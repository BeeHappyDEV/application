drop function if exists backend_update_monthly_tax_unit_values;

create or replace function backend_update_monthly_tax_unit_values (
    in in_jsn_object json
)
returns json as $body$
declare
    var_jsn_data json;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_year numeric;
    var_rec_month record;
    var_first_date date;
    var_last_date date;
begin

    var_jsn_status = status_initializer ();
    var_jsn_incoming = get_empty_node ((in_jsn_object) :: json);
    var_jsn_outgoing = get_empty_node (null :: json);

    var_jsn_data = get_node (var_jsn_incoming, 'jsn_data');

    for var_rec_month in

        select distinct
            to_char ((json ->> 'date') :: date, 'yyyymm') :: numeric idf_monthly_tax_unit,
            to_char ((json ->> 'date') :: date, 'mm') :: numeric num_month,
            replace (replace ((json ->> 'value'), '.', ''), ',', '.') :: numeric num_value,
            to_char ((json ->> 'date') :: date, 'yyyy') :: numeric num_year
        from
            json_array_elements (var_jsn_data) json
        order by
           1

    loop

        insert into dat_monthly_tax_units (
            idf_monthly_tax_unit,
            num_month,
            num_value,
            num_year
        ) values (
            var_rec_month.idf_monthly_tax_unit,
            var_rec_month.num_month,
            var_rec_month.num_value,
            var_rec_month.num_year
        )
        on conflict (idf_monthly_tax_unit)
        do update set
            num_value = excluded.num_value;

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

    for var_rec_month in

        select
            to_char (month, 'yyyymm') :: numeric as num_previous,
            to_char (month, 'yyyymm') as txt_previous
        from
            generate_series (
                var_first_date,
                least (var_last_date, current_date),
                '1 month' :: interval
            ) month

    loop

        if not exists (

            select
                1
            from
                dat_monthly_tax_units
            where
                idf_monthly_tax_unit = var_rec_month.num_previous

        ) then

            insert into dat_monthly_tax_units (
                idf_monthly_tax_unit,
                num_month,
                num_value,
                num_year
            )
            select
                var_rec_month.num_previous,
                to_char (var_rec_month.txt_previous :: date, 'mm') :: numeric,
                coalesce (
                    (
                        select
                            num_value
                        from
                            dat_monthly_tax_units
                        where
                            idf_monthly_tax_unit < var_rec_month.num_previous
                        order by
                            idf_monthly_tax_unit desc
                        limit
                            1
                    ),
                    0
                ),
                to_char (var_rec_month.txt_previous :: date, 'yyyy') :: numeric;

        end if;

    end loop;

    with tmp_monthly_tax_units as (
        select
            idf_monthly_tax_unit,
            num_value,
            lag (num_value) over (order by idf_monthly_tax_unit) as prev_value
        from
            dat_monthly_tax_units
        where
            num_year = var_num_year
    )
    update dat_monthly_tax_units mtu
    set
        num_absolute = mtu.num_value - tmp.prev_value,
        num_variation = sign (mtu.num_value - tmp.prev_value),
        num_percentage =
        case
            when tmp.prev_value = 0 then
                null
            else
                round (((mtu.num_value - tmp.prev_value) / tmp.prev_value * 100) :: numeric, 2)
        end
    from
        tmp_monthly_tax_units tmp
    where
        mtu.idf_monthly_tax_unit = tmp.idf_monthly_tax_unit
        and tmp.prev_value is not null;

    return result_successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;