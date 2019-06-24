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
ALTER TABLE ONLY public.validations DROP CONSTRAINT validations_puzzle_id_fkey;
ALTER TABLE ONLY public.validations DROP CONSTRAINT validations_left_hand_puzzle_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_object_id_fkey;
ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_object_id_fkey;
ALTER TABLE ONLY public.task_users DROP CONSTRAINT task_users_pkey;
ALTER TABLE ONLY public.task_users DROP CONSTRAINT task_users_users_id_fkey;
ALTER TABLE ONLY public.task_users DROP CONSTRAINT task_users_task_id_fkey;
ALTER TABLE ONLY public.task_templates DROP CONSTRAINT task_templates_pkey;
ALTER TABLE ONLY public.task_templates DROP CONSTRAINT task_templates_template_id_fkey;
ALTER TABLE ONLY public.task_templates DROP CONSTRAINT task_templates_task_id_fkey;
ALTER TABLE ONLY public.sections DROP CONSTRAINT sections_template_id_fkey;
ALTER TABLE ONLY public.puzzles DROP CONSTRAINT puzzles_template_id_fkey;
ALTER TABLE ONLY public.puzzles DROP CONSTRAINT puzzles_section_id_fkey;
ALTER TABLE ONLY public.objects DROP CONSTRAINT objects_region_id_fkey;
ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_task_id_fkey;
ALTER TABLE ONLY public.conditions DROP CONSTRAINT conditions_question_puzzle_fkey;
ALTER TABLE ONLY public.conditions DROP CONSTRAINT conditions_puzzle_id_fkey;
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
ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
ALTER TABLE ONLY public.conditions DROP CONSTRAINT conditions_pkey;
ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_pkey;
ALTER TABLE public.validations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.templates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.task_users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.task_templates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tasks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tariffs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.sections ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.regions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.puzzles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.objects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.notifications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.conditions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.answers ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.validations_id_seq;
DROP TABLE public.validations;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.templates_id_seq;
DROP TABLE public.templates;
DROP SEQUENCE public.tasks_id_seq;
DROP TABLE public.tasks;
DROP SEQUENCE public.task_users_id_seq;
DROP TABLE public.task_users;
DROP SEQUENCE public.task_templates_id_seq;
DROP TABLE public.task_templates;
DROP SEQUENCE public.tariffs_id_seq;
DROP TABLE public.tariffs;
DROP SEQUENCE public.sections_id_seq;
DROP TABLE public.sections;
DROP SEQUENCE public.regions_id_seq;
DROP TABLE public.regions;
DROP SEQUENCE public.puzzles_id_seq;
DROP TABLE public.puzzles;
DROP SEQUENCE public.objects_id_seq;
DROP TABLE public.objects;
DROP SEQUENCE public.notifications_id_seq;
DROP TABLE public.notifications;
DROP SEQUENCE public.conditions_id_seq;
DROP TABLE public.conditions;
DROP SEQUENCE public.answers_id_seq;
DROP TABLE public.answers;
DROP TYPE public.validation_action_type;
DROP TYPE public.unit_type;
DROP TYPE public.puzzle_type;
DROP TYPE public.operator_type;
DROP TYPE public.input_type;
DROP TYPE public.condition_type;
DROP TYPE public.condition_action_type;
DROP TYPE public.status_type;
DROP EXTENSION "uuid-ossp";
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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: condition_action_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.condition_action_type AS ENUM (
    'chosen_answer',
    'given_answer',
    'equal',
    'not_equal',
    'more_than',
    'less_than'
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
    'less_than',
    'more_than',
    'equal',
    'less_or_equal',
    'more_or_equal'
);


ALTER TYPE public.operator_type OWNER TO postgres;

--
-- Name: puzzle_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.puzzle_type AS ENUM (
    'group',
    'question',
    'radio_answer',
    'checkbox_answer',
    'dropdown_answer',
    'reference_answer',
    'upload_files',
    'date_answer',
    'text_answer',
    'numeric_answer'
);


