DROP TABLE IF EXISTS workflow.training_phrases CASCADE;


CREATE TABLE workflow.training_phrases (
    id SERIAL PRIMARY KEY,
    intent_id INTEGER NOT NULL REFERENCES intents(id) ON DELETE CASCADE,
    phrase TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Insertar frases de entrenamiento para 'consultar.productos'
INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'qué productos tienen' FROM intents WHERE name = 'consultar.productos';

INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'muéstrenme el catálogo' FROM intents WHERE name = 'consultar.productos';

INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'qué artículos venden' FROM intents WHERE name = 'consultar.productos';

-- Insertar frases de entrenamiento para 'consultar.garantia'
INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'información sobre garantías' FROM intents WHERE name = 'consultar.garantia';

INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'qué cubre la garantía' FROM intents WHERE name = 'consultar.garantia';

INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'la garantía incluye reparaciones' FROM intents WHERE name = 'consultar.garantia';

-- Insertar frases de entrenamiento para 'realizar.pedido'
INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'quiero comprar un %producto%' FROM intents WHERE name = 'realizar.pedido';

INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'deseo ordenar un %producto% %marca%' FROM intents WHERE name = 'realizar.pedido';

INSERT INTO workflow.training_phrases (intent_id, phrase)
SELECT id, 'cómo hago un pedido' FROM intents WHERE name = 'realizar.pedido';


