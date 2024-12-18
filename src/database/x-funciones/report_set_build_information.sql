drop function if exists report_set_build_information;

create or replace function report_set_build_information (
    in incoming_object json
)
returns json as $body$
declare
    var_txt_deploy text;
    var_txt_version text;
    var_txt_update text;
    var_sys_failed numeric;
    var_sys_success numeric;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();

    var_txt_deploy = core_get_json_text (incoming_object, 'txt_deploy');
    var_txt_update = core_get_json_text (incoming_object, 'txt_update');
    var_txt_version = core_get_json_text (incoming_object, 'txt_version');

    update dat_constants cst set
        txt_value = var_txt_deploy
    where
        cst.txt_key = 'deploy_description';

    update dat_constants cst set
        txt_value = var_txt_version
    where
        cst.txt_key = 'deploy_number';

    update dat_constants cst set
        txt_value = var_txt_update
    where
        cst.txt_key = 'deploy_time';

    incoming_object = report_get_evaluated_timestamp (incoming_object);
    incoming_object = report_get_evaluated_identifier (incoming_object);

    return core_get_function_result (var_sys_success, incoming_object);

exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);

end;
$body$ language plpgsql;