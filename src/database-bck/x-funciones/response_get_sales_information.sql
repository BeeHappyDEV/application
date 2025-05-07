drop function if exists response_get_sales_information;

create or replace function response_get_sales_information (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_expression numeric;
    var_obj_parameters json;
    var_txt_mail text;
    var_txt_telephone text;
begin

    var_idf_expression = core_get_json_numeric (incoming_object, 'idf_intention');

    select
        cst.txt_value
    into
        var_txt_mail
    from
        dat_constants cst
    where
        cst.idf_constant = 2021;

    select
        cst.txt_value
    into
        var_txt_telephone
    from
        dat_constants cst
    where
        cst.idf_constant = 2022;

    var_obj_parameters = core_set_json_text (var_obj_parameters, '1', var_txt_mail);
    var_obj_parameters = core_set_json_text (var_obj_parameters, '2', var_txt_telephone);

    incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', null);
    incoming_object = core_set_json_numeric (incoming_object, 'idf_expression', var_idf_expression);
    incoming_object = core_set_json_json (incoming_object, 'obj_parameters', null);
    incoming_object = core_set_json_json (incoming_object, 'obj_parameters', var_obj_parameters);

    return incoming_object;

end;
$body$ language plpgsql;