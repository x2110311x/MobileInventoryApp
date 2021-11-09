--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'unique ID generated to identify the company',
  `name` varchar(100) NOT NULL COMMENT 'Name of the company',
  `connectwiseid` varchar(50) DEFAULT NULL COMMENT 'The company''s company ID inside Connectwise Manage',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='Contains a list of client companies';

--
-- Table structure for table `companyusers`
--

DROP TABLE IF EXISTS `companyusers`;
CREATE TABLE `companyusers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID to identify this user (automatically generated)',
  `companyid` int(10) unsigned NOT NULL COMMENT 'The ID of the company this user belongs to',
  `first_name` varchar(100) NOT NULL COMMENT 'The first name of the user',
  `last_name` varchar(100) NOT NULL COMMENT 'The last name (surname) of the user',
  `full_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_companyusers_companyid` (`companyid`),
  CONSTRAINT `fk_companyusers_companyid` FOREIGN KEY (`companyid`) REFERENCES `companies` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Employees of clients, used to assign an item to a specific user';

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int(10) unsigned NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Used for audit trail';

--
-- Table structure for table `inventorytransaction`
--

DROP TABLE IF EXISTS `inventorytransaction`;
CREATE TABLE `inventorytransaction` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID of the transaction',
  `type` int(10) unsigned NOT NULL COMMENT 'Transaction Type',
  `date` datetime NOT NULL COMMENT 'Date and Time of the action performed',
  `itemid` int(10) unsigned NOT NULL,
  `companyid` int(10) unsigned DEFAULT NULL COMMENT 'Company the item was assigned to, if applicable',
  `companyUser` int(10) unsigned DEFAULT NULL COMMENT 'Companyuser the item was assigned to, if applicable',
  `doneBy` int(10) unsigned NOT NULL COMMENT 'The employee that performed the action',
  PRIMARY KEY (`id`),
  KEY `fk_transaction_company` (`companyid`),
  KEY `fk_transaction_employee` (`doneBy`),
  KEY `fk_transaction_item` (`itemid`),
  KEY `fk_transaction_type` (`type`),
  KEY `fk_transaction_user` (`companyUser`),
  CONSTRAINT `fk_transaction_company` FOREIGN KEY (`companyid`) REFERENCES `companies` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_employee` FOREIGN KEY (`doneBy`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_item` FOREIGN KEY (`itemid`) REFERENCES `items` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_type` FOREIGN KEY (`type`) REFERENCES `transactiontype` (`id`),
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`companyUser`) REFERENCES `companyusers` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Used as an audit trail of transactions carried out in the database';

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID assigned to the item',
  `order_number` int(10) unsigned NOT NULL,
  `description` longtext DEFAULT NULL,
  `received` binary(1) NOT NULL DEFAULT '0',
  `checked_out` binary(1) NOT NULL DEFAULT '0',
  `cost` double unsigned NOT NULL COMMENT 'Our purchase cost',
  `price` double unsigned NOT NULL COMMENT 'Price we are charing for it',
  `serial_number` varchar(50) DEFAULT NULL,
  `typeid` int(10) unsigned NOT NULL,
  `model` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `fk_items_model` (`model`),
  KEY `fk_items_ordernum` (`order_number`),
  KEY `fk_items_typeid` (`typeid`),
  CONSTRAINT `fk_items_model` FOREIGN KEY (`model`) REFERENCES `models` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_items_ordernum` FOREIGN KEY (`order_number`) REFERENCES `orders` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_items_typeid` FOREIGN KEY (`typeid`) REFERENCES `itemtypes` (`typeid`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Items in inventory, no matter the state (ordered, received, checked out, invoiced, etc)';

--
-- Table structure for table `itemtypes`
--

DROP TABLE IF EXISTS `itemtypes`;
CREATE TABLE `itemtypes` (
  `typeid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`typeid`),
  UNIQUE KEY `unq_itemtypes` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Allows user definable item types to be marked';

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
CREATE TABLE `models` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID assigned to the model',
  `typeid` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_models_typeid` (`typeid`),
  CONSTRAINT `fk_models_typeid` FOREIGN KEY (`typeid`) REFERENCES `itemtypes` (`typeid`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Item models';

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID assigned to the order to maintain uniqueness across vendors',
  `order_number` varchar(30) NOT NULL COMMENT 'Order number assigned by the vendor when the order was placed',
  `vendor` int(10) unsigned NOT NULL,
  `dateordered` date NOT NULL COMMENT 'Date and time the order was placed',
  `total_cost` double NOT NULL COMMENT 'Order total',
  `number_of_items` int(10) unsigned DEFAULT NULL COMMENT 'Amount of items in this order',
  PRIMARY KEY (`id`),
  KEY `fk_orders_vendor` (`vendor`),
  CONSTRAINT `fk_orders_vendor` FOREIGN KEY (`vendor`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Orders that have been placed';

--
-- Table structure for table `transactiontype`
--

DROP TABLE IF EXISTS `transactiontype`;
CREATE TABLE `transactiontype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Defines transaction types, to allow flexible audit typing';

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID auto-assigned to the vendor',
  `name` varchar(100) NOT NULL,
  `account_number` varchar(50) DEFAULT NULL COMMENT 'Account number (if applicable) with the vendor',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Generates a list of vendors'; 

DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `AddCompany`(company_name VARCHAR(100), connectwise_id VARCHAR(50))
BEGIN
	IF connectwise_id IS NULL THEN
		INSERT INTO companies(name) VALUES(company_name);
	ELSE
		INSERT INTO companies(name,connectwiseid) VALUES(company_name, connectwise_id);
	END IF;
END ;;
DELIMITER ;
 

 
DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `AddCompanyUser`(
	company_id INT,
	firstname VARCHAR(100),
 	lastname VARCHAR(100)
)
BEGIN
	INSERT INTO companyusers(companyid,first_name,last_name) VALUES(company_id,firstname,lastname);
END ;;
DELIMITER ;
 

 
DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `AddItem`(
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
END ;;
DELIMITER ;
 

 
DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `AddModel`(
	tID INT,
	mName VARCHAR(50)
)
BEGIN
	INSERT INTO models(typeid,name) VALUES(tID,mName);
END ;;
DELIMITER ;
 

 
DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `AddOrder`(
	oNumber VARCHAR(30),
	oVendor INT,
	oDate DATE,
	oCost DOUBLE
)
BEGIN
	INSERT INTO orders(order_number,vendor,dateordered,total_cost,number_of_items) VALUES(oNumber,oVendor,oDate,oCost,0);
END ;;
DELIMITER ;
 

 
DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `AddVendor`(vendor_name VARCHAR(100), account_number VARCHAR(50))
BEGIN
	IF account_number IS NULL THEN
		INSERT INTO vendors(name) VALUES(vendor_name);
	ELSE
		INSERT INTO vendors(name,account_number) VALUES(vendor_name, account_number);
	END IF;
END ;;
DELIMITER ;
 
 
DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `CheckOrder`(
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
END ;;
DELIMITER ;
  
DELIMITER ;;
CREATE DEFINER=`procadmin`@`localhost` PROCEDURE `CreateTransactionType`(
	tName VARCHAR(20)
)
BEGIN
	INSERT INTO transactiontype(name) VALUES(tname);
END ;;
DELIMITER ;
