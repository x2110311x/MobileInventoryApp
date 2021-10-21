DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE AddCompanyUser(
	company_id INT,
	firstname VARCHAR(100),
 	lastname VARCHAR(100)
)
BEGIN
	INSERT INTO companyusers(companyid,first_name,last_name) VALUES(company_id,firstname,lastname);
END $$
DELIMITER ;