ALTER TYPE public.puzzle_type OWNER TO postgres;

--
-- Name: status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_type AS ENUM (
    'inactive',
    'inprogress',
    'oncheck',
    'overdue',
    'completed'
);


ALTER TYPE public.status_type OWNER TO postgres;

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
    answer_type public.input_type,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
    puzzle_id integer,
    "order" integer,
    question_puzzle uuid,
    action_type public.condition_action_type,
    answer_puzzle uuid,
    value integer,
    condition_type public.condition_type,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    task_id integer,
    message text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: objects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.objects (
    id integer NOT NULL,
    name text,
    region_id integer,
    branch text,
    address text,
    format text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
-- Name: puzzles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puzzles (
    id integer NOT NULL,
    uuid uuid UNIQUE,
    template_id integer,
    section_id integer,
    parent_id integer,
    title text,
    description text,
    puzzle_type public.puzzle_type,
    "order" integer,
    answer_type public.input_type,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
    name text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    template_id integer,
    title text,
    description text,
    "order" integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
    toir_type text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
    id integer NOT NULL,
    task_id integer,
    template_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.task_templates OWNER TO postgres;

--
-- Name: task_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_templates_id_seq OWNER TO postgres;

--
-- Name: task_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_templates_id_seq OWNED BY public.task_templates.id;

--
-- Name: task_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_users (
    id integer NOT NULL,
    task_id integer,
    users_id integer,
    taken boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.task_users OWNER TO postgres;

--
-- Name: task_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_users_id_seq OWNER TO postgres;

--
-- Name: task_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_users_id_seq OWNED BY public.task_users.id;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    name text,
    description text,
    departure_date timestamp without time zone,
    deadline_date timestamp without time zone,
    object_id integer,
    status public.status_type,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
-- Name: templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.templates (
    id integer NOT NULL,
    title text,
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
    object_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
    puzzle_id integer,
    "order" integer,
    operator_type public.operator_type,
    validation_type public.validation_action_type,
    left_hand_puzzle uuid,
    right_hand_puzzle uuid,
    value integer,
    error_message text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
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
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


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
-- Name: task_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_templates ALTER COLUMN id SET DEFAULT nextval('public.task_templates_id_seq'::regclass);


--
-- Name: task_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_users ALTER COLUMN id SET DEFAULT nextval('public.task_users_id_seq'::regclass);


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

COPY public.answers (id, puzzle_id, answer, answer_type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: conditions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conditions (id, puzzle_id, "order", question_puzzle, action_type, answer_puzzle, value, condition_type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, task_id, message) FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.objects (id, name, region_id, branch, address, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: puzzles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.puzzles (id, uuid, template_id, section_id, parent_id, title, description, puzzle_type, "order", answer_type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regions (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, template_id, title, description, "order", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tariffs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tariffs (id, name, toir_id, toir_name, toir_type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: task_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_templates (id, task_id, template_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: task_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_users (id, task_id, users_id, taken, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, name, description, departure_date, deadline_date, object_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.templates (id, title, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, login, name, "position", object_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: validations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.validations (id, puzzle_id, "order", operator_type, validation_type, left_hand_puzzle, right_hand_puzzle, value, error_message, created_at, updated_at) FROM stdin;
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
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


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
-- Name: task_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_templates_id_seq', 1, false);


--
-- Name: task_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_users_id_seq', 1, false);


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
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


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
-- Name: tasks task_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_templates
    ADD CONSTRAINT task_templates_pkey PRIMARY KEY (id);


--
-- Name: tasks task_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_users
    ADD CONSTRAINT task_users_pkey PRIMARY KEY (id);


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
    ADD CONSTRAINT answers_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id) ON DELETE CASCADE;


--
-- Name: conditions conditions_answer_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_answer_puzzle_fkey FOREIGN KEY (answer_puzzle) REFERENCES public.puzzles(uuid) ON DELETE CASCADE;


--
-- Name: conditions conditions_puzzle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id) ON DELETE CASCADE;


--
-- Name: conditions conditions_question_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conditions
    ADD CONSTRAINT conditions_question_puzzle_fkey FOREIGN KEY (question_puzzle) REFERENCES public.puzzles(uuid) ON DELETE CASCADE;


--
-- Name: notifications notifications_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: objects objects_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objects
    ADD CONSTRAINT objects_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id) ON DELETE CASCADE;


--
-- Name: puzzles puzzles_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzles
    ADD CONSTRAINT puzzles_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- Name: puzzles puzzles_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puzzles
    ADD CONSTRAINT puzzles_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id)ON DELETE CASCADE;


--
-- Name: sections sections_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id)ON DELETE CASCADE;


--
-- Name: task_templates task_templates_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_templates
    ADD CONSTRAINT task_templates_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)ON DELETE CASCADE;


--
-- Name: task_templates task_templates_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_templates
    ADD CONSTRAINT task_templates_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id)ON DELETE CASCADE;


--
-- Name: task_users task_users_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_users
    ADD CONSTRAINT task_users_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)ON DELETE CASCADE;


--
-- Name: task_users task_users_users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_users
    ADD CONSTRAINT task_users_users_id_fkey FOREIGN KEY (users_id) REFERENCES public.users(id)ON DELETE CASCADE;


--
-- Name: tasks tasks_object_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_object_id_fkey FOREIGN KEY (object_id) REFERENCES public.objects(id) ON DELETE CASCADE;


--
-- Name: users users_object_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_object_id_fkey FOREIGN KEY (object_id) REFERENCES public.objects(id) ON DELETE CASCADE;


--
-- Name: validations validations_left_hand_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT validations_left_hand_puzzle_fkey FOREIGN KEY (left_hand_puzzle) REFERENCES public.puzzles(uuid) ON DELETE CASCADE;


--
-- Name: validations validations_puzzle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT validations_puzzle_id_fkey FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id) ON DELETE CASCADE;


--
-- Name: validations validations_right_hand_puzzle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validations
    ADD CONSTRAINT validations_right_hand_puzzle_fkey FOREIGN KEY (right_hand_puzzle) REFERENCES public.puzzles(uuid) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: TABLE answers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.answers TO magnit;


--
-- Name: SEQUENCE answers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.answers_id_seq TO magnit;


--
-- Name: TABLE conditions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.conditions TO magnit;


--
-- Name: SEQUENCE conditions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.conditions_id_seq TO magnit;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO magnit;


--
-- Name: SEQUENCE notifications_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.notifications_id_seq TO magnit;


--
-- Name: TABLE objects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.objects TO magnit;


--
-- Name: SEQUENCE objects_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.objects_id_seq TO magnit;


--
-- Name: TABLE puzzles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.puzzles TO magnit;


--
-- Name: SEQUENCE puzzles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.puzzles_id_seq TO magnit;


--
-- Name: TABLE regions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.regions TO magnit;


--
-- Name: SEQUENCE regions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.regions_id_seq TO magnit;


--
-- Name: TABLE sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sections TO magnit;


--
-- Name: SEQUENCE sections_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.sections_id_seq TO magnit;


--
-- Name: TABLE tariffs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tariffs TO magnit;


--
-- Name: SEQUENCE tariffs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tariffs_id_seq TO magnit;


--
-- Name: TABLE task_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.task_templates TO magnit;


--
-- Name: TABLE task_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.task_users TO magnit;


--
-- Name: TABLE tasks; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tasks TO magnit;


--
-- Name: SEQUENCE tasks_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tasks_id_seq TO magnit;


--
-- Name: TABLE templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.templates TO magnit;


--
-- Name: SEQUENCE templates_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.templates_id_seq TO magnit;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO magnit;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO magnit;


--
-- Name: TABLE validations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.validations TO magnit;


--
-- Name: SEQUENCE validations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.validations_id_seq TO magnit;


--
-- PostgreSQL database dump complete
--

