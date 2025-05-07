/**
 * @openapi
 * core_del_json_node:
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
 *        P1 ---> F[(core_del_json_node)]
 *        P2 ---> F[(core_del_json_node)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists core_del_json_node;

create or replace function core_del_json_node (
    in in_jsn_object json,
    in in_txt_key text
)
returns json as $body$
begin

    return in_jsn_object :: jsonb - in_txt_key;

end;
$body$ language plpgsql;