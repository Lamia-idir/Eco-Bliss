# EcoBlissBath

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Projet de Tests – Application Eco-Bliss

## Objectif

Ce projet a pour objectif de tester une application e-commerce composée :

- d’un frontend accessible sur : http://localhost:4200
- d’un backend API lancé via Docker Compose : http://localhost:8081
- de tests automatisés réalisés avec Cypress

Les tests couvrent :

- Tests API (authentification, produits, panier)
- Tests UI (connexion, ajout au panier)
- Tests de sécurité (XSS)
- Tests de gestion d’erreurs (stock, authentification)

# Installation du projet

## Cloner le repository

git clone < https://github.com/Lamia-idir/Eco-Bliss.git >

# Lancer le Backend avec Docker Compose

## Démarrer le backend

docker compose up -d
Le backend sera accessible sur : http://localhost:8081

# Lancer le Frontend : npm run start:

Le frontend sera accessible sur : http://localhost:4200

# Exécution des tests Cypress

## Mode interface graphique : npx cypress open, puis sélectionner **E2E Testing**.

## Mode ligne de commande : npx cypress run

# Configuration et génération du rapport (Mochawesome)

## Installation

npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator

# Exécution des tests avec rapport

npm run test:report

# Génération de rapport HTML

npm run report:generate

# Génération du rapport de tests

Si Mochawesome est configuré :

## Lancer les tests avec reporter

npx cypress run --reporter mochawesome

## Générer le rapport HTML

npx mochawesome-merge cypress/reports/\*.json > report.json
npx marge report.json
Le rapport sera disponible dans le dossier :
/mochawesome-report
