/**
 * @openapi
 * backend_update_foment_unit_values:
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
 *        P1 ---> F[(backend_update_foment_unit_values)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists backend_update_foment_unit_values;

create or replace function backend_update_foment_unit_values (
    in in_jsn_object json
)
returns json as $body$
declare
    var_jsn_data json;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_actual numeric;
    var_num_previous numeric;
    var_num_registries numeric;
    var_num_year numeric;
    var_rec_day record;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_object) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    var_jsn_data = core_get_json_json (var_jsn_incoming, 'jsn_data');

    for var_rec_day in

        select distinct
            to_char ((json ->> 'date') :: date, 'yyyymmdd') :: numeric "idf_foment_unit",
            to_char ((json ->> 'date') :: date, 'dd') :: numeric "num_day",
            to_char ((json ->> 'date') :: date, 'mm') :: numeric "num_month",
            replace (replace ((json ->> 'value'), '.', ''), ',', '.') :: numeric "num_value",
            to_char ((json ->> 'date') :: date, 'yyyy') :: numeric "num_year"
        from
            json_array_elements (var_jsn_data) json
        order by
            to_char ((json ->> 'date') :: date, 'yyyymmdd') :: numeric,
            to_char ((json ->> 'date') :: date, 'dd') :: numeric,
            to_char ((json ->> 'date') :: date, 'mm') :: numeric,
            to_char ((json ->> 'date') :: date, 'yyyy') :: numeric
    loop

        insert into dat_foment_units (
            idf_foment_unit,
            num_day,
            num_month,
            num_type,
            num_value,
            num_year
        ) values (
            var_rec_day.idf_foment_unit,
            var_rec_day.num_day,
            var_rec_day.num_month,
            1,
            var_rec_day.num_value,
            var_rec_day.num_year
        )
        on conflict (idf_foment_unit)
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

    select
        to_char (now (), 'yyyy') :: numeric
    into
        var_num_actual;

    if (var_num_year = var_num_actual) then

        for var_rec_day in

            select
                to_char (generate_series (date_trunc ('year', now ()), now (), '1 day' :: interval), 'yyyymmdd') :: numeric "num_previous",
                to_char (generate_series (date_trunc ('year', now ()), now (), '1 day' :: interval), 'yyyymmdd') "txt_previous"

        loop

            select
                count (fun.*)
            into
                var_num_registries
            from
                dat_foment_units fun
            where
                fun.idf_foment_unit = var_rec_day.num_previous;

            if (var_num_registries = 0) then

                insert into dat_foment_units (
                    idf_foment_unit,
                    num_day,
                    num_month,
                    num_type,
                    num_value,
                    num_year
                )
                select
                    var_rec_day.num_previous,
                    to_char (var_rec_day.txt_previous :: date, 'dd') :: numeric,
                    to_char (var_rec_day.txt_previous :: date, 'mm') :: numeric,
                    2,
                    fun.num_value,
                    to_char (var_rec_day.txt_previous :: date, 'yyyy') :: numeric
                from
                    dat_foment_units fun
                where
                    fun.idf_foment_unit <= var_rec_day.num_previous
                order by
                    fun.idf_foment_unit desc
                limit 1;

            end if;

        end loop;

    else

        for var_rec_day in

            select
                to_char (generate_series (concat (var_num_year, '0101') :: date, concat (var_num_year, '1231') :: date, '1 day' :: interval), 'yyyymmdd') :: numeric "num_previous",
                to_char (generate_series (concat (var_num_year, '0101') :: date, concat (var_num_year, '1231') :: date, '1 day' :: interval), 'yyyymmdd') "txt_previous"

        loop

            select
                count (fun.*)
            into
                var_num_registries
            from
                dat_foment_units fun
            where
                fun.idf_foment_unit = var_rec_day.num_previous;

            if (var_num_registries = 0) then

                insert into dat_foment_units (
                    idf_foment_unit,
                    num_day,
                    num_month,
                    num_type,
                    num_value,
                    num_year
                )
                select
                    var_rec_day.num_previous,
                    to_char (var_rec_day.txt_previous :: date, 'dd') :: numeric,
                    to_char (var_rec_day.txt_previous :: date, 'mm') :: numeric,
                    2,
                    fun.num_value,
                    to_char (var_rec_day.txt_previous :: date, 'yyyy') :: numeric
                from
                    dat_foment_units fun
                where
                    fun.idf_foment_unit <= var_rec_day.num_previous
                order by
                    fun.idf_foment_unit desc
                limit 1;

            end if;

        end loop;

    end if;

    for var_rec_day in

        select
            fun.idf_foment_unit,
            to_char (to_date (fun.idf_foment_unit :: text, 'yyyymmdd') - '1 day' :: interval, 'yyyymmdd') :: numeric "num_previous",
            fun.num_value
        from
            dat_foment_units fun
        where
            fun.num_year = var_num_year
        order by
            fun.idf_foment_unit

    loop

        select
            fun.num_value
        into
            var_num_previous
        from
            dat_foment_units fun
        where
            fun.idf_foment_unit = var_rec_day.num_previous;

        if (var_num_previous is null) then

            var_num_previous = var_rec_day.num_value;

        end if;

        update dat_foment_units set
            num_absolute = var_rec_day.num_value - var_num_previous,
            num_variation = sign (var_rec_day.num_value - var_num_previous),
            num_percentage = round ((var_rec_day.num_value - var_num_previous) / var_num_previous * 100, 2)
        where
            idf_foment_unit = var_rec_day.idf_foment_unit;

    end loop;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;