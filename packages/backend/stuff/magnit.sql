--
-- PostgreSQL database dump
--

-- Dumped from database version 10.8 (Ubuntu 10.8-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.8 (Ubuntu 10.8-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.validations DROP CONSTRAINT validations_right_hand_puzzle_fkey;
ALTER TABLE ONLY public.validations DROP CONSTRAINT validations_left_hand_puzzle_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_object_id_fkey;
ALTER TABLE ONLY public.template_puzzles DROP CONSTRAINT template_puzzles_template_id_fkey;
ALTER TABLE ONLY public.template_puzzles DROP CONSTRAINT template_puzzles_puzzle_id_fkey;
ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_object_id_fkey;
ALTER TABLE ONLY public.task_users DROP CONSTRAINT task_users_users_id_fkey;
ALTER TABLE ONLY public.task_users DROP CONSTRAINT task_users_task_id_fkey;
ALTER TABLE ONLY public.task_templates DROP CONSTRAINT task_templates_template_id_fkey;
ALTER TABLE ONLY public.task_templates DROP CONSTRAINT task_templates_task_id_fkey;
ALTER TABLE ONLY public.sections DROP CONSTRAINT sections_template_id_fkey;
ALTER TABLE ONLY public.section_puzzles DROP CONSTRAINT section_puzzles_section_id_fkey;
ALTER TABLE ONLY public.section_puzzles DROP CONSTRAINT section_puzzles_puzzle_id_fkey;
ALTER TABLE ONLY public.puzzle_validations DROP CONSTRAINT puzzle_validations_validation_id_fkey;
ALTER TABLE ONLY public.puzzle_validations DROP CONSTRAINT puzzle_validations_puzzle_id_fkey;
ALTER TABLE ONLY public.puzzle_conditions DROP CONSTRAINT puzzle_conditions_puzzle_id_fkey;
ALTER TABLE ONLY public.puzzle_conditions DROP CONSTRAINT puzzle_conditions_condition_id_fkey;
ALTER TABLE ONLY public.objects DROP CONSTRAINT objects_region_fkey;
ALTER TABLE ONLY public.conditions DROP CONSTRAINT conditions_question_puzzle_fkey;
ALTER TABLE ONLY public.conditions DROP CONSTRAINT conditions_answer_puzzle_fkey;
ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_puzzle_id_fkey;
ALTER TABLE ONLY public.validations DROP CONSTRAINT validations_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.templates DROP CONSTRAINT templates_pkey;
ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_pkey;
ALTER TABLE ONLY public.tariffs DROP CONSTRAINT tariffs_pkey;
ALTER TABLE ONLY public.sections DROP CONSTRAINT sections_pkey;
ALTER TABLE ONLY public.regions DROP CONSTRAINT regions_pkey;
ALTER TABLE ONLY public.puzzles DROP CONSTRAINT puzzles_pkey;
ALTER TABLE ONLY public.objects DROP CONSTRAINT objects_pkey;
ALTER TABLE ONLY public.conditions DROP CONSTRAINT conditions_pkey;
ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_pkey;
ALTER TABLE public.validations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.templates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tasks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tariffs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.sections ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.regions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.puzzles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.objects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.conditions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.answers ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.validations_id_seq;
DROP TABLE public.validations;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.templates_id_seq;
DROP TABLE public.templates;
DROP TABLE public.template_puzzles;
DROP SEQUENCE public.tasks_id_seq;
DROP TABLE public.tasks;
DROP TABLE public.task_users;
DROP TABLE public.task_templates;
DROP SEQUENCE public.tariffs_id_seq;
DROP TABLE public.tariffs;
DROP SEQUENCE public.sections_id_seq;
DROP TABLE public.sections;
DROP TABLE public.section_puzzles;
DROP SEQUENCE public.regions_id_seq;
DROP TABLE public.regions;
DROP SEQUENCE public.puzzles_id_seq;
DROP TABLE public.puzzles;
DROP TABLE public.puzzle_validations;
DROP TABLE public.puzzle_conditions;
DROP SEQUENCE public.objects_id_seq;
DROP TABLE public.objects;
DROP SEQUENCE public.conditions_id_seq;
DROP TABLE public.conditions;
DROP SEQUENCE public.answers_id_seq;
DROP TABLE public.answers;
DROP TYPE public.validation_action_type;
DROP TYPE public.unit_type;
DROP TYPE public.puzzle_type;
DROP TYPE public.operator_type;
DROP TYPE public.input_type;
DROP TYPE public.condition_action_type;
DROP TYPE public.condition_type;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: condition_action_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.condition_action_type AS ENUM (
    'chosen_answer'
);


ALTER TYPE public.condition_action_type OWNER TO postgres;


--
-- Name: condition_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.condition_type AS ENUM (
    'or',
    'and'
);


ALTER TYPE public.condition_type OWNER TO postgres;

--
-- Name: input_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.input_type AS ENUM (
    'string',
    'number'
);


ALTER TYPE public.input_type OWNER TO postgres;

--
-- Name: operator_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.operator_type AS ENUM (
    'less',
    'more',
    'equal',
    'less_or_equal',
    'more_or_equal'
);


ALTER TYPE public.operator_type OWNER TO postgres;

--
-- Name: puzzle_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.puzzle_type AS ENUM (
    'question',
    'numeric_answer',
    'string_answer',
    'radio_answer',
    'input_answer',
    'group'
);


ALTER TYPE public.puzzle_type OWNER TO postgres;

--
-- Name: unit_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.unit_type AS ENUM (
    'km',
    'm',
    'sm'
);


ALTER TYPE public.unit_type OWNER TO postgres;

--
-- Name: validation_action_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.validation_action_type AS ENUM (
    'compare_with_answer',
    'set_value'
);


ALTER TYPE public.validation_action_type OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answers (
    id integer NOT NULL,
    puzzle_id integer,
    answer text,
    answer_type public.input_type
);


ALTER TABLE public.answers OWNER TO postgres;

--
-- Name: answers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.answers_id_seq OWNER TO postgres;

--
-- Name: answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.answers_id_seq OWNED BY public.answers.id;


--
-- Name: conditions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conditions (
    id integer NOT NULL,
    "order" integer,
    question_puzzle integer,
    action_type public.condition_action_type,
    answer_puzzle integer,
		condition_type public.condition_type
);


ALTER TABLE public.conditions OWNER TO postgres;

--
-- Name: conditions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conditions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conditions_id_seq OWNER TO postgres;

--
-- Name: conditions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conditions_id_seq OWNED BY public.conditions.id;


--
-- Name: objects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.objects (
    id integer NOT NULL,
    name text,
    region integer,
    branch text,
    address text,
    format text
);


ALTER TABLE public.objects OWNER TO postgres;

--
-- Name: objects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.objects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.objects_id_seq OWNER TO postgres;

--
-- Name: objects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.objects_id_seq OWNED BY public.objects.id;


--
-- Name: puzzle_conditions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puzzle_conditions (
    puzzle_id integer,
    condition_id integer
);


ALTER TABLE public.puzzle_conditions OWNER TO postgres;

--
-- Name: puzzle_validations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puzzle_validations (
    puzzle_id integer,
    validation_id integer
);


ALTER TABLE public.puzzle_validations OWNER TO postgres;

--
-- Name: puzzles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puzzles (
    id integer NOT NULL,
    parent_id integer,
    title text,
    puzzle_type public.puzzle_type,
    "order" integer,
    answer_type public.input_type
);


ALTER TABLE public.puzzles OWNER TO postgres;

--
-- Name: puzzles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.puzzles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.puzzles_id_seq OWNER TO postgres;

--
-- Name: puzzles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.puzzles_id_seq OWNED BY public.puzzles.id;


--
-- Name: regions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regions (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.regions OWNER TO postgres;

--
-- Name: regions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.regions_id_seq OWNER TO postgres;

--
-- Name: regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.regions_id_seq OWNED BY public.regions.id;


--
-- Name: section_puzzles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.section_puzzles (
    section_id integer,
    puzzle_id integer
);


ALTER TABLE public.section_puzzles OWNER TO postgres;

--
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    template_id integer,
    title text,
    description text,
    "order" integer
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sections_id_seq OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: tariffs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tariffs (
    id integer NOT NULL,
    name text,
    toir_id integer,
    toir_name text,
    toir_type text
);


ALTER TABLE public.tariffs OWNER TO postgres;

--
-- Name: tariffs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tariffs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tariffs_id_seq OWNER TO postgres;

--
-- Name: tariffs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tariffs_id_seq OWNED BY public.tariffs.id;


--
-- Name: task_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_templates (
    task_id integer,
    template_id integer
);


ALTER TABLE public.task_templates OWNER TO postgres;

--
-- Name: task_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_users (
    task_id integer,
    users_id integer,
    taken boolean
);


ALTER TABLE public.task_users OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    name text,
    description text,
    departure_date timestamp without time zone,
    deadline_date timestamp without time zone,
    object_id integer
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: template_puzzles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.template_puzzles (
    template_id integer,
    puzzle_id integer
);


ALTER TABLE public.template_puzzles OWNER TO postgres;

--
-- Name: templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.templates (
    id integer NOT NULL,
    title text,
    description text
);


ALTER TABLE public.templates OWNER TO postgres;

--
-- Name: templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.templates_id_seq OWNER TO postgres;

--
-- Name: templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.templates_id_seq OWNED BY public.templates.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login text,
    name text,
    "position" text,
    object_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: validations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.validations (
    id integer NOT NULL,
    "order" integer,
    operator_type public.operator_type,
    validation_type public.validation_action_type,
    left_hand_puzzle integer,
    right_hand_puzzle integer,
    value integer,
    error_message text
);


ALTER TABLE public.validations OWNER TO postgres;

--
-- Name: validations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.validations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.validations_id_seq OWNER TO postgres;

--
-- Name: validations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.validations_id_seq OWNED BY public.validations.id;


--
-- Name: answers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers ALTER COLUMN id SET DEFAULT nextval('public.answers_id_seq'::regclass);


--
-- Name: conditions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conditions ALTER COLUMN id SET DEFAULT nextval('public.conditions_id_seq'::regclass);


--
-- Name: objects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objects ALTER COLUMN id SET DEFAULT nextval('public.objects_id_seq'::regclass);


--
-- Name: puzzles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzles ALTER COLUMN id SET DEFAULT nextval('public.puzzles_id_seq'::regclass);


--
-- Name: regions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions ALTER COLUMN id SET DEFAULT nextval('public.regions_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: tariffs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tariffs ALTER COLUMN id SET DEFAULT nextval('public.tariffs_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templates ALTER COLUMN id SET DEFAULT nextval('public.templates_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: validations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validations ALTER COLUMN id SET DEFAULT nextval('public.validations_id_seq'::regclass);


--
-- Data for Name: answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.answers (id, puzzle_id, answer, answer_type) FROM stdin;
\.


--
-- Data for Name: conditions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conditions (id, "order", question_puzzle, action_type, answer_puzzle) FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.objects (id, name, region, branch, address, format) FROM stdin;
\.


--
-- Data for Name: puzzle_conditions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.puzzle_conditions (puzzle_id, condition_id) FROM stdin;
\.


--
-- Data for Name: puzzle_validations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.puzzle_validations (puzzle_id, validation_id) FROM stdin;
\.


--
-- Data for Name: puzzles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.puzzles (id, parent_id, title, puzzle_type, "order", answer_type) FROM stdin;
\.


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regions (id, name) FROM stdin;
\.


--
-- Data for Name: section_puzzles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.section_puzzles (section_id, puzzle_id) FROM stdin;
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, template_id, title, description, "order") FROM stdin;
\.


--
-- Data for Name: tariffs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tariffs (id, name, toir_id, toir_name, toir_type) FROM stdin;
\.


--
-- Data for Name: task_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_templates (task_id, template_id) FROM stdin;
\.


--
-- Data for Name: task_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_users (task_id, users_id, taken) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, name, description, departure_date, deadline_date, object_id) FROM stdin;
\.


--
-- Data for Name: template_puzzles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.template_puzzles (template_id, puzzle_id) FROM stdin;
\.


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.templates (id, title, description) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, login, name, "position", object_id) FROM stdin;
\.


--
-- Data for Name: validations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.validations (id, "order", operator_type, validation_type, left_hand_puzzle, right_hand_puzzle, value, error_message) FROM stdin;
\.


--
-- Name: answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.answers_id_seq', 1, false);


--
-- Name: conditions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conditions_id_seq', 1, false);


--
-- Name: objects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.objects_id_seq', 1, false);


--
-- Name: puzzles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.puzzles_id_seq', 1, false);


--
-- Name: regions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.regions_id_seq', 1, false);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 1, false);


--
-- Name: tariffs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tariffs_id_seq', 1, false);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 1, false);


--
-- Name: templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.templates_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: validations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.validations_id_seq', 1, false);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: conditions conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: puzzles puzzles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzles
    ADD CONSTRAINT puzzles_pkey PRIMARY KEY (id);


--
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: tariffs tariffs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tariffs
    ADD CONSTRAINT tariffs_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: validations validations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT validations_pkey PRIMARY KEY (id);


--
-- Name: answers answers_puzzle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id);


--
-- Name: conditions conditions_answer_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_answer_puzzle_fkey FOREIGN KEY (answer_puzzle) REFERENCES public.puzzles(id);


--
-- Name: conditions conditions_question_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_question_puzzle_fkey FOREIGN KEY (question_puzzle) REFERENCES public.puzzles(id);


--
-- Name: objects objects_region_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objects
    ADD CONSTRAINT objects_region_fkey FOREIGN KEY (region) REFERENCES public.regions(id);


--
-- Name: puzzle_conditions puzzle_conditions_condition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzle_conditions
    ADD CONSTRAINT puzzle_conditions_condition_id_fkey FOREIGN KEY (condition_id) REFERENCES public.conditions(id);


--
-- Name: puzzle_conditions puzzle_conditions_puzzle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzle_conditions
    ADD CONSTRAINT puzzle_conditions_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id);


