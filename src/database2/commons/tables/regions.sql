drop table if exists regions cascade;

create table if not exists regions (
    idf_region  smallint,
    idf_country smallint,
    txt_region  text,
    constraint regions_pk primary key (idf_region),
    constraint regions_fk1 foreign key (idf_country) references countries (idf_country)
);

alter table regions enable row level security;

comment on table regions is 'rgn';

insert into regions (idf_region, idf_country, txt_region) values
(1, 56, 'Región de Tarapacá'),
(2, 56, 'Región de Antofagasta'),
(3, 56, 'Región de Atacama'),
(4, 56, 'Región de Coquimbo'),
(5, 56, 'Región de Valparaíso'),
(6, 56, 'Región del Libertador General Bernardo O’Higgins'),
(7, 56, 'Región del Maule'),
(8, 56, 'Región del Biobío'),
(9, 56, 'Región de La Araucanía'),
(10, 56, 'Región de Los Lagos'),
(11, 56, 'Región Aysén del General Carlos Ibáñez del Campo'),
(12, 56, 'Región de Magallanes y de la Antártica Chilena'),
(13, 56, 'Región Metropolitana de Santiago'),
(14, 56, 'Región de Los Ríos'),
(15, 56, 'Región de Arica y Parinacota'),
(16, 56, 'Región de Ñuble');