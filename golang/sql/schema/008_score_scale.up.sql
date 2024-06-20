CREATE SCHEMA score_scale;
CREATE TABLE IF NOT EXISTS score_scale
(
    id bigserial PRIMARY KEY,
    place_from integer NOT NULL DEFAULT 0,
    place_to integer NOT NULL DEFAULT 0,
    numbers_of_points integer NOT NULL DEFAULT 0,
    sport_school_id bigint NOT NULL,
    type_tournament_id bigint NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT score_scale_sport_school_id_foreign FOREIGN KEY (sport_school_id)
        REFERENCES sport_school (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT score_scale_type_tournament_id_foreign FOREIGN KEY (type_tournament_id)
        REFERENCES type_tournament (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)