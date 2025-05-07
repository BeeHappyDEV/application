/**
 * @openapi
 * flow_update_identifier:
 *    options:
 *      tags:
 *        - System
 *      description: |
 *        | Concept | Value |
 *        | :-----: | :---: |
 *        | Intentions | 9093 |
 *        | Expressions | 9093 |
 *        ```
 *        sequenceDiagram
 *        autonumber
 *        Actor Chatbot
 *        participant F as flow_update_identifier
 *        Chatbot ->> F: in_jsn_transfer
 *        F ->> F: select constants: system_version
 *        F ->> F: select constants: system_status
 *        F ->> F: idf_expression: 9021
 *        F -->> Chatbot: out_jsn_transfer
 *        ```
 */

drop function if exists flow_update_identifier;

create or replace function flow_update_identifier (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_arr_words text[];
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_phone numeric;
    var_num_telegram numeric;
    var_num_word numeric;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_arr_words = core_get_text_array (var_jsn_outgoing, 'txt_message');

    begin

        var_num_word = var_arr_words [2] :: numeric;

        if (length (var_num_word :: text) = 11) then

            if exists (

                select
                    usr.num_phone
                from
                    dat_users usr
                where
                    usr.num_phone = var_num_word

            ) then

                update
                    dat_users
                set
                    num_telegram = var_num_telegram
                where
                    num_phone = var_num_word;

            end if;

            var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9093);

        end if;

    end;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;