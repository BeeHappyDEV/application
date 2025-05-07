/**
 * @openapi
 * core_get_text_array:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Input | text | in_txt_key |
 *        | Output | text [] | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        C((Client)) ---> P2[in_txt_key
 *        text]
 *        P1 ---> F[(core_get_text_array)]
 *        P2 ---> F[(core_get_text_array)]
 *        F ---> R[returns
 *        text #91;#93;]
 *        R ---> C
 *        ```
 */

drop function if exists core_get_text_array;

create or replace function core_get_text_array (
    in in_jsn_object json,
    in in_txt_key text
)
returns text[] as $body$
declare
    var_txt_message text;
begin

    var_txt_message = trim (in_jsn_object ->> lower (in_txt_key));

    return regexp_split_to_array (var_txt_message, E'\\s+');

end;
$body$ language plpgsql;