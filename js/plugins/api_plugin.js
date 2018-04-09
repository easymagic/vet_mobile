/////api_plugin.js/////////////////

//base API

add_listener('init_ob_tags',function(){

  
  $('body').on('click','[data-ob]',function(e){
    
    var vl_ob = $(this).data('ob');

     __action(vl_ob,e);

     return false;


  });



});




add_listener('is_logged',function(){
   
   if (__filter('session',['consumer_data']) ){
   	location.href = 'dashboard.html';
   }


});


add_listener('is_not_logged',function(){

   console.log(__filter('session',['consumer_data']) );
   
   if (!__filter('session',['consumer_data']) ){
   	location.href = 'index.html';
   }


});


add_listener('logout',function(){
  __action('session',['consumer_data','','__null__']);
  __action('is_not_logged');
});




