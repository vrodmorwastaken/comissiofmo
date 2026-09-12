# Comissió FMó

Aplicació web (en català) per gestionar el registre de penyes, amb:

- Formulari públic de creació de penya (nom, logo, color, enllaç de YouTube, acceptació de normes) + registre com a usuari (usuari + contrasenya).
- Login únic per a penyes i per a staff.
- Dashboard públic amb el llistat de penyes actives.
- Panell privat de staff: activar/suspendre penyes i gestionar usuaris de staff.
- Pàgina privada "La meva penya" per a les penyes un cop han fet login.

Tecnologies: **Next.js 14 (App Router)** + **Prisma/Postgres** + **NextAuth** + **Vercel Blob** (per als logos) + **Tailwind CSS**.

---

## 1. Requisits previs

- Compte de [Vercel](https://vercel.com) (gratuït).
- Compte de [GitHub](https://github.com) (per connectar el repo a Vercel).
- Node.js 18+ instal·lat si vols provar-ho en local.

## 2. Crear la base de dades (gratuïta)

1. Al dashboard de Vercel del teu projecte: **Storage → Create Database → Postgres** (Neon).
2. Un cop creada, Vercel et donarà les variables `DATABASE_URL` i `DIRECT_URL` (o `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`, segons la integració — ajusta els noms a `.env` si cal). Copia-les.
3. També pots crear-la directament a [neon.tech](https://neon.tech) (pla gratuït) si ho prefereixes independent de Vercel.

## 3. Crear l'emmagatzematge del logo (Vercel Blob)

1. Al dashboard de Vercel: **Storage → Create Database → Blob**.
2. Connecta'l al projecte; això genera automàticament la variable `BLOB_READ_WRITE_TOKEN`.

## 4. Variables d'entorn

Copia `.env.example` a `.env` (per treballar en local) i omple:

```
DATABASE_URL=...
DIRECT_URL=...
NEXTAUTH_SECRET=...      # genera'n una amb: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000   # a producció, la URL del teu domini de Vercel
BLOB_READ_WRITE_TOKEN=...
SEED_STAFF_USER=admin
SEED_STAFF_PASS=canvia-aquesta-contrasenya
```

A Vercel, aquestes mateixes variables s'han de configurar a **Project Settings → Environment Variables**.

## 5. Instal·lació en local (opcional, per provar abans de desplegar)

```bash
npm install
npm run db:push       # crea les taules a la base de dades
npm run db:seed       # crea el primer usuari de staff (admin / la contrasenya de SEED_STAFF_PASS)
npm run dev
```

Obre http://localhost:3000

## 6. Desplegar a Vercel

1. Puja aquest projecte a un repositori de GitHub.
2. A Vercel: **Add New → Project → importa el repositori**.
3. Afegeix les variables d'entorn (pas 4) al projecte de Vercel.
4. Desplega. Vercel executarà automàticament `prisma generate` (via `postinstall`) i `next build`.
5. Un cop desplegat, connecta't per SSH... en realitat no cal SSH: pots executar `npm run db:push` i `npm run db:seed` **en local** apuntant al `DATABASE_URL` de producció (posa'l temporalment al teu `.env` local), per crear les taules i l'usuari admin inicial a la base de dades de producció.

## 7. Primer accés com a staff

Un cop fet el `db:seed`, entra a `/login` amb:

- Usuari: el valor de `SEED_STAFF_USER` (per defecte `admin`)
- Contrasenya: el valor de `SEED_STAFF_PASS`

Des del panell (`/panel` → pestanya "Staff") pots crear altres usuaris de staff i eliminar-ne.

## 8. Estructura del projecte

```
app/
  page.js                     -> Dashboard públic de penyes
  registre/page.js            -> Formulari de creació de penya
  login/page.js                -> Login (penyes + staff)
  la-meva-penya/page.js        -> Pàgina privada de la penya
  panel/page.js + PanelClient  -> Panell privat de staff
  api/
    penyes/route.js            -> POST crear penya, GET llistar actives
    penyes/status/route.js     -> GET totes / PATCH activar-suspendre (staff)
    staff/route.js              -> GET / POST usuaris de staff (staff)
    staff/[id]/route.js         -> DELETE usuari de staff (staff)
    auth/[...nextauth]/route.js -> NextAuth
prisma/schema.prisma           -> Models Penya i Staff
lib/                            -> prisma client, auth config, sessió
middleware.js                   -> Protecció de /panel i /la-meva-penya
```

## 9. Properes millores possibles

- Edició de dades pròpies de la penya (ara només el staff les pot canviar).
- Text de normes configurable des del panell (ara és un checkbox fix).
- Recuperació de contrasenya per correu.
- Exportar llistat de penyes (CSV/Excel).
