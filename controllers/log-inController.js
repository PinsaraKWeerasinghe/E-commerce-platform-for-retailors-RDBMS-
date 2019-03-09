module.exports= function(app){

    app.get('/log-in',function(req,res){
      res.render('log-in');
    });
   app.get('/register',function(req,res){
    res.render('register');
  });
 
};