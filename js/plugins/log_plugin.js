
add_listener('log_success',function(msg){
  
  $('[data-log-message]').show();
  $('[data-log-message]').removeClass('btn-danger');
  $('[data-log-message]').addClass('btn-success');
  // $('[data-log-message]').css('border','1px solid green');
  $('[data-log-message]').html(msg);

  $('html,body').animate({scrollTop:0},'slow');


});            



add_listener('log_error',function(msg){
  
  $('[data-log-message]').show();
  $('[data-log-message]').removeClass('btn-success');
  $('[data-log-message]').addClass('btn-danger'); //css('border','1px solid red');
  $('[data-log-message]').html(msg);

  $('html,body').animate({scrollTop:0},'slow');


});            