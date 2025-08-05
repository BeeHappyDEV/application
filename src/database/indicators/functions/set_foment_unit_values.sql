drop function if exists indicators.set_foment_unit_values;

create or replace function indicators.set_foment_unit_values (
    in in_jsn_object json
)
returns json as $body$
declare
    var_jsn_data json;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_year numeric;
    var_rec_day record;
    var_first_date date;
    var_last_date date;
begin

    var_jsn_status = result.initializer ();
    var_jsn_incoming = framework.get_empty_node ((in_jsn_object) :: json);
    var_jsn_outgoing = framework.get_empty_node (null :: json);

    var_jsn_data = framework.get_node (var_jsn_incoming, 'jsn_data');

    for var_rec_day in

        select distinct
            to_char ((json ->> 'date') :: date, 'yyyymmdd') :: numeric idf_foment_unit,
            to_char ((json ->> 'date') :: date, 'dd') :: numeric num_day,
            to_char ((json ->> 'date') :: date, 'mm') :: numeric num_month,
            replace (replace ((json ->> 'value'), '.', ''), ',', '.') :: numeric num_value,
            to_char ((json ->> 'date') :: date, 'yyyy') :: numeric num_year
        from
            json_array_elements (var_jsn_data) json
        order by
            1

    loop

        insert into indicators.foment_units (
            idf_foment_unit,
            boo_calculated,
            num_day,
            num_month,
            num_value,
            num_year
        ) values (
            var_rec_day.idf_foment_unit,
            false,
            var_rec_day.num_day,
            var_rec_day.num_month,
            var_rec_day.num_value,
            var_rec_day.num_year
        )
        on conflict (idf_foment_unit)
        do update set
            num_value = excluded.num_value,
            boo_calculated = false;

    end loop;

    select
        min ((json ->> 'date') :: date),
        max ((json ->> 'date') :: date),
        extract (year from min ((json ->> 'date') :: date)) :: numeric
    into
        var_first_date,
        var_last_date,
        var_num_year
    from
        json_array_elements (var_jsn_data) json;

    for var_rec_day in

        select
            to_char (day, 'yyyymmdd') :: numeric as num_previous,
            to_char (day, 'yyyymmdd') as txt_previous
        from
            generate_series (
                var_first_date,
                least (var_last_date, current_date),
                '1 day' :: interval
            ) day

    loop

        if not exists (

            select
                1
            from
                indicators.foment_units fun
            where
                fun.idf_foment_unit = var_rec_day.num_previous

        ) then

            insert into indicators.foment_units (
                idf_foment_unit,
                boo_calculated,
                num_day,
                num_month,
                num_value,
                num_year
            )
            select
                var_rec_day.num_previous,
                true,
                to_char (var_rec_day.txt_previous :: date, 'dd') :: numeric,
                to_char (var_rec_day.txt_previous :: date, 'mm') :: numeric,
                coalesce (
                    (
                        select
                            fun.num_value
                        from
                            indicators.foment_units fun
                        where
                            fun.idf_foment_unit < var_rec_day.num_previous
                        order by
                            fun.idf_foment_unit desc
                        limit
                            1
                    ),
                    0
                ),
                to_char (var_rec_day.txt_previous :: date, 'yyyy') :: numeric;

        end if;

    end loop;

    with temp_foment_units as (
        select
            fun.idf_foment_unit,
            fun.num_value,
            lag (fun.num_value) over (order by fun.idf_foment_unit) as prev_value
        from
            indicators.foment_units fun
        where
            fun.num_year = var_num_year
    )
    update indicators.foment_units fun
    set
        num_absolute = fun.num_value - temp.prev_value,
        num_variation = sign (fun.num_value - temp.prev_value),
        num_percentage =
            case
                when temp.prev_value = 0 then
                    null
                else
                    round (((fun.num_value - temp.prev_value) / temp.prev_value * 100) :: numeric, 2)
            end
    from
        temp_foment_units temp
    where
        fun.idf_foment_unit = temp.idf_foment_unit
        and temp.prev_value is not null;

    return result.successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result.failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;