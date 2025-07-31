-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS likes_response;
DROP TABLE IF EXISTS likes_question;
DROP TABLE IF EXISTS dislikes_response;
DROP TABLE IF EXISTS dislikes_question;
DROP TABLE IF EXISTS user_classes;
DROP TABLE IF EXISTS school_classes;
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS schools;

-- Schools
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Classes
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Join table: schools <-> classes (many-to-many) NOTE!!! This isn't currently functional. This is here for future implementation.
CREATE TABLE school_classes (
    class_id INT NULL,
    school_id INT NULL,
    PRIMARY KEY (class_id, school_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    school_id INT,
    dark_mode BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL
);

-- Join table: users <-> classes (many-to-many) NOTE!!! This isn't currently functional. This is here for future implementation.
CREATE TABLE user_classes (
    user_id INT NULL,
    class_id INT NULL,
    PRIMARY KEY (user_id, class_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Questions
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INT, -- Nullable for anonymous
    school_id INT,
    class_id INT,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Responses (can respond to question OR another response)
CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT,
    question_id INT,
    parent_response_id INT,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_response_id) REFERENCES responses(id) ON DELETE CASCADE,
    CHECK (
        (question_id IS NOT NULL AND parent_response_id IS NULL)
        OR (question_id IS NULL AND parent_response_id IS NOT NULL)
    )
);

-- Likes on Questions
CREATE TABLE likes_question (
    user_id INT,
    question_id INT,
    PRIMARY KEY (user_id, question_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Likes on Responses NOTE!!! This isn't currently functional. This is here for future implementation.
CREATE TABLE likes_response (
    user_id INT,
    response_id INT,
    PRIMARY KEY (user_id, response_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE
);

-- Dislikes on Questions
CREATE TABLE dislikes_question (
    user_id INT,
    question_id INT,
    PRIMARY KEY (user_id, question_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Dislikes on Responses NOTE!!! This isn't currently functional. This is here for future implementation.
CREATE TABLE dislikes_response (
    user_id INT,
    response_id INT,
    PRIMARY KEY (user_id, response_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE
);

