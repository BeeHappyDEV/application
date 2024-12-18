drop function if exists response_get_dependent_selection;

create or replace function response_get_dependent_selection (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_expression text;
    var_idf_user numeric;
    var_num_count numeric;

    var_obj_parameters json;
    var_txt_profile text;
begin

    var_idf_expression = core_get_json_text (incoming_object, 'idf_intention');
    var_idf_user = core_get_json_numeric (incoming_object, 'idf_user');

    select
        count (*)
    into
        var_num_count
    from
        dat_states sta
    where
        sta.idf_user = var_idf_user;

    if (var_num_count = 0) then



    else



    end if;

    select
        prf.txt_profile
    into
        var_txt_profile
    from
        dat_users usr,
        dat_profiles prf
    where
        usr.idf_user = core_get_json_text (incoming_object, 'idf_user') :: numeric
        and prf.idf_profile = usr.idf_profile
        and prf.idf_profile = core_get_json_text (incoming_object, 'idf_profile') :: numeric;

    if (var_txt_profile is not null) then

        var_obj_parameters = core_set_json_text (var_obj_parameters, '1', var_txt_profile);

        incoming_object = core_set_json_text (incoming_object, 'idf_expression', var_idf_expression);
        incoming_object = core_set_json_json (incoming_object, 'obj_parameters', var_obj_parameters);

    else

        incoming_object = core_set_json_text (incoming_object, 'idf_expression', '9999');

    end if;

    return incoming_object;

end;
$body$ language plpgsql;