drop table if exists commons.constants cascade;

create table if not exists commons.constants (
    idf_constant  smallint,
    txt_key       text,
    txt_value     text,
    constraint constants_pk primary key (idf_constant)
);

alter table commons.constants enable row level security;

comment on table commons.constants is 'cst';

insert into commons.constants (idf_constant, txt_key, txt_value) values
(1001, 'timezone_difference', '-3'),
(2001, 'link_facebook', 'https://www.facebook.com/'),
(2002, 'link_instagram', 'https://www.instagram.com/'),
(2003, 'link_linkedin', 'https://www.linkedin.com/'),
(2004, 'link_discord', 'https://discord.com/'),
(2005, 'link_x', 'https://x.com/'),
(2011, 'link_privacy_policy_video', 'https://www.youtube.com/'),
(2012, 'modification_privacy_policy', '10 abril 2025'),
(2021, 'link_terms_and_conditions_video', 'https://www.youtube.com/'),
(2022, 'modification_terms_and_conditions', '10 abril 2025');