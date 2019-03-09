module.exports= function(app){

//database connection
const sql=require('mysql');

const uuid=require('uuid/v1');
  
  
//home view request
 app.get('/home',function(req,res){
   sess=req.session;
  var con=sql.createConnection({
    host:"127.0.0.1",
    user:"guest",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err){
      console.log(err);
      res.redirect(req.get('referer'));
    }
   });
   var subcats;
   var categories=[];
   /*con.query("insert into cart(cartId,totalPrice,customerId) values('"+req.cookies.ccid+"',0,'ES0001')",function(err,result){
     if(err) throw err;
   });*/
   con.query("select * from maincategory join category on maincategory.maincatId=category.maincatId",function(err,subcat){
         if(err){
           console.log(err);
           res.redirect(req.get('referer'));
         }
         subcats=subcat;
   });
  con.query("select * from maincategory",function(err,category){
    if(err){
      console.log(err);
      res.redirect(req.get('referer'));
    }
    
    for(var i=0;i<category.length;i++){
      categories.push(category[i]);
      categories[i]["subcat"]=[];
      for(var j=0;j<subcats.length;j++){
        if(subcats[j].MainCatId==category[i].MainCatId){
            //console.log(subcats[j].MainCatId);
            categories[i]["subcat"].push(subcats[j]);
        }
      }
    }
    con.end();
    res.render('home',{categories});
  });
  });
  

//cart view  request
 app.get('/cart',function(req,res){
   sess=req.session;
   var customerId=sess.customerId;
  if(customerId){
  var con=sql.createConnection({
    host:"127.0.0.1",
    user:"customer",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
      res.redirect(req.get('referer'));
    }
    console.log("connected");
   });
   con.query("select cartId from cart where customerId="+sql.escape(customerId),function(err,cartId){
        if(err){
          try{
            throw err;
          }
          catch(err){
            console.log(err);
            res.send(false) ;         
          }
          }
          var cartId=cartId[0].cartId;
   
    con.query("select * from   cart join cartItemSummery where cart.cartId="+sql.escape(cartId),function(err,cartitems){
       if(err){
        console.log(err);
        res.redirect(req.get('referer'));
       }
       console.log(cartitems);
       con.query("select totalPrice from cart where customerId="+sql.escape(customerId),function(err,totalPrice){
        if(err){
          try{
            throw err;
          }
          catch(err){
            console.log(err);
            res.send(false) ;         
          }
          }
          var items={
            'cartitems':cartitems,
            'totalPrice':totalPrice
          }
          con.end();
          res.render('cart',{items});
       });
       
       
    });
  });

}else{
  var guestId=sess.guestId;
  var con=sql.createConnection({
    host:"127.0.0.1",
    user:"guest",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
      res.redirect(req.get('referer'));
    }
  });
  /* use of guestcartSummery*/
  con.query("select * from  guestcartItemSummery where guestId="+sql.escape(guestId),function(err,cartitems){
    if(err){
     try{
    
       throw  err;
     }
     catch(err){
      console.log(err);
      res.redirect(req.get('referer'));
     }
    }
    console.log(cartitems);
    con.query("select totalPrice from guest_customer where guestId="+sql.escape(guestId),function(err,totalPrice){
       if(err){
         try{
           throw err;
         }
         catch(err){
            console.loglog(err);
            res.send(false);
         }
       }
      var items={
        'cartitems':cartitems,'totalPrice':totalPrice
      }
       con.end();
       res.render('cart',{items});
    });
    
    
 });
}
});


//Product view request
app.get('/product/:subcatid',function(req,res){
  var con=sql.createConnection({
    host:"127.0.0.1",
    user:"guest",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
        res.redirect(req.get('referer'));
    }
    console.log("connected");
   });
    con.query("select * from product where categoryId="+sql.escape(req.params.subcatid),function(err,products){
      if(err){
        console.log(err);
        throw err;
      }
      con.end();
      res.render('product',{products});
    }); 
});


//Quantity change
app.post('/updci',function(req,res){
  var con=sql.createConnection({
    host:"127.0.0.1",
    user:"mine",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
      res.redirect(req.get('referer'));
    }
    console.log("connected");
   });
    var data=req.body;
    con.beginTransaction(function(err){
      if(err){
         throw err;
      }
      con.query("update cart_items set quantity="+sql.escape(req.body.quantity)+" where cartId="+sql.escape(req.body.cartId)+"and productId="+sql.escape(req.body.productId),function(err,result){
        if(err) {
          console.log(err);
          con.rollback(function(){
            throw err;
          });
        }
        con.commit(function(err){
           if(err){
              console.log(err);
              con.rollback(function(){
                throw err;
              });
           }
        });
        console.log("Transaction Complete");
      con.end();
      res.send("sucess");
    });
  });
  
});




