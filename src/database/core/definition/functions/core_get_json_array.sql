/**
 * @openapi
 * core_get_json_array:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Input | text | in_txt_key |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        C((Client)) ---> P2[in_txt_key
 *        text]
 *        P1 ---> F[(core_get_json_array)]
 *        P2 ---> F[(core_get_json_array)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists core_get_json_array;

create or replace function core_get_json_array (
    in in_jsn_object json,
    in in_txt_key text
)
returns json as $body$
declare
    var_jsn_object json;
begin

    var_jsn_object = trim (in_jsn_object ->> lower (in_txt_key));

    if (var_jsn_object is null) then

        return '[]';

    else

        return var_jsn_object :: json;

    end if;

end;
$body$ language plpgsql;