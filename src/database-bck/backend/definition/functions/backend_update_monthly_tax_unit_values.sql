/**
 * @openapi
 * backend_update_monthly_tax_unit_values:
 *    options:
 *      tags:
 *        - Schedule
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_object |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_object
 *        json]
 *        P1 ---> F[(backend_update_monthly_tax_unit_values)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

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
    var_num_previous numeric;
    var_num_year numeric;
    var_rec_month record;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_object) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    var_jsn_data = core_get_json_json (var_jsn_incoming, 'jsn_data');

    for var_rec_month in

        select distinct
            to_char ((json ->> 'date') :: date, 'yyyymmdd') :: numeric "idf_monthly_tax_unit",
            to_char ((json ->> 'date') :: date, 'mm') :: numeric "num_month",
            replace (replace ((json ->> 'value'), '.', ''), ',', '.') :: numeric "num_value",
            to_char ((json ->> 'date') :: date, 'yyyy') :: numeric "num_year"
        from
            json_array_elements (var_jsn_data) json
        order by
            to_char ((json ->> 'date') :: date, 'yyyymmdd') :: numeric,
            to_char ((json ->> 'date') :: date, 'mm') :: numeric,
            to_char ((json ->> 'date') :: date, 'yyyy') :: numeric
    loop

        insert into dat_monthly_tax_units (
            idf_monthly_tax_unit,
            num_month,
            num_type,
            num_value,
            num_year
        ) values (
            var_rec_month.idf_monthly_tax_unit,
            var_rec_month.num_month,
            1,
            var_rec_month.num_value,
            var_rec_month.num_year
        )
        on conflict (idf_monthly_tax_unit)
        do update set
            num_value = excluded."num_value",
            num_type = 1;

    end loop;

    select
        to_char ((json ->> 'date') :: date, 'yyyy') :: numeric
    into
        var_num_year
    from
        json_array_elements (var_jsn_data) json
    order by
        (json ->> 'date') :: date
    limit 1;

    for var_rec_month in

        select
            mtu.idf_monthly_tax_unit,
            to_char (to_date (mtu.idf_monthly_tax_unit :: text, 'yyyymmdd') - '1 day' :: interval, 'yyyymmdd') :: numeric "num_previous",
            mtu.num_value
        from
            dat_monthly_tax_units mtu
        where
            mtu.num_year = var_num_year
        order by
            mtu.idf_monthly_tax_unit

    loop

        select
            mtu.num_value
        into
            var_num_previous
        from
            dat_monthly_tax_units mtu
        where
            mtu.idf_monthly_tax_unit = var_rec_month.num_previous;

        if (var_num_previous is null) then

            var_num_previous = var_rec_month.num_value;

        end if;

        update dat_monthly_tax_units set
            num_absolute = var_rec_month.num_value - var_num_previous,
            num_variation = sign (var_rec_month.num_value - var_num_previous),
            num_percentage = round ((var_rec_month.num_value - var_num_previous) / var_num_previous * 100, 2)
        where
            idf_monthly_tax_unit = var_rec_month.idf_monthly_tax_unit;

    end loop;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;