/**
 * @openapi
 * dat_communes:
 *    head:
 *      tags:
 *        - Location
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | cmn | |
 *        ```
 *        erDiagram
 *        dat_communes {
 *        idf_commune  numeric pk "dat_communes_pk"
 *        idf_country  numeric fk "dat_communes_fk1"
 *        idf_region   numeric fk "dat_communes_fk2"
 *        idf_province numeric fk "dat_communes_fk3"
 *        txt_commune  text
 *        }
 *        dat_countries {
 *        idf_country numeric
 *        }
 *        dat_regions {
 *        idf_region numeric
 *        }
 *        dat_provinces {
 *        idf_province numeric
 *        }
 *        dat_countries ||--|{ dat_communes : dat_communes_fk1
 *        dat_regions ||--|{ dat_communes : dat_communes_fk2
 *        dat_provinces ||--|{ dat_communes : dat_communes_fk3
 *        ```
 */

drop table if exists dat_communes cascade;

create table if not exists dat_communes (
    idf_commune  numeric,
    idf_country  numeric,
    idf_region   numeric,
    idf_province numeric,
    txt_commune  text,
    constraint dat_communes_pk primary key (idf_commune),
    constraint dat_communes_fk1 foreign key (idf_country) references dat_countries (idf_country),
    constraint dat_communes_fk2 foreign key (idf_region) references dat_regions (idf_region),
    constraint dat_communes_fk3 foreign key (idf_province) references dat_provinces (idf_province)
);

comment on table dat_communes is 'cmn';