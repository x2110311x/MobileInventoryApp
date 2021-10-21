DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE CreateTransactionType(
	tName VARCHAR(20)
)
BEGIN
	INSERT INTO transactiontype(name) VALUES(tname);
END $$
DELIMITER ;