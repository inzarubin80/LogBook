CREATE TABLE IF NOT EXISTS public.fl_tournament
(
    id bigint NOT NULL DEFAULT nextval('fl_tournament_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    begin_date_tournament date,
    end_date_tournament date,
    venue character varying(100) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    type_of_tornament_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_tournament_pkey PRIMARY KEY (id),
    CONSTRAINT fl_tournament_type_of_tornament_id_foreign FOREIGN KEY (type_of_tornament_id)
        REFERENCES public.fl_type_tournament (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_tournament
    OWNER to postgres;