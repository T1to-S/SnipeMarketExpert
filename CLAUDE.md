# CS2 Sniper — Guide de session Claude

## Projet
Scanner et sniper d'items CS2 multi-marketplace. Permet de configurer des filtres (float, prix, pattern, stickers…), de scanner des marketplaces en tâche de fond, et d'alerter l'utilisateur en temps réel quand une opportunité est détectée.

## Stack

| Couche | Tech | Version |
|--------|------|---------|
| Framework | Next.js + App Router | 16.2.2 |
| Language | TypeScript strict | ^5 |
| Style | Tailwind CSS v4 + shadcn/ui | ^4 |
| ORM | Prisma + PostgreSQL | ^7 (WASM engine) |
| Queue | BullMQ + IORedis | ^5 |
| Auth | NextAuth.js v5 beta | beta.30 |
| Validation | Zod | ^4 |
| Logging | Pino + pino-pretty | ^10 |
| Env | t3-env | ^0.13 |

## Points d'attention Prisma v7
Prisma v7 a des breaking changes importants :
- Le driver par défaut est WASM — nécessite `@prisma/adapter-pg` (déjà installé)
- La config est dans `prisma.config.ts` (pas seulement dans `schema.prisma`)
- `DATABASE_URL` n'est plus dans le bloc `datasource` du schema, il est dans `prisma.config.ts`
- `db.ts` utilise `PrismaPg` adapter, pas le client Prisma classique

## Structure clé

```
src/
├── app/
│   ├── (auth)/login|register     # Pages auth (sans layout dashboard)
│   ├── (dashboard)/              # Layout avec Sidebar + Header
│   │   ├── dashboard/            # Page principale
│   │   ├── scanner/              # Gestion des scans
│   │   └── settings/             # Clés API, préférences
│   └── api/
│       ├── auth/[...nextauth]/   # Handler NextAuth
│       ├── scanner/              # CRUD configs de scan
│       └── webhooks/             # Webhooks entrants
├── lib/
│   ├── auth.ts                   # Config NextAuth (Google + Resend magic link)
│   ├── db.ts                     # Singleton Prisma avec adapter PG
│   ├── redis.ts                  # Singleton IORedis
│   ├── env.ts                    # Variables typées t3-env
│   ├── logger.ts                 # Pino (pretty en dev, JSON en prod)
│   ├── scanner/
│   │   ├── csfloat.ts            # Client API CSFloat (rate limit 1 req/s)
│   │   └── filters.ts            # Filtrage côté client des listings
│   ├── jobs/
│   │   ├── queue.ts              # scanner-queue + alerts-queue BullMQ
│   │   └── workers/scanner.worker.ts  # Worker principal
│   └── utils/
│       ├── crypto.ts             # AES-256-GCM encrypt/decrypt
│       └── price.ts              # centsToEuros, calculateProfit, calculateROI
├── types/
│   ├── csfloat.ts                # Types stricts API CSFloat
│   ├── scanner.ts                # ScanFilter, WearName, WearRange, PriceRange
│   └── marketplace.ts            # MarketplaceId, configs des 6 marketplaces
└── hooks/
    ├── useScanner.ts             # Démarrer/arrêter un scan
    └── useListings.ts            # Fetch des résultats (polling pour l'instant)
```

## Modèles Prisma

- **User** — email, subscription (FREE/PRO/ELITE)
- **ApiKey** — clé chiffrée AES-256-GCM par marketplace
- **ScanConfig** — config d'un scan (marketplace, interval, filters JSON)
- **ScanResult** — résultat d'un scan (price, float, pattern, stickers…)
- **Alert** — notification (DISCORD / EMAIL / IN_APP)
- **Account / Session / VerificationToken** — tables NextAuth standard

## Règles à respecter

- **Zéro `any`** — TypeScript strict partout
- **Zéro `console.log`** — uniquement `logger` de `src/lib/logger.ts`
- **Secrets jamais côté client** — `CSFLOAT_API_KEY`, `ENCRYPTION_KEY` restent server-only
- Les clés API users sont **toujours chiffrées en base** (AES-256-GCM via `crypto.ts`)
- Marquer les TODOs sécurité avec `// TODO(security):` et perf avec `// TODO(perf):`
- Chaque fichier commence par son chemin en commentaire : `// src/lib/example.ts`

## Commandes utiles

```bash
npm run dev          # Dev server
npm run build        # Build prod (vérifie les types)
npx prisma studio    # UI base de données
npx prisma migrate dev --name <nom>  # Nouvelle migration
npx prisma generate  # Regénérer le client après modif schema
```

## Variables d'environnement requises

Copier `.env.example` → `.env` et remplir :
- `DATABASE_URL` — PostgreSQL
- `REDIS_URL` — Redis
- `NEXTAUTH_SECRET` — min 32 chars
- `NEXTAUTH_URL` — ex: `http://localhost:3000`
- `ENCRYPTION_KEY` — **exactement 32 caractères** (AES-256)

Optionnelles :
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — OAuth Google
- `AUTH_RESEND_KEY` — Magic link email
- `CSFLOAT_API_KEY` — Clé API CSFloat globale (les users peuvent aussi fournir la leur)

## État actuel du projet (avril 2026)

- [x] Scaffold complet Next.js + TypeScript + Tailwind
- [x] Schema Prisma avec tous les modèles
- [x] Infrastructure BullMQ (queues + worker scanner)
- [x] Client CSFloat avec filtres
- [x] Chiffrement AES-256-GCM des clés API
- [x] Auth NextAuth v5 (Google + magic link)
- [x] Pages dashboard, scanner, settings (squelettes)
- [ ] UI des filtres de scan (ScannerFilters à compléter)
- [ ] Worker alertes (alerts-queue sans worker pour l'instant)
- [ ] Intégration des autres marketplaces (Skinport, DMarket, Buff163, Waxpeer)
- [ ] Système de souscription (FREE/PRO/ELITE)
- [ ] Tests unitaires
