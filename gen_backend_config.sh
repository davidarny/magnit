#!/bin/sh

echo "
{
  \"host\": \"http://localhost:${BACKEND_PORT}\",
  \"hostname\": \"localhost\",
  \"postgresql_db\": \"magnit\",
  \"postgresql_user\": \"magnit\",
  \"postgresql_host\": \"db\",
  \"postgresql_password\": \"${POSTGRES_PASSWORD}\",
  \"postgresql_port\": 5432,
  \"secret\": \"${SECRET}\"
}
" > ./packages/backend/config.json


echo "
module.exports.bootstrap = async function() {};
" > ./packages/backend/config/bootstrap.js

echo "
module.exports = {
    port: ${BACKEND_PORT},
};
" > ./packages/backend/config/local.js
