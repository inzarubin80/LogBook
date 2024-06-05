CREATE SEQUENCE IF NOT EXISTS public.fl_tournament_info_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.fl_tournament_info_id_seq
    OWNER TO postgres;