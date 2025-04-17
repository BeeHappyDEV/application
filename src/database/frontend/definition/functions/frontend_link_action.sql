drop function if exists frontend_link_action;

create or replace function frontend_link_action (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_txt_action text;
    var_txt_name text;
    var_txt_redirect text;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    var_txt_action = core_get_json_text (var_jsn_incoming, 'txt_action');
    var_txt_name = core_get_json_text (var_jsn_incoming, 'txt_name');
    var_txt_name = lower (var_txt_name);

    if (var_txt_action = 'call_us') then

        select
            'tel:+' || usr.num_whatsapp
        into
            var_txt_redirect
        from
            dat_users usr
        where
            usr.sys_status = true
            and usr.idf_user = 0;

    end if;

    if (var_txt_action = 'write_us') then

        select
            'mailto:' || usr.txt_mail
        into
            var_txt_redirect
        from
            dat_users usr
        where
            usr.sys_status = true
            and usr.idf_user = 0;

    end if;

    if (var_txt_action = 'text_us') then

        select
            'https://api.whatsapp.com/send?phone=' || usr.num_whatsapp
        into
            var_txt_redirect
        from
            dat_users usr
        where
            usr.sys_status = true
            and usr.idf_user = 0;

    end if;

    if (var_txt_action = 'visit_us') then

        select
            usr.txt_location
        into
            var_txt_redirect
        from
            dat_users usr
        where
            usr.sys_status = true
            and usr.idf_user = 0;

    end if;

    if (var_txt_action = 'facebook') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            dat_constants cst
        where
            cst.txt_key = 'link_facebook';

    end if;

    if (var_txt_action = 'instagram') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            dat_constants cst
        where
            cst.txt_key = 'link_instagram';

    end if;

    if (var_txt_action = 'x') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            dat_constants cst
        where
            cst.txt_key = 'link_x';

    end if;

    if (var_txt_action = 'linkedin') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            dat_constants cst
        where
            cst.txt_key = 'link_linkedin';

    end if;

    if (var_txt_action = 'discord') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            dat_constants cst
        where
            cst.txt_key = 'link_discord';

    end if;

    if (var_txt_action = 'privacy_policy_video') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            dat_constants cst
        where
            cst.txt_key = 'link_privacy_policy_video';

    end if;

    if (var_txt_action = 'terms_and_conditions_video') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            dat_constants cst
        where
            cst.txt_key = 'link_terms_and_conditions_video';

    end if;

    if (var_txt_action = 'call_me') then

        select
            'tel:+' || usr.num_whatsapp
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

    end if;

    if (var_txt_action = 'write_me') then

        select
            'mailto:' || usr.txt_mail
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

    end if;

    if (var_txt_action = 'text_me') then

        select
            'https://api.whatsapp.com/send?phone=' || usr.num_whatsapp
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

    end if;

    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_redirect', var_txt_redirect);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;