
create database if not exists test23;
use test23;
DELIMITER $$

/*procedures */

/* on ccdetails */
CREATE DEFINER=`root`@`localhost` PROCEDURE `check_cc` (IN `date` DATE)  NO SQL
BEGIN
    IF date<sysdate() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'invalid date!';
    END IF;

END$$

/* on customer */
 CREATE DEFINER=`root`@`localhost` PROCEDURE `check_nic` (IN `nic` VARCHAR(10))  NO SQL
BEGIN
    IF char_length(nic)!=10 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on cutomers.nic failed';
    END IF;

END$$

/* on customer */
 CREATE DEFINER=`root`@`localhost` PROCEDURE `check_pn` (IN `pn` VARCHAR(12))  NO SQL
BEGIN
    IF pn!=12 or SUBSTRING(pn,1,1)!="+" THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'invalid Phone number';
    END IF;

END$$

/* on customer */
 CREATE DEFINER=`root`@`localhost` PROCEDURE `check_price` (IN `totalPrice` FLOAT)  NO SQL
BEGIN
    IF totalPrice<0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on cart.totalPrice failed';
    END IF;

END$$

/* on customer */
 CREATE DEFINER=`root`@`localhost` PROCEDURE `check_product` (IN `value` FLOAT, IN `value2` FLOAT)  NO SQL
BEGIN
    IF value<0 or value2<0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on cannot ne negative';
    END IF;

END$$
 DELIMITER ;



/* tables */

create table if not exists cutomers(
	customerId varchar(20),
	first_name varchar(20) not null,
	last_name varchar(20) ,
	nic varchar(10) not null unique ,
	birthday date,
	email varchar(65) not null,
	streetNumber varchar(25),
	streetName varchar(100),
	aptName varchar(25),
	city varchar(25),
	state varchar(25),
	country varchar(25) not null,
	zip varchar(6),
	primary key(customerId)
);


create table if not exists phoneNumbers(
	customerId varchar(20),
	phoneNumber varchar(10),
	primary key(customerId,phoneNumber),
	foreign key (customerId) references cutomers(customerId)
    on update cascade on delete cascade
);

CREATE TABLE `maincategory` (
  `MainCatId` varchar(25) NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
    primary key(MainCatId)

);

create  table if not exists Admin(
  adminId varchar(255) ,
  firstname  varchar(255) not null,
  lastname varchar(255) ,
  telephone int(10) not null ,
  email varchar(255) not null,
  primary key(adminId)
);

create table if not exists Guest_customer(
   guestId varchar(255),
   guestCartId varchar(255),
   toatlPrice numeric(8,2),
   primary key(guestId,guestcartId)
  

);


create table if not exists courier (
   courierId varchar(40),
   telephoneNo int(11),
   firstname varchar(255),
   lastname varchar(255),
   country varchar(200),
   primary key(courierId)
   
);

create table if not exists Log_in(
	username varchar(255),
	customerId varchar(255) unique,
	password varchar(100),
	primary key (username),
	foreign key (customerId) references cutomers(customerId)
);


create table if not exists Log_in_admin(
	username varchar(255),
	adminID varchar(255) unique,
	password varchar(255),
	foreign key(adminId) references  Admin(adminID);
	
);

create table if not exists Log_in_courier(
    username varchar(255),
	courierId varchar(255) unique,
	password varchar(255),
	foreign key(courierId) references Courier(courierId)

);


DELIMITER $$
create trigger before_log_in_admin_insert
       BEFORE INSERT ON log_in_admin
       FOR EACH ROW
       BEGIN
	    IF char_length(new.password)<8 THEN
           SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'password length must be greater than 8 charactors!';
		ELSE
         SET NEW.password= SHA1(NEW.password);
		END IF;
         
      END 
       $$
 DELIMITER;



DELIMITER $$
create trigger before_log_in_insert
       BEFORE INSERT ON log_in
       FOR EACH ROW
       BEGIN
	    IF char_length(new.password)<8 THEN
           SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'password length must be greater than 8 charactors!';
		ELSE
         SET NEW.password= SHA1(NEW.password);
		END IF;
         
      END 
       $$
 DELIMITER;

 DELIMITER $$
