drop function if exists chatbot_get_intention;

create or replace function chatbot_get_intention (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_boo_break boolean;
    var_boo_telegram boolean;
    var_boo_whatsapp boolean;
    var_idf_unhandled numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_rec_intentions record;
    var_txt_channel text;
    var_txt_message text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_txt_channel = core_get_json_text (var_jsn_incoming, 'txt_channel');
    var_boo_telegram = core_get_json_boolean (var_jsn_outgoing, 'boo_telegram');
    var_boo_whatsapp = core_get_json_boolean (var_jsn_outgoing, 'boo_whatsapp');
    var_txt_message = core_get_json_text (var_jsn_outgoing, 'txt_message');

    var_boo_break = false;

    if (var_txt_channel = 'telegram') then

        if (var_boo_telegram is false) then

            var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_function', 'flow_require_telegram_authentication');

            var_boo_break = true;

        end if;


    end if;

    if (var_txt_channel = 'whatsapp') then

        if (var_boo_whatsapp is false) then

            var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_function', 'flow_require_whatsapp_authentication');

            var_boo_break = true;

        end if;

    end if;

    if (var_boo_break is false) then

        for var_rec_intentions in

            select
                int.boo_exact :: boolean,
                int.idf_intention,
                int.txt_intention,
                rel.boo_dependency,
                rel.txt_function
            from
                dat_intentions int,
                dat_relations rel
            where
                int.txt_intention is not null
                and rel.idf_intention = int.idf_intention
            order by
                int.boo_exact desc,
                int.idf_intention

        loop

            if (var_rec_intentions.boo_exact is true) then

                if (var_rec_intentions.txt_intention = var_txt_message) then

                    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_dependency', var_rec_intentions.boo_dependency);
                    --var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_intention', var_rec_intentions.idf_intention);
                    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_function', var_rec_intentions.txt_function);

                    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

                end if;

            end if;

            if (var_rec_intentions.boo_exact is false) then

                if (regexp_matches (var_txt_message, var_rec_intentions.txt_intention) is not null) then

                    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_dependency', var_rec_intentions.boo_dependency);
                    --var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_intention', var_rec_intentions.idf_intention);
                    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_function', var_rec_intentions.txt_function);

                    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

                end if;

            end if;

        end loop;

        for var_rec_intentions in

            select
                int.idf_intention,
                rel.boo_dependency,
                rel.txt_function
            from
                dat_intentions int,
                dat_relations rel
            where
                int.idf_intention = var_idf_unhandled

        loop

            var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_dependency', var_rec_intentions.boo_dependency);
            --var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_intention', var_rec_intentions.idf_intention);
            var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_function', var_rec_intentions.txt_function);

        end loop;

    end if;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;