drop table if exists dat_alternatives cascade;

create table if not exists dat_alternatives (
    idf_expression  numeric,
    idf_intention   numeric,
    idf_profile     numeric,
    num_alternative numeric,
    txt_alternative text
);

comment on table dat_alternatives is 'alt';