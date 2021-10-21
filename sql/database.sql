CREATE OR REPLACE SCHEMA inventoryapp;

CREATE TABLE inventoryapp.companies (
	id                   int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	name                 varchar(100)  NOT NULL    ,
	connectwiseid        varchar(50)      ,
	CONSTRAINT unq_name UNIQUE ( name )
 );

ALTER TABLE inventoryapp.companies COMMENT 'Contains a list of client companies';

ALTER TABLE inventoryapp.companies MODIFY id int UNSIGNED NOT NULL  AUTO_INCREMENT COMMENT 'unique ID generated to identify the company';

ALTER TABLE inventoryapp.companies MODIFY name varchar(100)  NOT NULL   COMMENT 'Name of the company';

ALTER TABLE inventoryapp.companies MODIFY connectwiseid varchar(50)     COMMENT 'The company''s company ID inside Connectwise Manage';

CREATE TABLE inventoryapp.companyusers (
	id                   int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	companyid            int UNSIGNED NOT NULL    ,
	first_name           varchar(100)  NOT NULL    ,
	last_name            varchar(100)  NOT NULL    ,
	full_name            varchar(200)      ,
	CONSTRAINT fk_companyusers_companyid FOREIGN KEY ( companyid ) REFERENCES inventoryapp.companies( id ) ON DELETE RESTRICT ON UPDATE CASCADE
 );

CREATE INDEX fk_companyusers_companyid ON inventoryapp.companyusers ( companyid );

ALTER TABLE inventoryapp.companyusers COMMENT 'Employees of clients, used to assign an item to a specific user';

ALTER TABLE inventoryapp.companyusers MODIFY id int UNSIGNED NOT NULL  AUTO_INCREMENT COMMENT 'ID to identify this user (automatically generated)';

ALTER TABLE inventoryapp.companyusers MODIFY companyid int UNSIGNED NOT NULL   COMMENT 'The ID of the company this user belongs to';

ALTER TABLE inventoryapp.companyusers MODIFY first_name varchar(100)  NOT NULL   COMMENT 'The first name of the user';

ALTER TABLE inventoryapp.companyusers MODIFY last_name varchar(100)  NOT NULL   COMMENT 'The last name (surname) of the user';

CREATE TABLE inventoryapp.employees (
	id                   int UNSIGNED NOT NULL    PRIMARY KEY,
	first_name           varchar(50)  NOT NULL    ,
	last_name            varchar(50)  NOT NULL    ,
	full_name            varchar(200)
 );

ALTER TABLE inventoryapp.employees COMMENT 'Used for audit trail';

CREATE TABLE inventoryapp.itemtypes (
	typeid               int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	type_name            varchar(100)  NOT NULL    ,
	CONSTRAINT unq_itemtypes UNIQUE ( type_name )
 );

ALTER TABLE inventoryapp.itemtypes COMMENT 'Allows user definable item types to be marked';

CREATE TABLE inventoryapp.models (
	id                   int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	typeid               int UNSIGNED NOT NULL    ,
	name                 varchar(50)  NOT NULL    ,
	CONSTRAINT fk_models_typeid FOREIGN KEY ( typeid ) REFERENCES inventoryapp.itemtypes( typeid ) ON DELETE RESTRICT ON UPDATE CASCADE
 );

CREATE INDEX fk_models_typeid ON inventoryapp.models ( typeid );

ALTER TABLE inventoryapp.models COMMENT 'Item models';

ALTER TABLE inventoryapp.models MODIFY id int UNSIGNED NOT NULL  AUTO_INCREMENT COMMENT 'Unique ID assigned to the model';

CREATE TABLE inventoryapp.transactiontype (
	id                   int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	name                 varchar(20)  NOT NULL    ,
	CONSTRAINT unq_name UNIQUE ( name )
 );

ALTER TABLE inventoryapp.transactiontype COMMENT 'Defines transaction types, to allow flexible audit typing';

CREATE TABLE inventoryapp.vendors (
	id                   int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	name                 varchar(100)  NOT NULL    ,
	account_number       varchar(50)
 );

ALTER TABLE inventoryapp.vendors COMMENT 'Generates a list of vendors';

