drop function if exists response_get_concierges_by_workshift;

create or replace function response_get_concierges_by_workshift (
    in incoming_object json
)
returns json as $body$
declare
    var_dat_current date;
    var_obj_parameters json;
    var_tim_current time;
begin

    var_dat_current = core_get_timestamp_value () :: date;
    var_tim_current = core_get_timestamp_value () :: time;

    var_obj_parameters = core_set_json_text (var_obj_parameters, '1', '???');

    incoming_object = core_set_json_text (incoming_object, 'idf_expression', '1303');
    incoming_object = core_set_json_json (incoming_object, 'obj_parameters', var_obj_parameters);

    return incoming_object;

end;
$body$ language plpgsql;