# Hi-Tech Store - Backend

Ceci est le backend pour Hi-Tech Store, une application e-commerce full-stack conçue pour présenter une large variété de produits électroniques. Le backend est construit avec Node.js et Express, et il fournit une API RESTful pour gérer les produits, les utilisateurs, les commandes et bien plus encore.


## Table des Matières

*   [À Propos du Projet](#à-propos-du-projet)
*   [Construit Avec](#construit-avec)
*   [Architecture](#architecture)
*   [Démarrage](#démarrage)
    *   [Prérequis](#prérequis)
    *   [Installation](#installation)
*   [Utilisation](#utilisation)
    *   [Exécution du serveur](#exécution-du-serveur)
    *   [Exécution des tests](#exécution-des-tests)
*   [Points de Terminaison API](#points-de-terminaison-api)
*   [Structure du Projet](#structure-du-projet)
*   [Variables d'Environnement](#variables-denvironnement)
*   [Déploiement](#déploiement)
*   [Contribution](#contribution)
*   [Licence](#licence)

## À Propos du Projet

Le backend de Hi-Tech Store est une application serveur robuste et évolutive qui alimente la plateforme e-commerce. Il gère toute la logique métier, le stockage des données et l'authentification de l'application.

### Fonctionnalités

*   **Authentification :** Authentification utilisateur sécurisée utilisant les JSON Web Tokens (JWT) avec expiration du token à 1 heure.
*   **Gestion des Produits :** Fonctionnalité CRUD complète pour les produits, catégories, marques, modèles, variantes et spécifications.
*   **Mise en Cache Redis :** Les catégories sont mises en cache avec Redis (Upstash) avec un TTL de 5-10 minutes pour améliorer les performances.
*   **Panier d'Achat :** Panier d'achat persistant pour les utilisateurs authentifiés avec opérations CRUD complètes.
*   **Liste de Souhaits :** Les utilisateurs peuvent ajouter/supprimer des produits de leur liste de souhaits.
*   **Traitement des Commandes :** Traitement sécurisé des commandes avec intégration Stripe Payment Intents.
*   **Avis sur les Produits :** Les utilisateurs peuvent laisser des avis et des notes sur les produits avec fonctionnalité CRUD complète.
*   **Recherche :** Fonctionnalité de recherche puissante à travers les produits, catégories, marques et modèles.
*   **Gestion du Profil Utilisateur :** Les utilisateurs peuvent mettre à jour leur profil et changer leur mot de passe.
*   **Architecture en Couches de Service :** Couche de service dédiée (OrderService, CartService, CheckoutService, SpecService) pour la logique métier.
*   **Gestion des Erreurs :** Gestion centralisée des erreurs avec classe personnalisée AppError et plus de 70 messages d'erreur.
*   **Validation des Entrées :** Validation complète utilisant Joi et Express-Validator.

## Construit Avec

*   [Node.js](https://nodejs.org/) - Runtime JavaScript
*   [Express.js](https://expressjs.com/) - Framework web
*   [MongoDB](https://www.mongodb.com/) - Base de données NoSQL
*   [Mongoose](https://mongoosejs.com/) - ODM MongoDB
*   [Redis](https://redis.io/) - Mise en cache en mémoire (Upstash)
*   [JSON Web Token (JWT)](https://jwt.io/) - Authentification
*   [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Hachage de mot de passe (10 tours de sel)
*   [Stripe](https://stripe.com/) - Traitement des paiements
*   [Joi](https://joi.dev/) - Validation de schéma
*   [Express-Validator](https://express-validator.github.io/) - Validation de requête
*   [Jest](https://jestjs.io/) - Framework de test

## Architecture

Le backend suit un modèle d'architecture en couches :

```
┌─────────────────────────────────────────────────────┐
│                 Requête Client                       │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│             Couche Middleware                        │
│  • Authentification (JWT)                            │
│  • Validation (Joi, Express-Validator)              │
│  • Gestion des Erreurs                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│            Couche Contrôleur (13)                    │
│  authController, productController, cartController,  │
│  orderController, categoryController, brandController│
│  modelController, variantController, reviewController│
│  specController, userController, wishlistController, │
│  searchController                                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Couche Service (4)                      │
│  • OrderService                                      │
│  • CartService                                       │
│  • CheckoutService                                   │
│  • SpecService                                       │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│               Couche Données                         │
│  • MongoDB (via Mongoose)                            │
│  • Cache Redis (Upstash - Catégories, TTL 5-10min)  │
└─────────────────────────────────────────────────────┘
```

### Décisions Architecturales Clés

1. **Modèle de Couche de Service** : La logique métier est encapsulée dans des classes de service pour une meilleure réutilisabilité et testabilité.
2. **Mise en Cache Redis** : Les données fréquemment consultées (catégories) sont mises en cache pour réduire la charge de la base de données.
3. **Authentification JWT** : Authentification sans état avec expiration du token à 1 heure.
4. **Gestion Centralisée des Erreurs** : Classe personnalisée AppError avec plus de 70 messages d'erreur prédéfinis.
5. **Validation des Entrées** : Validation à deux niveaux (schémas Joi + Express-Validator) pour une intégrité robuste des données.
6. **Sécurité des Mots de Passe** : bcryptjs avec 10 tours de sel pour un hachage sécurisé des mots de passe.
7. **Pooling de Connexions MongoDB** : Connexions de base de données optimisées pour de meilleures performances.

## Démarrage

Pour faire fonctionner le serveur backend, suivez ces étapes.

### Prérequis

*   Node.js et npm
*   MongoDB
*   Redis

### Installation

1.  **Naviguer vers le répertoire `Back`**
    ```sh
    cd Back
    ```
2.  **Installer les packages NPM**
    ```sh
    npm install
    ```
3.  **Configurer les variables d'environnement**
    *   Créer un fichier `.env` dans le répertoire `Back`.
    *   Ajouter les variables d'environnement listées dans la section [Variables d'Environnement](#variables-denvironnement).

## Utilisation

### Exécution du serveur

*   **Développement :**
    ```sh
    npm run dev
    ```
    Le serveur démarrera en mode développement avec nodemon, qui redémarrera automatiquement le serveur lors des modifications de fichiers. Le serveur fonctionnera sur `http://localhost:5002`.

*   **Production :**
    ```sh
    npm start
    ```
    Le serveur démarrera en mode production.

### Exécution des tests

```sh
npm test
```

Cela exécutera la suite de tests en utilisant Jest.

## Points de Terminaison API

### Authentification (`/api/auth`)
*   `POST /api/auth/register` - Enregistrer un nouvel utilisateur
*   `POST /api/auth/login` - Connecter un utilisateur et recevoir un token JWT
*   `GET /api/auth/me` - Obtenir le profil de l'utilisateur authentifié actuel
*   `PUT /api/auth/profile` - Mettre à jour le profil utilisateur
*   `PUT /api/auth/change-password` - Changer le mot de passe utilisateur

### Produits (`/api/products`)
*   `GET /api/products` - Obtenir tous les produits avec filtrage et pagination
*   `GET /api/products/:id` - Obtenir un produit spécifique par ID
*   `POST /api/products` - Créer un nouveau produit (admin)
*   `PUT /api/products/:id` - Mettre à jour un produit (admin)
*   `DELETE /api/products/:id` - Supprimer un produit (admin)

### Catégories (`/api/categories`)
*   `GET /api/categories` - Obtenir toutes les catégories (mis en cache Redis, TTL 5-10 min)
*   `GET /api/categories/:id` - Obtenir une catégorie spécifique
*   `POST /api/categories` - Créer une catégorie (admin)
*   `PUT /api/categories/:id` - Mettre à jour une catégorie (admin)
*   `DELETE /api/categories/:id` - Supprimer une catégorie (admin)

### Marques (`/api/brands`)
*   `GET /api/brands` - Obtenir toutes les marques
*   `GET /api/brands/:id` - Obtenir une marque spécifique
*   `POST /api/brands` - Créer une marque (admin)
*   `PUT /api/brands/:id` - Mettre à jour une marque (admin)
*   `DELETE /api/brands/:id` - Supprimer une marque (admin)

### Modèles (`/api/models`)
*   `GET /api/models` - Obtenir tous les modèles avec filtrage
*   `GET /api/models/:id` - Obtenir un modèle spécifique avec tous les détails
*   `POST /api/models` - Créer un modèle (admin)
*   `PUT /api/models/:id` - Mettre à jour un modèle (admin)
*   `DELETE /api/models/:id` - Supprimer un modèle (admin)

### Variantes (`/api/variants`)
*   `GET /api/variants` - Obtenir toutes les variantes
*   `GET /api/variants/:id` - Obtenir une variante spécifique
*   `POST /api/variants` - Créer une variante (admin)
*   `PUT /api/variants/:id` - Mettre à jour une variante (admin)
*   `DELETE /api/variants/:id` - Supprimer une variante (admin)

### Spécifications (`/api/specs`)
*   `GET /api/specs/:modelId` - Obtenir les spécifications d'un modèle
*   `POST /api/specs` - Créer des spécifications (admin)
*   `PUT /api/specs/:id` - Mettre à jour des spécifications (admin)
*   `DELETE /api/specs/:id` - Supprimer des spécifications (admin)

### Panier d'Achat (`/api/cart`)
*   `GET /api/cart` - Obtenir le panier d'achat de l'utilisateur
*   `POST /api/cart` - Ajouter un article au panier
*   `PUT /api/cart/:itemId` - Mettre à jour la quantité d'un article du panier
*   `DELETE /api/cart/:itemId` - Supprimer un article du panier
*   `DELETE /api/cart` - Vider tout le panier

### Liste de Souhaits (`/api/wishlist`)
*   `GET /api/wishlist` - Obtenir la liste de souhaits de l'utilisateur
*   `POST /api/wishlist` - Ajouter un article à la liste de souhaits
*   `DELETE /api/wishlist/:modelId` - Supprimer un article de la liste de souhaits

### Commandes (`/api/orders`)
*   `GET /api/orders` - Obtenir l'historique des commandes de l'utilisateur
*   `GET /api/orders/:id` - Obtenir une commande spécifique
*   `POST /api/orders` - Créer une nouvelle commande
*   `POST /api/orders/create-payment-intent` - Créer une intention de paiement Stripe

### Avis (`/api/reviews`)
*   `GET /api/reviews/:modelId` - Obtenir tous les avis pour un modèle
*   `POST /api/reviews` - Créer un avis pour un modèle
*   `PUT /api/reviews/:id` - Mettre à jour son propre avis
*   `DELETE /api/reviews/:id` - Supprimer son propre avis

### Recherche (`/api/search`)
*   `GET /api/search?query={query}` - Rechercher à travers les produits, catégories, marques et modèles

Pour plus de détails sur les formats de requête/réponse, veuillez vous référer aux fichiers de routes dans `src/routes`.

## Structure du Projet

```
Back/
├── src/
│   ├── config/          # Fichiers de configuration (base de données, Redis)
│   ├── controllers/     # Gestionnaires de requêtes (13 contrôleurs)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   ├── brandController.js
│   │   ├── modelController.js
│   │   ├── variantController.js
│   │   ├── reviewController.js
│   │   ├── specController.js
│   │   ├── userController.js
│   │   ├── wishlistController.js
│   │   └── searchController.js
│   ├── models/          # Schémas Mongoose
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Brand.js
│   │   ├── Model.js
│   │   ├── Variant.js
│   │   ├── Specification.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/          # Définitions des routes API
│   ├── middleware/      # Middleware personnalisé (auth, validation, gestion des erreurs)
│   ├── services/        # Couche de logique métier (4 services)
│   │   ├── OrderService.js
│   │   ├── CartService.js
│   │   ├── CheckoutService.js
│   │   └── SpecService.js
│   ├── utils/           # Fonctions utilitaires
│   │   ├── AppError.js
│   │   └── errorMessages.js (plus de 70 messages)
│   ├── validators/      # Schémas Joi et Express-Validator
│   └── app.js           # Configuration de l'application Express
├── tests/               # Fichiers de test Jest
├── .env                 # Variables d'environnement
├── package.json
└── vercel.json          # Configuration de déploiement Vercel
```

## Variables d'Environnement

Les variables d'environnement suivantes sont requises :

*   `MONGO_URI` - Votre chaîne de connexion MongoDB Atlas
*   `JWT_SECRET` - Clé secrète pour signer les JWT (utilisez une chaîne aléatoire forte)
*   `JWT_EXPIRE` - Temps d'expiration du JWT (par défaut : 1h)
*   `STRIPE_SECRET_KEY` - Votre clé API secrète Stripe
*   `REDIS_URL` - Votre URL de connexion Upstash Redis
*   `PORT` - Port du serveur (par défaut : 5002)
*   `NODE_ENV` - Environnement (development/production)
*   `FRONTEND_URL_LOCAL` - URL du frontend local (http://localhost:3000)
*   `FRONTEND_URL_VERCEL` - URL du frontend en production
*   `FRONTEND_URL_GITHUB` - URL du frontend GitHub Pages

### Exemple de fichier `.env` :

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hitech-store
JWT_SECRET=votre_cle_jwt_super_secrete_ici
JWT_EXPIRE=1h
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe
REDIS_URL=redis://default:password@redis-url.upstash.io:6379
PORT=5002
NODE_ENV=development
FRONTEND_URL_LOCAL=http://localhost:3000
FRONTEND_URL_VERCEL=https://votre-app.vercel.app
FRONTEND_URL_GITHUB=https://username.github.io/repo
```

## Déploiement

L'application est configurée pour le déploiement sur Vercel. Le fichier `vercel.json` contient la configuration nécessaire pour déployer l'application.

## Contribution

Les contributions sont ce qui fait de la communauté open source un endroit incroyable pour apprendre, inspirer et créer. Toutes les contributions que vous apportez sont **grandement appréciées**.

1.  Fork le Projet
2.  Créez votre Branche de Fonctionnalité (`git checkout -b feature/FonctionnaliteIncroyable`)
3.  Committez vos Changements (`git commit -m 'Ajouter une FonctionnaliteIncroyable'`)
4.  Poussez vers la Branche (`git push origin feature/FonctionnaliteIncroyable`)
5.  Ouvrez une Pull Request

## Licence

Distribué sous la licence ISC. Voir `LICENSE` pour plus d'informations.
