drop function if exists frontend.link_action;

create or replace function frontend.link_action (
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
    var_txt_name text;
    var_txt_redirect text;
begin

    var_jsn_status = result.initializer ();
    var_jsn_incoming = framework.get_empty_node ((in_jsn_incoming) :: json) :: jsonb;
    var_jsn_outgoing = framework.get_empty_node (null :: json);

    var_txt_action = framework.get_text (var_jsn_incoming, 'txt_action');
    var_txt_name = framework.get_text (var_jsn_incoming, 'txt_name');
    var_txt_name = lower (var_txt_name);

    var_boo_action = false;

    if (var_txt_action = 'call_us') then

        select
            'tel:+' || mem.txt_phone
        into
            var_txt_redirect
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

        var_boo_action = true;

    end if;

    if (var_txt_action = 'write_us') then

        select
            'mailto:' || mem.txt_mail
        into
            var_txt_redirect
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

        var_boo_action = true;

    end if;

    if (var_txt_action = 'text_us') then

        select
            'https://api.whatsapp.com/send?phone=' || mem.txt_phone
        into
            var_txt_redirect
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

        var_boo_action = true;

    end if;

    if (var_txt_action = 'visit_us') then

        select
            mem.txt_location
        into
            var_txt_redirect
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

        var_boo_action = true;

    end if;

    if (var_txt_action = 'discord') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            commons.constants cst
        where
            cst.txt_key = 'link_discord';

        var_boo_action = true;

    end if;

    if (var_txt_action = 'facebook') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            commons.constants cst
        where
            cst.txt_key = 'link_facebook';

        var_boo_action = true;

    end if;

    if (var_txt_action = 'instagram') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            commons.constants cst
        where
            cst.txt_key = 'link_instagram';

        var_boo_action = true;

    end if;

    if (var_txt_action = 'linkedin') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            commons.constants cst
        where
            cst.txt_key = 'link_linkedin';

        var_boo_action = true;

    end if;

    if (var_txt_action = 'x') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            commons.constants cst
        where
            cst.txt_key = 'link_x';

        var_boo_action = true;

    end if;

    if (var_txt_action = 'privacy_policy_video') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            commons.constants cst
        where
            cst.txt_key = 'link_privacy_policy_video';

        var_boo_action = true;

    end if;

    if (var_txt_action = 'terms_and_conditions_video') then

        select
            cst.txt_value
        into
            var_txt_redirect
        from
            commons.constants cst
        where
            cst.txt_key = 'link_terms_and_conditions_video';

        var_boo_action = true;

    end if;

    if (var_txt_action = 'call_me') then

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

            return result.failed (var_jsn_status, var_jsn_incoming);

        end if;

        select
            'tel:+' || mem.txt_phone
        into
            var_txt_redirect
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

        var_boo_action = true;

    end if;

    if (var_txt_action = 'write_me') then

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

            return result.failed (var_jsn_status, var_jsn_incoming);

        end if;

        select
            'mailto:' || mem.txt_mail
        into
            var_txt_redirect
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

        var_boo_action = true;

    end if;

    if (var_txt_action = 'text_me') then
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

            return result.failed (var_jsn_status, var_jsn_incoming);

        end if;

        select
            'https://api.whatsapp.com/send?phone=' || mem.txt_phone
        into
            var_txt_redirect
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

        var_boo_action = true;

    end if;

    if (var_boo_action = true) then

        var_jsn_outgoing = framework.set_text (var_jsn_outgoing, 'txt_redirect', var_txt_redirect);

        return result.successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

    else

        var_jsn_outgoing = framework.set_text (var_jsn_outgoing, 'txt_redirect', '/');

        return result.successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

    end if;

exception
    when others then
        return result.failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;