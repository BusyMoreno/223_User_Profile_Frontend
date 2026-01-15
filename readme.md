# User Profile Frontend (UK223)

Frontend für User-/Rollen-/Authority-Verwaltung mit Login, geschützten Routen und einer Startseite für eingeloggte Nutzer.

## Quick Links

Die genaue URL/Port hängt von deiner lokalen Vite-Konfiguration ab. Nach `yarn dev` zeigt das Terminal die URL (meist `http://localhost:5173`).

- **Start**: `/`
- **Login**: `/login`
- **Users (Tabelle)**: `/user`
- **User anlegen**: `/user/edit`
- **User bearbeiten**: `/user/edit/:userId`

## Voraussetzungen

- **Node.js**: empfohlen 16+
- **Yarn**: `npm install -g yarn`

## Setup & Start

```bash
yarn install
yarn dev
```

## Wichtige Kommandos

- **dev**: `yarn dev`
- **build**: `yarn build`
- **preview**: `yarn preview`
- **tests**: `yarn test`

## Routing (wie die App navigiert)

Die Routen sind zentral in `src/Router/Router.tsx` definiert.

- **`/` (Startseite)**:
  - wenn Token vorhanden → `AuthenticatedHomePage`
  - sonst → `HomePage`
- **`/login`**: Login-Seite
- **`/user`**: geschützte Route über `PrivateRoute`
- **`/user/edit`** und **`/user/edit/:userId`**: ebenfalls geschützt (mit Authority-Check)
- **Fallback (`*`)**: redirect auf `/`

## Auth & Guards (wie der Zugriff geschützt wird)

### Token-Speicher

- Die App nutzt `localStorage.getItem('token')` als “eingeloggt”-Indikator (Router) und als Basis für weitere Checks.

### `PrivateRoute`

In `src/Router/PrivateRoute.tsx` passiert Folgendes:

- **Login-Check**: Token wird aus `localStorage` gelesen, ggf. `Bearer ` entfernt, dann wird der JWT dekodiert und auf `exp` geprüft.
- **Logout/Redirect**: wenn nicht eingeloggt → `ActiveUserContext.logout()` + Redirect auf `/login`.
- **Authority-Check**: wenn `requiredAuths` gesetzt sind → via `AuthorityService.hasAuthority` wird geprüft, ob der aktive User mindestens eine benötigte Authority hat; sonst Redirect auf `/unauthorized`.

## AuthenticatedHomePage (Startseite nach Login)

Die Seite `src/components/pages/AuthenticatedHomePage.tsx`:

- lädt den aktiven User über `ActiveUserContext.loadActiveUser()`, falls noch nicht vorhanden
- zeigt User-Infos (Name/Email/Rollen) an
- bietet Aktionen:
  - **Manage Users** → navigiert auf `/user`
  - **Logout** → `ActiveUserContext.logout()`

## Was zuletzt gefixt / ergänzt wurde

- **`AuthenticatedHomePage`**
  - falscher Logo-Import wurde korrigiert (`src/logo1.png`)
  - `export default` ergänzt, damit der Import im Router sauber funktioniert
- **`Router`**
  - Router rendert nicht mehr “außerhalb” der `Routes`, sondern entscheidet innerhalb von `/`, ob `AuthenticatedHomePage` oder `HomePage` angezeigt wird
  - `*` Route macht jetzt einen Redirect auf `/` statt “Not Found”
- **TypeScript: Image Imports**
  - neues `src/types/images.d.ts` ergänzt, damit TS Image-Imports (png/jpg/svg/…) kennt

## Projektstruktur (relevant)

```
.
├── src/
│   ├── components/pages/        # Seiten (Home/Login/User/AuthenticatedHomePage)
│   ├── Contexts/                # z.B. ActiveUserContext (User/Session)
│   ├── Router/                  # Router.tsx + PrivateRoute.tsx
│   ├── Services/                # API/Business-Logik (User/Role/Authority)
│   └── types/                   # Models + images.d.ts
├── public/                      # statische Assets
├── vite.config.ts
└── package.json
```

## Troubleshooting

- **Port/URL unklar**: nach `yarn dev` die URL aus der Konsole nehmen.
- **Install-Probleme**:

```bash
rm -rf node_modules
yarn install
```
