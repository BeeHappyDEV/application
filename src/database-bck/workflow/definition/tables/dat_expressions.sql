drop table if exists dat_expressions cascade;

create table if not exists dat_expressions (
    idf_expression numeric,
    num_offset numeric,
    txt_expression text
);

comment on table dat_expressions is 'exp';