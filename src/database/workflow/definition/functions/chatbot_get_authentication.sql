drop function if exists chatbot_get_authentication;

create or replace function chatbot_get_authentication (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_boo_telegram boolean;
    var_boo_whatsapp boolean;
    var_num_telegram numeric;
    var_num_whatsapp numeric;

    var_boo_authenticated boolean;
    var_boo_required boolean;
    var_idf_profile numeric;
    var_idf_user numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_count numeric;
    var_num_sender numeric;
    var_txt_first_name text;
    var_txt_last_name text;
    var_txt_channel text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_txt_channel = core_get_json_text (var_jsn_incoming, 'txt_channel');
    var_num_sender = core_get_json_numeric (var_jsn_incoming, 'txt_sender');

    var_boo_telegram = false;
    var_boo_whatsapp = false;

    if (var_txt_channel = 'telegram') then

        select
            count (usr.*)
        into
            var_num_count
        from
            dat_users usr
        where
            usr.sys_status = true
            and usr.num_telegram = var_num_sender;

        if (var_num_count > 0) then

            var_boo_telegram = true;

            select
                usr.idf_user,
                usr.num_whatsapp,
                usr.txt_first_name,
                usr.txt_last_name,
                pfu.idf_profile
            into
                var_idf_user,
                var_num_whatsapp,
                var_txt_first_name,
                var_txt_last_name,
                var_idf_profile
            from
                dat_users usr,
                dat_profiles_users pfu
            where
                usr.sys_status = true
                and usr.num_telegram = var_num_sender
                and pfu.idf_user = usr.idf_user;

            if (var_num_whatsapp is not null) then

                var_boo_whatsapp = true;

            end if;

        end if;

    end if;

    if (var_txt_channel = 'whatsapp') then

        select
            count (usr.*)
        into
            var_num_count
        from
            dat_users usr
        where
            usr.sys_status = true
            and usr.num_whatsapp = var_num_sender;

        if (var_num_count > 0) then

            var_boo_whatsapp = true;

            select
                usr.idf_user,
                usr.num_telegram,
                usr.txt_first_name,
                usr.txt_last_name,
                pfu.idf_profile
            into
                var_idf_user,
                var_num_telegram,
                var_txt_first_name,
                var_txt_last_name,
                var_idf_profile
            from
                dat_users usr,
                dat_profiles_users pfu
            where
                usr.sys_status = true
                and usr.num_whatsapp = var_num_sender
                and pfu.idf_user = usr.idf_user;

            if (var_num_whatsapp is not null) then

                var_boo_telegram = true;

            end if;

        end if;

    end if;

    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_telegram', var_boo_telegram);
    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_whatsapp', var_boo_whatsapp);
    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_profile', var_idf_profile);
    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_user', var_idf_user);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_first_name', var_txt_first_name);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_last_name', var_txt_last_name);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;