add_listener('active/sub_talents',function(response){
 

 // console.log(response);
 __action('session',['sub_talents',response,'object']);


});


add_listener('talent/analyse/bvn',function(response){
  

  console.log(response);

  __action('session',['talent/analyse/bvn',response,'object']);


});


add_listener('talent/analyse/email',function(response){
  

  console.log(response);

  __action('session',['talent/analyse/email',response,'object']);


});


add_listener('talent/analyse/phone',function(response){
  

  console.log(response);

  __action('session',['talent/analyse/phone',response,'object']);


});


add_listener('talent/analyse/account_number',function(response){
  

  console.log(response);

  __action('session',['talent/analyse/account_number',response,'object']);


});
