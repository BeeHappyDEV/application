drop function if exists frontend_qrcode_page;

create or replace function frontend_qrcode_page (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_count numeric;
    var_txt_data text;
    var_txt_first_name text;
    var_txt_full_name text;
    var_txt_icon text;
    var_txt_last_name text;
    var_txt_mail text;
    var_txt_name text;
    var_txt_path text;
    var_txt_profile text;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    var_txt_name = core_get_json_text (var_jsn_incoming, 'txt_name');
    var_txt_name = lower (var_txt_name);
    var_txt_path = core_get_json_text (var_jsn_incoming, 'txt_path');
    var_txt_data = var_txt_path || '/colaborador/' || var_txt_name;

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
        prf.txt_icon,
        usr.txt_mail,
        prf.txt_profile
    into
        var_txt_first_name,
        var_txt_last_name,
        var_txt_icon,
        var_txt_mail,
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

    else

        var_txt_full_name = initcap (trim (var_txt_first_name || ' ' || var_txt_last_name));

    end if;

    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'txt_found', true);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_data', var_txt_data);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_name', var_txt_name);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_full_name', var_txt_full_name);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_icon', var_txt_icon);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_mail', var_txt_mail);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_profile', var_txt_profile);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;