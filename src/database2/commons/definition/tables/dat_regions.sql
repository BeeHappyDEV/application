drop table if exists dat_regions cascade;

create table if not exists dat_regions (
    idf_region  smallint,
    idf_country smallint,
    txt_region  text,
    constraint dat_regions_pk primary key (idf_region),
    constraint dat_regions_fk1 foreign key (idf_country) references dat_countries (idf_country)
);

comment on table dat_regions is 'rgn';