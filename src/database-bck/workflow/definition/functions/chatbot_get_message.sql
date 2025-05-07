drop function if exists chatbot_get_message;

create or replace function chatbot_get_message (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_rec_words record;
    var_txt_message text;
    var_txt_word text;
    var_txt_words text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_txt_message = core_get_json_text (var_jsn_incoming, 'txt_message');
    var_txt_message = lower (var_txt_message);
    var_txt_words = '';

    for var_rec_words in

        select
            regexp_split_to_table (var_txt_message, ' ') "words"

    loop

        var_txt_word = trim (var_rec_words.words);
        var_txt_word = translate (var_txt_word, 'àáâãäéèëêíìïîóòõöôúùüûç', 'aaaaaeeeeiiiiooooouuuuc');

        if (not utils_check_mail (var_txt_word)) then

            var_txt_word = trim (regexp_replace (var_rec_words.words, '[^\w]+', '', 'g'));

        end if;

        if (var_txt_word != 'java.sql.SQLWarning' and var_txt_word != '') then

            var_txt_words = var_txt_words || ' ' || var_txt_word;

        end if;

    end loop;

    if (position ('/' in var_txt_message) = 1) then

        var_txt_words = '/' || trim (var_txt_words);

    else

        var_txt_words = trim (var_txt_words);

    end if;

    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_message', var_txt_words);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;