create trigger before_log_in_courier
       BEFORE INSERT ON log_in_courier
       FOR EACH ROW
       BEGIN
	    IF char_length(new.password)<8 THEN
           SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'password length must be greater than 8 charactors!';
		ELSE
         SET NEW.password= SHA1(NEW.password);
		END IF;
         
      END 
       $$
 DELIMITER;

 /* admin authentication function*/
DELIMITER $$
create function checkLogin_admin(password varchar(40),username varchar(40))
returns boolean deterministic
begin
   IF(select  count(*) from log_in_admin where log_in_admin.password= sha1(password) and log_in_admin.username=username) THEN
      return TRUE;
   ELSE
     return FALSE;
   END IF;
end
$$
DELIMITER ;
 

/*courier authentication function*/
DELIMITER $$
create function checkLogin_courier(password varchar(40),username varchar(40))
returns boolean deterministic
begin
   IF(select  count(*) from log_in_courier where log_in_courier.password= sha1(password) and log_in_courier.username=username) THEN
      return TRUE;
   ELSE
     return FALSE;
   END IF;
end
$$
DELIMITER ;



 
 





create table if not exists orders (
	orderId varchar(20),
	customerId varchar(20) ,
	deliveredDate DateTime ,
	deliverAddress varchar(255) not null,
	deliverStatus varchar(25),
    orderedDate Date,
	totalPrice numeric(10,2),
	courierId  varchar(40),
	primary key(orderId),
	foreign key (customerId) references cutomers(customerId),
	foreign key (curiorId) references courier(courierId)
);



create table if not exists category(
	categoryId varchar(20),
	name varchar(30) not null,
	`MainCatId` varchar(25) NOT NULL,
	`link` varchar(300) NOT NULL,
	primary key(categoryId),
    FOREIGN key (MainCatId) REFERENCES maincategory(MainCatId)
);

/*product table*/
create table if not exists Product(
	productId varchar(20),
	title varchar(255) not null,
	weight float not null,
	SKU varchar(100) not null,
	description varchar(1000) not null,
	price numeric(8,2) not null,
    categoryId varchar(20),
    link varchar(300),
    brandname varchar(25),
	primary key(productId),
    FOREIGN key (categoryId) REFERENCES category(categoryId)
);




create table if not exists Cart(
	cartId varchar(20),
	totalPrice numeric(8,2) default 0,
	customerId varchar(20) unique,
	primary key(cartId),
	foreign key(customerId) references cutomers(customerId)
	on update cascade on delete cascade
);






 





create table if not exists guest_Cart_items(
    guestId varchar(255),
	productID varchar(255),
	quantity int(3),
	unitPrice float(10),
    primary key(guestId,productId),
    foreign key(guestId) references guest_customer(guestId),
    foreign key(productId) references product(productId)
);

create table if not exists Cart_Items(
	cartId varchar(20),
	productId varchar(20),
	quantity int,
	primary key(cartId,productId),
	foreign key (cartId) references Cart(cartId),
	foreign key (productId) references Product(productId)
);


create table if not exists Order_items(
	orderId varchar(20),
	productId varchar(20),
	quantity int,
	price float,
	primary key(orderId,productId),
	foreign key (orderId) references orders(orderId),
	foreign key (productId) references Product(productId)
);


create table if not exists VariantTypes(
	vTypeId varchar(20),
	variant varchar(30),
	primary key (vTypeId)
);


create table if not exists productVarient(
  productId varchar(20),
  varientValue varchar(20),
  vTypeId varchar(20),
  primary key(varientValue,productId),
  foreign key(vTypeId) references VariantTypes(vTypeId),
  Foreign key(productId) references Product(ProductId)
);

create table if not exists WearHouse(
	wearHouseId varchar(20),
	country varchar(30) not null,
	state varchar(30) not null,
	primary key (wearHouseId)
);

create table if not exists Inventory(
	productId varchar(20) ,
	wearHouseId varchar(20),
	quantity int,
	primary key(productId,wearHouseId),
	foreign key (productId) references product(productId),
	foreign key (wearHouseId) references WearHouse(wearHouseId)
);


create table if not exists Payment(
	paymentId varchar(20),
	orderId varchar(20),
	primary key(paymentId),
	foreign key (orderId) references orders(orderId)
);


