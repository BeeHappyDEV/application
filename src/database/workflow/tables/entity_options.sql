DROP TABLE IF EXISTS entity_options CASCADE;


CREATE TABLE entity_options (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar opciones para 'producto'
INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'smartphone' FROM entities WHERE name = 'producto';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'laptop' FROM entities WHERE name = 'producto';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'tablet' FROM entities WHERE name = 'producto';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'computador' FROM entities WHERE name = 'producto';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'teléfono' FROM entities WHERE name = 'producto';

-- Insertar opciones para 'marca'
INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'samsung' FROM entities WHERE name = 'marca';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'apple' FROM entities WHERE name = 'marca';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'xiaomi' FROM entities WHERE name = 'marca';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'huawei' FROM entities WHERE name = 'marca';

INSERT INTO entity_options (entity_id, option_text)
SELECT id, 'lenovo' FROM entities WHERE name = 'marca';

