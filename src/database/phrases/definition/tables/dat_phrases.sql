/**
 * @openapi
 * dat_phrases:
 *    head:
 *      tags:
 *        - Phrases
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | phr | |
 *        ```
 *        erDiagram
 *        dat_phrases {
 *        idf_phrase numeric pk "dat_phrases_pk"
 *        txt_phrase text
 *        txt_author text
 *        }
 *        ```
 */

drop table if exists dat_phrases cascade;

create table if not exists dat_phrases (
    idf_phrase numeric,
    txt_phrase text,
    txt_author text,
    constraint dat_phrases_pk primary key (idf_phrase)
);

comment on table dat_phrases is 'phr';