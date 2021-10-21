DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE AddItem(
	oNumber VARCHAR(30),
	iDesc JSON,
	iCost DOUBLE,
	iPrice DOUBLE,
	iTypeID INT,
	iModel INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		ROLLBACK;
	START TRANSACTION;
		INSERT INTO items(order_number,description,cost,price,typeid,model) VALUES(oNumber,iDesc,iCost,iPrice,iTypeID,iModel);
		UPDATE orders SET number_of_items = number_of_items + 1;
	COMMIT;
END $$
DELIMITER ;