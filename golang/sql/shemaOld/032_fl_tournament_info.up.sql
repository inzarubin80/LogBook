CREATE TABLE IF NOT EXISTS public.fl_tournament_info
(
    id bigint NOT NULL DEFAULT nextval('fl_tournament_info_id_seq'::regclass),
    period date NOT NULL,
    points integer NOT NULL DEFAULT 0,
    place smallint NOT NULL DEFAULT '0'::smallint,
    tournament_id bigint,
    sportsman_id bigint,
    category_value_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_tournament_info_pkey PRIMARY KEY (id),
    CONSTRAINT fl_tournament_info_category_value_id_foreign FOREIGN KEY (category_value_id)
        REFERENCES public.fl_category_value (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fl_tournament_info_sportsman_id_foreign FOREIGN KEY (sportsman_id)
        REFERENCES public.fl_sportsman (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fl_tournament_info_tournament_id_foreign FOREIGN KEY (tournament_id)
        REFERENCES public.fl_tournament (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_tournament_info
    OWNER to postgres;