drop table if exists dat_holidays cascade;

create table if not exists dat_holidays (
    idf_year  smallint,
    idf_month smallint,
    idf_day   smallint,
    constraint dat_holidays_pk primary key (idf_year, idf_month, idf_day)
);

comment on table dat_holidays is 'hld';