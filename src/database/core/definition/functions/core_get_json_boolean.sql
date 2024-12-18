/**
 * @openapi
 * core_get_json_boolean:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Input | text | in_txt_key |
 *        | Output | boolean | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        C((Client)) ---> P2[in_txt_key
 *        text]
 *        P1 ---> F[(core_get_json_boolean)]
 *        P2 ---> F[(core_get_json_boolean)]
 *        F ---> R[returns
 *        boolean]
 *        R ---> C
 *        ```
 */

drop function if exists core_get_json_boolean;

create or replace function core_get_json_boolean (
    in in_jsn_object json,
    in in_txt_key text
)
returns boolean as $body$
begin

    return trim (in_jsn_object ->> lower (in_txt_key));

end;
$body$ language plpgsql;