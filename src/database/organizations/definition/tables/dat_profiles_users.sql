drop table if exists dat_profiles_users cascade;

create table if not exists dat_profiles_users (
    sys_user numeric,
    idf_profile_user numeric,
    idf_profile numeric,
    idf_user numeric,
    constraint dat_profiles_users_pk primary key (idf_profile_user),
    constraint dat_profiles_users_fk1 foreign key (idf_profile) references dat_profiles (idf_profile),
    constraint dat_profiles_users_fk2 foreign key (idf_user) references dat_users (idf_user)
);

comment on table dat_profiles_users is 'pfu';