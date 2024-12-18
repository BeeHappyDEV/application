drop table if exists dat_profiles cascade;

create table if not exists dat_profiles (
    idf_profile numeric,
    boo_collaborator boolean,
    txt_icon text,
    txt_profile text,
    constraint dat_profiles_pk primary key (idf_profile)
);

comment on table dat_profiles is 'prf';