ALTER TABLE inventoryapp.vendors MODIFY id int UNSIGNED NOT NULL  AUTO_INCREMENT COMMENT 'Unique ID auto-assigned to the vendor';

ALTER TABLE inventoryapp.vendors MODIFY account_number varchar(50)     COMMENT 'Account number (if applicable) with the vendor';

CREATE TABLE inventoryapp.orders (
	id                   int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	order_number         varchar(30)  NOT NULL    ,
	vendor               int UNSIGNED NOT NULL    ,
	dateordered          datetime  NOT NULL DEFAULT current_timestamp()   ,
	total_cost           double  NOT NULL    ,
	number_of_items      int UNSIGNED     ,
	CONSTRAINT fk_orders_vendor FOREIGN KEY ( vendor ) REFERENCES inventoryapp.vendors( id ) ON DELETE RESTRICT ON UPDATE RESTRICT
 );

CREATE INDEX fk_orders_vendor ON inventoryapp.orders ( vendor );

ALTER TABLE inventoryapp.orders COMMENT 'Orders that have been placed';

ALTER TABLE inventoryapp.orders MODIFY id int UNSIGNED NOT NULL  AUTO_INCREMENT COMMENT 'Unique ID assigned to the order to maintain uniqueness across vendors';

ALTER TABLE inventoryapp.orders MODIFY order_number varchar(30)  NOT NULL   COMMENT 'Order number assigned by the vendor when the order was placed';

ALTER TABLE inventoryapp.orders MODIFY dateordered datetime  NOT NULL DEFAULT current_timestamp()  COMMENT 'Date and time the order was placed';

ALTER TABLE inventoryapp.orders MODIFY total_cost double  NOT NULL   COMMENT 'Order total';

ALTER TABLE inventoryapp.orders MODIFY number_of_items int UNSIGNED    COMMENT 'Amount of items in this order';

CREATE TABLE inventoryapp.items (
	id                   int UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	order_number         int UNSIGNED NOT NULL    ,
	description          longtext      ,
	received             binary(1)  NOT NULL DEFAULT '0'   ,
	checked_out          binary(1)  NOT NULL DEFAULT '0'   ,
	cost                 double UNSIGNED NOT NULL    ,
	price                double UNSIGNED NOT NULL    ,
	serial_number        varchar(50)      ,
	typeid               int UNSIGNED NOT NULL    ,
	model                int UNSIGNED NOT NULL    ,
	CONSTRAINT serial_number UNIQUE ( serial_number ) ,
	CONSTRAINT fk_items_typeid FOREIGN KEY ( typeid ) REFERENCES inventoryapp.itemtypes( typeid ) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_items_model FOREIGN KEY ( model ) REFERENCES inventoryapp.models( id ) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_items_ordernum FOREIGN KEY ( order_number ) REFERENCES inventoryapp.orders( id ) ON DELETE RESTRICT ON UPDATE CASCADE
 );

CREATE INDEX fk_items_model ON inventoryapp.items ( model );

CREATE INDEX fk_items_ordernum ON inventoryapp.items ( order_number );

CREATE INDEX fk_items_typeid ON inventoryapp.items ( typeid );

ALTER TABLE inventoryapp.items COMMENT 'Items in inventory, no matter the state (ordered, received, checked out, invoiced, etc)';

ALTER TABLE inventoryapp.items MODIFY id int UNSIGNED NOT NULL  AUTO_INCREMENT COMMENT 'Unique ID assigned to the item';

ALTER TABLE inventoryapp.items MODIFY cost double UNSIGNED NOT NULL   COMMENT 'Our purchase cost';

ALTER TABLE inventoryapp.items MODIFY price double UNSIGNED NOT NULL   COMMENT 'Price we are charing for it';

