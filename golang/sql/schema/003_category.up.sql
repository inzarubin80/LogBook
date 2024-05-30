CREATE SCHEMA category;
CREATE TABLE category (
    id bigserial PRIMARY KEY,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT fl_category_pkey PRIMARY KEY (id)
)
