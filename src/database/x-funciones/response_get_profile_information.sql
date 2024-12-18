drop function if exists response_get_profile_information;

create or replace function response_get_profile_information (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_expression numeric;
    var_idf_profile numeric;
    var_idf_unhandled numeric;
    var_idf_user numeric;
    var_obj_parameters json;
    var_txt_profile text;
begin

    var_idf_expression = core_get_json_numeric (incoming_object, 'idf_intention');
    var_idf_profile = core_get_json_numeric (incoming_object, 'idf_profile');
    var_idf_unhandled = action_get_unhandled ();
    var_idf_user = core_get_json_numeric (incoming_object, 'idf_user');

    select
        prf.txt_profile
    into
        var_txt_profile
    from
        dat_users usr,
        dat_profiles_users pfu,
        dat_profiles prf
    where
        usr.sys_status = true
        and usr.idf_user = var_idf_user
        and pfu.idf_user = usr.idf_user
        and pfu.idf_profile = var_idf_profile
        and prf.idf_profile = pfu.idf_profile;

    if (var_txt_profile is not null) then

        var_obj_parameters = core_set_json_text (var_obj_parameters, '1', var_txt_profile);

        incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', null);
        incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', var_idf_expression);
        incoming_object = core_set_json_json (incoming_object, 'obj_parameters', null);
        incoming_object = core_set_json_json (incoming_object, 'obj_parameters', var_obj_parameters);

    else

        incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', null);
        incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', var_idf_unhandled);

    end if;

    return incoming_object;

end;
$body$ language plpgsql;