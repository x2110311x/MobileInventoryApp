DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE AddCompany(company_name VARCHAR(100), connectwise_id VARCHAR(50))
BEGIN
	IF connectwise_id IS NULL THEN
		INSERT INTO companies(name) VALUES(company_name);
	ELSE
		INSERT INTO companies(name,connectwiseid) VALUES(company_name, connectwise_id);
	END IF;
END $$
DELIMITER ;