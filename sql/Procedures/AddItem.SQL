DELIMITER ;;
CREATE OR REPLACE DEFINER=`procadmin`@`localhost` PROCEDURE `addItem`(
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
		INSERT INTO items(order_number,description,cost,price,typeid,model,received,checked_out) VALUES(oNumber,iDesc,iCost,iPrice,iTypeID,iModel,0,0);
		UPDATE orders SET number_of_items = number_of_items + 1;
	COMMIT;
END;;
DELIMITER ;