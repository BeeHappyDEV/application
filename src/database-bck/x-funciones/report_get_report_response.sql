drop function if exists report_get_report_response;

create or replace function report_get_report_response (
    in incoming_object json
)
returns json as $body$
declare
    var_sys_failed numeric;
    var_sys_success numeric;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();

    incoming_object = report_get_evaluated_timestamp (incoming_object);
    incoming_object = report_get_evaluated_identifier (incoming_object);

    return core_get_function_result (var_sys_success, incoming_object);

exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);

end;
$body$ language plpgsql;