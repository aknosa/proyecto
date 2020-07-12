CREATE DATABASE IF NOT EXISTS book_exchange;

USE book_exchange;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    registration_date DATETIME NOT NULL,
    password TINYTEXT NOT NULL,
    role ENUM('normal', 'admin') DEFAULT 'normal' NOT NULL,
    name VARCHAR(200),
    birthdate DATE,
    email VARCHAR(200),
    phone_number VARCHAR(15),
    location VARCHAR(200),
    image TINYTEXT,
	active BOOLEAN DEFAULT false,
    registration_code TINYTEXT,
	password_update_code TINYTEXT,
	last_auth_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creation_date DATETIME,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS books (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    availability BOOLEAN DEFAULT TRUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    synopsis TEXT,
    author_biography TEXT,
    image TINYTEXT,
	creation_date DATETIME,
    update_date DATETIME,
    book_owner_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (book_owner_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS exchanges (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    place VARCHAR(200),
    date DATETIME,
    exchange_status ENUM('In process', 'Accepted', 'Rejected'),
    preorder_code INT UNSIGNED UNIQUE,
    offered_book_user_rating ENUM('1','2','3','4','5'),
    wanted_book_user_rating ENUM('1','2','3','4','5'),
    offered_book_user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (offered_book_user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    offered_book_id INT UNSIGNED,
    FOREIGN KEY (offered_book_id) REFERENCES books (id) ON DELETE CASCADE ON UPDATE CASCADE,
    wanted_book_user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (wanted_book_user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    wanted_book_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (wanted_book_id) REFERENCES books (id) ON DELETE CASCADE ON UPDATE CASCADE,
	creation_date DATETIME,
    update_date DATETIME
);

SET FOREIGN_KEY_CHECKS = 1;