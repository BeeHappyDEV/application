drop table if exists dat_constants cascade;

create table if not exists dat_constants (
    idf_constant  smallint,
    txt_key       text,
    txt_value     text,
    constraint dat_constants_pk primary key (idf_constant)
);

comment on table dat_constants is 'cst';