drop function if exists maintainer_get_user_by_phone;

create or replace function maintainer_get_user_by_phone (
    in incoming_object json
)
returns json as $body$
declare
    var_obj_organizations json;
    var_num_phone numeric;
    var_txt_mail text;
    var_txt_name text;
    var_txt_profile text;
    var_rec_organizations record;
    var_sys_failed numeric;
    var_sys_success numeric;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();

    var_num_phone = core_get_json_numeric (incoming_object, 'num_phone');

    select
        usr.txt_mail,
        usr.txt_first_name || ' ' || usr.txt_last_name,
        prf.txt_profile
    into
        var_txt_mail,
        var_txt_name,
        var_txt_profile
    from
        dat_users usr,
        dat_profiles prf
    where
        usr.num_phone = var_num_phone
        and prf.idf_profile = usr.idf_profile;

    for var_rec_organizations in
        select
            org.txt_organization
        from
            dat_users usr,
            dat_profiles prf,
            dat_organizations_users oru,
            dat_organizations org
        where
            usr.num_phone = var_num_phone
            and prf.idf_profile = usr.idf_profile
            and oru.idf_user = usr.idf_user
            and org.idf_organization = oru.idf_organization
        order by
            org.txt_organization
    loop

        var_obj_organizations = core_set_json_text (var_obj_organizations, 'txt_organization', var_rec_organizations.txt_organization);
        raise notice '%', ' ';

    end loop;

    incoming_object = core_set_json_json (incoming_object, 'obj_organizations', var_obj_organizations);
    /*incoming_object = core_set_json_text (incoming_object, 'txt_mail', var_txt_mail);
    incoming_object = core_set_json_text (incoming_object, 'txt_name', var_txt_name);
    incoming_object = core_set_json_text (incoming_object, 'txt_profile', var_txt_profile);*/

    return core_get_function_result (var_sys_success, incoming_object);
/*
exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);
*/
end;

$body$ language plpgsql;