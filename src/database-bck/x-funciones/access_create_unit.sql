drop function if exists access_create_unit;

create or replace function access_create_unit (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_organization numeric;
    var_idf_unit numeric;
    var_num_aliquot numeric;
    var_num_unique_rol numeric;
    var_sys_failed numeric;
    var_sys_success numeric;
    var_sys_user numeric;
    var_txt_block text;
    var_txt_floor text;
    var_txt_unit text;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();
    var_sys_user = core_get_json_numeric (incoming_object, 'sys_user');
    var_num_aliquot = core_get_json_numeric (incoming_object, 'num_aliquot');
    var_num_unique_rol = core_get_json_numeric (incoming_object, 'num_unique_rol');
    var_txt_block = core_get_json_text (incoming_object, 'txt_block');
    var_txt_floor = core_get_json_text (incoming_object, 'txt_floor');
    var_txt_unit= core_get_json_text (incoming_object, 'txt_unit');

    select
        org.idf_organization
    into
        var_idf_organization
    from
        dat_organizations org
    where
        org.sys_status = true
        and org.num_unique_rol = var_num_unique_rol;

    var_idf_unit = core_get_sequence_next ('seq_units');

    insert into dat_units (
        sys_user,
        idf_organization,
        idf_unit,
        num_aliquot,
        txt_block,
        txt_floor,
        txt_unit
    ) values (
        var_sys_user,
        var_idf_organization,
        var_idf_unit,
        var_num_aliquot,
        var_txt_block,
        var_txt_floor,
        var_txt_unit
    );

    return core_get_function_result (var_sys_success, incoming_object);

exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);

end;
$body$ language plpgsql;