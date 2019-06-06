CREATE TYPE "puzzle_type" AS ENUM (
  'question',
  'numeric_answer',
  'string_answer',
  'radio_answer',
  'input_answer',
  'group'
);

CREATE TYPE "condition_action_type" AS ENUM (
  'choosen_answer'
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

CREATE TABLE "template" (
  "id" int PRIMARY KEY,
  "title" varchar
);

CREATE TABLE "section" (
  "id" int PRIMARY KEY,
  "template_id" int,
  "title" varchar,
  "order" int
);

CREATE TABLE "sections_x_puzzle" (
  "section_id" int,
  "puzzle_id" int
);

CREATE TABLE "puzzle" (
  "id" int PRIMARY KEY,
  "title" varchar,
  "puzzle_type" "puzzle_type",
  "order" int,
  "answer_type" "input_type"
);

CREATE TABLE "puzzle_x_puzzle" (
  "parent_id" int,
  "child_id" int
);

CREATE TABLE "puzzle_x_condition" (
  "puzzle_id" int,
  "condition_id" int
);

CREATE TABLE "condition" (
  "id" int PRIMARY KEY,
  "order" int,
  "question_puzzle" int,
  "action_type" "condition_action_type",
  "answer_puzzle" int
);

CREATE TABLE "validation" (
  "id" id PRIMARY KEY,
  "order" int,
  "operator_type" "operator_type",
  "validation_type" "validation_action_type",
  "left_hand_puzzle" int,
  "right_hand_puzzle" int,
  "value" int,
  "error_message" varchar
);

CREATE TABLE "puzzle_x_validation" (
  "puzzle_id" int,
  "validation_id" int
);

ALTER TABLE "section" ADD FOREIGN KEY ("template_id") REFERENCES "template" ("id");

ALTER TABLE "sections_x_puzzle" ADD FOREIGN KEY ("section_id") REFERENCES "section" ("id");

ALTER TABLE "sections_x_puzzle" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzle" ("id");

ALTER TABLE "puzzle_x_puzzle" ADD FOREIGN KEY ("parent_id") REFERENCES "puzzle" ("id");

ALTER TABLE "puzzle_x_puzzle" ADD FOREIGN KEY ("child_id") REFERENCES "puzzle" ("id");

ALTER TABLE "puzzle_x_condition" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzle" ("id");

ALTER TABLE "puzzle_x_condition" ADD FOREIGN KEY ("condition_id") REFERENCES "condition" ("id");

ALTER TABLE "condition" ADD FOREIGN KEY ("question_puzzle") REFERENCES "puzzle" ("id");

ALTER TABLE "condition" ADD FOREIGN KEY ("answer_puzzle") REFERENCES "puzzle" ("id");

ALTER TABLE "validation" ADD FOREIGN KEY ("left_hand_puzzle") REFERENCES "puzzle" ("id");

ALTER TABLE "validation" ADD FOREIGN KEY ("right_hand_puzzle") REFERENCES "puzzle" ("id");

ALTER TABLE "puzzle_x_validation" ADD FOREIGN KEY ("puzzle_id") REFERENCES "puzzle" ("id");

ALTER TABLE "puzzle_x_validation" ADD FOREIGN KEY ("validation_id") REFERENCES "validation" ("id");