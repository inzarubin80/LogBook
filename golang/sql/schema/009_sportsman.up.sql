CREATE SCHEMA sportsman;
CREATE TABLE IF NOT EXISTS sportsman
(
    id bigserial PRIMARY KEY,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    gender character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT 'MALE'::character varying,
    date_birth date,
    main_coache_id bigint NOT NULL,
    sport_school_id bigint NOT NULL,
    insuranse character varying(100) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT sportsman_gender_check CHECK (gender::text = ANY (ARRAY['MALE'::character varying, 'FEMALE'::character varying]::text[]))
)