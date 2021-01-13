<br />
<p align="center">
  <a href="https://github.com/DavidArutiunian/magnit">
    <img src="frontend/src/assets/logo.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Магнит "Опросный Лист"</h3>
  <h4 align="center">Monorepo for internal Omega-R project Магнит "Опросный Лист"</h4>
  <p align="center">
    <a href="http://magnit-omega-r.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/DavidArutiunian/magnit/issues">Report Bug</a>
    ·
    <a href="https://github.com/DavidArutiunian/magnit/issues">Request Feature</a>
  </p>
</p>

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/DavidArutiunian/magnit.svg)
[![TLOC](https://tokei.rs/b1/github/DavidArutiunian/magnit)](https://github.com/DavidArutiunian/magnit)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/DavidArutiunian/magnit.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/DavidArutiunian/magnit.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![GitHub top language](https://img.shields.io/github/languages/top/DavidArutiunian/magnit.svg)
[![GitHub license](https://img.shields.io/github/license/DavidArutiunian/magnit.svg)](https://github.com/DavidArutiunian/magnit/blob/master/LICENSE)
[![David](https://img.shields.io/david/DavidArutiunian/magnit.svg)](https://github.com/DavidArutiunian/magnit)

## Table of Contents

-   [Table of Contents](#table-of-contents)
    -   [Requirements](#requirements)
    -   [Technologies](#technologies)
    -   [Project structure](#project-structure)
    -   [Installation](#installation)
    -   [Running](#running)
        -   [Frontend](#frontend)
        -   [Backend](#backend)
        -   [Libraries](#libraries)
    -   [Testing](#testing)
    -   [Documentation](#documentation)
    -   [Contributing](#contributing)

### Requirements

-   [Node.js](https://nodejs.org/en/) - runtime for backend & tooling
-   [Yarn](https://yarnpkg.com/lang/en/) - package management
-   [Lerna](https://github.com/lerna/lerna) - tool for managing projects with multiple packages

### Technologies

-   [TypeScript](https://www.typescriptlang.org/) - main language
-   [Node.js](https://nodejs.org/en/) - runtime for backend & tooling
-   [nest](https://nestjs.com/) - Node.js REST framework
-   [pino](http://getpino.io/) - super fast, all natural json logger
-   [Swagger](https://swagger.io/) - OpenAPI documentation
-   [compodoc](https://compodoc.app/) - code documentation
-   [React](https://reactjs.org/) - a JavaScript library for building user interfaces
-   [Material-UI](https://material-ui.com) - React UI framework
-   [Yarn](https://yarnpkg.com/lang/en/) - package management
-   [Lerna](https://github.com/lerna/lerna) - tool for managing projects with multiple packages
-   [Docker](https://www.docker.com/) - container platform
-   [nginx](https://nginx.org) - reverse proxy for frontend
-   [PostgreSQL](https://www.postgresql.org/) - relational DB
-   [Prettier](https://prettier.io/) - opinionated code formatter
-   [Husky](https://github.com/typicode/husky) - git hooks management
-   [webpack](https://webpack.js.org/) - package bundler
-   [logrotate](https://github.com/logrotate/logrotate) - tool for logs rotation

### Project structure

This project consists of 2 main parts

-   [@magnit/backend](./packages/backend) - REST API server built on top of [NestJS](https://nestjs.com/)
-   [@magnit/frontend](./packages/frontend) - SPA application build on top of [React](https://reactjs.org/)

### Installation

```bash
$ yarn lerna bootstrap
```

This will install all packages using `yarn install` command

You can check all packages using

```bash
$ yarn workspaces info
```

It should give use something like this

```
$ yarn workspaces info
yarn workspaces v1.21.1
{
  "@magnit/components": {
    "location": "packages/components",
    "workspaceDependencies": [
      "@magnit/icons"
    ],
    "mismatchedWorkspaceDependencies": []
  },
  "@magnit/entities": {
    "location": "packages/entities",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "@magnit/icons": {
    "location": "packages/icons",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "@magnit/services": {
    "location": "packages/services",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "@magnit/task-editor": {
    "location": "packages/task-editor",
    "workspaceDependencies": [
      "@magnit/components",
      "@magnit/entities",
      "@magnit/icons",
      "@magnit/services"
    ],
    "mismatchedWorkspaceDependencies": []
  },
  "@magnit/template-editor": {
    "location": "packages/template-editor",
    "workspaceDependencies": [
      "@magnit/components",
      "@magnit/entities",
      "@magnit/icons",
      "@magnit/services"
    ],
    "mismatchedWorkspaceDependencies": []
  },
  "@magnit/frontend": {
    "location": "frontend",
    "workspaceDependencies": [
      "@magnit/components",
      "@magnit/entities",
      "@magnit/icons",
      "@magnit/services",
      "@magnit/task-editor",
      "@magnit/template-editor"
    ],
    "mismatchedWorkspaceDependencies": []
  }
}
Done in 0.14s.
```

More info about `yarn workspaces` can be found [here](https://yarnpkg.com/en/docs/cli/workspaces)

### Running

#### Frontend

To start frontend just run this command

```bash
$ yarn start:frontend
```

#### Backend

To start backend just run this command

```bash
$ yarn start:backend
```

#### Libraries

It's recommended to build all libraries before starting project

```bash
$ yarn lerna run build:lib
```

Also if you're developing a library, provide a `build:lib` script, which will package and bundle your library

You can find examples in [@magnit/template-editor](packages/template-editor/package.json) `package.json` file

### Testing

```bash
$ lerna run test
```

This will run tests in all packages that have `test` script in `package.json`

### Documentation

All the necessary documentation for architecture can be found [here](./docs)

Backend documentation is available [here (compodoc)](http://91.144.161.208:1336/)

REST API documentations is available [here (swagger)](http://91.144.161.208:1336/api)

### Contributing

The recommended way to commit is using `yarn commit` command

This script is using [commitizen](https://github.com/commitizen/cz-cli), as well as [commitlint](https://github.com/conventional-changelog/commitlint) as git `post-commit` hook
