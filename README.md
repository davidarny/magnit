<br />
<p align="center">
  <a href="https://github.com/DavidArutiunian/magnit">
    <img src="packages/frontend/src/assets/magnit.png" alt="Logo" width="128" height="128">
  </a>

  <h3 align="center">Магнит "Опросный Лист"</h3>

  <h4 align="center">Monorepo for internal Omega-R project Магнит "Опросный Лист"</h4>

  <p align="center">
    <a href="https://magnit-omega-r.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/DavidArutiunian/magnit/issues">Report Bug</a>
    ·
    <a href="https://github.com/DavidArutiunian/magnit/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Project structure](#project-structure)
  - [Usage](#usage)
    - [Installation](#installation)
    - [Running](#running)
      - [Frontend](#frontend)
      - [Backend](#backend)
    - [Testing](#testing)
    - [Contributing](#contributing)
    - [Documentation](#documentation)

### Requirements

* [Node.js](https://nodejs.org/en/) - runtime for backend & tooling
* [Yarn](https://yarnpkg.com/lang/en/) - package management

### Project structure

This project consists of 2 main parts

* [@magnit/backend](./packages/backend) - REST API server built on top of [sails.js](https://sailsjs.com/)
* [@magnit/frontend](./packages/frontend) - SPA application build on top of [React](https://reactjs.org/)

### Usage

#### Installation

```bash
$ yarn install
```

This project is build on top of [yarn workspaces](https://yarnpkg.com/en/docs/workspaces)

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


#### Running

##### Frontend

To start frontend just run this command

```bash
$ yarn workspace @magnit/frontend start
```

##### Backend

To start backend just run this command

```bash
$ yarn workspace @magnit/backend start
```

More info about `yarn workspace` can be found [here](https://yarnpkg.com/en/docs/cli/workspace)

#### Testing

```bash
$ yarn workspaces run test
```

This will run tests in all packages that have `test` script in `package.json`


#### Contributing

The recommended way to commit is using `yarn commit` command

This script is using [commitizen](https://github.com/commitizen/cz-cli), as well as [commitlint](https://github.com/conventional-changelog/commitlint) as git `post-commit` hook

#### Documentation

All the necessary documentation can be found [here](./docs)
