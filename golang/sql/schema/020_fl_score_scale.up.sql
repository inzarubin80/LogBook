CREATE TABLE public.fl_score_scale
(
    id bigint NOT NULL DEFAULT nextval('fl_score_scale_id_seq'::regclass),
    period date NOT NULL,
    place_from integer NOT NULL DEFAULT 0,
    place_to integer NOT NULL DEFAULT 0,
    numbers_of_points integer NOT NULL DEFAULT 0,
    sport_school_id bigint,
    type_tournament_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_score_scale_pkey PRIMARY KEY (id),
    CONSTRAINT fl_score_scale_sport_school_id_foreign FOREIGN KEY (sport_school_id)
        REFERENCES public.fl_sport_school (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fl_score_scale_type_tournament_id_foreign FOREIGN KEY (type_tournament_id)
        REFERENCES public.fl_type_tournament (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_score_scale
    OWNER to postgres;