//Removing items from cart
app.post('/delitem',function(req,res){
  var con=sql.createConnection({
    host:"127.0.0.1",
    user:"mine",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err){
      console.log(err);
      res.redirect(req.get('referer'));
    }
     console.log("connected");
   });
   //Begin transaction
   con.beginTransaction(function(err){
      if(err){
        console.log(err);
        throw err;
      }
      con.query("delete from cart_items where cartId="+sql.escape(req.body.cartId)+" and productId="+sql.escape(req.body.productId),function(err,result){
      if(err){
        con.rollback(function(){
          console.log(err);
          throw err;
        });  
      }
      con.commit(function(err){
        if(err){
          conn.rollback(function(){
            console.log(err);
             throw err;
          });
        }
      });
      console.log("transaction Complete");
      //End transaction
      con.end();
      res.send("sucess");
  });
});
});



//adding items to the cart
app.post('/additem',function(req,res){
   sess=req.session;
  var productId=req.body.productId;
  console.log(sess.customerId);
  if(sess.customerId){
    var customerId=sess.customerId;
  //database connection initialization
  var con=sql.createConnection({
    host:"127.0.0.1",
    user:"customer",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
      res.redirect(req.get('referer'));
    }
    console.log("connected");
   });
  //begin transaction
  con.query("select cartid from cart where customerId="+sql.escape(customerId),function(err,result){
    if(err){
      console.log(err);
      throw err;
    }
    var cartId=result[0].cartid;
     con.query("select * from cart_items where cartId="+sql.escape(cartId)+" and productId="+sql.escape(productId),function(err,rest2){
      if(err){
        console.log(err);
        throw err;
      }

      if(rest2.length==0){
        con.beginTransaction(function(err){
         if(err){
           console.log(err);
           throw err;
         }
         con.query("insert into cart_items(cartId,productId,quantity,Unitprice) values("+sql.escape(cartId)+","+sql.escape(productId)+",'','');",function(err,rest){
         if(err){
           con.rollback(function(){
              throw err;
           });
         }
         con.commit(function(err){
           if(err){
             con.rollback(function(){
              throw err;
            });
           }
         });
         con.end();
        });
        });
        console.log('End trasaction');
        res.send('Success');
      
        
     }
     else{
       con.beginTransaction(function(err){
         if(err){
           console.log(err);
           throw(err);
         }
         
        con.query("update cart_items set quantity=quantity+1 where cartId="+sql.escape(cartId)+" and productId="+sql.escape(productId)+";",function(err,re){
         if(err) {
             con.rollback(function(){
               console.log(err);
               throw err;
             });
         }
         con.commit(function(err){
           if(err){
             con.rollback(function(){
               console.log(err);
               throw(err);
             });
          }
          con.end();
          res.send('Success');
         });

         //End transaction
         
      });
     });
     }
     
   });
  });
 }
 else{
   if(sess.guestId==null){
     console.log('new session created');
     sess.guestId=uuid();
     var guestId=sess.guestId;
     var con=sql.createConnection({
      host:"127.0.0.1",
      user:"guest",
      password:'cse',
      database:'test23' 
     });
     con.connect(function(err){
      if (err){
        console.log(err);
        res.redirect(req.get('referer'));
      }
     });
     con.beginTransaction(function(err){
        if(err){
         try{
          throw err;
         }
          
        catch(err){
           console.log(err);
           con.end();
           res.send(false);
        }
      } 
      console.log('Insert into Guest_customer(guestId,totalPrice) values'+sql.escape(guestId)+",''");
      con.query('Insert into Guest_customer(guestId,totalPrice) values('+sql.escape(guestId)+",'')",function(err){
        if(err){
          con.rollback(function(){
            con.end();
            res.send(false);
          });
          
        }
          
          con.query("Insert into guest_cart_items(guestId,productId,quantity,unitPrice) values ("+sql.escape(guestId)+","+sql.escape(productId)+",' ',' ')",function(err){
            if(err){
              con.rollback(function(){
                 try{
                  throw err;
                 }
                 catch(err){
                   console.log(err);
                   con.end();
                   res.send(false);
                 }
              });
  
            }
            con.commit(function(err){
               if(err){
                 try{
                   throw err;
                 }
                 catch(err){
                   console.log(err);
                   con.end();
                   res.send(false);
                 }
               }
               con.end();
               res.send(true);
            });
            
  
        });

      });
     });
  }
  else{
     console.log("session not created");
     var guestId=sess.guestId;
     var con=sql.createConnection({
      host:"127.0.0.1",
      user:"guest",
      password:'cse',
      database:'test23' 
     });
     con.connect(function(err){
      if (err){
        console.log(err);
        res.redirect(req.get('referer'));
      }
     });
      var guestId=sess.guestId;
       con.query("select * from guest_cart_items where guestId="+sql.escape(guestId)+"and productId="+sql.escape(productId),function(err,result){
           if(err){
             try{
               throw err;
             }
             catch(err){
               console.log(err);
               res.send(false);
             }
           }
      if(result.length==0){
       con.beginTransaction(function(err){
        if(err){
          try{
            throw err;
          }
          catch(err){
            console.log(err);
            con.end();
            res.send(false);
          }
        }
        console.log(guestId);
       con.query('Insert into guest_cart_items(guestId,productId,quantity,unitPrice) values ('+sql.escape(guestId)+','+sql.escape(productId)+',"","")',function(err){
          if(err){
            con.rollback(function(){
               try{
                throw err;
               }
               catch(err){
                 console.log(err);
                 con.end();
                 res.send(false);
               }
            });

          }
          con.commit(function(err){
             if(err){
               try{
                 throw err;
               }
               catch(err){
                 console.log(err);
                 con.end();
                 res.send(false);
               }
             }
             con.end();
             res.send(true);
          });
          
       });
  });
  }else{
    con.beginTransaction(function(err){
      if(err){
        console.log(err);
        throw(err);
      }
      
     con.query("update guest_cart_items set quantity=quantity+1 where guestId="+sql.escape(guestId)+" and productId="+sql.escape(productId)+";",function(err,re){
      if(err) {
          con.rollback(function(){
            console.log(err);
            throw err;
          });
      }
      con.commit(function(err){
        if(err){
          con.rollback(function(){
            console.log(err);
            throw(err);
          });
       }
       con.end();
       res.send(true);
      });

      //End transaction
      
   });
  });
  }
});
 }
}  
});






