/**
 * @openapi
 * flow_add_user:
 *    options:
 *      tags:
 *        - System
 *      description: |
 *        | Concept | Value |
 *        | :-----: | :---: |
 *        | Intentions | 9020 |
 *        | Expressions | 9021 |
 *        ```
 *        sequenceDiagram
 *        autonumber
 *        Actor Chatbot
 *        participant F as flow_about_me
 *        Chatbot ->> F: in_jsn_transfer
 *        F ->> F: select constants: system_version
 *        F ->> F: select constants: system_status
 *        F ->> F: idf_expression: 9021
 *        F -->> Chatbot: out_jsn_transfer
 *        ```
 */

drop function if exists flow_who_is;

create or replace function flow_who_is (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_arr_words text[];
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_parameters json;
    var_jsn_status json;
    var_num_at numeric;
    var_num_dot numeric;
    var_num_word numeric;
    var_txt_full_name text;
    var_txt_mail text;
    var_txt_phone text;
    var_txt_status text;
    var_txt_word text;
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

                select
                    trim (usr.txt_first_name || ' ' || usr.txt_last_name),
                    usr.txt_mail,
                    case usr.sys_status
                        when true then 'Activo'
                        when false then 'Inactivo'
                    end
                into
                    var_txt_full_name,
                    var_txt_mail,
                    var_txt_status
                from
                    dat_users usr
                where
                    usr.num_phone = var_num_word;

                var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9011);
                var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%1', var_txt_full_name);
                var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%2', var_txt_mail);
                var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%3', var_txt_status);
                var_jsn_outgoing = core_set_json_json (var_jsn_outgoing, 'jsn_parameters', var_jsn_parameters);

            else

                var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9012);

            end if;

        else

            var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9013);

        end if;

    exception
        when others then

            var_txt_word = var_arr_words [2] :: text;

            var_num_at := position ('@' in var_txt_word);
            var_num_dot := position ('.' in substring (var_txt_word from var_num_at :: integer + 1));

            if (utils_check_mail (var_txt_word)) then

                if exists (

                    select
                        usr.txt_mail
                    from
                        dat_users usr
                    where
                        usr.txt_mail = var_txt_word

                ) then

                    select
                        trim (usr.txt_first_name || ' ' || usr.txt_last_name),
                        usr.num_phone,
                        case usr.sys_status
                            when true then 'Activo'
                            when false then 'Inactivo'
                        end
                    into
                        var_txt_full_name,
                        var_txt_phone,
                        var_txt_status
                    from
                        dat_users usr
                    where
                        usr.txt_mail = var_txt_word;

                    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9014);
                    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%1', var_txt_full_name);
                    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%2', var_txt_phone);
                    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%3', var_txt_status);
                    var_jsn_outgoing = core_set_json_json (var_jsn_outgoing, 'jsn_parameters', var_jsn_parameters);

                else

                    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9015);

                end if;

            else

                var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9016);

            end if;

    end;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;