create table if not exists OnDeliveryPayment(
	paymentId varchar(40) not null,
	paymentStatus boolean,
	primary key (paymentID,courierId),
	foreign key (paymentId) references payment(paymentId),
	foreign key(courierId)  references courior(courierId)
);

create table if not exists CCdetails(
	cardId varchar(20),
	customerId varchar(20),
	CCNumber varchar(20) not null,
	cvv decimal(3,0) not null,
	expiredate date not null,
	billingAddress varchar(200) ,
	primary key(cardId),
	foreign key (customerId) references cutomers(customerId)
);

create table if not exists Telephone(
	customerId varchar(255),
	MobileNumber(255) not null,
	primary key(customerId,MobileNumber),
	foreign key (customerId) references cutomers(customerId)
);


create table if not exists CCPayment(
	paymentId varchar(25),
	cardId varchar(20),
	primary key(paymentId,cardId),
	foreign key (paymentId) references payment(paymentId),
	foreign key (cardId) references CCdetails(cardId)
);

create table if not exists known_city(
    cityId varchar(255),
	city   varchar(255) not null,
	primary key(cityId)
);



/*trigers*/

DELIMITER $$
CREATE TRIGGER `check_cc` BEFORE INSERT ON `ccdetails` FOR EACH ROW CALL check_cc(new.expiredate)
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `check_quntity` BEFORE INSERT ON `inventory` FOR EACH ROW call check_price(new.quantity)
$$
DELIMITER ;

DELIMITER $$
create trigger update_price_on_cart
       BEFORE INSERT ON cart_items
       FOR EACH ROW
       BEGIN

		   select price into @unitprice from product where productId=new.productId;
		   set new.Unitprice= @unitprice;
		   set new.quantity=1;
		   UPDATE Cart set totalPrice=totalPrice+new.unitPrice*new.quantity where cart.cartid=new.cartid;
		 END IF;
       END 
       $$
 DELIMITER;

 DELIMITER $$
create trigger after_insert_order_items
       AFTER INSERT ON order_items
       FOR EACH ROW
       BEGIN 
	     select cartId into @cartId from cart where customerId in (select customerId from orders where orderId=new.orderId);
	     delete from cart_items  where cartId=@cartId and productId=new.productId;
       END 
       $$
 DELIMITER;



DELIMITER $$
create trigger before_insert_order_items
       BEFORE INSERT ON order_items
       FOR EACH ROW
       BEGIN
	     IF(new.quantity<=0) THEN
	        	SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid quantity for an product';
		 ELSE
		   select price into @price from prouct where productId=new.productId;
		   set new.price=@price*quantity;
		 END IF;
       END 
       $$
 DELIMITER;

/*after deletion of guest cart*/

 DELIMITER $$
create trigger update_guest__price_after_delete
       After delete ON guest_cart_items
       FOR EACH ROW
       BEGIN
	       UPDATE guest_customer set totalPrice=totalPrice-old.unitPrice*old.quantity where guest_customer.guestId=old.guestId;
       END 
       $$
 DELIMITER;


 DELIMITER $$
 create trigger update_price_on_guest_cart
       AFTER update ON guest_cart_items 
       FOR EACH ROW
	   BEGIN
	   IF(new.quantity!=old.quantity and new.unitPrice=old.UnitPrice) THEN
	    IF new.quantity>old.quantity then 
	      UPDATE guest_customer set totalPrice=totalPrice+old.UnitPrice*(new.quantity-old.quantity) where guest_customer.guestId=old.guestId;
	    ELSE IF new.quantity<old.quantity THEN
	      UPDATE guest_customer set totalPrice=totalPrice-old.unitPrice*(old.quantity-new.quantity) where guest_customer.guestId=old.guestId;
          END IF;END IF;
	   ELSE IF(new.quantity=old.quantity and new.unitPrice!=old.unitPrice) THEN
          Update guest_customer set totalPrice=totalPrice-old.quantity*old.unitPrice+new.unitPrice*quantity;
	   END IF;END IF;
       END 
       $$
 DELIMITER;

 DELIMITER $$
CREATE TRIGGER `checkingprice` BEFORE INSERT ON `cart` FOR EACH ROW CALL check_price(new.totalPrice)
$$
DELIMITER ;


