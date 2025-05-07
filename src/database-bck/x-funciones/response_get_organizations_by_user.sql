drop function if exists response_get_organizations_by_user;

create or replace function response_get_organizations_by_user (
    in incoming_object json
)
returns json as $body$
declare
    var_num_organizations numeric;
    var_obj_intentions json;
    var_obj_parameters json;
    var_rec_organizations record;
    var_txt_organizations text;
begin

    select
        count (*)
    into
        var_num_organizations
    from
        dat_users usr,
        dat_organizations_users oru,
        dat_organizations org
    where
        usr.idf_user = core_get_json_text (incoming_object, 'idf_user') :: numeric
        and usr.idf_profile = core_get_json_text (incoming_object, 'idf_profile') :: numeric
        and oru.idf_user = usr.idf_user
        and org.idf_organization = oru.idf_organization
        and org.sys_status = true;

    if (var_num_organizations = 0) then

        incoming_object = core_set_json_text (incoming_object, 'idf_expression', '9999');

        return incoming_object;

    end if;

    if (var_num_organizations = 1) then

        select
            org.txt_organization
        into
            var_txt_organizations
        from
            dat_users usr,
            dat_organizations_users oru,
            dat_organizations org
        where
            usr.idf_user = core_get_json_text (incoming_object, 'idf_user') :: numeric
            and usr.idf_profile = core_get_json_text (incoming_object, 'idf_profile') :: numeric
            and oru.idf_user = usr.idf_user
            and org.idf_organization = oru.idf_organization;

        var_obj_parameters = core_set_json_text (var_obj_parameters, '1', var_txt_organizations);

        incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', 3011);
        incoming_object = core_set_json_json (incoming_object, 'obj_intentions', core_get_json_json (var_obj_intentions, 'obj_intentions'));
        incoming_object = core_set_json_json (incoming_object, 'obj_parameters', 3011);

    else

        var_num_organizations = 0;

        var_txt_organizations = '';

        for var_rec_organizations in
            select
                org.txt_organization
            from
                dat_users usr,
                dat_organizations_users oru,
                dat_organizations org
            where
                usr.idf_user = core_get_json_text (incoming_object, 'idf_user') :: numeric
                and usr.idf_profile = core_get_json_text (incoming_object, 'idf_profile') :: numeric
                and oru.idf_user = usr.idf_user
                and org.idf_organization = oru.idf_organization
            order by
                org.txt_organization
        loop

            var_num_organizations = var_num_organizations + 1;

            if (var_txt_organizations != '') then

                var_txt_organizations = var_txt_organizations || chr (10);

            end if;

            var_txt_organizations = var_txt_organizations || var_num_organizations || '. ' || var_rec_organizations.txt_organization;

            var_obj_intentions = core_set_json_numeric (var_obj_intentions, 'obj_intentions', 3012);

        end loop;

        var_obj_parameters = core_set_json_text (var_obj_parameters, '1', var_txt_organizations);

        incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', 3012);
        incoming_object = core_set_json_json (incoming_object, 'obj_intentions', core_get_json_json (var_obj_intentions, 'obj_intentions'));
        incoming_object = core_set_json_json (incoming_object, 'obj_parameters', var_obj_parameters);

    end if;

    return incoming_object;

end;
$body$ language plpgsql;