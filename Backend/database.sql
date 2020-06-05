DROP DATABASE iF EXISTS DB_Monitor;
CREATE DATABASE IF NOT EXISTS DB_Monitor;
USE DB_Monitor;

CREATE TABLE roles(
    id INT NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE users(
    id INT NOT NULL auto_increment,
    role_id INT NOT NULL,
    email VARCHAR(50) NOT NULL ,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    PRIMARY KEY(id),
    UNIQUE(email),
    CONSTRAINT fk_user_role FOREIGN KEY(role_id) REFERENCES roles(id)
)ENGINE=InnoDb;

CREATE TABLE states(
    id INT NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE categories(
    id INT NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    icon TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE complaints(
    id INT NOT NULL auto_increment,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    state_id INT NOT NULL,
    original_id INT DEFAULT NULL,
    description VARCHAR(240) NOT NULL,
    image LONGBLOB DEFAULT NULL,
    address VARCHAR(150) DEFAULT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_complaint_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_complaint_category FOREIGN KEY(category_id) REFERENCES categories(id),
    CONSTRAINT fk_complaint_state FOREIGN KEY(state_id) REFERENCES states(id),
    CONSTRAINT fk_complaint_original FOREIGN KEY(original_id) REFERENCES complaints(id)
)ENGINE=InnoDb;

INSERT INTO roles (id, name) VALUES (NULL, 'Administrador');
INSERT INTO roles (id, name) VALUES (NULL, 'Usuario');

INSERT INTO states (id, name) VALUES (NULL, 'Actual');
INSERT INTO states (id, name) VALUES (NULL, 'No resuelta');
INSERT INTO states (id, name) VALUES (NULL, 'Resuelta');

INSERT INTO categories (id, name,icon) VALUES (NULL, 'Basura','http://monitor.consejociudadanobc.org/images/trash.png');
INSERT INTO categories (id, name,icon) VALUES (NULL, 'Alumbrado','http://monitor.consejociudadanobc.org/images/lamp.png');
INSERT INTO categories (id, name,icon) VALUES (NULL, 'Fugas','http://monitor.consejociudadanobc.org/images/drop.png');
INSERT INTO categories (id, name,icon) VALUES (NULL, 'Obras',NULL);
INSERT INTO categories (id, name,icon) VALUES (NULL, 'Seguridad',NULL);

