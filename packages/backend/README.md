## **Recommended software versions:**

-   PostgreSQL >= 10.8

-   node.js >= 10.15.2

-   sails.js >= 1.1.0

-   mocha >= 6.0.2 (for running tests)

## **Usage**

1. Create file "local.js" in folder "config" and fill it in by example "stuff/local_example.js"
2. Create file "bootstrap.js" in folder "config" and fill it in by example "stuff/bootstrap_example.js"
3. Create file "config.json" in the root directory and fill it in by example "stuff/config_example.json"
4. `npm install`
5. Create database `magnit` in PostgreSQL
6. `sudo -u postgres psql --quiet magnit < stuff/magnit.sql`
7. `sails lift`

####To run tests:
`npm test`
