DROP TABLE IF EXISTS workflow.intents CASCADE;

CREATE TABLE workflow.intents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);




-- Insertar intenciones
INSERT INTO workflow.intents (name, language) VALUES ('consultar.productos', 'es');
INSERT INTO workflow.intents (name, language) VALUES ('consultar.garantia', 'es');
INSERT INTO workflow.intents (name, language) VALUES ('realizar.pedido', 'es');