--
-- Name: puzzle_validations puzzle_validations_puzzle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzle_validations
    ADD CONSTRAINT puzzle_validations_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id);


--
-- Name: puzzle_validations puzzle_validations_validation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzle_validations
    ADD CONSTRAINT puzzle_validations_validation_id_fkey FOREIGN KEY (validation_id) REFERENCES public.validations(id);


--
-- Name: section_puzzles section_puzzles_puzzle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_puzzles
    ADD CONSTRAINT section_puzzles_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id);


--
-- Name: section_puzzles section_puzzles_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_puzzles
    ADD CONSTRAINT section_puzzles_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id);


--
-- Name: sections sections_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id);


--
-- Name: task_templates task_templates_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_templates
    ADD CONSTRAINT task_templates_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: task_templates task_templates_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_templates
    ADD CONSTRAINT task_templates_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id);


--
-- Name: task_users task_users_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_users
    ADD CONSTRAINT task_users_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: task_users task_users_users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_users
    ADD CONSTRAINT task_users_users_id_fkey FOREIGN KEY (users_id) REFERENCES public.users(id);


--
-- Name: tasks tasks_object_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_object_id_fkey FOREIGN KEY (object_id) REFERENCES public.objects(id);


--
-- Name: template_puzzles template_puzzles_puzzle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.template_puzzles
    ADD CONSTRAINT template_puzzles_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id);


--
-- Name: template_puzzles template_puzzles_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.template_puzzles
    ADD CONSTRAINT template_puzzles_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id);


--
-- Name: users users_object_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_object_id_fkey FOREIGN KEY (object_id) REFERENCES public.objects(id);


--
-- Name: validations validations_left_hand_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT validations_left_hand_puzzle_fkey FOREIGN KEY (left_hand_puzzle) REFERENCES public.puzzles(id);


--
-- Name: validations validations_right_hand_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT validations_right_hand_puzzle_fkey FOREIGN KEY (right_hand_puzzle) REFERENCES public.puzzles(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to magnit;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public to magnit;
