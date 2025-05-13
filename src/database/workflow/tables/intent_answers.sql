DROP TABLE IF EXISTS intent_answers CASCADE;

CREATE TABLE intent_answers (
    id SERIAL PRIMARY KEY,
    intent_id INTEGER NOT NULL REFERENCES intents(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar respuestas
INSERT INTO intent_answers (intent_id, answer_text)
SELECT id, '📱 Productos disponibles:\n1. Smartphones\n2. Laptops\n3. Tablets\n4. Accesorios\n\n¿Sobre cuál necesitas información?'
FROM intents WHERE name = 'consultar.productos';

INSERT INTO intent_answers (intent_id, answer_text)
SELECT id, '🛡️ Nuestras garantías:\n- Estándar: 12 meses\n- Premium: 24 meses\n\n¿Para qué producto necesitas esta información?'
FROM intents WHERE name = 'consultar.garantia';

INSERT INTO intent_answers (intent_id, answer_text)
SELECT id, '🛒 Puedes realizar tu pedido:\n1. Online (www.tienda.com)\n2. Por WhatsApp (+123456789)\n3. En tienda física\n\n¿Cómo prefieres hacerlo?'
FROM intents WHERE name = 'realizar.pedido';
