
select workflow_run_chatbot ('{
    "txt_channel": "whatsapp",
    "txt_name": "AB",
    "txt_sender": "56991220195",
    "txt_message": "/aboutme"
}');


    select
        usr.idf_user,
        usr.txt_first_name,
        usr.txt_last_name,
        pfu.idf_profile
    from
        dat_users usr,
        dat_profiles_users pfu
    where
        usr.sys_status = true
        and usr.num_phone = 56991220195
        and pfu.idf_user = usr.idf_user;
        ;




select utils_get_full_name ('{
  "outgoing": {
    "txt_first_name": "Alexis",
    "txt_last_name": null
  }
}');

select chatbot_get_expressions ('{
  "status": {
  },
  "incoming": {
  },
  "outgoing": {
    "idf_expression": 1021,
    "boo_authenticated": true
  }
}');

select trim ('Alexis' || ' ' || 'Bacian');
select trim ('Alexis' || ' ' || null);


select chatbot_set_messages ('{
  "status": {},
  "incoming": {},
  "outgoing": {
    "idf_expression": 1021,
    "arr_expressions": [
      {
        "txt_type": "text",
        "txt_content": "¡Me gusta que me llamen por mi nombre! En que te ayudo%0?",
        "num_expression": 1
      }
    ],
    "boo_authenticated": true
  }
}');

