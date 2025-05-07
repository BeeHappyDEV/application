/**
 * @openapi
 * dat_used_phrases:
 *    head:
 *      tags:
 *        - Phrases
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | uph | |
 *        ```
 *        erDiagram
 *        dat_used_phrases {
 *        idf_phrase numeric pk "dat_phrases_pk"
 *        num_day    numeric
 *        num_month  numeric
 *        num_year   numeric
 *        }
 *        ```
 */

drop table if exists dat_used_phrases cascade;

create table if not exists dat_used_phrases (
    idf_phrase numeric,
    num_day    numeric,
    num_month  numeric,
    num_year   numeric
);

comment on table dat_used_phrases is 'uph';