//converting cart to an order
app.post('/addorder',function(req,res){
  
  sess=req.session;
  var customerId=sess.customerId;
  if(sess.customerId){
    
  console.log('arrived');
  var paymentType=req.body.paymentType;
   var cartId=req.body.cartId;
   var shippingAddress=req.body.shippingAddress;
   var con=sql.createConnection({
    host:"127.0.0.1",
    user:"customer",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
      res.redirect(req.get('referer'));
    }
    console.log("connected");
   });
   con.query('select productId,quantity from cart_items where cartId='+sql.escape(cartId),function(err,result){
     if(err){
       console.log(err);
       throw err;
       
     }
     var items=result;
     con.query('select totalPrice from cart where cartId='+sql.escape(cartId),function(err,result){
        if(err){
          console.log(err);
          throw err;
        }
        var totalPrice=result[0].totalPrice;
        //unique id generator
        var orderId=uuid();
        con.beginTransaction(function(err){
           if(err){
             console.log(err);
             throw err;
           }
           con.query("Insert Into orders(OrderId,CustomerId,shippingAddress,OrderedDate,DeliveredDate,DeliveryStatus,TotalPrice) values("+sql.escape(orderId)+","+sql.escape(customerId)+","+sql.escape(shippingAddress)+",'','','',"+sql.escape(totalPrice)+")",function(err){
                if(err){
                  con.rollback(function(){
                    throw err;
                  });
                }
                console.log('Order Transaction complete');

                //adding items to order item
                var i=0;
                if(items.length>0){
                items.forEach(function(item,index){
                  console.log(item);
                  console.log("Insert into order_items(orderId,productId,quantity,Price,courierId) values ("+sql.escape(orderId)+","+sql.escape(item.productId)+","+sql.escape(item.quantity)+",'','')");
                 con.query("Insert into order_items(orderId,productId,quantity,Price) values ("+sql.escape(orderId)+","+sql.escape(item.productId)+","+sql.escape(item.quantity)+",'')",function(err){
                   if(err){
                     con.rollback(function(err){
                      console.log(err);
                     });
                    }  
                    if(index==(items.length-1)){
                      console.log('Order_items transaction complete');
                    }
                    
                });
              });
              //payment
            
             if(paymentType=="1"){
            
               //check balance of the card
               //if(blance>totalPrice) then deduct totalPrice  from the account
                  //and  update payment table and ccpayment table
               //Else notify insufficient funds 
               var paymentId=uuid();
               console.log("Insert into payment(paymentId,orderId) values("+sql.escape(paymentId)+","+sql.escape(orderId)+")");
               con.query("Insert into payment(paymentId,orderId) values("+sql.escape(paymentId)+","+sql.escape(orderId)+")",function(err){
                  if(err){
                  con.rollback(function(){
                    throw err;
                  });
                  }
                  else{
                  var cardId;
                  con.query("select cardId from ccdetails where customerId="+sql.escape(customerId),function(err,reslt){
                     if(err){
                       console.log(err);
                       throw err;     
                     }
                     else{
                     if(reslt==null){
                       console.log("No card information");
                       res.send('Unsuccessful');
                     }
                     else{
                       cardId=reslt[0].cardId;
                     }
                     
                     con.query("select paymentId from payment",function(err,ret){
                       console.log(ret);
                     

                     console.log("Insert into ccpayment(cardId,paymentId) values("+sql.escape(cardId)+","+sql.escape(paymentId)+")");
                     con.query("Insert into ccpayment(cardId,paymentId) values("+sql.escape(cardId)+","+sql.escape(paymentId)+")",function(err){
                    if(err){
                    con.rollback(function(){
                      throw err;
                    });
                  }
                  else{
                    con.commit(function(err){
                    if(err){
                      con.rollback(function(err){
                         throw err;
                      });
                    }
                    });
                     con.end()
                     res.send({'state':true,'orderId':orderId});
                   }  
                  });
                 });
                  }
                  });

                }
                });
              }
             else {
                var paymentId=uuid();
                con.query("Insert into payment(paymentId,orderId) values("+sql.escape(paymentId)+","+sql.escape(orderId)+")",function(err,retr){
                  console.log(retr)
                  if(err){
                    conn.rollback(function(){
                       throw err;
                    });
                  }
                  con.query("Insert into ondeliverypayment(paymentId,paymentStatus) values("+sql.escape(paymentId)+",'')",function(err){
                    if(err){
                    con.rollback(function(){
                      throw err;
                    });
                    }
                    con.commit(function(err){
                      if(err){
                        con.rollback(function(err){
                           throw err;
                        });
                      }
                    });
                    con.end();
                    res.send({'state':true,'orderId':orderId});
                  });
                  console.log('payment updation transaction complete!');
                });
             }
          }
        else{
         con.end();
         res.send("No items on order");
        }
        });
     });
     
   });
   
});
  }
  else{
    res.send(false);
 
  }

});


