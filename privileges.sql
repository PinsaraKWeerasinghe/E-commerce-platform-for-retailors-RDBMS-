
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


GRANT SELECT ON log_in_admin TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON log_in_admin TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT UPDATE ON log_in_admin TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT DELETE ON log_in_admin TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';

GRANT SELECT ON log_in_courier TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT INSERT ON log_in_courier TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT UPDATE ON log_in_courier TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';
GRANT DELETE ON log_in_courier TO 'admin'@'localhost', 'customer'@'localhost','courier'@'localhost';




GRANT SELECT ON maincategory TO 'admin'@'localhost', 'customer'@'localhost','guest'@'localhost';
GRANT INSERT ON maincategory TO 'admin'@'localhost';
GRANT UPDATE ON maincategory TO 'admin'@'localhost';
GRANT DELETE ON maincategory TO 'admin'@'localhost';

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

GRANT EXECUTE ON function test23.checkLogin TO 'admin'@'localhost','customer'@'localhost','courier'@'localhost';