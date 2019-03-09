$(document).ready(function(){
    $('#ccpayment').hide();
    var variableJSON = JSON.parse($('#variableJSON').text());
    $('#variableJSON').remove();
    $('.adds').on('change',function(event){
        cartId=variableJSON[this.id].cartId;
        productId=variableJSON[this.id].productId;
        var newquantity=this.value;
        var data={
            'cartId':cartId,
            'productId':productId,
            'quantity':newquantity
        }
        $.ajax({
          type:'POST',
          url:'/updci',
          data:data,
          success:function(data){
              location.reload();
          }
        });
    });
    $('.delete').on('click',function(event){
        cartId=variableJSON[this.id].cartId;
        productId=variableJSON[this.id].productId;
        var data={
            'cartId':cartId,
            'productId':productId
        }
        $.ajax({
          type:'POST',
          url:'/delitem',
          data:data,
          success:function(data){
              location.reload();
          }
        });
    });
    $('#checkout').on('click',function(event){

        $('#addbut').click();
    });
    $('#proceed').on('click',function(event){
        $('#addcart').toggle();
        var cartId=variableJSON[0].cartId;
        var paymentType=$('#method') .val();
        var shipadd=$('#shipadd').val();
        /*var country=$('#cnt').val();
        var province=$('#prv').val();*/
        /*var shipadd={
            'country':country,
            'province':province,
            'street'
        }*/
        var data={
            'shippingAddress':shipadd,
            'paymentType':paymentType,
            'cartId':cartId
        }
        $.ajax({
          type:'POST',
          url:'/addorder',
          data:data,
          success:function(data){
            if(data.state){
              alert('Ordered Successfully');
              var orderId=data.orderId
              window.location.replace('/ordersum/'+orderId);
            }
            else{
                window.location.replace('/log-in');
            }
            }
        });
    });
    /*$('#method').on('change',function(){
        alert('yes');
        if(this.value=='1'){
            $('#ccpayment').show();
        }
    });*/


});