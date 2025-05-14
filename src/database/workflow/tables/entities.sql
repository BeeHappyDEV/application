drop table if exists workflow.entities cascade;

create table if not exists workflow.entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

alter table workflow.entities enable row level security;

--comment on table dollars is 'usd';

INSERT INTO workflow.entities (name, language) VALUES ('producto', 'es');
INSERT INTO workflow.entities (name, language) VALUES ('marca', 'es');