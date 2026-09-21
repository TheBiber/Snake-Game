CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    high_score INTEGER NOT NULL DEFAULT 0
);

INSERT INTO users (username, password_hash, high_score)
VALUES
    ('yoav', 'abc123', 120),
    ('daniel', 'dre2', 85),
    ('noam', 'snoop', 200);