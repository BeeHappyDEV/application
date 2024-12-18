drop function if exists frontend_call_me_link;

create or replace function frontend_call_me_link (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_count numeric;
    var_txt_name text;
    var_txt_redirect text;
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
        'tel:+' || usr.num_phone
    into
        var_txt_redirect
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

    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_redirect', var_txt_redirect);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;