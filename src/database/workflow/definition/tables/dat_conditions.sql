drop table if exists dat_conditions cascade;

create table if not exists dat_conditions (
    boo_dependency   boolean,
    idf_expression   numeric,
    idf_intention    numeric,
    idf_organization numeric,
    idf_profile      numeric,
    idf_unit         numeric,
    idf_user         numeric,
    sys_timestamp    timestamp,
    txt_sender       text,
    constraint dat_conditions_fk1 foreign key (idf_user) references dat_users (idf_user),
    constraint dat_conditions_fk2 foreign key (idf_profile) references dat_profiles (idf_profile),
    constraint dat_conditions_fk3 foreign key (idf_organization) references dat_organizations (idf_organization)
    /*
    constraint dat_conditions_fk4 foreign key (idf_unit) references dat_units (idf_unit)
    */
);

comment on table dat_conditions is 'cnd';