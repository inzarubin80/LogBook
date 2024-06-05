CREATE TABLE IF NOT EXISTS public.fl_sportsman_info
(
    id bigint NOT NULL DEFAULT nextval('fl_sportsman_info_id_seq'::regclass),
    period date NOT NULL,
    insuranse boolean NOT NULL DEFAULT false,
    sport_school_id bigint,
    sportsman_id bigint,
    coache_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_sportsman_info_pkey PRIMARY KEY (id),
    CONSTRAINT fl_sportsman_info_coache_id_foreign FOREIGN KEY (coache_id)
        REFERENCES public.fl_coache (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fl_sportsman_info_sport_school_id_foreign FOREIGN KEY (sport_school_id)
        REFERENCES public.fl_sport_school (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fl_sportsman_info_sportsman_id_foreign FOREIGN KEY (sportsman_id)
        REFERENCES public.fl_sportsman (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.fl_sportsman_info
    OWNER to postgres;

COMMENT ON COLUMN public.fl_sportsman_info.insuranse
    IS 'Признак, застрахован ли спортсмен';