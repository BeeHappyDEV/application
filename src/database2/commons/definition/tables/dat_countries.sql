drop table if exists dat_countries cascade;

create table if not exists dat_countries (
    idf_country smallint,
    txt_country text,
    constraint dat_countries_pk primary key (idf_country)
);

comment on table dat_countries is 'cty';