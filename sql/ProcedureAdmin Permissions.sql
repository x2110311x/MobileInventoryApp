CREATE USER 'procadmin'@'localhost' IDENTIFIED BY <password>
GRANT SELECT, INSERT, UPDATE, DELETE on inventoryapp.* to 'procadmin'@'localhost';
GRANT ALTER ROUTINE, CREATE ROUTINE, EXECUTE ON *.* to 'procadmin'@'localhost';
ALTER USER 'procadmin'@'localhost' ACCOUNT LOCK;
FLUSH PRIVILEGES;