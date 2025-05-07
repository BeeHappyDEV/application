drop function if exists response_get_novelties_by_community;

create or replace function response_get_novelties_by_community (
    in incoming_object json
)
returns json as $body$
declare
    var_obj_parameters json;
    var_txt_mail text;
    var_txt_telephone text;
begin

    var_txt_mail = 'hola@beehappychile.cl';

    var_txt_telephone = '+56 9 7800 8001';

    var_obj_parameters = core_set_json_text (var_obj_parameters, '1', var_txt_mail);
    var_obj_parameters = core_set_json_text (var_obj_parameters, '2', var_txt_telephone);

    incoming_object = core_set_json_text (incoming_object, 'idf_expression', '2010');
    incoming_object = core_set_json_json (incoming_object, 'obj_parameters', var_obj_parameters);

    return incoming_object;

end;
$body$ language plpgsql;