//order summery
app.get('/ordersum/:orderId',function(req,res){
  sess=req.session;
  var customerId=sess.customerId;
  if(customerId){
  var orderId =req.params.orderId;
  var con=sql.createConnection({
   host:"127.0.0.1",
   user:"customer",
   password:'cse',
   database:'test23' 
  });
  con.connect(function(err){
   if (err){
     console.log(err);
     res.redirect(req.get('referer'));
   }
  });
  console.log("select * from orderItemSummery where orderId="+sql.escape(orderId));
  con.query("select * from orderItemSummery where orderId="+sql.escape(orderId),function(err,orderItems){
    if(err){
      console.log(err);
      con.end();
      res.send({'state':false});
    }
    con.query("select * from orders where orderId="+sql.escape(orderId),function(err,result){
      if(err){
        console.log(err);
        con.end();
        res.send({'state':false});
      }
    
    if(err){
      try{
        console.log(err)
        throw err;
      }
      catch(err){
         console.log("Unsuccessful redirecting");
         res.send(false);
      }
    }
  
    console.log(result);
    con.end();
    res.render('order-summery',{result,orderItems});

  });
});
}
else{
  res.send("Something went wrong with order summary!Order complete");
}
});

//Authentication
app.post('/signin',function(req,res){
   var  sess=req.session;
  var  password=req.body.password;
  var username=req.body.username;
  var usertype=req.body.usertype;
  console.log(username);
  console.log(password);
  console.log(usertype);
   //sess.email=req.body.email;
  if(usertype==1){
  
   
   var con=sql.createConnection({
    host:"127.0.0.1",
    user:"customer",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
      res.redirect(req.get('referer'));
    }
    console.log("connected");
    con.query("select checkLogin("+sql.escape(password)+","+sql.escape(username)+")  as validation",function(err,result){
       if(err){
         try{
           console.log(err)
           throw err;
         }
         catch(err){
            console.log("Unsuccessful redirecting");
            res.send({success:false});
         }
       }
       console.log(result[0].validation);
       if(result[0].validation==true){
         var customerId;
         con.query("select customerId from log_in where username="+sql.escape(username),function(err,reslt){
          if(err){
            try{
              console.log(err)
              throw err;
            }
            catch(err){
              console.log
              res.send({success:false});
            }
           
          }
          customerId=reslt[0].customerId;
          sess.customerId=customerId;
          sess.type='1';
          console.log(sess.customerId);
          console.log("log-in successful");
          con.end();
          res.send(true);
          
         });
        
       }
       else{
         con.end();
         console.log('Invalid password or username');
         res.send(false);
       }
    });

   });
  }
  else if(usertype==2){
    
   var con=sql.createConnection({
    host:"127.0.0.1",
    user:"admin",
    password:'cse',
    database:'test23' 
   });
   con.connect(function(err){
    if (err) {
      console.log(err);
      res.redirect(req.get('referer'));
    }
    console.log("connected");
    con.query("select checkLogin_admin("+sql.escape(password)+","+sql.escape(username)+")  as validation",function(err,result){
       if(err){
         try{
           console.log(err)
           throw err;
         }
         catch(err){
            console.log("Unsuccessful redirecting");
            res.send({success:false});
         }
       }
       console.log(result[0].validation);
       if(result[0].validation==true){
         var customerId;
         con.query("select adminId from log_in_admin where username="+sql.escape(username),function(err,reslt){
          if(err){
            try{
              console.log(err)
              throw err;
            }
            catch(err){
              console.log
              res.send({success:false});
            }
           
          }
          Id=reslt[0].adminId;
          sess.Id=Id;
          sess.type='2';
          console.log(sess.Id);
          console.log("log-in successful");
          con.end();
          res.send(true);
          
         });
        
       }
       else{
         con.end();
         console.log('Invalid password or username');
         res.send(false);
       }
    });

   });
  }
  else if(usertype==3){
    var con=sql.createConnection({
      host:"127.0.0.1",
      user:"courier",
      password:'cse',
      database:'test23' 
     });
     con.connect(function(err){
      if (err) {
        console.log(err);
        res.redirect(req.get('referer'));
      }
      console.log("connected");
      con.query("select checkLogin_courier("+sql.escape(password)+","+sql.escape(username)+")  as validation",function(err,result){
         if(err){
           try{
             console.log(err)
             throw err;
           }
           catch(err){
              console.log("Unsuccessful redirecting");
              res.send({success:false});
           }
         }
         console.log(result[0].validation);
         if(result[0].validation==true){
           var customerId;
           con.query("select courierId from log_in_courier where username="+sql.escape(username),function(err,reslt){
            if(err){
              try{
                console.log(err)
                throw err;
              }
              catch(err){
                console.log
                res.send({success:false});
              }
             
            }
            Id=reslt[0].courierId;
            sess.Id=Id;
            sess.type='3'
            console.log(sess.Id);
            console.log("log-in successful");
            con.end();
            res.send(true);
            
           });
          
         }
         else{
           con.end();
           console.log('Invalid password or username');
           res.send(false);
         }
      });
  
     });
  }
   
});

