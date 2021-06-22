\echo 'Delete and recreate vaccine-hub-schema db?'
\prompt 'Return for yes or ^C to cancel > ' answer

DROP DATABASE if exists vaccine_hub;
CREATE DATABASE vaccine_hub;
\connect vaccine_hub;

\i vaccine-hub-schema.sql;