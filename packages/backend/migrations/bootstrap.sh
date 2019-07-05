#!/bin/sh sh

PATH_TO_SQL=../stuff/magnit.sql

psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -a -f ${PATH_TO_SQL}
