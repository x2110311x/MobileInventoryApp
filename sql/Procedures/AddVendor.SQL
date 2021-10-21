DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE AddVendor(vendor_name VARCHAR(100), account_number VARCHAR(50))
BEGIN
	IF account_number IS NULL THEN
		INSERT INTO vendors(name) VALUES(vendor_name);
	ELSE
		INSERT INTO vendors(name,account_number) VALUES(vendor_name, account_number);
	END IF;
END $$
DELIMITER ;