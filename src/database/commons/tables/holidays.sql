drop table if exists holidays cascade;

create table if not exists holidays (
    idf_year  smallint,
    idf_month smallint,
    idf_day   smallint,
    constraint holidays_pk primary key (idf_year, idf_month, idf_day)
);

alter table holidays enable row level security;

comment on table holidays is 'hld';

insert into holidays  (idf_year, idf_month, idf_day) values
(2025, 1, 1),
(2025, 4, 18),
(2025, 4, 19),
(2025, 5, 1),
(2025, 5, 21),
(2025, 6, 20),
(2025, 6, 29),
(2025, 7, 16),
(2025, 8, 15),
(2025, 9, 18),
(2025, 9, 19),
(2025, 10, 12),
(2025, 10, 31),
(2025, 11, 1),
(2025, 11, 16),
(2025, 12, 8),
(2025, 12, 14),
(2025, 12, 25);