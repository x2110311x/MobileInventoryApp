DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE AddModel(
	tID INT,
	mName VARCHAR(50)
)
BEGIN
	INSERT INTO models(typeid,name) VALUES(tID,mName);
END $$
DELIMITER ;