//loging out
app.get('/logout',function(req,res){
     var  sess=req.session;
  
     req.session.destroy(function(err){
       if(err){
        try{
         console.log(err);
         throw err;
        }
        catch(err){
          res.send(true);
        }
       }
       else{
         res.send(true);
         res.send(true);
       }
     });

  

});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////

// admin controlls

//////////////////Admin Authentication


function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  sess = req.session;
  //sess.id
  if (1==1)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/');
}


////////////Product Search

app.get('/product-search/:key',function(req,res){

  
  key = req.params.key;
  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"admin",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {

        console.log("Can't connect Database!");
      }
      console.log("connected");
   });

   key = key.toLowerCase();
  var query = "SELECT * from product where lower(title) like concat('%',"+sql.escape(key)+",'%') or lower(description) like  concat('%',"+sql.escape(key)+",'%')";
  console.log(query);
  con.query(query,[key],function(err,result){
    if(err) {
      console.log("Database error!")
    };
    console.log(result);
    res.render('product-search',{result});
  });
});

//product view
app.get('/product-view/:productId',function(req,res){
  productID = req.params.productId;
  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"admin",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {

        console.log("Can't connect Database!");
      }
      console.log("connected");
   });

   
  var query = "select * from product where productId = ? ";
  //console.log(query);
  con.query(query,[productID],function(err,result){
    if(err) {
      console.log("Database Error!");
    } else{
      console.log(result);
      con.query("select * from productvarient natural join variantypes where productId = ?",[productID],function(err,variant){
        if(err) {
          console.log("Database Error!");
        } else{
          console.log(variant);
          res.render('product-view',{result,variant});
        }
      });
    }
    
  });
});

// admin controlls

app.get('/admin/product',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"admin",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {
        console.log("Database Error!");
      }
      console.log("connected");
   }); 


  var query = "SELECT * from product";
  con.query(query,function(err,result){
    if(err) {
      console.log("Database Error!")
    };
    console.log("Query successf!");
    res.status(200).json(result);
    con.end();
  });
});


//individual product

app.get('/admin/product/:productID',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"admin",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });


  
  //console.log(query);
  con.query("SELECT * from product where productID=?",[req.params.productID],function(err,result){
    if(err) {
      console.log('Error occured!');
    };
    console.log("Query successf!");
    
    res.status(200).json(result);
    try{
        con.end();
      }catch(err){

    }
  });
});

