CREATE TABLE public.fl_type_tournament
(
    id bigint NOT NULL DEFAULT nextval('fl_type_tournament_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_type_tournament_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_type_tournament
    OWNER to postgres;