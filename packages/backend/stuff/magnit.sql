CREATE TYPE "puzzle_types" AS ENUM (
  'question',
  'numeric_answer',
  'string_answer',
  'radio_answer',
  'group'
);

CREATE TYPE "action_types" AS ENUM (
  'one_answer',
  'yes_or_no'
);

CREATE TYPE "operator_types" AS ENUM (
  'less',
  'greater',
  'equal',
  'less_or_equal',
  'greater_or_equal'
);

CREATE TYPE "unit_types" AS ENUM (
  'km',
  'm',
  'sm'
);

CREATE TABLE "templates" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "sections" (
  "id" int PRIMARY KEY,
  "template_id" int,
  "name" varchar,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "section_puzzles" (
  "id" int PRIMARY KEY,
  "section_id" int,
  "puzzle_id" int
);

CREATE TABLE "puzzles" (
  "id" int PRIMARY KEY,
  "parent_id" int,
  "title" varchar,
  "puzzle_type" "puzzle_types",
  "created_at" timestamp
);

CREATE TABLE "validations" (
  "id" int PRIMARY KEY,
  "operator" "operator_types",
  "value" varchar,
  "unit_type" "unit_types"
);

CREATE TABLE "puzzle_validations" (
  "id" int PRIMARY KEY,
  "puzzle_id" int,
  "validation_id" int
);

CREATE TABLE "conditions" (
  "id" int PRIMARY KEY,
  "puzzle_id" int,
  "actions" "action_types"
);

ALTER TABLE "sections" ADD FOREIGN KEY ("template_id") REFERENCES "templates" ("id");

ALTER TABLE "section_puzzles" ADD FOREIGN KEY ("section_id") REFERENCES "sections" ("id");

ALTER TABLE "section_puzzles" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");

ALTER TABLE "puzzle_validations" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");

ALTER TABLE "puzzle_validations" ADD FOREIGN KEY ("validation_id") REFERENCES "validations" ("id");

ALTER TABLE "conditions" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");