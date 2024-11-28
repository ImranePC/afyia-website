# AFYIA Diagnostics - website

Ce projet à été créer avec [Angular](https://github.com/angular/angular-cli) version 17.3.8.

## Ouvrir le serveur de developpement

Ouvrir le serveur de developpement d'Angular avec `ng serve`. Le port par défaut est `4200`.

Avec Scully utiliser `npx scully serve`.

## Build avec Scully

Pour build le site de façon statique avec scully utiliser les commandes suivantes

`ng build` ou `npm run build`

Puis

`npx scully build --project afyia-website` ou `npm run build-static`

## API Express.js

L'API se trouve dans le dossier `/api`

Pour démarrer l'api utiliser la commande suivante `nodemon api/server.js` (nodemon permet d'avoir le hotreload) ou `npm run start-api`

## Deploiement avec Docker

Pour déployer l'application, on utilise Docker (docker compose)

Le fichier `docker-compose.yml` décrit la configuration de docker

Il existe deux containers, un pour l'API qui se lance sur le port 3001, un autre pour le serveur web qui utilise va utiliser build disponible dans le dossier `/dist` pour lancer l'application.