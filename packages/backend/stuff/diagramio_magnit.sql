CREATE TYPE "puzzle_type" AS ENUM (
  'question',
  'numeric_answer',
  'string_answer',
  'radio_answer',
  'input_answer',
  'group'
);

CREATE TYPE "condition_action_type" AS ENUM (
  'chosen_answer'
);

CREATE TYPE "validation_action_type" AS ENUM (
  'compare_with_answer',
  'set_value'
);

CREATE TYPE "input_type" AS ENUM (
  'string',
  'number'
);

CREATE TYPE "operator_type" AS ENUM (
  'less',
  'more',
  'equal',
  'less_or_equal',
  'more_or_equal'
);

CREATE TYPE "unit_type" AS ENUM (
  'km',
  'm',
  'sm'
);

CREATE TYPE "condition_type" AS ENUM (
  'or',
  'and'
);

CREATE TABLE "templates" (
  "id" SERIAL PRIMARY KEY,
  "title" text,
  "description" text
);

CREATE TABLE "sections" (
  "id" SERIAL PRIMARY KEY,
  "template_id" int,
  "title" text,
  "description" text,
  "order" int
);

CREATE TABLE "template_puzzles" (
  "template_id" int,
  "puzzle_id" int
);

CREATE TABLE "section_puzzles" (
  "section_id" int,
  "puzzle_id" int
);

CREATE TABLE "puzzles" (
  "id" SERIAL PRIMARY KEY,
  "parent_id" int,
  "title" text,
  "puzzle_type" "puzzle_type",
  "order" int,
  "answer_type" "input_type"
);

CREATE TABLE "puzzle_conditions" (
  "puzzle_id" int,
  "condition_id" int
);

CREATE TABLE "conditions" (
  "id" SERIAL PRIMARY KEY,
  "order" int,
  "question_puzzle" int,
  "action_type" "condition_action_type",
  "answer_puzzle" int,
  "condition_type" "condition_type"
);

CREATE TABLE "validations" (
  "id" SERIAL PRIMARY KEY,
  "order" int,
  "operator_type" "operator_type",
  "validation_type" "validation_action_type",
  "left_hand_puzzle" int,
  "right_hand_puzzle" int,
  "value" int,
  "error_message" text
);

CREATE TABLE "puzzle_validations" (
  "puzzle_id" int,
  "validation_id" int
);

CREATE TABLE "tariffs" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "toir_id" int,
  "toir_name" text,
  "toir_type" text
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "login" text,
  "name" text,
  "position" text,
  "object_id" int
);

CREATE TABLE "regions" (
  "id" SERIAL PRIMARY KEY,
  "name" text
);

CREATE TABLE "objects" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "region" int,
  "branch" text,
  "address" text,
  "format" text
);

CREATE TABLE "tasks" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "description" text,
  "departure_date" timestamp,
  "deadline_date" timestamp,
  "object_id" int
);

CREATE TABLE "task_templates" (
  "task_id" int,
  "template_id" int
);

CREATE TABLE "task_users" (
  "task_id" int,
  "users_id" int,
  "taken" boolean
);

CREATE TABLE "answers" (
  "id" SERIAL PRIMARY KEY,
  "puzzle_id" int,
  "answer" text,
  "answer_type" "input_type"
);

ALTER TABLE "sections" ADD FOREIGN KEY ("template_id") REFERENCES "templates" ("id");

ALTER TABLE "template_puzzles" ADD FOREIGN KEY ("template_id") REFERENCES "templates" ("id");

ALTER TABLE "template_puzzles" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");

ALTER TABLE "section_puzzles" ADD FOREIGN KEY ("section_id") REFERENCES "sections" ("id");

ALTER TABLE "section_puzzles" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");

ALTER TABLE "puzzle_conditions" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");

ALTER TABLE "puzzle_conditions" ADD FOREIGN KEY ("condition_id") REFERENCES "conditions" ("id");

ALTER TABLE "conditions" ADD FOREIGN KEY ("question_puzzle") REFERENCES "puzzles" ("id");

ALTER TABLE "conditions" ADD FOREIGN KEY ("answer_puzzle") REFERENCES "puzzles" ("id");

ALTER TABLE "validations" ADD FOREIGN KEY ("left_hand_puzzle") REFERENCES "puzzles" ("id");

ALTER TABLE "validations" ADD FOREIGN KEY ("right_hand_puzzle") REFERENCES "puzzles" ("id");

ALTER TABLE "puzzle_validations" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");

ALTER TABLE "puzzle_validations" ADD FOREIGN KEY ("validation_id") REFERENCES "validations" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("object_id") REFERENCES "objects" ("id");

ALTER TABLE "objects" ADD FOREIGN KEY ("region") REFERENCES "regions" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("object_id") REFERENCES "objects" ("id");

ALTER TABLE "task_templates" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id");

ALTER TABLE "task_templates" ADD FOREIGN KEY ("template_id") REFERENCES "templates" ("id");

ALTER TABLE "task_users" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id");

ALTER TABLE "task_users" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "answers" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzles" ("id");