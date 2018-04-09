
$value.account_type = 'company';

add_listener('consumer/login',function(response){


  
   // console.log('Called...');

  console.log(response);
  __action('save_consumer_data',response);
  __action('is_logged',[]);



});

add_listener('consumer/list',function(response){
  

  console.log(response);

  __action('session',['consumers',response.data,'object']);


});

add_listener('get_age',function(){
  var age = (+$request.collect.age);
  var lst = [];
  for (var c = 0;c <= age - 1;c++){

    lst[c] = c;

  }

  console.log(lst);
  
  __action('session',['ages',lst,'object']);

});

add_listener('consumer/register_error',function(response){


   
   

   console.log('called...');


});

add_listener('consumer/register',function(response){


   
   $('html,body').animate({scrollTop:0},'slow');

   // console.log('called...');


});


(function(){

var nums = [1,2,4,444,299200];

add_listener('get_numbers',function(){
  return nums;
});


add_listener('set_numbers',function(numbers){
  nums = numbers;
  //[11,2,33,4,105]
  __action('data-array');
});

})();



// $('body').on('click','[consumer-logout]',function(){
     
//      __action('logout',[]);


// });