CREATE TABLE IF NOT EXISTS public.fl_sportsman
(
    id bigint NOT NULL DEFAULT nextval('fl_sportsman_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    gender character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT 'MALE'::character varying,
    date_birth date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_sportsman_pkey PRIMARY KEY (id),
    CONSTRAINT fl_sportsman_gender_check CHECK (gender::text = ANY (ARRAY['MALE'::character varying, 'FEMALE'::character varying]::text[]))
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_sportsman
    OWNER to postgres;