app.post('/admin/product',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"admin",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {
        console.log("Database error!");
      }else{
        console.log("connected");
      }
      
      
   });


  //var productID = req.body.productID;
  var productID = Math.floor(Math.random()*100000);
  var  title = req.body.title;
  var weight = req.body.weight;
  var sku = req.body.sku;
  var description = req.body.description;
  var price = req.body.price;
  var category = req.body.category;
  var brandname = req.body.brandname;
  count = 0;
  var subQuery = "insert into productvarient values ";

  //var query = "INSERT INTO product values('"+productID+"','"+title+"','"+weight+"','"+sku+"','"+description+"','"+price+"')";
  //console.log(query);
  try{
    con.beginTransaction(function(err){
        if (err) {
          console.log('Database error!')
        }
        con.query("INSERT INTO product values (?,?,?,?,?,?,?,?,?)",[productID,title,weight,sku,description,price,category,'',brandname],function(err,result){
          if(err) {
            con.rollback(function(){
              console.log("Roll Back !");
              res.status(200).json({'message':'Roll back!'});
            });
          } else {
            console.log("Insert the new product!");
            //console.log(result);
            params = [];k=0;
            for(var key in req.body){
              if(count > 6 && req.body[key] != ''){
                params.push(productID);
                params.push(req.body[key]);
                params.push(key);
                if(k==0){
                  subQuery += "(?,?,?)";k++;
                } else{
                  subQuery += ",(?,?,?)";
                }  
              }
              count++;
            }
            if(params.length!=0){
              con.query(subQuery,params,function(err,result2){
                if (err){
                  con.rollback(function(){
                    console.log("Roll Back!");
                  });
                } else {
                  con.commit(function(err){
                    if(err){
                      con.rollback(function(err){
                        console.log("Roll Back!");
                        res.status(200).json({'message':"Unexpected Error!"});
                      })
                    } else{
                      res.status(200).json(result);
                    }
                    try{
                        con.end();
                    }catch(err){

                    }
                    
                  })
                  //console.log(result);
                }
              });
            } else{

              con.commit(function(err){
                    if(err){
                      con.rollback(function(err){
                        console.log("Roll Back!");
                        res.status(200).json({'message':"Unexpected Error!"});
                      })
                    } else{
                      res.status(200).json(result);
                    }
                    try{
                          con.end();
                    }catch(err){

                    }
                    
                  })
            }
            
            
          }
        });
      });
    } catch(err){
      if (err ){
        console.log("Try to enter duplicate entry");
      }
    }
  
});

app.delete('/admin/product/:productID',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });

  var productID = req.params.productID;
  //var query = "DELETE FROM product where productID = '"+productID+"'";
  //console.log(productID);
  con.beginTransaction(function(err){
      if (err) {throw err;}
      con.query("DELETE FROM product where productID = ?",[productID],function(err,result){
        if(err) {
            con.rollback(function(){
              console.log("Roll Back !");
              con.end();
              res.status(200).json({'message':'Product not deleted!'});
            });
          } else {
          console.log("Delete the product!");
            try{
              con.end();
            }catch(err){

            }
          res.status(200).json(result);
        }
      });
  });
});

app.patch('/admin/product/:productID',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      
      console.log("connected");
   });

  var productID = req.params.productID;
  var  title = req.body.title;
  var weight = req.body.weight;
  var sku = req.body.sku;
  var description = req.body.description;
  var price = req.body.price;


  con.query("UPDATE  product set title=?,weight=?,sku=?,description=?,price=? where productID = ?" ,[title,weight,sku,description,price,productID],function(err,result){
    if(err) throw err;
    console.log("Update the product!");
      try{
          con.end();
      }catch(err){

      }
    res.status(200).json(result);
  });
});


//admin order detail operations

app.get('/admin/order',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {console.log("Database error!");}
      console.log("connected");
   });

  var query = "SELECT * from orders";
  console.log(query);
  con.query(query,function(err,result){
    if(err) throw err;
    try{
        con.end();
    }catch(err){

    }
    console.log("Query successfull!");
    res.status(200).json(result);
  });
})

app.get('/admin/order/:customerId',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;

      console.log("connected");
   });

  var customerId = req.params.customerId;
  //var query = "SELECT * from orders where customerId = '"+customerId+"'";
  //console.log(query);
  con.query("SELECT * from orders where customerId = ?",[customerId],function(err,result){
    if(err) {
      console.log("Database error!");
    } else{
      console.log("Query successfull!");
    }
    
    try{
        con.end();
    }catch(err){

    }
    res.status(200).json(result);
  });
})

app.get('/control/order/:orderId',isAuthenticated,function(req,res){
  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {
        console.log('Database error!');
      } else {
              console.log("connected");
      }
   });

  var orderId = req.params.orderId;
  con.query("SELECT * from orders natural join cutomers where orderId = ?",[orderId],function(err,result){
    if(err) throw err;
    console.log(result);
    //var query2 = "select order_items.productId,quantity, order_items.price as totals,product.price as unitprice from order_items,product where product.productID = order_items.productID and  orderId ='"+orderId+"';";
    //console.log(query2);
    con.query("select order_items.productId,quantity, order_items.price as totals,product.price as unitprice from order_items,product where product.productID = order_items.productID and  orderId =?",[orderId],function(err,orderItems){
      if(err) throw err;
      //console.log(orderItems);
      try{
        con.end();
      }catch(err){

      }
      res.render('page-order',{result,orderItems});
    });
    
  });
});

//admin operations with varients

app.post('/admin/variant',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });
  var vTypeId = req.body.vTypeId;
  var variant = req.body.variant;
  //wrong database name ****************
  //var query  = "INSERT INTO varianTypes values('"+vTypeId+"','"+variant+"')";
  con.query("INSERT INTO varianTypes values(?,?)",[vTypeId,variant],function(err,result){
    if(err) throw err;
    console.log("Insert the variant!");
    try{
        con.end();
    }catch(err){

    }
    res.status(200).json(result);
  });
})

