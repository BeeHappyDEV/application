/**
 * @openapi
 * core_get_json_empty:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P[in_jsn_object
 *        json]
 *        P ---> F[(core_get_json_empty)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists core_get_json_empty;

create or replace function core_get_json_empty (
    in in_jsn_object json
)
returns json as $body$
declare
    var_boo_null boolean;
    var_txt_null text;
begin

    var_boo_null = false;

    var_txt_null = in_jsn_object :: text;

    if (in_jsn_object is null) then

        var_boo_null = true;

    end if;

    if (var_txt_null = '') then

        var_boo_null = true;

    end if;

    if (var_txt_null = '{}') then

        var_boo_null = true;

    end if;

    if (var_boo_null) then

        return '{}' :: json;

    else

        return in_jsn_object;

    end if;

end;
$body$ language plpgsql;