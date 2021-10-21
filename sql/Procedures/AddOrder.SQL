DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE AddOrder(
	oNumber VARCHAR(30),
	oVendor INT,
	oDate datetime,
	oCost DOUBLE
)
BEGIN
	INSERT INTO orders(order_number,vendor,dateordered,total_cost,number_of_items) VALUES(oNumber,oVendor,oDate,oCost,0);
END $$
DELIMITER ;