app.get('/admin/variant',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });
  //wrong database name ****************
  var query  = "SELECT * FROM varianTypes ";
  con.query(query,function(err,result){
    if(err) throw err;
    console.log("Insert the variant!");
    try{
        con.end();
    }catch(err){

    }
    res.status(200).json(result);
  });
})


app.patch('/admin/variant/:vTypeId',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });

  //wrong database name ****************
  var variant = req.body.variant;
  var vTypeId = req.params.vTypeId;
  //var query  = "UPDATE  varianTypes  set variant = '"+variant+"' where vTypeId = '"+vTypeId+"'";
  con.query("UPDATE  varianTypes  set variant = ? where vTypeId = ?",[variant,vTypeId],function(err,result){
    if(err) throw err;
    console.log("Update the variant!");
    try{
        con.end();
    }catch(err){

    }
    res.status(200).json(result);
  });
})

app.delete('/admin/variant/:vTypeId',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });

  //wrong database name ****************
  var vTypeId = req.params.vTypeId;
  //var query  = "DELETE FROM  varianTypes   where vTypeId = '"+vTypeId+"'";
  con.query("DELETE FROM  varianTypes   where vTypeId = ? ",[vTypeId],function(err,result){
    if(err) throw err;
    try{
        con.end();
    }catch(err){

    }
    console.log("Delete the variant!");
    res.status(200).json(result);
  });
})

///get customer info

app.get('/admin/customer',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });


  var customerId = req.params.customerId;
  var query = "SELECT * from cutomers";
  console.log(query);
  con.query(query,function(err,result){
    if(err) throw err;
    try{
        con.end();
    }catch(err){

    }
    console.log("Query successfull!");
    res.status(200).json(result);
  });
})


//get category info
app.get('/admin/category',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });
  var customerId = req.params.customerId;
  var query = "select category.categoryId as categoryId,category.name as name ,maincategory.name as mname,maincategory.MainCatId as MainCatId ,maincategory.link as link from category left  join maincategory on category.maincatid=maincategory.maincatid;";
  console.log(query);
  con.query(query,function(err,result){
    if(err) throw err;
    try{
        con.end();
    }catch(err){

    }
    console.log("Query successfull!");
    res.status(200).json(result);
  });
})

app.get('/admin/report/most_sold_product/:period',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });

    string = req.params.period;
    arr = string.split(':');
    var fromDate  = arr[0]
    var toDate = arr[1];

    var query = "select product.productId, product.title, product.brandname,product.price,sum(order_items.quantity) as total from product  join order_items on  order_items.productId = product.productId  and order_items.orderId in (select orderId from orders where orderedDate between ? and ? ) group by product.productId order by sum(order_items.quantity) desc";
    con.query(query,[fromDate,toDate ],function(err,result){
      if(err) throw err;
      
      console.log("most_interested_product report!");
      console.log(result);
      res.status(200).json(result);
      try{
        con.end();
      }catch(err){

      }
    });

});

app.get('/admin/report/most_order_category',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });

    var fromDate  = req.body.fromDate;
    var toDate = req.body.toDate;

    var query = "select category.categoryId,category.name,sum(order_items.quantity) as sales from order_items,product,category where order_items.productId = product.productId and category.categoryId = product.categoryId group by category.categoryId order by sum(order_items.quantity) desc;";
    con.query(query,function(err,result){
      if(err) throw err;
      try{
        con.end();
      }catch(err){

      }
      //console.log("most_interested_product report!");
      res.status(200).json(result);
    });

});

