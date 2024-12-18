/**
 * @openapi
 * core_set_json_boolean:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Input | text | in_txt_key |
 *        | Input | boolean | in_boo_value |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        C((Client)) ---> P2[in_txt_key
 *        text]
 *        C((Client)) ---> P3[in_boo_value
 *        boolean]
 *        P1 ---> F[(core_set_json_boolean)]
 *        P2 ---> F[(core_set_json_boolean)]
 *        P3 ---> F[(core_set_json_boolean)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists core_set_json_boolean;

create or replace function core_set_json_boolean (
    in in_jsn_object json,
    in in_txt_key text,
    in in_boo_value boolean
)
returns json as $body$
declare
    var_jsn_object json;
begin

    var_jsn_object = json_build_object (in_txt_key, in_boo_value);

    in_jsn_object = core_get_json_empty (in_jsn_object);

    if (in_jsn_object :: text = '{}') then

        return var_jsn_object;

    end if;


    return in_jsn_object :: jsonb || var_jsn_object :: jsonb;

end ;
$body$ language plpgsql;