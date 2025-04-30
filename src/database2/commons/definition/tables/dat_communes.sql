drop table if exists dat_communes cascade;

create table if not exists dat_communes (
    idf_commune  smallint,
    idf_country  smallint,
    idf_region   smallint,
    idf_province smallint,
    txt_commune  text,
    constraint dat_communes_pk primary key (idf_commune),
    constraint dat_communes_fk1 foreign key (idf_country) references dat_countries (idf_country),
    constraint dat_communes_fk2 foreign key (idf_region) references dat_regions (idf_region),
    constraint dat_communes_fk3 foreign key (idf_province) references dat_provinces (idf_province)
);

comment on table dat_communes is 'cmn';