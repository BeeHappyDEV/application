/**
 * @openapi
 * toolbox_get_first_name:
 *    options:
 *      tags:
 *        - Toolbox
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Output | text | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        P1 ---> F[(toolbox_get_first_name)]
 *        F ---> R[returns
 *        text]
 *        R ---> C
 *        ```
 */

drop function if exists toolbox_get_first_name;

create or replace function toolbox_get_first_name (
    in in_jsn_object json
)
returns text as $body$
declare
    var_jsn_outgoing json;
    var_txt_first_name text;
begin

    var_jsn_outgoing = core_get_json_empty ((in_jsn_object ->> 'outgoing') :: json);

    var_txt_first_name = core_get_json_text (var_jsn_outgoing, 'txt_first_name');

    if (var_txt_first_name is null) then

        var_txt_first_name = '';

    else

        var_txt_first_name = ' ' || var_txt_first_name;

    end if;

    return var_txt_first_name;

end;
$body$ language plpgsql;