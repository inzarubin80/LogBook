CREATE TABLE public.fl_category_value
(
    id bigint NOT NULL DEFAULT nextval('fl_category_value_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    category_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_category_value_pkey PRIMARY KEY (id),
    CONSTRAINT fl_category_value_category_id_foreign FOREIGN KEY (category_id)
        REFERENCES public.fl_category (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_category_value
    OWNER to postgres;