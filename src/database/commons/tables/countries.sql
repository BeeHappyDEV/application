drop table if exists commons.countries cascade;

create table if not exists commons.countries (
    idf_country smallint,
    txt_country text,
    constraint countries_pk primary key (idf_country)
);

alter table commons.countries enable row level security;

comment on table commons.countries is 'cty';

insert into commons.countries (idf_country, txt_country) values
(56, 'Chile');