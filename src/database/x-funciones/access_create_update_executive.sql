drop function if exists access_create_update_executive;

create or replace function access_create_update_executive (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_commune numeric;
    var_idf_country numeric;
    var_idf_organization numeric;
    var_idf_province numeric;
    var_idf_region numeric;
    var_num_postal_code numeric;
    var_num_unique_rol numeric;
    var_sys_failed numeric;
    var_sys_success numeric;
    var_sys_user numeric;
    var_txt_address text;
    var_txt_check_digit text;
    var_txt_location text;
    var_txt_organization text;
begin

    var_sys_failed = core_get_function_failed ();
    var_sys_success = core_get_function_success ();
    var_sys_user = core_get_json_numeric (incoming_object, 'sys_user');
    var_idf_commune = core_get_json_numeric (incoming_object, 'idf_commune');
    var_idf_country = core_get_json_numeric (incoming_object, 'idf_country');
    var_idf_province = core_get_json_numeric (incoming_object, 'idf_province');
    var_idf_region = core_get_json_numeric (incoming_object, 'idf_region');
    var_num_postal_code = core_get_json_numeric (incoming_object, 'num_postal_code');
    var_num_unique_rol = core_get_json_numeric (incoming_object, 'num_unique_rol');
    var_txt_address = core_get_json_text (incoming_object, 'txt_address');
    var_txt_check_digit = core_get_json_text (incoming_object, 'txt_check_digit');
    var_txt_location = core_get_json_text (incoming_object, 'txt_location');
    var_txt_organization = core_get_json_text (incoming_object, 'txt_organization');

    select
        org.idf_organization
    into
        var_idf_organization
    from
        dat_organizations org
    where
        org.sys_status = true
        and org.num_unique_rol = var_num_postal_code;

    if (var_idf_organization is null) then

        var_idf_organization = core_get_sequence_next ('seq_organizations');

        insert into dat_organizations (
            sys_user,
            idf_commune,
            idf_country,
            idf_organization,
            idf_province,
            idf_region,
            num_postal_code,
            num_unique_rol,
            txt_address,
            txt_check_digit,
            txt_location,
            txt_organization
        ) values (
            var_sys_user,
            var_idf_commune,
            var_idf_country,
            var_idf_organization,
            var_idf_province,
            var_idf_region,
            var_num_postal_code,
            var_num_unique_rol,
            var_txt_address,
            var_txt_check_digit,
            var_txt_location,
            var_txt_organization
        );

    else

        update dat_organizations set
            sys_user = coalesce (var_sys_user, sys_user),
            idf_commune = coalesce (var_idf_commune, idf_commune),
            idf_country = coalesce (var_idf_country, idf_country),
            idf_province = coalesce (var_idf_province, idf_province),
            idf_region = coalesce (var_idf_region, idf_region),
            num_postal_code = coalesce (var_num_postal_code, num_postal_code),
            num_unique_rol = coalesce (var_num_unique_rol, num_unique_rol),
            txt_address = coalesce (var_txt_address, txt_address),
            txt_check_digit = coalesce (var_txt_check_digit, txt_check_digit),
            txt_location = coalesce (var_txt_location, txt_location),
            txt_organization = coalesce (var_txt_organization, txt_organization)
        where
            idf_organization = var_idf_organization;

    end if;

    return core_get_function_result (var_sys_success, incoming_object);

exception
    when others then
        return core_get_function_result (var_sys_failed, incoming_object);

end;
$body$ language plpgsql;