DELIMITER $$
create trigger update_price_on_cart
       BEFORE INSERT ON cart_items
       FOR EACH ROW
       BEGIN
	     IF(select * from cart_items where cartId=new.cartId and productId=new.productId) THEN
	        	SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'duplicate Entry!';
		 ELSE
		   select price into @unitprice from product where productId=new.productId;
		   set new.Unitprice= @unitprice;
		   set new.quantity=1;
		   UPDATE Cart set totalPrice=totalPrice+new.unitPrice*new.quantity where cart.cartid=new.cartid;
		 END IF;
       END 
       $$
 DELIMITER;

/*trigger when inserting to guest customer cart*/
DELIMITER $$
create trigger update_price_on_guet_customer
       BEFORE INSERT ON guest_cart_items
       FOR EACH ROW
       BEGIN
	     IF(select * from guest_cart_items where guestId=new.guestId and productId=new.productId) THEN
	        	SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'duplicate Entry!';
		 ELSE
		   select price into @unitprice from product where productId=new.productId;
		   set new.Unitprice= @unitprice;
		   set new.quantity=1;
		   UPDATE Guest_customer set totalPrice=totalPrice+new.unitPrice*new.quantity where gusetId=new.guestId;
		 END IF;
       END 
       $$
 DELIMITER;

 DELIMITER $$
create trigger after_price_update_cart
       AFTER Update ON Product
       FOR EACH ROW
       BEGIN
	    IF old.price != new.price THEN
		    UPDATE cart_items set UnitPrice=new.price where productId=old.productId;
			UPDATE guest_cart_items set UnitPrice=new.price where productId=old.productId; 
		ELSE IF new.weight<=0 THEN
           SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid weight value!';
		ELSE IF new.price<=0 THEN
           SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid weight price!';	
        END IF;
		END IF;
		END IF;
       END 
       $$
DELIMITER;

DELIMITER $$
CREATE TRIGGER `checking_price` BEFORE INSERT ON `product` FOR EACH ROW CALL check_product(new.price,new.weight)
$$
DELIMITER ;

/*Trigger on insert*/
DELIMITER $$
create trigger before_order_insert
       BEFORE INSERT ON orders
       FOR EACH ROW
             IF new.totalPrice <=0 THEN
            SIGNAL SQLSTATE '45000'  
            SET MESSAGE_TEXT = 'Invalid TotalPrice!';
       ELSE
          set new.orderedDate=sysDate();
          set new.deliveredDate=null;
          set new.deliveryStatus=FALSE;
  
         select courierId into @id   from courier  where country like new.shippingAddress limit 0,1;
          if(@id!=null) then
            set new.courierId=@id;
          else
            set new.courierId=null;
        end if;
      END IF;
       END
       $$
 DELIMITER;

/*Trigger on order6 update*/
DELIMITER $$
create trigger before_order_update
    Before update on orders
	for each ROW
	BEGIN
     IF(old.deliveredDate!=new.deliveredDate) THEN
         set new.deliveredDate=sysDate();
	 END IF;
	 END
	 $$
DELIMITER;

DELIMITER $$
CREATE TRIGGER `check_phone` BEFORE INSERT ON `phonenumbers` FOR EACH ROW CALL check_pn(new.phoneNumber)
$$
DELIMITER ;




/*functions */
/*module for sending delivery estamation*/
DELIMITER $$
create function deliveryEstimation(productId varchar(255),city varchar(40))
returns varchar(55) deterministic
begin
  
   select quantity into @count from inventory where inventory.productId=productId;
    select cityId into @city from known_city where known_city.city=city;
	if  @count!=0  then
	   if @city=null then
	      
		  return "7 days";
	   else
		 
		 return "5 days" ;
	   
	   end if;
    else
       if @city= null then
	      return "10 days";
	   else
		  return "8 days";
	   
	   end if;
	
   end if;    
end
$$
DELIMITER ;


/*authentication function*/
DELIMITER $$
create function checkLogin(password varchar(40),username varchar(40))
returns boolean deterministic
begin
   IF(select  count(*) from log_in where log_in.password= sha1(password) and log_in.username=username) THEN
      return TRUE;
   ELSE
     return FALSE;
   END IF;
