drop function if exists frontend_page_action;

create or replace function frontend_page_action (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_boo_action boolean;
    var_num_count numeric;
    var_txt_action text;
    var_txt_first_name text;
    var_txt_full_name text;
    var_txt_icon text;
    var_txt_last_name text;
    var_txt_mail text;
    var_txt_modification text;
    var_txt_name text;
    var_txt_phone text;
    var_txt_phone_temp text;
    var_txt_profile text;
begin

    var_jsn_status = result_initializer ();
    var_jsn_incoming = system_get_empty_node ((in_jsn_incoming) :: json);
    var_jsn_outgoing = system_get_empty_node (null :: json);

    var_txt_action = system_get_text (var_jsn_incoming, 'txt_action');
    var_txt_name = system_get_text (var_jsn_incoming, 'txt_name');
    var_txt_name = lower (var_txt_name);

    var_boo_action = false;

    if (var_txt_action = 'landing') then

        select
            mem.txt_mail,
            mem.txt_phone
        into
            var_txt_mail,
            var_txt_phone
        from
            members_organizations_profiles mop,
            profiles prf,
            members mem
        where
            mop.idf_profile = prf.idf_profile
            and prf.boo_active = true
            and prf.boo_internal = true
            and prf.txt_code = 'BEE'
            and mop.idf_member = mem.idf_member
            and mem.boo_active = true;

        select
            '+' || substring (var_txt_phone, 1, 2) || ' ' || substring (var_txt_phone, 3, 3) || ' ' || substring (var_txt_phone, 6, 3) || ' ' || substring (var_txt_phone, 9, 3)
        into
            var_txt_phone;

        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_mail', var_txt_mail);
        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_phone', var_txt_phone);

        var_boo_action = true;

    end if;

    if (var_txt_action = 'privacy_policy') then

        select
            cst.txt_value
        into
            var_txt_modification
        from
            constants cst
        where
            cst.txt_key = 'modification_privacy_policy';

        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_modification', var_txt_modification);

        var_boo_action = true;

    end if;

    if (var_txt_action = 'terms_and_conditions') then

        select
            cst.txt_value
        into
            var_txt_modification
        from
            constants cst
        where
            cst.txt_key = 'modification_terms_and_conditions';

        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_modification', var_txt_modification);

        var_boo_action = true;

    end if;

    if (var_txt_action = 'collaborator') then

        select
            count (*)
        into
            var_num_count
        from
            members_organizations_profiles mop,
            profiles prf,
            members mem
        where
            mop.idf_profile = prf.idf_profile
            and prf.boo_active = true
            and prf.boo_internal = true
            and mop.idf_member = mem.idf_member
            and mem.boo_active = true
            and lower (mem.txt_first_name) = var_txt_name;

        if (var_num_count = 0) then

            return result_failed (var_jsn_status, var_jsn_incoming);

        end if;

        select
            coalesce (mem.txt_first_name, ''),
            coalesce (mem.txt_last_name, ''),
            prf.txt_icon,
            mem.txt_mail,
            mem.txt_phone,
            prf.txt_description_es
        into
            var_txt_first_name,
            var_txt_last_name,
            var_txt_icon,
            var_txt_mail,
            var_txt_phone_temp,
            var_txt_profile
        from
            members_organizations_profiles mop,
            profiles prf,
            members mem
        where
            mop.idf_profile = prf.idf_profile
            and prf.boo_active = true
            and prf.boo_internal = true
            and mop.idf_member = mem.idf_member
            and mem.boo_active = true
            and lower (mem.txt_first_name) = var_txt_name;

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

        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_full_name', var_txt_full_name);
        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_icon', var_txt_icon);
        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_mail', var_txt_mail);
        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_name', var_txt_name);
        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_phone', var_txt_phone);
        var_jsn_outgoing = system_set_text (var_jsn_outgoing, 'txt_profile', var_txt_profile);

        var_boo_action = true;

    end if;
/*
    if (var_txt_action = 'qr') then

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

        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_collaborator', 'colaborador/' || var_txt_name);
        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_full_name', var_txt_full_name);
        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_icon', var_txt_icon);
        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_mail', var_txt_mail);
        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_name', var_txt_name);
        var_jsn_outgoing = set_text (var_jsn_outgoing, 'txt_profile', var_txt_profile);

    end if;
*/

    if (var_boo_action = true) then

        return result_successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

    else

        return result_failed (var_jsn_status, var_jsn_incoming);

    end if;
/*
exception
    when others then
        return result_failed (var_jsn_status, var_jsn_incoming);
*/
end;
$body$ language plpgsql;