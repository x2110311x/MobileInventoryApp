DELIMITER $$
CREATE OR REPLACE DEFINER='procadmin'@'localhost' PROCEDURE CheckOrder(
	IN oID INT,
	OUT validity BINARY,
	OUT msg VARCHAR(50)
)
BEGIN
	SELECT count(id) INTO @itemCount FROM items WHERE order_number = oID;
	SELECT number_of_items INTO @recordedItemCount FROM orders WHERE order_number = oID;
	SELECT total_cost INTO @totalCost FROM orders WHERE id = oID;
	SELECT SUM(cost) INTO @recordedCost FROM items WHERE order_number = oID;
	IF @recordedItemCount != @itemCount THEN
		SET validity = 0;
		SET msg = 'Item count does not match recorded items';
	ELSEIF @totalCost != @recordedCost THEN
		SET validity = 0;
		SET msg = 'Total item cost does not match order cost';
	ELSE
		SET validity = 0;
		SET msg = 'Order Valid';
	END IF;
END $$
DELIMITER ;