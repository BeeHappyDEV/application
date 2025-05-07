drop table if exists dat_intentions cascade;

create table if not exists dat_intentions (
    boo_exact      boolean,
    idf_intention  numeric,
    txt_intention  text
);

comment on table dat_intentions is 'int';