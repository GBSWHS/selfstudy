CREATE DATABASE selfstudy;
CREATE USER 'selfstudy'@'localhost' IDENTIFIED BY 'selfstudy1234!';
GRANT ALL PRIVILEGES ON selfstudy.* TO 'selfstudy'@'localhost';
FLUSH PRIVILEGES;

use selfstudy;
CREATE TABLE zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  floor INT NOT NULL,
  disabled BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE location (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  grade INT NOT NULL,
  class INT NOT NULL,
  `number` INT NOT NULL,
  zoneid INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  FOREIGN KEY (zoneid) REFERENCES zones(id)
);
