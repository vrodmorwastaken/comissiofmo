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

## 2. Base de dades

Si ja has creat un "Storage" de tipus **Prisma Postgres** des de Vercel (Storage → Create Database), no cal fer res més: Vercel genera automàticament una variable d'entorn amb el prefix del nom que li vas posar, per exemple si el vas anomenar `comissioBD` la variable es diu **`BD_POSTGRES_URL`**, i el projecte ja està configurat per fer-la servir (`prisma/schema.prisma`).

Si li has posat un altre nom al Storage, ves a **Storage → el teu Storage → Quickstart** i mira quin és el nom exacte de la variable que acaba en `_POSTGRES_URL`; si no coincideix amb `BD_POSTGRES_URL`, edita `prisma/schema.prisma` i canvia `env("BD_POSTGRES_URL")` pel nom correcte.

## 3. Crear l'emmagatzematge del logo (Vercel Blob)

1. Al dashboard de Vercel: **Storage → Create Database → Blob**.
2. Connecta'l al projecte; això genera automàticament la variable `BLOB_READ_WRITE_TOKEN`.

## 4. Variables d'entorn

Copia `.env.example` a `.env` (per treballar en local) i omple:

```
BD_POSTGRES_URL=...      # ja la tens si has creat el Storage des de Vercel
NEXTAUTH_SECRET=...      # genera'n una amb: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000   # a producció, la URL del teu domini de Vercel
BLOB_READ_WRITE_TOKEN=...
SEED_STAFF_USER=admin
SEED_STAFF_PASS=canvia-aquesta-contrasenya
SETUP_SECRET=...
```

A Vercel, aquestes mateixes variables s'han de configurar a **Project Settings → Environment Variables**.

## 5. Desplegar directament des de GitHub + Vercel (sense entorn local)

Aquest és el camí recomanat si no vols instal·lar res al teu ordinador:

1. Puja aquest projecte a un repositori de GitHub.
2. A Vercel: **Add New → Project → importa el repositori**.
3. A **Project Settings → Environment Variables**, afegeix totes les variables del pas 4, incloent-hi `SETUP_SECRET` (inventa't una cadena llarga i aleatòria, per exemple `a1b2c3-clau-temporal-xyz`).
4. Desplega. Gràcies al script de `build` (`prisma generate && prisma db push && next build`), **les taules de la base de dades es creen soles a cada desplegament** — no cal fer res més per això.
5. Un cop el desplegament acabi, **visita una sola vegada** aquesta URL al navegador (canvia el domini i els valors):

   ```
   https://el-teu-domini.vercel.app/api/setup?secret=LA_TEVA_SETUP_SECRET&username=admin&password=una-contrasenya-forta&nom=Administrador
   ```

   Això crea el primer usuari de **staff**. Si tot ha anat bé, veuràs un missatge JSON de confirmació.
6. **Important:** un cop creat, esborra la variable `SETUP_SECRET` del projecte a Vercel (o canvia-li el valor) i torna a desplegar, perquè aquesta ruta deixi de ser accessible. Per seguretat, la ruta ja rebutja crear més usuaris si ja n'hi ha algun, però és millor tancar-la del tot.

## 6. Instal·lació en local (alternativa, opcional)

Si en algun moment vols treballar-hi en local:

```bash
npm install
npm run db:push       # crea les taules a la base de dades
npm run db:seed       # crea el primer usuari de staff (admin / la contrasenya de SEED_STAFF_PASS)
npm run dev
```

Obre http://localhost:3000

## 7. Primer accés com a staff

Entra a `/login` amb l'usuari i la contrasenya que hagis fet servir a `/api/setup` (o al `db:seed` si has anat per la via local).

Des del panell (`/panel` → pestanya "Staff") pots crear altres usuaris de staff i eliminar-ne, sense necessitat de tornar a fer servir `/api/setup`.

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
