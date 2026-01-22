# Project Documentation

## How to start this application?

To start this application, follow these steps:

1.  **Launch Docker**: Ensure Docker is running on your machine.
2.  **Start Backend**: Run the backend application.
3.  **Start Frontend**: Navigate to the frontend directory and enter the following command:
    `yarn dev`

After these steps, you should be automatically forwarded to [http://localhost:3000](http://localhost:3000).

---

## Login Daten

| Email | Passwort | Rolle |
| :--- | :--- | :--- |
| admin@example.com | 1234 | Admin |
| example@example.com | 1234 | User |

---

## Use Cases

### 5.1 User Profile
* **UC1**: User erstellt eigenes Profil
* **UC2**: User liest und aktualisiert eigenes Profil
* **UC3**: User löscht eigenes Profil
* **UC4**: Admin löscht beliebiges UserProfile
* **UC5**: Admin sucht, filtert und sortiert alle UserProfiles

---

## Testing

We utilize three main testing methods:

* **Cypress**: For end-to-end testing (primarily frontend-focused).
* **Postman**: For component testing (backend-focused).
* **Black Box testing**: A balanced combination of both.

### Black Box Testing
For the Black Box tests, we had a user with no prior knowledge of the code test the application; the results can be found in the documentation uploaded to our frontend repository.

### Postman
To use Postman, ensure that **Docker is running** and the **backend application is started**. You will also need Postman installed on your machine. Once installed, open the test files we provided to find various tests covering the entire application.

### Cypress
You can locate the test file in the frontend repository and execute it. These tests fully validate **Use Cases 2 and 5**. While other use cases are included in the testing suite, Use Cases 2 and 5 are the most comprehensively tested.

---

## Frontend-URL

Route,Zugriffsebene,Beschreibung,Besonderheiten
/,Öffentlich,Home / Landing Page,Startpunkt der Anwendung.
/user/login,Öffentlich,Login-Seite,Authentifizierung für User und Admins.
/User,User,Profil-Ansicht,Ein regulärer User sieht hier nur seine eigenen Daten.
/User,Admin,Benutzerliste,Ein Admin sieht hier alle registrierten Benutzer.
/User/admin,Admin,Dashboard,"Zentrales Management mit Filtern, Pagination und Sortierung."
