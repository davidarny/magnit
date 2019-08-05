<br />
<p align="center">
  <a href="https://github.com/DavidArutiunian/magnit">
    <img src="packages/frontend/src/assets/MagnitIcon.png" alt="Logo" width="40" height="40">
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

## Table of Contents

-   [Table of Contents](#Table-of-Contents)
    -   [Requirements](#Requirements)
    -   [Project structure](#Project-structure)
    -   [Installation](#Installation)
    -   [Running](#Running)
        -   [Frontend](#Frontend)
        -   [Backend](#Backend)
        -   [Libraries](#Libraries)
    -   [Testing](#Testing)
    -   [Documentation](#Documentation)
    -   [Contributing](#Contributing)

### Requirements

-   [Node.js](https://nodejs.org/en/) - runtime for backend & tooling
-   [Yarn](https://yarnpkg.com/lang/en/) - package management
-   [Lerna](https://github.com/lerna/lerna) - a tool for managing projects with multiple packages

### Project structure

This project consists of 2 main parts

-   [@magnit/backend](./packages/backend) - REST API server built on top of [Nest.JS](https://nestjs.com/)
-   [@magnit/frontend](./packages/frontend) - SPA application build on top of [React](https://reactjs.org/)

### Installation

```bash
$ lerna bootstrap
```

This will install all packages using `yarn install` command

You can check all packages using

```bash
$ yarn workspaces info
```

It should give use something like this

```
$ yarn workspaces info
yarn workspaces v1.16.0
{
  "@magnit/backend": {
    "location": "packages/backend",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "@magnit/frontend": {
    "location": "packages/frontend",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  }
}
Done in 0.11s.
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
lerna run build:lib
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

Backend documentation is available [here (compodoc)](http://91.144.161.208:1337/)

REST API documentations is available [here (swagger)](http://91.144.161.208:1337/api)

### Contributing

The recommended way to commit is using `yarn commit` command

This script is using [commitizen](https://github.com/commitizen/cz-cli), as well as [commitlint](https://github.com/conventional-changelog/commitlint) as git `post-commit` hook
