drop function if exists response_get_options_by_profile;

create or replace function response_get_options_by_profile (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_arr_profiles numeric [];
    var_idf_expression numeric;
    var_idf_intention numeric;
    var_idf_profile numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_rec_alternatives record;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_idf_intention = core_get_json_numeric (var_jsn_outgoing, 'idf_intention');
    var_idf_profile = core_get_json_numeric (var_jsn_outgoing, 'idf_profile');

    var_idf_expression = var_idf_intention;

    if (var_idf_profile = 11 or var_idf_profile = 12) then

        var_arr_profiles = array [11];

    end if;

    if (var_idf_profile = 31 or var_idf_profile = 32) then

        var_arr_profiles = array [31];

    end if;

    if (var_idf_profile = 61 or var_idf_profile = 62 or var_idf_profile = 63) then

        var_arr_profiles = array [61];

    end if;

    if (var_arr_profiles is null) then

        var_arr_profiles = array [91];

    end if;

    for var_rec_alternatives in
        select
            alt.idf_expression,
            alt.txt_alternative
        from
            dat_alternatives alt
        where
            alt.idf_intention = var_idf_intention
            and alt.idf_profile = any (var_arr_profiles)
        order by
            alt.num_alternative
    loop

        var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'jsn_alternatives', var_rec_alternatives.txt_alternative);

    end loop;

    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', var_idf_expression);
    --var_jsn_outgoing = core_set_json_json (var_jsn_outgoing, 'jsn_parameters', null);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;