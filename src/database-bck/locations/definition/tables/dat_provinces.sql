/**
 * @openapi
 * dat_provinces:
 *    head:
 *      tags:
 *        - Location
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | pvc | |
 *        ```
 *        erDiagram
 *        dat_provinces {
 *        idf_province numeric pk "dat_provinces_pk"
 *        idf_country  numeric fk "dat_provinces_fk1"
 *        idf_region   numeric fk "dat_provinces_fk2"
 *        txt_province text
 *        }
 *        dat_countries {
 *        idf_country numeric
 *        }
 *        dat_regions {
 *        idf_region numeric
 *        }
 *        dat_countries ||--|{ dat_provinces : dat_provinces_fk1
 *        dat_regions ||--|{ dat_provinces : dat_provinces_fk2
 *        ```
 */

drop table if exists dat_provinces cascade;

create table if not exists dat_provinces (
    idf_province numeric,
    idf_country  numeric,
    idf_region   numeric,
    txt_province text,
    constraint dat_provinces_pk primary key (idf_province),
    constraint dat_provinces_fk1 foreign key (idf_country) references dat_countries (idf_country),
    constraint dat_provinces_fk2 foreign key (idf_region) references dat_regions (idf_region)
);

comment on table dat_provinces is 'pvc';