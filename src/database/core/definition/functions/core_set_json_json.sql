/**
 * @openapi
 * core_set_json_json:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Input | text | in_txt_key |
 *        | Input | json | in_jsn_value |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        C((Client)) ---> P2[in_txt_key
 *        text]
 *        C((Client)) ---> P3[in_jsn_value
 *        json]
 *        P1 ---> F[(core_set_json_json)]
 *        P2 ---> F[(core_set_json_json)]
 *        P3 ---> F[(core_set_json_json)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists core_set_json_json;

create or replace function core_set_json_json (
    in in_jsn_object json,
    in in_txt_key text,
    in in_jsn_value json
)
returns json as $body$
declare
    var_jsn_node json;
    var_jsn_object json;
begin

    var_jsn_object = json_build_object (in_txt_key, in_jsn_value);

    var_jsn_node = core_get_json_empty (in_jsn_object);

    if (var_jsn_node :: text = '{}') then

        return var_jsn_object;

    end if;

    var_jsn_node = core_get_json_json (in_jsn_object, in_txt_key);

    if (var_jsn_node :: text = '{}') then

        return in_jsn_object :: jsonb || var_jsn_object :: jsonb;

    end if;

    var_jsn_object = core_get_json_json (var_jsn_object, in_txt_key);
    var_jsn_object = var_jsn_object :: jsonb || var_jsn_node :: jsonb;
    var_jsn_object = json_build_object (in_txt_key, var_jsn_object);

    return in_jsn_object :: jsonb || var_jsn_object :: jsonb;

end;
$body$ language plpgsql;