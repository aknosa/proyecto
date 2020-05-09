CREATE DATABASE IF NOT EXISTS book_exchange;

USE book_exchange;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    name VARCHAR(50),
    birthdate DATE,
    email VARCHAR(50),
    phone_number VARCHAR(15),
    location VARCHAR(50),
    creation_date DATETIME,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS books (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    author VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    synopsis VARCHAR(200),
    author_biography VARCHAR(200),
	creation_date DATETIME,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS exchanges (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    place VARCHAR(50),
    date DATETIME,
    exchange_status ENUM('In process', 'Accepted', 'Rejected'),
    preorder_code INT UNSIGNED UNIQUE,
    rating ENUM('1','2','3','4','5'),
    user_1_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_1_id) REFERENCES users (id),
    book_1_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (book_1_id) REFERENCES books (id),
    user_2_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_2_id) REFERENCES users (id),
    book_2_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (book_2_id) REFERENCES books (id),
	creation_date DATETIME,
    update_date DATETIME
);