CREATE TABLE `companies` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'unique ID generated to identify the company',
  `name` varchar(100) NOT NULL COMMENT 'Name of the company',
  `connectwiseid` varchar(50) DEFAULT NULL COMMENT 'The company''s company ID inside Connectwise Manage',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Contains a list of client companies';


CREATE TABLE `companyusers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID to identify this user (automatically generated)',
  `companyid` int(10) unsigned NOT NULL COMMENT 'The ID of the company this user belongs to',
  `first_name` varchar(100) NOT NULL COMMENT 'The first name of the user',
  `last_name` varchar(100) NOT NULL COMMENT 'The last name (surname) of the user',
  `full_name` varchar(200) GENERATED ALWAYS AS (concat(`first_name`,' ',`last_name`)) VIRTUAL,
  PRIMARY KEY (`id`),
  KEY `fk_companyusers_companyid` (`companyid`),
  CONSTRAINT `fk_companyusers_companyid` FOREIGN KEY (`companyid`) REFERENCES `companies` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Employees of clients, used to assign an item to a specific user';


CREATE TABLE `employees` (
  `id` int(10) unsigned NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `full_name` varchar(200) GENERATED ALWAYS AS (concat(`first_name`,' ',`last_name`)) VIRTUAL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Used for audit trail';


CREATE TABLE `inventorytransaction` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID of the transaction',
  `type` int(10) unsigned NOT NULL COMMENT 'Transaction Type',
  `date` datetime NOT NULL COMMENT 'Date and Time of the action performed',
  `itemid` int(10) unsigned NOT NULL,
  `companyid` int(10) unsigned DEFAULT NULL COMMENT 'Company the item was assigned to, if applicable',
  `companyUser` int(10) unsigned DEFAULT NULL COMMENT 'Companyuser the item was assigned to, if applicable',
  `doneBy` int(10) unsigned NOT NULL COMMENT 'The employee that performed the action',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_transaction_company` (`companyid`),
  KEY `fk_transaction_user` (`companyUser`),
  KEY `fk_transaction_item` (`itemid`),
  KEY `fk_transaction_employee` (`doneBy`),
  KEY `fk_transaction_type` (`type`),
  CONSTRAINT `fk_transaction_company` FOREIGN KEY (`companyid`) REFERENCES `companies` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_employee` FOREIGN KEY (`doneBy`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_item` FOREIGN KEY (`itemid`) REFERENCES `items` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaction_type` FOREIGN KEY (`type`) REFERENCES `transactiontype` (`id`),
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`companyUser`) REFERENCES `companyusers` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Used as an audit trail of transactions carried out in the database';


CREATE TABLE `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID assigned to the item',
  `order_number` int(10) unsigned NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `received` binary(1) NOT NULL DEFAULT '0',
  `checked_out` binary(1) NOT NULL DEFAULT '0',
  `cost` double unsigned NOT NULL COMMENT 'Our purchase cost',
  `price` double unsigned NOT NULL COMMENT 'Price we are charing for it',
  `serial_number` varchar(50) DEFAULT NULL,
  `typeid` int(10) unsigned NOT NULL,
  `model` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `fk_items_ordernum` (`order_number`),
  KEY `fk_items_typeid` (`typeid`),
  KEY `fk_items_model` (`model`),
  CONSTRAINT `fk_items_model` FOREIGN KEY (`model`) REFERENCES `models` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_items_ordernum` FOREIGN KEY (`order_number`) REFERENCES `orders` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_items_typeid` FOREIGN KEY (`typeid`) REFERENCES `itemtypes` (`typeid`) ON UPDATE CASCADE,
  CONSTRAINT `cns_items_costprice` CHECK (`cost` < `price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Items in inventory, no matter the state (ordered, received, checked out, invoiced, etc)';


CREATE TABLE `itemtypes` (
  `typeid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`typeid`),
  UNIQUE KEY `unq_itemtypes` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Allows user definable item types to be marked';


CREATE TABLE `models` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID assigned to the model',
  `typeid` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_models_typeid` (`typeid`),
  CONSTRAINT `fk_models_typeid` FOREIGN KEY (`typeid`) REFERENCES `itemtypes` (`typeid`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Item models';


CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID assigned to the order to maintain uniqueness across vendors',
  `order_number` varchar(30) NOT NULL COMMENT 'Order number assigned by the vendor when the order was placed',
  `vendor` int(10) unsigned NOT NULL,
  `dateordered` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Date and time the order was placed',
  `total_cost` double NOT NULL COMMENT 'Order total',
  `number_of_items` int(10) unsigned DEFAULT NULL COMMENT 'Amount of items in this order',
  PRIMARY KEY (`id`),
  KEY `fk_orders_vendor` (`vendor`),
  CONSTRAINT `fk_orders_vendor` FOREIGN KEY (`vendor`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Orders that have been placed';


CREATE TABLE `transactiontype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `unq_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Defines transaction types, to allow flexible audit typing';


CREATE TABLE `vendors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique ID auto-assigned to the vendor',
  `name` varchar(100) NOT NULL,
  `account_number` varchar(50) DEFAULT NULL COMMENT 'Account number (if applicable) with the vendor',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Generates a list of vendors';

