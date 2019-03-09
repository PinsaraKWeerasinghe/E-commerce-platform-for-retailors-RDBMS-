module.exports=function(app){
   const sql=require('mysql');
   var con=sql.createConnection({
      host:"localhost",
      user:"mine",
      password:'cse',
      database:'eshop'
      
   });
   con.connect(function(err){
      if (err) throw err;
      console.log("connected");
   });
   /*con.query("select * from cutomers",function(err,rows,fields){
        console.log(rows); 
   });*/

 
};



