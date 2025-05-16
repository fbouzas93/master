CREATE TABLE IF NOT EXISTS service_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    service_provider_id INTEGER NOT NULL REFERENCES service_providers(id),
    service VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);