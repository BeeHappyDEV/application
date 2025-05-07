drop function if exists access_create_update_state;

create or replace function access_create_update_state (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_intention numeric;
    var_idf_organization numeric;
    var_idf_unit numeric;
    var_idf_user numeric;
    var_num_count numeric;
    var_sys_failed numeric;
    var_sys_success numeric;
    var_sys_timestamp timestamp;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();
    var_idf_intention = core_get_json_numeric (incoming_object, 'idf_intention');
    var_idf_organization = core_get_json_numeric (incoming_object, 'idf_organization');
    var_idf_unit = core_get_json_numeric (incoming_object, 'idf_unit');
    var_idf_user = core_get_json_numeric (incoming_object, 'idf_user');
    var_sys_timestamp = core_get_timestamp_value ();

    select
        count (*)
    into
        var_num_count
    from
        dat_states sta
    where
        sta.idf_user = var_idf_user;

    if (var_num_count = 0) then

        insert into dat_states (
            idf_intention,
            idf_organization,
            idf_unit,
            idf_user,
            sys_timestamp
        ) values (
            var_idf_intention,
            var_idf_organization,
            var_idf_unit,
            var_idf_user,
            var_sys_timestamp
        );

    else

        update dat_states set
            idf_intention = var_idf_intention,
            idf_organization = var_idf_organization,
            idf_unit = var_idf_unit,
            sys_timestamp = var_sys_timestamp
        where
            idf_user = var_idf_user;

    end if;

    return core_get_function_result (var_sys_success, incoming_object);

exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);

end;
$body$ language plpgsql;