end
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `checking` BEFORE INSERT ON `cutomers` FOR EACH ROW CALL check_nic(new.nic)
$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER check_customer_validation BEFORE INSERT ON cutomers
FOR EACH ROW
BEGIN
      IF char_length(nic)!=10 THEN
		IF !(nic LIKE "%v") THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'check constraint on cutomers.nic failed';
		END IF;	
		END IF;
	    IF NEW.`email` NOT LIKE '%_@%_.__%' THEN
		    SIGNAL SQLSTATE VALUE '45000'
			SET MESSAGE_TEXT = '[table:cutomers] - `email` column is not valid';
	
    END IF;	
END$$
DELIMITER ;



/*views*/

/*order summery*/

create view if not exists cutomer_address as select cutomers.streetNumber as streetNumber,cutomers.streetName as streetName,cutomers.aptName as aptName,cutomers.city as city,cutomers.state as state from orders join cutomers on orders.customerId=cutomers.customerId

/*order item summery*/

create view if not exists orderItemSummery as Select product.productID as productId, product.title as title, product.price as unitPrice , order_items.quantity as quantity, order_items.price as price,order_items.orderId as orderId from order_items  join product on product.productId = order_items.productId;

/*cart item summery */
create view if not exists cartItemSummery as Select product.productID as productId, product.title as title, product.price as unitPrice , cart_items.quantity as quantity ,cart_items.cartId as cartId,product.link as link from cart_items  join product on product.productId = cart_items.productId;

/* Guest cart item summery */

create view if not exists guestcartItemSummery as Select product.productID as productId, product.title as title, product.price as unitPrice,product.link as link, guest_cart_items.quantity as quantity, guest_cart_items.guestId as guestId from guest_cart_items  join product on product.productId = guest_cart_items.productId;

/*indices   */
CREATE INDEX custometrId_index ON cart(customerId);
Create index customerId_index ON orders(customerId);
Create index courierId_index ON orders(courierId);
Create index title_index ON product(title);
Create index description ON product(description);




/* Privileges */

GRANT SELECT ON phonenumbers TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON phonenumbers TO 'admin'@'localhost','courier'@'localhost','customer'@'localhost';
GRANT UPDATE ON phonenumbers TO 'customer'@'localhost','admin'@'localhost';
GRANT DELETE ON phonenumbers TO 'admin'@'localhost','customer'@'localhost';

GRANT SELECT ON product TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost','guest'@'localhost';
GRANT INSERT ON product TO 'admin'@'localhost';
GRANT UPDATE ON product TO 'admin'@'localhost';
GRANT DELETE ON product TO 'admin'@'localhost';

GRANT SELECT ON productvarient TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost','guest'@'localhost';
GRANT INSERT ON productvarient TO 'admin'@'localhost';
GRANT UPDATE ON productvarient TO 'admin'@'localhost';
GRANT DELETE ON productvarient TO 'admin'@'localhost';

GRANT SELECT ON variantypes TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost','guest'@'localhost';
GRANT INSERT ON variantypes TO 'admin'@'localhost';
GRANT UPDATE ON variantypes TO 'admin'@'localhost';
GRANT DELETE ON variantypes TO 'admin'@'localhost';

GRANT SELECT ON wearhouse TO 'admin'@'localhost';
GRANT INSERT ON wearhouse TO 'admin'@'localhost';
GRANT UPDATE ON wearhouse TO 'admin'@'localhost';
GRANT DELETE ON wearhouse TO 'admin'@'localhost';


GRANT SELECT ON inventory TO 'admin'@'localhost';
GRANT INSERT ON inventory TO 'admin'@'localhost';
GRANT UPDATE ON inventory TO 'admin'@'localhost';
GRANT DELETE ON inventory TO 'admin'@'localhost';



GRANT SELECT ON cartitemsummery TO 'customer'@'localhost';

GRANT SELECT ON orderitemsummery TO 'customer'@'localhost','admin'@'localhost';

GRANT SELECT ON orderItemsummery TO 'customer'@'localhost','admin'@'localhost';
GRANT select on cartItemsummery to 'customer'@'localhost';
GRANT select on guestcartItemsummery to 'guest'@'localhost';


GRANT SELECT ON test23.CART TO 'customer'@'localhost';
GRANT INSERT ON test23.CART TO 'customer'@'localhost';
GRANT UPDATE ON test23.CART TO 'customer'@'localhost';
GRANT DELETE ON test23.CART TO 'customer'@'localhost';

