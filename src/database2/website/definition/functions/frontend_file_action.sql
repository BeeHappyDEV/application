drop function if exists frontend_file_action;

create or replace function frontend_file_action (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_count numeric;
    var_txt_action text;
    var_txt_first_name text;
    var_txt_full_name text;
    var_txt_last_name text;
    var_txt_mail text;
    var_txt_mime text;
    var_txt_name text;
    var_txt_phone text;
    var_txt_phone_temp text;
    var_txt_profile text;
    var_txt_vcard text;
begin

    var_jsn_status = status_initializer ();
    var_jsn_incoming = get_empty_node ((in_jsn_incoming) :: json);
    var_jsn_outgoing = get_empty_node (null :: json);

    var_txt_action = get_text (var_jsn_incoming, 'txt_action');
    var_txt_name = get_text (var_jsn_incoming, 'txt_name');
    var_txt_name = lower (var_txt_name);

    if (var_txt_action = 'vcard') then

        select
            count (*)
        into
            var_num_count
        from
            dat_users usr,
            dat_profiles_users pfu,
            dat_profiles prf
        where
            usr.sys_status = true
            and lower (usr.txt_first_name) = var_txt_name
            and pfu.idf_user = usr.idf_user
            and prf.idf_profile = pfu.idf_profile
            and prf.boo_collaborator = true;

        if (var_num_count = 0) then

            return result_failed (var_jsn_status, var_jsn_incoming);

        end if;

        select
            coalesce (usr.txt_first_name, ''),
            coalesce (usr.txt_last_name, ''),
            usr.txt_mail,
            usr.num_whatsapp,
            prf.txt_profile
        into
            var_txt_first_name,
            var_txt_last_name,
            var_txt_mail,
            var_txt_phone_temp,
            var_txt_profile
        from
            dat_users usr,
            dat_profiles_users pfu,
            dat_profiles prf
        where
            usr.sys_status = true
            and lower (usr.txt_first_name) = var_txt_name
            and pfu.idf_user = usr.idf_user
            and prf.idf_profile = pfu.idf_profile
            and prf.boo_collaborator = true;

        if (var_txt_last_name = '') then

            var_txt_full_name = trim (var_txt_first_name);

            select
                '+' || substring (var_txt_phone_temp, 1, 2) || ' ' || substring (var_txt_phone_temp, 3, 3) || ' ' || substring (var_txt_phone_temp, 6, 3) || ' ' || substring (var_txt_phone_temp, 9, 3)
            into
                var_txt_phone;

        else

            var_txt_full_name = initcap (trim (var_txt_first_name || ' ' || var_txt_last_name));

            select
                '+' || substring (var_txt_phone_temp, 1, 3) || ' ' || substring (var_txt_phone_temp, 4, 4) || ' ' || substring (var_txt_phone_temp, 8, 4)
            into
                var_txt_phone;

        end if;

        var_txt_mime = 'text/x-vcard';

        var_txt_vcard = '';
        var_txt_vcard = var_txt_vcard || 'BEGIN:VCARD' || chr (10);
        var_txt_vcard = var_txt_vcard || 'VERSION:4.0' || chr (10);
        var_txt_vcard = var_txt_vcard || 'ORG:BeeHappy®' || chr (10);
        var_txt_vcard = var_txt_vcard || 'N:' || var_txt_last_name || ';' || var_txt_first_name || ';;;' || chr (10);
        var_txt_vcard = var_txt_vcard || 'FN:' || var_txt_full_name || chr (10);
        var_txt_vcard = var_txt_vcard || 'TITLE:' || var_txt_profile || chr (10);
        var_txt_vcard = var_txt_vcard || 'TEL;TYPE=WORK,VOICE:' || var_txt_phone || chr (10);
        var_txt_vcard = var_txt_vcard || 'EMAIL:' || var_txt_mail || chr (10);
        var_txt_vcard = var_txt_vcard || 'URL:http://beehappy.dev' || chr (10);
        var_txt_vcard = var_txt_vcard || 'URL;TYPE=WORK:http://beehappy.dev/colaborador/' || lower (var_txt_first_name) || chr (10);
        var_txt_vcard = var_txt_vcard || 'END:VCARD';

        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_mime', var_txt_mime);
        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_vcard', var_txt_vcard);

    end if;

    return result_successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;