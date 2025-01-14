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


-- SEED USERS
INSERT INTO users (username, email, password_hash, created_at, updated_at) VALUES
('bartlomiej', 'bartlomiej@example.com', 'hashed_password1', NOW(), NOW()),
('agnieszka', 'agnieszka@example.com', 'hashed_password2', NOW(), NOW()),
('seba', 'seba@example.com', 'hashed_password3', NOW(), NOW()),
('beata', 'beata@example.com', 'hashed_password4', NOW(), NOW()),
('wiktor', 'wiktor@example.com', 'hashed_password5', NOW(), NOW());

-- SEED SCENES
INSERT INTO scenes (title, description, user_id, created_at, updated_at, is_public, likes_count, comments_count, reactions, tags) VALUES
('Ania Singing in the Rain', 'Ania sings in the rain, creating a melancholic yet beautiful atmosphere.', 1, NOW(), NOW(), TRUE, 10, 5, '{"like": 10, "love": 5}', ARRAY['muzyka', 'deszcz']),
('Epic Volleyball Match', 'A surreal volleyball game played with two balls, showcasing chaos and skill.', 2, NOW(), NOW(), TRUE, 15, 8, '{"like": 12, "love": 3}', ARRAY['sport', 'akcja']),
('Crystallize Dance', 'Seba plays the saxophone while Bartek drifts his BMW M5 in a synchronized dance.', 3, NOW(), NOW(), TRUE, 25, 10, '{"like": 20, "love": 5}', ARRAY['muzyka', 'taniec']),
('Pyramid Time Travel', 'Exploring the construction of the Pyramid of Cheops with advanced alien technology.', 4, NOW(), NOW(), TRUE, 30, 15, '{"like": 25, "wow": 5}', ARRAY['historia', 'sci-fi']),
('Hackathon Adventure', 'A thrilling programming hackathon where the team battles a cyberattack.', 5, NOW(), NOW(), TRUE, 18, 7, '{"like": 10, "love": 8}', ARRAY['technologia', 'programowanie']);

-- SEED POSTS
INSERT INTO posts (user_id, title, content, created_at, updated_at) VALUES
(1, 'My First Post', 'This is the content of my first post on the Hollywood Genius AI portal.', NOW(), NOW()),
(2, 'Life Story', 'Sharing my experiences and reflections with you all.', NOW(), NOW()),
(3, 'Epic Stories', 'Stories that inspire and transform lives.', NOW(), NOW());

-- SEED COMMENTS
INSERT INTO comments (post_id, user_id, scene_id, content, created_at) VALUES
(1, 2, 1, 'An amazing scene that captures raw emotion!', NOW()),
(1, 3, 2, 'Incredible creativity and execution.', NOW()),
(2, 1, 3, 'The best use of music and visuals I have ever seen.', NOW()),
(3, 4, 4, 'History meets technology in such a cool way!', NOW()),
(2, 5, 5, 'Loved the programming hackathon twist.', NOW());

-- SEED REACTIONS
INSERT INTO reactions (user_id, post_id, reaction_type, created_at) VALUES
(2, 1, 'like', NOW()),
(3, 1, 'love', NOW()),
(1, 2, 'like', NOW()),
(4, 2, 'wow', NOW()),
(5, 3, 'love', NOW());

-- SEED REACTIONS FOR COMMENTS
INSERT INTO reactions (user_id, comment_id, reaction_type, created_at) VALUES
(1, 1, 'like', NOW()),
(2, 2, 'love', NOW()),
(3, 3, 'wow', NOW()),
(4, 4, 'like', NOW()),
(5, 5, 'love', NOW());
