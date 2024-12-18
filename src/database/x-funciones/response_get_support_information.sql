drop function if exists response_get_support_information;

create or replace function response_get_support_information (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_expression numeric;
    var_obj_parameters json;
    var_txt_mail text;
begin

    var_idf_expression = core_get_json_numeric (incoming_object, 'idf_intention');

    select
        cst.txt_value
    into
        var_txt_mail
    from
        dat_constants cst
    where
        cst.idf_constant = 2031;

    var_obj_parameters = core_set_json_text (var_obj_parameters, '1', var_txt_mail);

    incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', null);
    incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', var_idf_expression);
    incoming_object = core_set_json_json (incoming_object, 'obj_parameters', null);
    incoming_object = core_set_json_json (incoming_object, 'obj_parameters', var_obj_parameters);

    return incoming_object;

end;
$body$ language plpgsql;