CREATE TABLE inventoryapp.inventorytransaction (
	id                   bigint UNSIGNED NOT NULL  AUTO_INCREMENT  PRIMARY KEY,
	`type`               int UNSIGNED NOT NULL    ,
	`date`               datetime  NOT NULL    ,
	itemid               int UNSIGNED NOT NULL    ,
	companyid            int UNSIGNED     ,
	`companyUser`        int UNSIGNED     ,
	`doneBy`             int UNSIGNED NOT NULL    ,
	CONSTRAINT fk_transaction_company FOREIGN KEY ( companyid ) REFERENCES inventoryapp.companies( id ) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_transaction_user FOREIGN KEY ( `companyUser` ) REFERENCES inventoryapp.companyusers( id ) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_transaction_employee FOREIGN KEY ( `doneBy` ) REFERENCES inventoryapp.employees( id ) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_transaction_item FOREIGN KEY ( itemid ) REFERENCES inventoryapp.items( id ) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_transaction_type FOREIGN KEY ( `type` ) REFERENCES inventoryapp.transactiontype( id ) ON DELETE RESTRICT ON UPDATE RESTRICT
 );

CREATE INDEX fk_transaction_company ON inventoryapp.inventorytransaction ( companyid );

CREATE INDEX fk_transaction_employee ON inventoryapp.inventorytransaction ( `doneBy` );

CREATE INDEX fk_transaction_item ON inventoryapp.inventorytransaction ( itemid );

CREATE INDEX fk_transaction_type ON inventoryapp.inventorytransaction ( `type` );

CREATE INDEX fk_transaction_user ON inventoryapp.inventorytransaction ( `companyUser` );

ALTER TABLE inventoryapp.inventorytransaction COMMENT 'Used as an audit trail of transactions carried out in the database';

ALTER TABLE inventoryapp.inventorytransaction MODIFY id bigint UNSIGNED NOT NULL  AUTO_INCREMENT COMMENT 'Unique ID of the transaction';

ALTER TABLE inventoryapp.inventorytransaction MODIFY `type` int UNSIGNED NOT NULL   COMMENT 'Transaction Type';

ALTER TABLE inventoryapp.inventorytransaction MODIFY `date` datetime  NOT NULL   COMMENT 'Date and Time of the action performed';

ALTER TABLE inventoryapp.inventorytransaction MODIFY companyid int UNSIGNED    COMMENT 'Company the item was assigned to, if applicable';

ALTER TABLE inventoryapp.inventorytransaction MODIFY `companyUser` int UNSIGNED    COMMENT 'Companyuser the item was assigned to, if applicable';

ALTER TABLE inventoryapp.inventorytransaction MODIFY `doneBy` int UNSIGNED NOT NULL   COMMENT 'The employee that performed the action';

CREATE  PROCEDURE `AddCompany`(company_name VARCHAR(100), connectwise_id VARCHAR(50))
BEGIN
	IF connectwise_id IS NULL THEN
		INSERT INTO companies(name) VALUES(company_name);
	ELSE
		INSERT INTO companies(name,connectwiseid) VALUES(company_name, connectwise_id);
	END IF;
END

CREATE  PROCEDURE `AddCompanyUser`(
	company_id INT,
	firstname VARCHAR(100),
 	lastname VARCHAR(100)
)
BEGIN
	INSERT INTO companyusers(companyid,first_name,last_name) VALUES(company_id,firstname,lastname);
END

CREATE  PROCEDURE `AddItem`(
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
END

CREATE  PROCEDURE `AddItemType`(
	tName VARCHAR(100)
)
BEGIN
	INSERT INTO itemtypes(type_name) VALUES(tName);
END

CREATE  PROCEDURE `AddModel`(
	tID INT,
	mName VARCHAR(50)
)
BEGIN
	INSERT INTO models(typeid,name) VALUES(tID,mName);
END

CREATE  PROCEDURE `AddOrder`(
	oNumber VARCHAR(30),
	oVendor INT,
	oDate datetime,
	oCost DOUBLE
)
BEGIN
	INSERT INTO orders(order_number,vendor,dateordered,total_cost,number_of_items) VALUES(oNumber,oVendor,oDate,oCost,0);
END

CREATE  PROCEDURE `AddVendor`(vendor_name VARCHAR(100), account_number VARCHAR(50))
BEGIN
	IF account_number IS NULL THEN
		INSERT INTO vendors(name) VALUES(vendor_name);
	ELSE
		INSERT INTO vendors(name,account_number) VALUES(vendor_name, account_number);
	END IF;
END

CREATE  PROCEDURE `CheckOrder`(
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
END

CREATE  PROCEDURE `CreateTransactionType`(
	tName VARCHAR(20)
)
BEGIN
	INSERT INTO transactiontype(name) VALUES(tname);
END
