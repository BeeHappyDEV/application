drop function if exists frontend.file_action;

create or replace function frontend.file_action (
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
    var_txt_last_name text;
    var_txt_mail text;
    var_txt_mime text;
    var_txt_name text;
    var_txt_phone text;
    var_txt_phone_temp text;
    var_txt_profile text;
    var_txt_vcard text;
begin

    var_jsn_status = result.initializer ();
    var_jsn_incoming = framework.get_empty_node ((in_jsn_incoming) :: json) :: jsonb;
    var_jsn_outgoing = framework.get_empty_node (null :: json);

    var_txt_action = framework.get_text (var_jsn_incoming, 'txt_action');
    var_txt_name = framework.get_text (var_jsn_incoming, 'txt_name');
    var_txt_name = lower (var_txt_name);

    var_boo_action = false;

    if (var_txt_action = 'vcard') then

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
            coalesce (mem.txt_first_name, ''),
            coalesce (mem.txt_last_name, ''),
            mem.txt_mail,
            mem.txt_phone,
            prf.txt_description_es
        into
            var_txt_first_name,
            var_txt_last_name,
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

        var_txt_mime = 'text/x-vcard';

        var_txt_vcard = '';
        var_txt_vcard = var_txt_vcard || 'BEGIN:VCARD' || chr (10);
        var_txt_vcard = var_txt_vcard || 'VERSION:4.0' || chr (10);
        var_txt_vcard = var_txt_vcard || 'ORG:BeeHappy.dev®' || chr (10);
        var_txt_vcard = var_txt_vcard || 'N:' || var_txt_last_name || ';' || var_txt_first_name || ';;;' || chr (10);
        var_txt_vcard = var_txt_vcard || 'FN:' || var_txt_full_name || chr (10);
        var_txt_vcard = var_txt_vcard || 'TITLE:' || var_txt_profile || chr (10);
        var_txt_vcard = var_txt_vcard || 'TEL;TYPE=WORK,VOICE:' || var_txt_phone || chr (10);
        var_txt_vcard = var_txt_vcard || 'EMAIL:' || var_txt_mail || chr (10);
        var_txt_vcard = var_txt_vcard || 'URL:http://beehappy.dev' || chr (10);
        var_txt_vcard = var_txt_vcard || 'URL;TYPE=WORK:https://beehappy.dev/colaborador/' || lower (var_txt_first_name) || chr (10);
        var_txt_vcard = var_txt_vcard || 'END:VCARD';

        var_jsn_outgoing = framework.set_text (var_jsn_outgoing, 'txt_mime', var_txt_mime);
        var_jsn_outgoing = framework.set_text (var_jsn_outgoing, 'txt_vcard', var_txt_vcard);

        var_boo_action = true;

    end if;

    if (var_boo_action = true) then

        return result.successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

    else

        return result.failed (var_jsn_status, var_jsn_incoming);

    end if;

exception
    when others then
        return result.failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;