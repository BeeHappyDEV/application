drop function if exists report_get_evaluated_timestamp;

create or replace function report_get_evaluated_timestamp (
    in incoming_object json
)
returns json as $body$
declare
    var_txt_timestamp text;
begin

    var_txt_timestamp = core_get_timestamp_value ();
    var_txt_timestamp = replace (var_txt_timestamp, ' ', '_');

    incoming_object = core_set_json_text (incoming_object, 'txt_timestamp', var_txt_timestamp);

    return incoming_object;

end;
$body$ language plpgsql;