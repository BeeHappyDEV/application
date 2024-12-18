/**
 * @openapi
 * core_get_json_numeric:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Input | text | in_txt_key |
 *        | Output | numeric | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        C((Client)) ---> P2[in_txt_key
 *        text]
 *        P1 ---> F[(core_get_json_numeric)]
 *        P2 ---> F[(core_get_json_numeric)]
 *        F ---> R[returns
 *        numeric]
 *        R ---> C
 *        ```
 */

drop function if exists core_get_json_numeric;

create or replace function core_get_json_numeric (
    in in_jsn_object json,
    in in_txt_key text
)
returns numeric as $body$
declare
    var_txt_array text;
begin

    var_txt_array = trim (in_jsn_object ->> lower (in_txt_key));

    var_txt_array = replace (var_txt_array, '"[', '[');
    var_txt_array = replace (var_txt_array, ']"', ']');

    return var_txt_array :: numeric;

end;
$body$ language plpgsql;