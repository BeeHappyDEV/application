/**
 * @openapi
 * toolbox_check_mail:
 *    options:
 *      tags:
 *        - Toolbox
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | text | in_txt_object |
 *        | Output | boolean | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_txt_object
 *        text]
 *        P1 ---> F[(toolbox_check_mail)]
 *        F ---> R[returns
 *        boolean]
 *        R ---> C
 *        ```
 */

drop function if exists toolbox_check_mail;

create or replace function toolbox_check_mail (
    in in_txt_object text
)
returns boolean as $body$
declare
    var_num_at numeric;
    var_num_dot numeric;
begin

    var_num_at := position ('@' in in_txt_object);
    var_num_dot := position ('.' in substring (in_txt_object from var_num_at :: integer + 1));

    if (var_num_at > 0 and var_num_dot > 0 and var_num_dot < length (in_txt_object) - var_num_at) then

        return true;

    end if;

    return false;

end;
$body$ language plpgsql;