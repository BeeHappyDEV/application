drop function if exists frontend_vcard_file;

create or replace function frontend_vcard_file (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_count numeric;
    var_txt_first_name text;
    var_txt_full_name text;
    var_txt_last_name text;
    var_txt_mail text;
    var_txt_name text;
    var_txt_phone_1 text;
    var_txt_phone_2 text;
    var_txt_profile text;
    var_txt_vcard text;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    var_txt_name = core_get_json_text (var_jsn_incoming, 'txt_name');
    var_txt_name = lower (var_txt_name);

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

        return result_get_failed (var_jsn_status, var_jsn_incoming);

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
        var_txt_phone_2,
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

        var_txt_first_name = trim (var_txt_first_name || '®');
        var_txt_full_name = var_txt_first_name;

    else

        var_txt_full_name = initcap (trim (var_txt_first_name || ' ' || var_txt_last_name));

    end if;

    select
        '+' || substring (var_txt_phone_2, 1, 3) || ' ' || substring (var_txt_phone_2, 4, 4) || ' ' || substring (var_txt_phone_2, 8, 4)
    into
        var_txt_phone_1;

    var_txt_vcard = '';
    var_txt_vcard = var_txt_vcard || 'BEGIN:VCARD' || chr (10);
    var_txt_vcard = var_txt_vcard || 'VERSION:4.0' || chr (10);
    var_txt_vcard = var_txt_vcard || 'ORG:BeeHappy®' || chr (10);
    var_txt_vcard = var_txt_vcard || 'N:' || var_txt_last_name || ';' || var_txt_first_name || ';;;' || chr (10);
    var_txt_vcard = var_txt_vcard || 'FN:' || var_txt_full_name || chr (10);
    var_txt_vcard = var_txt_vcard || 'TITLE:' || var_txt_profile || chr (10);
    var_txt_vcard = var_txt_vcard || 'TEL;TYPE=WORK,VOICE:' || var_txt_phone_1 || chr (10);
    var_txt_vcard = var_txt_vcard || 'EMAIL:' || var_txt_mail || chr (10);
    var_txt_vcard = var_txt_vcard || 'URL:http://beehappy.ai' || chr (10);
    var_txt_vcard = var_txt_vcard || 'URL;TYPE=WORK:http://beehappy.ai/colaborador/' || lower (var_txt_first_name) || chr (10);
    var_txt_vcard = var_txt_vcard || 'END:VCARD';

    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'txt_found', true);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_vcard', var_txt_vcard);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;