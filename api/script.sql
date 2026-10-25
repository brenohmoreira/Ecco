CREATE TABLE Usuarios (
        id NUMERIC(18, 0) PRIMARY KEY IDENTITY(1,1),
        usuario NVARCHAR(40) NOT NULL UNIQUE,
        nome VARCHAR(100) NOT NULL,
        email NVARCHAR(254) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        ativo VARCHAR(1) NOT NULL DEFAULT 'A',
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME() 
)

CREATE TABLE UsuariosPerfil (
        idUsuario NUMERIC(18,0) PRIMARY KEY,
        bio NVARCHAR(300) NULL,
        foto VARCHAR(500) NULL,
        privado BIT NOT NULL DEFAULT 0,
        seguidores NUMERIC(18,0) NOT NULL DEFAULT 0,
        seguindo NUMERIC(18,0) NOT NULL DEFAULT 0,
        postagens NUMERIC(18,0) NOT NULL DEFAULT 0,

        CONSTRAINT FK_UsuariosPerfil_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuarios(id)
)

CREATE TABLE Seguidores (
        idSeguido NUMERIC(18,0) NOT NULL,
        idSeguidor NUMERIC(18,0) NOT NULL,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        -- Esse índice inicial permite buscar todas pessoas que uma pessoa X segue. Impossibilita também que uma pessoa siga a outra duas vezes
        CONSTRAINT PK_Seguidores PRIMARY KEY (idSeguidor, idSeguido),
        CONSTRAINT FK_Seguidores_Seguidor FOREIGN KEY (idSeguidor) REFERENCES Usuarios(id),
        CONSTRAINT FK_Seguidores_Seguido FOREIGN KEY (idSeguido) REFERENCES Usuarios(id),
        CONSTRAINT CK_Seguidores_NaoSegueASiMesmo CHECK (idSeguidor <> idSeguido)
)

-- Esse índice facilita buscar todos seguidores de uma pessoa X
CREATE INDEX IX_Seguidores_Seguido ON Seguidores (idSeguido, idSeguidor)

-- ## Postagens 

CREATE TABLE Postagens (
        id NUMERIC(18,0) PRIMARY KEY IDENTITY(1,1),
        idUsuario NUMERIC(18,0) NOT NULL,
        visualizacoes NUMERIC(18,0) NOT NULL DEFAULT 0,
        curtidas NUMERIC(18,0) NOT NULL DEFAULT 0,
        comentarios NUMERIC(18,0) NOT NULL DEFAULT 0,
        arquivado BIT NOT NULL DEFAULT 0,
        ativo BIT NOT NULL DEFAULT 1,
        texto NVARCHAR(1500) NULL,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT FK_Postagens_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuarios(id)
)

-- Índice que ordena por usuário. Útil para o feed para o perfil de alguém (mostra x Postagens de um usuário que você segue, por exemplo), ordena pelo mais recente
CREATE INDEX IX_Postagens_Usuario ON Postagens (idUsuario, dataCriacao DESC)

CREATE TABLE PostagensVisualizacoes (
        idPostagem NUMERIC(18,0) NOT NULL,
        idUsuario NUMERIC(18,0) NOT NULL,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_PostagensVisualizacoes PRIMARY KEY (idPostagem, idUsuario),
        CONSTRAINT FK_PostagensVisualizacoes_Postagem FOREIGN KEY (idPostagem) REFERENCES Postagens(id),
        CONSTRAINT FK_PostagensVisualizacoes_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuarios(id) 
)

CREATE TABLE PostagensArquivos (
        id NUMERIC(18,0) PRIMARY KEY IDENTITY(1,1),
        idPostagem NUMERIC(18,0) NOT NULL,
        endereco VARCHAR(500) NOT NULL,
        tipo CHAR(1) NOT NULL,
        ordem TINYINT NOT NULL,

        CONSTRAINT FK_PostagensArquivos_Postagem FOREIGN KEY (idPostagem) REFERENCES Postagens(id)
)

-- Índice que ordena por postagem. Útil para buscar todos arquivos de uma postagem
CREATE INDEX IX_PostagensArquivos_Postagem ON PostagensArquivos (idPostagem, ordem)

