drop function if exists chatbot_set_condition;

create or replace function chatbot_set_condition (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;

    var_boo_dependency boolean;
    var_idf_expression numeric;
    var_idf_intention numeric;
    var_idf_organization numeric;
    var_idf_profile numeric;
    var_idf_unit numeric;
    var_idf_user numeric;
    var_num_count numeric;
    var_sys_timestamp timestamp;
    var_txt_sender text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_incoming ->> 'outgoing') :: json);
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'incoming');
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'outgoing');

    var_boo_dependency = core_get_json_boolean (var_jsn_outgoing, 'boo_dependency');
    var_idf_expression = core_get_json_numeric (var_jsn_outgoing, 'idf_expression');
    var_idf_intention = core_get_json_numeric (var_jsn_outgoing, 'idf_intention');
    var_idf_organization = core_get_json_numeric (var_jsn_outgoing, 'idf_organization');
    var_idf_profile = core_get_json_numeric (var_jsn_outgoing, 'idf_profile');
    var_idf_unit = core_get_json_numeric (var_jsn_outgoing, 'idf_unit');
    var_idf_user = core_get_json_numeric (var_jsn_outgoing, 'idf_user');
    var_txt_sender = core_get_json_text (var_jsn_outgoing, 'txt_sender');

    var_sys_timestamp = core_get_timestamp_value ();

    select
        count (*)
    into
        var_num_count
    from
        dat_conditions cnd
    where
        cnd.idf_user = var_idf_user;

    if (var_num_count = 0) then

        insert into dat_conditions (
            boo_dependency,
            idf_expression,
            idf_intention,
            idf_organization,
            idf_profile,
            idf_unit,
            idf_user,
            sys_timestamp,
            txt_sender
        ) values (
            var_boo_dependency,
            var_idf_expression,
            var_idf_intention,
            var_idf_organization,
            var_idf_profile,
            var_idf_unit,
            var_idf_user,
            var_sys_timestamp,
            var_txt_sender
        );

    else

        update dat_conditions set
            boo_dependency = var_boo_dependency,
            idf_expression = var_idf_expression,
            idf_intention = var_idf_intention,
            idf_organization = var_idf_organization,
            idf_profile = var_idf_profile,
            idf_unit = var_idf_unit,
            sys_timestamp = var_sys_timestamp,
            txt_sender = var_txt_sender
        where
            idf_user = var_idf_user;

    end if;

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;