GRANT SELECT ON test23.CART_ITEMS TO 'customer'@'localhost';
GRANT INSERT ON test23.CART_ITEMS TO 'customer'@'localhost';
GRANT UPDATE ON test23.CART_ITEMS TO 'customer'@'localhost';
GRANT DELETE ON test23.CART_ITEMS TO 'customer'@'localhost';

GRANT SELECT ON test23.guest_customer TO 'guest'@'localhost';
GRANT INSERT ON test23.guest_customer TO 'guest'@'localhost';
GRANT UPDATE ON test23.guest_customer TO 'guest'@'localhost';
GRANT DELETE ON test23.guest_customer TO 'guest'@'localhost';


GRANT SELECT ON test23.guest_cart_items TO 'guest'@'localhost';
GRANT INSERT ON test23.guest_cart_items TO 'guest'@'localhost';
GRANT UPDATE ON test23.guest_cart_items TO 'guest'@'localhost';
GRANT DELETE ON test23.guest_cart_items TO 'guest'@'localhost';





GRANT SELECT ON test23.CATEGORY TO 'admin'@'localhost','customer'@'localhost','courier'@'localhost','guest'@'localhost';
GRANT INSERT ON test23.CATEGORY TO 'admin'@'localhost';
GRANT UPDATE ON test23.CATEGORY TO 'admin'@'localhost';
GRANT DELETE ON test23.CATEGORY TO 'admin'@'localhost';

GRANT SELECT ON test23.ccdetails TO 'customer'@'localhost';
GRANT INSERT ON test23.ccdetails TO 'customer'@'localhost';
GRANT UPDATE ON test23.ccdetails TO 'customer'@'localhost';
GRANT DELETE ON test23.ccdetails TO 'customer'@'localhost';

GRANT SELECT ON test23.ccpayment TO 'customer'@'localhost','admin'@'localhost';
GRANT INSERT ON test23.ccpayment TO 'customer'@'localhost';
GRANT UPDATE ON test23.ccpayment TO 'customer'@'localhost';
GRANT DELETE ON test23.ccpayment TO 'customer'@'localhost';

GRANT SELECT ON test23.courier TO 'admin'@'localhost';
GRANT INSERT ON test23.courier TO 'admin'@'localhost';
GRANT UPDATE ON test23.courier TO 'admin'@'localhost';
GRANT DELETE ON test23.courier TO 'admin'@'localhost';


GRANT SELECT ON test23.CUTOMERS TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON test23.CUTOMERS TO 'customer'@'localhost';
GRANT UPDATE ON test23.CUTOMERS TO 'customer'@'localhost';
GRANT DELETE ON test23.CUTOMERS TO 'admin'@'localhost','customer'@'localhost';

GRANT SELECT ON test23.ondeliverypayment TO 'admin'@'localhost','customer'@'localhost','courier'@'localhost';
GRANT INSERT ON test23.ondeliverypayment TO 'customer'@'localhost','courier'@'localhost';
GRANT DELETE ON test23.ondeliverypayment TO 'admin'@'localhost';

GRANT SELECT ON log_in TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON log_in TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT UPDATE ON log_in TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT DELETE ON log_in TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';

GRANT SELECT ON maincategory TO 'admin'@'localhost', 'customer'@'localhost','guest'@'localhost';
GRANT INSERT ON maincategory TO 'admin'@'localhost';
GRANT UPDATE ON maincategory TO 'admin'@'localhost';
GRANT DELETE ON maincategory TO 'admin'@'localhost';




GRANT SELECT ON order_items TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON order_items TO 'customer'@'localhost';

GRANT SELECT ON orders TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON orders TO 'customer'@'localhost';
GRANT UPDATE ON orders TO 'admin'@'localhost','customer'@'localhost','courier'@'localhost';
GRANT DELETE ON orders TO 'admin'@'localhost';


GRANT SELECT ON payment TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON payment TO 'customer'@'localhost';
GRANT DELETE ON payment TO 'admin'@'localhost';

/* routines and procedures*/

GRANT EXECUTE ON function test23.checkLogin TO 'customer'@'localhost';

GRANT EXECUTE ON function test23.checkLogin_admin TO 'admin'@'localhost';

GRANT EXECUTE ON function test23.checkLogin_courier TO 'admin'@'localhost';











