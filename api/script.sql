CREATE TABLE Usuarios (
        id NUMERIC(18, 0) PRIMARY KEY IDENTITY(1,1),
        usuario VARCHAR(MAX) NOT NULL,
        email VARCHAR(MAX) NOT NULL UNIQUE,
        senha VARCHAR(MAX) NOT NULL,
        ativo VARCHAR(1) DEFAULT 'A'
)