app.get('/admin/report/quaterly_report_product/:year',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });

    var year  = req.params.year;
    quaters = [[year+'-01-1',year+'-03-31'],  [year+'-04-1',year+'-06-30'] , [year+'-07-1',year+'-9-30'], [year+'-10-1',year+'-12-31']]
    //var toDate = req.body.toDate;
    //Get the product with their sales
    let bigData = [];
    var prductSale = "SELECT product.productID,product.title,sum(quantity) as quantity ,sum(order_items.price) as total FROM  order_items, product where order_items.productId = product.productId and order_items.orderId in (select orderId from orders where orderedDate between ? and ? ) group by product.productID order by sum(quantity) desc;";
      con.query(prductSale,[quaters[0][0],quaters[0][1]],function(err,result){
        if(err) throw err;
        //if(result.length >0 ){
          bigData.push(result);
        //}
        
        
    })

    var prductSale = "SELECT product.productID,product.title,sum(quantity) as quantity ,sum(order_items.price) as total FROM  order_items, product where order_items.productId = product.productId and order_items.orderId in (select orderId from orders where orderedDate between ? and ? ) group by product.productID order by sum(quantity) desc;";
      con.query(prductSale,[quaters[1][0],quaters[1][1]],function(err,result){
        if(err) throw err;
        //if(result.length >0 ){
          bigData.push(result);
        //}
    });

    var prductSale = "SELECT product.productID,product.title,sum(quantity) as quantity ,sum(order_items.price) as total FROM  order_items, product where order_items.productId = product.productId and order_items.orderId in (select orderId from orders where orderedDate between ? and ? ) group by product.productID order by sum(quantity) desc;";
      con.query(prductSale,[quaters[2][0],quaters[2][1]],function(err,result){
        if(err) throw err;
        //if(result.length >0 ){
          bigData.push(result);
        //}
    });

    var prductSale = "SELECT product.productID,product.title,sum(quantity) as quantity ,sum(order_items.price) as total FROM  order_items, product where order_items.productId = product.productId and order_items.orderId in (select orderId from orders where orderedDate between ? and ? ) group by product.productID order by sum(quantity) desc;";
      con.query(prductSale,[quaters[3][0],quaters[3][1]],function(err,result){
        if(err) throw err;
        //if(result.length >0 ){
          bigData.push(result);
        //}
        try{
            con.end();
        }catch(err){

        }
        res.status(200).json(bigData);
    });
    
    
});

app.get('/admin/report/quaterly_report_category/:year',isAuthenticated,function(req,res){
  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });

    var year  = req.params.year;
    var bigData = [];
    quaters = [[year+'-01-1',year+'-03-31'],  [year+'-04-1',year+'-06-30'] , [year+'-07-1',year+'-9-30'], [year+'-10-1',year+'-12-31']]
    //console.log([quaters[0][0],quaters[0][1]]);
    for(i=0;i<4;i++){
      var query = "select category.categoryId,category.name,sum(order_items.quantity) as quantity,sum(order_items.price) as sales from order_items,product,category where order_items.productId = product.productId and category.categoryId = product.categoryId and order_items.orderId in (select orderId from orders where orders.orderDate between ? and ? ) group by category.categoryId order by count(order_items.quantity) desc";
      con.query(query,[quaters[i][0],quaters[i][1]],function(err,result){
        if(err) throw err;
        console.log(result);
        //bigData.push[result];

      });
    }
    try{
        con.end();
    }catch(err){

    }
    res.status(200).json(bigData);
});



///aditional


app.get('/admin/courier',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {
        console.log("Can't connect to the database!");
        res.status(200).json({"message":"Database error!"});
      }else{
        console.log("connected");
      }
      
   });


  var query = "SELECT * from courier";
  con.query(query,function(err,result){
    if(err){
      console.log("Can't get the courier details!")
      res.status(200).json({"message":"Database error!"});
    } else{
      console.log("Query successf!");
      res.status(200).json(result);
    }
    con.end();
  });
});

app.get('/admin/wearhouse',isAuthenticated,function(req,res){

  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {
        console.log("Can't connect to the database!");
        res.status(200).json({"message":"Database error!"});
      }else{
        console.log("connected");
      }
      
   });


  var query = "SELECT * from wearhouse";
  con.query(query,function(err,result){
    if(err){
      console.log("Can't get the wearhouse details!")
      res.status(200).json({"message":"Database error!"});
    } else{
      console.log("Query success!");
      res.status(200).json(result);
    }
    con.end();
  });
});


/////////////////Courier controls

app.get('/courier/ordersData',function(req,res){
  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });

   con.connect(function(err){
      if (err) {console.log("Database error!");}
      console.log("connected");
   });

  var query = "SELECT * from orders";
  console.log(query);
  con.query(query,function(err,result){
    if(err) throw err;
    try{
        con.end();
    }catch(err){

    }
    console.log("Query successfull!");
    res.status(200).json(result);
  });
});

app.get('/courier/orders',isAuthenticated,function(req,res){
    res.render('courier-control');
  });


app.get('/courier/orders/:orderID',function(req,res){
  orderId = req.params.orderID;
  const sql=require('mysql');
   var con=sql.createConnection({
      host :"localhost",
      user :"mine",
      password:'cse',
      database: 'test23'
   });
   con.connect(function(err){
          if (err) {console.log("Database error!");}
          console.log("connected");
       });
   con.beginTransaction(function(err){
      if (err) {throw err;}
       

      var query = "Update orders set deliveryStatus = ? where orderId = ?";
      console.log(query);
      con.query(query,['1',orderId],function(err,result){
        if(err) {

          con.rollback(function(){
              console.log("Roll Back !");
              con.end();
              res.status(200).json({'message':'Status not updated!'});
            });

        } else {
          con.commit(function(err){
            if(err){
              con.rollback(function(err){
                console.log("Roll Back!");
                res.status(200).json({'message':"Status not updated!"});
              })
            } else{
              res.status(200).json({"message": "Order state changed!"});
            }
          });
        }
        
      });
      });
  
    });







};






