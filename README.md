# ✈️ Projet SAE 4.01a - Gestion de Vols (IUT d'Orléans)

**Développement d'une application complexe comprenant une base de données, une API REST, un client Web (SPA) et un client Mobile (Flutter).**

Ce projet s'inscrit dans le cadre de la SAE 4.01a à l'IUT d'Orléans. L'objectif est de mettre en place un système complet de gestion et de visualisation de vols commerciaux, d'aéroports et de terminaux, en s'appuyant sur une architecture moderne séparant le backend des différents frontends.

---

## 📂 Architecture globale du projet

Le dépôt est découpé en trois composants majeurs :

```text
├── API_REST/         # Backend (Gère la base de données et l'API)
├── SPA/              # Interface Web (Single Page Application en Vanilla JS)
└── sae_dev_mobil/    # Interface Mobile (Application Flutter)
```

---

## 🐍 1. Backend : API REST (Python / Flask)

Le backend gère la logique de l'application et la persistance des données via une base de données SQLite. Il expose les données aux applications web et mobiles.

### 🛠️ Technologies
*   **Python 3**
*   **Flask** & **Flask-RESTX** (génération automatique de l'interface Swagger)
*   **SQLAlchemy** (ORM)

### ✨ Fonctionnalités
*   Points d'accès CRUD complets (Create, Read, Update, Delete) pour : `Pays`, `Villes`, `Compagnies`, `Aéroports`, `Terminaux` et `Vols`.
*   Gestion des coordonnées géographiques (Latitude, Longitude) pour le placement des aéroports sur la carte côté mobile.

### 🚀 Installation & Lancement
```bash
cd API_REST

# 1. Créer et activer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate  # (Sous Windows: venv\Scripts\activate)

# 2. Installer les dépendances
pip install -r requirements.txt
```

⚠️ **Configuration de la Base de Données :**  
Avant de lancer le serveur, vous devez configurer la connexion à votre base MySQL.  
Ouvrez le fichier `app/myapp.py` et modifiez la ligne `SQLALCHEMY_DATABASE_URI` avec vos propres identifiants (utilisateur, mot de passe, et nom de la base) :  
`'mysql+pymysql://<VOTRE_USER>:<VOTRE_MDP>@localhost:3306/<VOTRE_BD>?charset=utf8mb4'`

```bash
# 3. Initialiser / Réinitialiser la base de données avec des jeux de test (Vols 2026, Villes, Aéroports...)
flask syncdb

# 4. Lancer le serveur (par défaut sur http://127.0.0.1:5000)
flask run
```
*Tip : Vous pouvez consulter la documentation Swagger de l'API directement à l'adresse racine : `http://127.0.0.1:5000/`*

---

## 💻 2. Frontend Web : Single Page Application (SPA)

Une interface d'administration web légère fonctionnant entièrement via le navigateur du client. Conçue avec le pattern "Master/Detail" (Liste à gauche, formulaire d'édition à droite).

### 🛠️ Technologies
*   **HTML5 / CSS3**
*   **JavaScript (Vanilla ES6)** avec l'architecture par Modules (Imports/Exports)
*   Communication asynchrone avec `fetch` vers l'API Flask.

### ✨ Fonctionnalités
*   Affichage et administration de toutes les entités (Villes, Aéroports, Vols...).
*   Les modifications (ex: mise à jour des coordonnées géographiques d'un aéroport) se répercutent instantanément sur la base de données.
*   Navigation fluide sans rechargement de page.

### 🚀 Lancement
Il suffit d'héberger le dossier `SPA` via un serveur web local.
```bash
cd SPA
# Avec PHP :
php -S localhost:5050
# Ou avec Python :
python3 -m http.server 5050
```
Accédez ensuite à l'application via `http://localhost:5050/`.

---

##📱 3. Frontend Mobile : Application Flutter

Une application mobile intuitive permettant aux utilisateurs de rechercher des vols, de consulter la carte des trajets et d'enregistrer leurs itinéraires favoris.

### 🛠️ Technologies et Architecture
*   **Flutter & Dart**
*   **Architecture MVVM** (Model - View - ViewModel) et **Repository Pattern** (`lib/services/`).
*   **Provider** : Pour la gestion d'état réactive complète et optimisée.
*   **SharedPreferences** : Pour la sauvegarde locale persistante.
*   **flutter_map** & **latlong2** : Pour l'affichage cartographique (OpenStreetMap).

### ✨ Fonctionnalités
1.  **Listing et Recherche** : Catalogue de vols complet avec recherche intelligente par numéro, ville, aéroport ou compagnie.
2.  **Filtre par Date** : Sélection via calendrier pour affiner l'affichage des vols.
3.  **Favoris Sauvegardés** : Possibilité de liker un vol (sauvegarde locale dans l'appareil) pour le retrouver dans le menu "Mes Vols".
4.  **Cartographie (Dark/Light mode)** : Tracé automatique de lignes (Polylines) entre les aéroports de départ et d'arrivée pour les vols mis en favoris.
5.  **Mode Sombre (Dark Mode)** : Option dans les paramètres de l'application adaptée à toute l'UI ainsi qu'aux tuiles de la carte !
6.  **Animations Premium** : Transitions "Hero" (l'icône d'avion s'envole littéralement lors du clic depuis la liste vers la page détails).

### 🚀 Installation & Lancement
Assurez-vous que l'**API REST soit lancée** pour que le mobile puisse y récupérer les données.
```bash
cd sae_dev_mobil
# 1. Télécharger les librairies (Provider, SharedPreferences, flutter_map...)
flutter pub get

# 2. Lancer l'application (sur l'émulateur Android, Linux ou navigateur Chrome)
flutter run
```

---

*Développé pour la SAE 4.01a.*
