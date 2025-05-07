/**
 * @openapi
 * core_set_json_text:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Input | text | in_txt_key |
 *        | Input | text | in_txt_value |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        C((Client)) ---> P2[in_txt_key
 *        text]
 *        C((Client)) ---> P3[in_txt_value
 *        text]
 *        P1 ---> F[(core_set_json_text)]
 *        P2 ---> F[(core_set_json_text)]
 *        P3 ---> F[(core_set_json_text)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists core_set_json_text;

create or replace function core_set_json_text (
    in in_jsn_object json,
    in in_txt_key text,
    in in_txt_value text
)
returns json as $body$
declare
    var_jsn_object json;
    var_num_length numeric;
    var_txt_node text;
begin

    var_jsn_object = json_build_object (in_txt_key, in_txt_value);

    in_jsn_object = core_get_json_empty (in_jsn_object);

    if (in_jsn_object :: text = '{}') then

        return var_jsn_object;

    end if;

    var_txt_node = core_get_json_text (in_jsn_object, in_txt_key);

    if (var_txt_node is null) then

        return in_jsn_object :: jsonb || var_jsn_object :: jsonb;

    end if;

    begin

        var_num_length = json_array_length (var_txt_node :: json);

        var_jsn_object = var_txt_node :: jsonb || ('"' || in_txt_value || '"') :: jsonb;
        var_jsn_object = json_build_object (in_txt_key, var_jsn_object);

    exception
        when others then

            var_num_length = 0;

            var_jsn_object = ('["' || var_txt_node || '"]') :: jsonb || ('"' || in_txt_value || '"') :: jsonb;
            var_jsn_object = json_build_object (in_txt_key, var_jsn_object);

    end;

    return in_jsn_object :: jsonb || var_jsn_object :: jsonb;

end ;
$body$ language plpgsql;