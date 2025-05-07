/**
 * @openapi
 * publish_daily_phrase:
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
 *        P1 ---> F[(publish_daily_phrase)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists publish_daily_phrase;

create or replace function publish_daily_phrase (
    in in_jsn_object json
)
returns json as $body$
declare
    var_boo_iterate boolean;
    var_boo_description boolean;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_day numeric;
    var_num_day_of_week numeric;
    var_num_holiday numeric;
    var_num_month numeric;
    var_num_phrases numeric;
    var_num_selected_phrase numeric;
    var_num_series numeric;
    var_num_used_phrase numeric;
    var_num_used_phrases numeric;
    var_num_year numeric;
    var_txt_date text;
    var_txt_description text;
    var_txt_author text;
    var_txt_phrase text;
begin

    var_jsn_status = result_set_initial ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_object) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    var_num_day = core_get_json_numeric (var_jsn_incoming, 'num_day');
    var_num_month = core_get_json_numeric (var_jsn_incoming, 'num_month');
    var_num_year = core_get_json_numeric (var_jsn_incoming, 'num_year');

    select
        count (hld.*)
    into
        var_num_holiday
    from
        dat_holidays hld
    where
        hld.num_day = var_num_day
        and hld.num_month = var_num_month
        and hld.num_year = var_num_year;

    var_boo_description = false;

    if (var_num_holiday = 0) then

        var_txt_date = concat (var_num_year, to_char (var_num_month, '00'), to_char (var_num_day, '00'));

        var_num_day_of_week = date_part ('dow', var_txt_date :: date) :: numeric;

        if (var_num_day_of_week <> 0 and var_num_day_of_week <> 6) then

            select
                count (uph.*)
            into
                var_num_used_phrases
            from
                dat_used_phrases uph
            where
                uph.num_day = var_num_day
                and uph.num_month = var_num_month
                and uph.num_year = var_num_year;

            if (var_num_used_phrases = 0) then

                select
                    count (phr.*)
                into
                    var_num_phrases
                from
                    dat_phrases phr;

                select
                    count (uph.*)
                into
                    var_num_used_phrases
                from
                    dat_used_phrases uph
                where
                    uph.num_day = var_num_day
                    and uph.num_month = var_num_month
                    and uph.num_year = var_num_year;

                var_num_series = floor (var_num_used_phrases / var_num_phrases) + 1;

                var_boo_iterate = true;

                while var_boo_iterate = true loop

                    var_num_selected_phrase = floor (random () * var_num_phrases + 1);

                    select
                        count (*)
                    into
                        var_num_used_phrase
                    from
                        dat_used_phrases uph
                    where
                        uph.idf_phrase = var_num_selected_phrase;

                    if (var_num_used_phrase < var_num_series) then

                        select
                            phr.txt_author,
                            phr.txt_phrase
                        into
                            var_txt_author,
                            var_txt_phrase
                        from
                            dat_phrases phr
                        where
                            phr.idf_phrase = var_num_selected_phrase;

                        insert into dat_used_phrases (
                            idf_phrase,
                            num_day,
                            num_month,
                            num_year
                        ) values (
                            var_num_selected_phrase,
                            var_num_day,
                            var_num_month,
                            var_num_year
                        );

                        var_boo_iterate = false;

                    end if;

                end loop;

            else

                select
                    phr.txt_author,
                    phr.txt_phrase
                into
                    var_txt_author,
                    var_txt_phrase
                from
                    dat_used_phrases uph,
                    dat_phrases phr
                where
                    uph.num_day = var_num_day
                    and uph.num_month = var_num_month
                    and uph.num_year = var_num_year
                    and phr.idf_phrase = uph.idf_phrase;

            end if;

            var_boo_description = true;

            var_txt_description = '';
            var_txt_description = var_txt_description || '« *' || var_txt_phrase || '* »' || chr (10);
            var_txt_description = var_txt_description || '− ' || var_txt_author || ' −';

            var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_description', var_txt_description);
            var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_title', '');

        end if;

    end if;

    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_description', var_boo_description);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;