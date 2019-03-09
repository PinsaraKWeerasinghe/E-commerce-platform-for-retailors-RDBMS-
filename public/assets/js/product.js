$(document).ready(function(){
   
    $('.add').on('click',function(event){
       var productId=this.id;
       var data={
        'productId':productId
       }
    $.ajax({
      type:'POST',
      url:'/additem',
      data:data,
      success:function(data){
       if(data){
        $('#addbut').click();
      }
      else{
       alert("unsuccessful");
      }
      }
    });
    });
  

});