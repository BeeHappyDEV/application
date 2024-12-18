drop function if exists access_create_update_user;

create or replace function access_create_update_user (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_organization numeric;
    var_idf_organization_user numeric;
    var_idf_profile numeric;
    var_idf_user numeric;
    var_num_phone numeric;
    var_obj_organizations json;
    var_sys_failed numeric;
    var_sys_success numeric;
    var_sys_user numeric;
    var_txt_first_name text;
    var_txt_last_name text;
    var_txt_mail text;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();
    var_sys_user = core_get_json_numeric (incoming_object, 'sys_user');
    var_idf_profile = core_get_json_numeric (incoming_object, 'idf_profile');
    var_num_phone = core_get_json_numeric (incoming_object, 'num_phone');
    var_obj_organizations = core_get_json_json (incoming_object, 'obj_organizations');
    var_txt_first_name = core_get_json_text (incoming_object, 'txt_first_name');
    var_txt_last_name = core_get_json_text (incoming_object, 'txt_last_name');
    var_txt_mail = core_get_json_text (incoming_object, 'txt_mail');

    select
        usr.idf_user
    into
        var_idf_user
    from
        dat_users usr
    where
        usr.sys_status = true
        and usr.num_phone = var_num_phone;

    if (var_idf_user is null) then

        var_idf_user = core_get_sequence_next ('seq_users');

        insert into dat_users (
            sys_user,
            idf_profile,
            idf_user,
            num_phone,
            txt_first_name,
            txt_last_name,
            txt_mail
        ) values (
            var_sys_user,
            var_idf_profile,
            var_idf_user,
            var_num_phone,
            var_txt_first_name,
            var_txt_last_name,
            var_txt_mail
        );

        for var_idf_organization in
            select
                json_array_elements (var_obj_organizations)
        loop

            var_idf_organization_user = core_get_sequence_next ('seq_organizations_users');

            insert into dat_organizations_users (
                idf_organization,
                idf_organization_user,
                idf_user,
                sys_user
            ) values (
                var_idf_organization,
                var_idf_organization_user,
                var_idf_user,
                var_sys_user
            );

        end loop;

    else

        update dat_users set
            sys_user = var_sys_user,
            idf_profile = coalesce (var_idf_profile, idf_profile),
            num_phone = coalesce (var_num_phone, num_phone),
            txt_first_name = coalesce (var_txt_first_name, txt_first_name),
            txt_last_name = coalesce (var_txt_last_name, txt_last_name),
            txt_mail = coalesce (var_txt_mail, txt_mail)
        where
            idf_user = var_idf_user;

        if (var_obj_organizations is not null) then

            update dat_organizations_users oru set
                sys_status = false,
                sys_user = var_sys_user
            where
                idf_user = var_idf_user;

            for var_idf_organization in
                select
                    json_array_elements (var_obj_organizations)
            loop

                var_idf_organization_user = core_get_sequence_next ('seq_organizations_users');

                insert into dat_organizations_users (
                    sys_user,
                    idf_organization,
                    idf_organization_user,
                    idf_user
                ) values (
                    var_sys_user,
                    var_idf_organization,
                    var_idf_organization_user,
                    var_idf_user
                );

            end loop;

        end if;

    end if;

    return core_get_function_result (var_sys_success, incoming_object);

exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);

end;
$body$ language plpgsql;