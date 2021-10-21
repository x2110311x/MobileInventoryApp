DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE AddOrder(
	oNumber VARCHAR(30),
	oVendor INT,
	oDate datetime,
	oCost DOUBLE,
	oItemCount INT
)
BEGIN
	IF oItemCount IS NULL THEN
		INSERT INTO orders(order_number,vendor,dateordered,total_cost) VALUES(oNumber,oVendor,oDate,oCost);
	ELSE
		INSERT INTO orders(order_number,vendor,dateordered,total_cost,number_of_items) VALUES(oNumber,oVendor,oDate,oCost,oItemCount);

END $$
DELIMITER ;