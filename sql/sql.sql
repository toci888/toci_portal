-- Usuń widoki w odwrotnej kolejności
DROP VIEW IF EXISTS user_activity_summary;
DROP VIEW IF EXISTS scene_reactions_with_authors;
DROP VIEW IF EXISTS comments_with_authors_and_scenes;
DROP VIEW IF EXISTS users_with_public_scenes;
DROP VIEW IF EXISTS scenes_with_reactions;
DROP VIEW IF EXISTS scenes_with_action_tag;
DROP VIEW IF EXISTS public_scenes_with_users;

-- Usuń tabele w odwrotnej kolejności zależności
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS scenes;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE scenes (
  id SERIAL PRIMARY KEY,                           -- Unikalny identyfikator sceny
  title VARCHAR(255) NOT NULL,                    -- Tytuł sceny
  description TEXT NOT NULL,                      -- Opis sceny
  user_id INT NOT NULL,                           -- Powiązanie z użytkownikiem (autorem)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data utworzenia sceny
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data aktualizacji sceny
  is_public BOOLEAN DEFAULT TRUE,                 -- Czy scena jest publiczna
  likes_count INT DEFAULT 0,                      -- Liczba polubień sceny
  comments_count INT DEFAULT 0,                   -- Liczba komentarzy do sceny
  reactions JSONB,                                -- Reakcje w formacie JSON (np. {"like": 10, "love": 5})
  scene_data JSONB,                               -- Dodatkowe dane sceny, np. wektory, parametry (rozszerzalne)
  tags TEXT[],                                    -- Tagowanie sceny (np. ["akcja", "dramat"])
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


-- Utworzenie bazy danych (opcjonalne)
--CREATE DATABASE autobiografia;
--\c autobiografia;

-- Tabela dla użytkowników


-- Tabela dla postów
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tabela dla komentarzy
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    scene_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (scene_id) REFERENCES scenes (id) ON DELETE CASCADE
);

--ALTER TABLE comments add column scene_id INT NOT NULL FOREIGN KEY REFERENCES scenes (id)

-- Tabela dla reakcji
CREATE TABLE reactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT,
    comment_id INT,
    reaction_type VARCHAR(50) NOT NULL, -- np. 'like', 'dislike', 'love', itp.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
);

-- Dodanie indeksów dla optymalizacji
CREATE INDEX idx_posts_user_id ON posts (user_id);
CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
CREATE INDEX idx_reactions_post_id ON reactions (post_id);
CREATE INDEX idx_reactions_comment_id ON reactions (comment_id);
CREATE INDEX idx_reactions_user_id ON reactions (user_id);

-- Przykładowe dane



CREATE VIEW public_scenes_with_users AS
SELECT 
  s.id, 
  s.title, 
  s.description, 
  u.username AS author,
  s.likes_count, 
  s.comments_count,
  s.tags,
  s.created_at
FROM scenes s
JOIN users u ON s.user_id = u.id
WHERE s.is_public = TRUE
ORDER BY s.created_at DESC;

CREATE VIEW scenes_with_action_tag AS
SELECT * 
FROM scenes
WHERE 'akcja' = ANY(tags);

CREATE VIEW scenes_with_reactions AS
SELECT 
  s.id, 
  s.title, 
  s.description,
  s.reactions,
  COALESCE(s.reactions->>'like', '0')::INTEGER AS likes,
  COALESCE(s.reactions->>'love', '0')::INTEGER AS loves,
  s.created_at
FROM scenes s
WHERE s.is_public = TRUE;

CREATE VIEW users_with_public_scenes AS
SELECT 
  u.id AS user_id,
  u.username,
  COUNT(s.id) AS public_scenes_count
FROM users u
LEFT JOIN scenes s ON u.id = s.user_id AND s.is_public = TRUE
GROUP BY u.id, u.username
ORDER BY public_scenes_count DESC;

CREATE VIEW comments_with_authors_and_scenes AS
SELECT 
  c.id AS comment_id,
  c.content,
  u.username AS author,
  c.created_at,
  s.title AS scene_title
FROM comments c
JOIN users u ON c.user_id = u.id
JOIN scenes s ON c.scene_id = s.id
ORDER BY c.created_at DESC;

CREATE VIEW scene_reactions_with_authors AS
SELECT 
  s.id AS scene_id,
  s.title,
  u.username AS author,
  COALESCE(s.reactions->>'like', '0')::INTEGER AS likes,
  COALESCE(s.reactions->>'love', '0')::INTEGER AS loves,
  s.created_at
FROM scenes s
JOIN users u ON s.user_id = u.id
WHERE s.is_public = TRUE;

CREATE VIEW user_activity_summary AS
SELECT 
  u.id AS user_id,
  u.username,
  COUNT(DISTINCT s.id) AS scenes_count,
  COUNT(DISTINCT c.id) AS comments_count
FROM users u
LEFT JOIN scenes s ON u.id = s.user_id
LEFT JOIN comments c ON u.id = c.user_id
GROUP BY u.id, u.username
ORDER BY scenes_count DESC, comments_count DESC;




INSERT INTO users (username, email, password_hash) VALUES
('bartlomiej', 'bartlomiej@example.com', 'hashed_password1'),
('agnieszka', 'agnieszka@example.com', 'hashed_password2'),
('seba', 'seba@example.com', 'hashed_password3');

INSERT INTO posts (user_id, title, content) VALUES
(1, 'Moja pierwsza scena', 'To jest treść mojego pierwszego wpisu na portalu autobiografia.'),
(2, 'Historia życia', 'Dzielę się moimi przeżyciami z wami.'),
(3, 'Epiczne historie', 'Opowieści, które zmieniają życie.');

INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Wspaniała historia!'),
(1, 3, 'Dziękuję za podzielenie się.'),
(2, 1, 'To brzmi niesamowicie.');

INSERT INTO reactions (user_id, post_id, reaction_type) VALUES
(2, 1, 'like'),
(3, 1, 'love'),
(1, 2, 'like');