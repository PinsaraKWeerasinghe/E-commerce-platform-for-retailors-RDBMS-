$(document).ready(function(){
   $('#subbut').on('click',function(event){
      event.preventDefault();
      var username=$('#username').val();
      var password=$('#password').val();
      var usertype=$('#sel1').val();
      data={
         username:username,
         password:password,
         usertype:usertype
      }
      $.ajax({
         type:'POST',
         url:'/signin',
         data:data,
         success:function(data){
          if(data){

             alert("login-successful");
           if(usertype=="1"){
             window.location.replace('/home');
           }
           else if(usertype=="2"){
              window.location.replace('/control')
           }
           else{
              window.location.replace('/courier');
           }
          }
          else{
             alert('Invalid username or password');
             window.location.reload();
          }
         }
       });
   });



});