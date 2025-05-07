drop function if exists report_get_evaluated_identifier;

create or replace function report_get_evaluated_identifier (
    in incoming_object json
)
returns json as $body$
declare
    var_idf_view numeric;
    var_num_reports numeric;
    var_txt_view text;
    var_uid_identifier uuid;
begin

    var_uid_identifier = core_get_json_uuid (incoming_object, 'uid_identifier');

    select
        count (*)
    into
        var_num_reports
    from
        dat_reports rep
    where
        rep.uid_report = var_uid_identifier;

    if (var_num_reports > 0) then

        select
            rep.idf_view,
            vie.txt_view
        into
            var_idf_view,
            var_txt_view
        from
            dat_reports rep,
            dat_views vie
        where
            rep.uid_report = var_uid_identifier
            and vie.idf_view = rep.idf_view;

    else

        select
            rep.idf_view,
            vie.txt_view
        into
            var_idf_view,
            var_txt_view
        from
            dat_reports rep,
            dat_views vie
        where
            vie.idf_view = 9999;

    end if;

    incoming_object = core_set_json_numeric (incoming_object, 'idf_view', var_idf_view);
    incoming_object = core_set_json_text (incoming_object, 'txt_view', var_txt_view);

    return incoming_object;

end;
$body$ language plpgsql;