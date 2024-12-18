drop function if exists staff_create_update_workshift;

create or replace function staff_create_update_workshift (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_organization numeric;
    var_idf_workshift numeric;
    var_num_day numeric;
    var_obj_workshift json;
    var_obj_workshifts json;
    var_tim_final time;
    var_tim_initial time;
    var_sys_failed numeric;
    var_sys_success numeric;
    var_sys_user numeric;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();
    var_sys_user = core_get_json_numeric (incoming_object, 'sys_user');
    var_idf_organization = core_get_json_numeric (incoming_object, 'idf_organization');
    var_obj_workshifts = core_get_json_json (incoming_object, 'obj_workshifts');

    for var_obj_workshift in
        select
            json_array_elements (var_obj_workshifts)
    loop

        var_idf_workshift = core_get_sequence_next ('seq_workshifts');
        var_num_day = var_obj_workshift->>'num_day';
        var_tim_final = var_obj_workshift->>'tim_final';
        var_tim_initial = var_obj_workshift->>'tim_initial';

        if (var_num_day = 7) then

            var_num_day = 0;

        end if;

        insert into dat_workshifts (
            sys_user,
            idf_organization,
            idf_workshift,
            num_day,
            tim_final,
            tim_initial
        ) values (
            var_sys_user,
            var_idf_organization,
            var_idf_workshift,
            var_num_day,
            var_tim_final,
            var_tim_initial
        );

    end loop;

    return core_get_function_result (var_sys_success, incoming_object);

exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);

end;
$body$ language plpgsql;