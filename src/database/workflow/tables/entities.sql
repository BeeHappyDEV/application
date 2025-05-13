drop table if exists entities cascade;

create table if not exists entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

alter table entities enable row level security;

--comment on table dollars is 'usd';

INSERT INTO entities (name, language) VALUES ('producto', 'es');
INSERT INTO entities (name, language) VALUES ('marca', 'es');