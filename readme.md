# User Profile Frontend (UK223)

Frontend für User-/Rollen-/Authority-Verwaltung mit Login, geschützten Routen und einer Startseite für eingeloggte Nutzer.

## Quick Links

Die genaue URL/Port hängt von deiner lokalen Vite-Konfiguration ab. Nach `yarn dev` zeigt das Terminal die URL (meist `http://localhost:5173`).

- **Start**: `/`
- **Login**: `/login`
- **Admin**: `/admin` (nur für Nutzer mit Rolle `ADMIN` sinnvoll nutzbar)
- **Users (Tabelle)**: `/user`
- **User anlegen**: `/user/edit`
- **User bearbeiten**: `/user/edit/:userId`
- **Sign Up**: _TODO: Sign Up Page (siehe unten)_

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
- **`/admin`**: Admin-Bereich, geschützt durch `PrivateRoute` + Rollencheck (`ADMIN`)
- **`/user`**: geschützte Route über `PrivateRoute`
- **`/user/edit`** und **`/user/edit/:userId`**: ebenfalls geschützt (mit Authority-Check)
- **`/signup`**: _TODO: Sign Up Page — eigene Route anlegen_
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

## TODO: Sign Up Page

- Eine Sign Up (Registrierungs-)Seite ist geplant, existiert aktuell aber noch nicht.
- In `LoginPage` wird ein "Sign Up"-Link angezeigt, der aktuell ins Leere (`#`) zeigt.
- ToDo:
  - Neue Page-Komponente für Sign Up anlegen, etwa `src/components/pages/SignUpPage/SignUpPage.tsx`
  - Route `/signup` im Router ergänzen
  - Formular & Registrierung implementieren (Anbindung an Backend beachten)
  - "Sign Up"-Link im Login auf die neue Seite zeigen lassen

## Was in diesem Branch gemacht wurde

- **Rollen & Datenmodell**
  - `roles` in `src/config/Roles.ts` auf Basis der Backend-/SQL-Daten befüllt: `DEFAULT`, `ADMIN`, `USER`.
  - `ActiveUserContext.checkRole(roleToCheck)` nutzt diese Enum-Werte (`role.name === roleToCheck`), um Rollen sauber zu prüfen.
- **AuthenticatedHomePage**
  - falscher Logo-Import wurde korrigiert (`src/logo1.png`).
  - `export default` ergänzt, damit der Import im Router sauber funktioniert.
- **Router & Navigation**
  - Router rendert nicht mehr “außerhalb” der `Routes`, sondern entscheidet innerhalb von `/`, ob `AuthenticatedHomePage` oder `HomePage` angezeigt wird.
  - `*` Route macht jetzt einen Redirect auf `/` statt “Not Found`.
  - `/admin`-Route hinzugefügt, die auf `AdminPage` zeigt und über `PrivateRoute` nur für eingeloggte Nutzer erreichbar ist.
- **Admin-Zugriff (warum normale User nicht drauf kommen)**
  - In `PrivateRoute` wird oben eine Leiste gerendert; der **Admin-Button** erscheint nur, wenn `checkRole('ADMIN')` true ist. Normale User sehen diesen Button nicht.
  - Die `AdminPage` (`src/components/pages/AdminPage/AdminPage.tsx`) macht zusätzlich selbst einen Rollencheck über `ActiveUserContext`:
    - Hat der User **nicht** die Rolle `ADMIN`, wird eine 403-Fehlermeldung gerendert: „403 - Forbidden / You do not have access to this page.“
    - Dadurch ist der Schutz **persistent**: selbst wenn ein normaler User `/admin` direkt in die URL schreibt, bekommt er nur 403 und sieht keinen Admin-Content.
- **TypeScript: Image Imports**
  - Neues `src/types/images.d.ts` ergänzt, damit TS Image-Imports (png/jpg/svg/…) kennt.

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
