CREATE TABLE public.fl_category (
    id bigint NOT NULL DEFAULT nextval('fl_category_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_category_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_category
    OWNER to postgres;

