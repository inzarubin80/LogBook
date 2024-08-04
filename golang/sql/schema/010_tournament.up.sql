CREATE SCHEMA tournament;
CREATE TABLE IF NOT EXISTS tournament
(
    id bigserial PRIMARY KEY,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    begin_date_tournament date NOT NULL,
    end_date_tournament date NOT NULL,
    type_of_tornament_id bigint NOT NULL,
    venue character varying(100) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT tournament_type_of_tornament_id_foreign FOREIGN KEY (type_of_tornament_id)
        REFERENCES type_tournament (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)