CREATE TABLE PostagensComentarios (
        id NUMERIC(18,0) PRIMARY KEY IDENTITY(1,1), 
        idUsuario NUMERIC(18,0) NOT NULL,
        idPostagem NUMERIC(18,0) NOT NULL,
        idComentarioPai NUMERIC(18,0) NULL, 
        texto NVARCHAR(1000) NOT NULL,
        ativo BIT NOT NULL DEFAULT 1,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT FK_PostagensComentarios_Postagem FOREIGN KEY (idPostagem) REFERENCES Postagens(id),
        CONSTRAINT FK_PostagensComentarios_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuarios(id),
        CONSTRAINT FK_PostagensComentarios_Pai FOREIGN KEY (idComentarioPai) REFERENCES PostagensComentarios(id)
)

-- Para buscar os comentários de uma postagem, só basta a postagem. Além disso, um índice para buscar as mensagens filhas de um comentário pai
CREATE INDEX IX_PostagensComentarios_Postagem ON PostagensComentarios (idPostagem, dataCriacao)
CREATE INDEX IX_PostagensComentarios_ComentarioPai ON PostagensComentarios (idComentarioPai, dataCriacao)

-- Aqui um índice de idUsuario sendo ordenado só seria útil se eu fosse fazer uma parte analítica onde quero saber N curtidas que um usuário teve
CREATE TABLE PostagensCurtidas (
        idPostagem NUMERIC(18,0) NOT NULL,
        idUsuario NUMERIC(18,0) NOT NULL,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_PostagensCurtidas PRIMARY KEY (idPostagem, idUsuario),
        CONSTRAINT FK_PostagensCurtidas_Postagem FOREIGN KEY (idPostagem) REFERENCES Postagens(id),
        CONSTRAINT FK_PostagensCurtidas_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuarios(id)
)

-- ## Stories 

-- Para ver N Stories, vou ter N usuários. Ou seja, preciso de um índice para ordenar por usuário + dataCriacao para ver os mais recentes
CREATE TABLE Stories (
        id NUMERIC(18,0) PRIMARY KEY IDENTITY(1,1),
        idUsuario NUMERIC(18,0) NOT NULL,
        endereco VARCHAR(500) NOT NULL,
        tipo CHAR(1) NOT NULL,
        visualizacoes NUMERIC(18,0) NOT NULL DEFAULT 0,
        dataExpira DATETIME2 NOT NULL,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        arquivado BIT NOT NULL DEFAULT 0,
        ativo BIT NOT NULL DEFAULT 1,

        CONSTRAINT FK_Stories_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuarios(id) 
)

CREATE INDEX IX_Stories_Usuario ON Stories (idUsuario, dataCriacao DESC)

-- Para ver N visualizações, vou ter um Story. Sendo assim, não preciso de ordenação por usuário (então, não preciso de um índice)
CREATE TABLE StoriesVisualizacoes (
        idStory NUMERIC(18,0) NOT NULL,
        idUsuario NUMERIC(18,0) NOT NULL,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_StoriesVisualizacoes PRIMARY KEY (idStory, idUsuario),
        CONSTRAINT FK_StoriesVisualizacoes_Storie FOREIGN KEY (idStory) REFERENCES Stories(id),
        CONSTRAINT FK_StoriesVisualizacoes_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuarios(id)
)

-- ## Notificações

CREATE TABLE Notificacoes (
        id NUMERIC(18,0) PRIMARY KEY IDENTITY(1,1),
        idUsuario NUMERIC(18,0) NOT NULL,
        idAutor NUMERIC(18,0) NOT NULL,
        tipo CHAR(1) NOT NULL, 
        idPostagem NUMERIC(18,0) NULL,
        texto NVARCHAR(1000) NOT NULL,
        dataCriacao DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        visto BIT NOT NULL DEFAULT 0,

        CONSTRAINT FK_Notificacoes_Usuarios FOREIGN KEY (idUsuario) REFERENCES Usuarios(id),
        CONSTRAINT FK_Notificacoes_Autor FOREIGN KEY (idAutor) REFERENCES Usuarios(id),
        CONSTRAINT FK_Notificacoes_Postagem FOREIGN KEY (idPostagem) REFERENCES Postagens(id) 
)

CREATE INDEX IX_Notificacoes_Usuario ON Notificacoes (idUsuario, dataCriacao DESC)