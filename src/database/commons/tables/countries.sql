drop table if exists countries cascade;

create table if not exists countries (
    idf_country smallint,
    txt_country text,
    constraint countries_pk primary key (idf_country)
);

alter table countries enable row level security;

comment on table countries is 'cty';

insert into countries (idf_country, txt_country) values
(56, 'Chile');