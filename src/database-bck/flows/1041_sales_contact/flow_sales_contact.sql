/**
 * @openapi
 * flow_sales_contact:
 *    options:
 *      tags:
 *        - Basic
 *      description: |
 *        | Concept | Value |
 *        | :-----: | :---: |
 *        | Intentions | 1041 |
 *        | Expressions | 1041 |
 *        ```
 *        sequenceDiagram
 *        autonumber
 *        Actor Chatbot
 *        participant F as flow_sales_contact
 *        Chatbot ->> F: in_jsn_transfer
 *        F ->> F: utils_get_first_name
 *        F ->> F: select constants: company_write
 *        F ->> F: select constants: company_call
 *        F ->> F: idf_expression: 1041
 *        F -->> Chatbot: out_jsn_transfer
 *        ```
 */

drop function if exists flow_sales_contact;

create or replace function flow_sales_contact (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_parameters json;
    var_jsn_status json;
    var_txt_first_name text;
    var_txt_mail text;
    var_txt_phone text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_txt_first_name = utils_get_first_name (in_jsn_transfer);

    select
        cst.txt_value
    into
        var_txt_mail
    from
        dat_constants cst
    where
        cst.txt_key = 'company_write';

    select
        '+' || cst.txt_value
    into
        var_txt_phone
    from
        dat_constants cst
    where
        cst.txt_key = 'company_call';

    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 1041);
    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%0', var_txt_first_name);
    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%1', var_txt_mail);
    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%2', var_txt_phone);
    var_jsn_outgoing = core_set_json_json (var_jsn_outgoing, 'jsn_parameters', var_jsn_parameters);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;