## Requirements

-   [PostgreSQL](https://www.postgresql.org/) ≥ 10.x

-   [Node.js](https://nodejs.org/en/) ≥ 10.x

-   [Sails.js](https://sailsjs.com/) ≥ 1.1.0

-   [Mocha](https://mochajs.org/) ≥ 6.x (for tests)

## Usage

1. Create file `local.js` in folder `config` and fill it in by example `stuff/local_example.js`
2. Create file `bootstrap.js` in folder `config` and fill it in by example `stuff/bootstrap_example.js`
3. Create file `config.json` in the root directory and fill it in by example `stuff/config_example.json`
4. `$ yarn install`
5. Create database `magnit` in PostgreSQL
6. `$ sudo -u postgres psql --quiet magnit < stuff/magnit.sql`
7. `$ sails lift`
