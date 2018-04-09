(function($,win,undefined){

  win.$value = {};
  win.$cache = {};
  win.$output = '';
  win.$request = {collect:{},error:false,errors:[]};


	$(function(){


	
  

  win.eval_expr_return = function(params,str){
    var fn = new Function(params,' return ' + str + ';');
    return fn;
  };

  win.eval_expr_do = function(params,str){
    var fn = new Function(params,str + ';');
    return fn;
  };


//handle confirm
$('body').on('click','[data-api],[data-container]',function(e){
	var $el = $(e.target);
	// e.preventDefault();
	if ($el.is('[data-confirm]')){
		console.log(e);
		if (!confirm('Do you want to confirm this action?')){
	      e.stopImmediatePropagation();
		}
	}
});
 
  //handle clear (opposite of data-param)
  $('body').on('data-clear','[data-api],[data-container]',function(e){
  	var $el = $(e.target);
  	if ($el.is('[data-param]') && !$el.is('[type=hidden]') && !$el.is('[data-skip-clear]')){
  	  $el.fadeOut('slow',function(){
  	    $el.val('');
  	    $el.fadeIn('slow');	
  	  });	
      
  	}
  }); 


  //handle data-set
  $('body').on('data-set','[data-api],[data-container]',function(e){

     var $el = $(e.target);

     if ($el.is('[data-set]')){

         $el.val( eval_expr_return('',$el.data('set'))() );

     }  

  });
  


  //handle data-show
  $('body').on('data-show','[data-api],[data-container]',function(e){

    var $el = $(e.target);
    var $parent = $(this);

    if ($el.is('[data-show]')){
      
      var vl = $el.data('show');

      var expr = eval_expr_return('',vl);


      if (expr()){
         $el.show();    
         $el.find('*').data('ignore',false);
         $el.data('ignore',false);
      }else{
         $el.hide();
         $el.find('*').data('ignore',true);
         $el.data('ignore',true);
      }

    }

   

  });

  $('[data-show]').trigger('data-show');

  

  //handle data-switch
  $('body').on('change','[data-api],[data-container]',function(e){


  	  var $el = $(e.target);
  	  var $parent = $(this);

  	  if ($el.is('[data-switch]')){

  	  	var vl = $el.val();

         if ($el.is('[type=checkbox],[type=radio]')){

         	var $data_checked = $el.data('checked');
         	var $data_unchecked = $el.data('unchecked');
            
            if ($el.is(':checked')){
               
               var expr = eval_expr_do('',$data_checked);
               expr();

            }else{

               var expr = eval_expr_do('',$data_unchecked);
               expr();

            }

            $parent.find('[data-show]').trigger('data-show');
            $parent.find('[data-set]').trigger('data-set');

         }else{ //this is a select drop-down
            

            var expr = eval_expr_do('',vl);
            expr();
         	$parent.find('[data-show]').trigger('data-show');
         	$parent.find('[data-set]').trigger('data-set');


         }
         

  	  }

   

  });

  $('[data-switch]').trigger('change');



  //handle auto-trigger
  $('body').on('data-trigger','[data-api]',function(e){
  	
  	var $el = $(e.target);
  	var $parent = $(this);

  	if ($el.is('[data-trigger]')){
      $parent.trigger('data-api');  
  	}

  });
  



  
  //handle data-array
  $('body').on('data-array','[data-api],[data-container],[data-blank]',function(e){
   

   // data-array-post

      var $el = $(e.target);
     
      if ($el.is('[data-array]')){

      	// if ($el.is('[data-array-post]')){
       //   var $el_save = $el;
      	//  $el=$($el.data('array-post'));//crazy indirection	
      	// }

      	var append_mode = false;

      	if ($el.is('[data-append]')){
          append_mode = true;
      	}

      	if ($el.is('[data-array-post]')){
	        var $template = $($el.data('array-post')).find('script');
      	}else{
	        var $template = $el.find('script');
      	}

      	var $list = $el.find('list-output');      		          
        

        if (!append_mode)$list.html(''); //clear the list if not in append mode.
        // console.log($template.html());

        var id = '';
        if ($el.is('[data-array-id]')){
          id = $el.data('array-id');
        }


        var code = eval_expr_do('$id',$template.html().split('\r').join('').split('\n').join(''));
        code(id); //evaluate the code

        // console.log(code);

        $list.append($output);
        $output = ''; //garbage output

      }

     

  });
  

  //handle data-param
  $('body').on('data-param','[data-container],[data-api]',function(e){
   
    var $el = $(e.target);
    var $parent = $(this);

   function collect_data($parent){
	  // var data = {collect:{},error:false,errors:[]};
	  //reset this variable.
	  $request.error = false;
	  $request.errors = [];

	  $parent.find('[data-param]').each(function(k,v){
	      var key = $(this).data('param');
	      var value = $(this).val();
	      if ($request.error)return;
	      if ($(this).data('required') && !$(this).data('ignore')){
	        if (value == ''){
	          $request.error = true;
	          $request.errors.push(key + ' is required!');
	          return;
	        }else{
	         // data.collect[key] = value;  
	         $request.collect[key] = value;
	        }
	      }else{
	       // data.collect[key] = value;  
	       $request.collect[key] = value;
	      }
	      
	  });
	  return $request;   	
   }    

    if ($el.is('[data-param]')){
      
       collect_data($parent);

    }


  });




  ///handle data-api
  $('body').on('data-api','[data-api]',function(e){

  
   var api = $(this).data('api');

   var $parent = $(this);

   var $trigger_el = null;
   
   if ($parent.find('[data-button]').is('[data-button]')){
     $trigger_el = $parent.find('[data-button]');
   }else if ($parent.find('[data-sync-button]').is('[data-sync-button]')){
     $trigger_el = $parent.find('[data-sync-button]');
   }


   $parent.find('[data-param]').trigger('data-param'); //collect data
   

   if ($trigger_el != null)$trigger_el.html($trigger_el.data('waiting-text'));

   if ($request.error){
     
     if ($trigger_el != null)$trigger_el.html($trigger_el.data('waiting-recover'));     
     __action('log_error',$request.errors.join(' , '));
     __action(api + '_error',$request.errors.join(' , '));

   }else{   

   	   __action('ajax_loading');

		   $.ajax({
		    url:'http://r2soft.com.ng/vet2/actions/api/' + api,
		    type:'post',
		    data:{
		      post_data:$request.collect
		    },
		    success:function(response){
		      
		      var resp = JSON.parse(response);

		      if (typeof(resp.error) != 'undefined'){

		        if (resp.error*1 == 1){
		         __action('log_error',resp.message);
		         __action(api + '_error',resp);
		        }else{
		         __action('log_success',resp.message);
		         __action(api,resp);
		         $parent.find('[data-array]').trigger('data-array');
		         $parent.find('[data-param]').trigger('data-clear');
		        }

		      }else{

		      	__action(api,resp);
		      	$parent.find('[data-array]').trigger('data-array');
		        
		      }
		      
		      __action('ajax_done_loading');

		      if ($trigger_el != null)$trigger_el.html($trigger_el.data('waiting-recover'));     

		    }
		   });
    }		   


  });
  // $('[data-api]').trigger('data-api');






  $('body').on('data-container','[data-container]',function(e){
    
    var $el = $(e.target);

    if ($el.is('[data-container]')){


    	if ($el.data('container')){
        
	        var code = eval_expr_do('',$el.data('container'));

	        $el.find('[data-param]').trigger('data-param');

	        if ($request.error){
	         __action('log_error',[$request.errors.join(' , ')]);
	        }else{
	         code();	
	        }

    	}

        
        



        $el.find('[data-array]').trigger('data-array');

    }

  });


  //handle data-api
  $('body').on('click','[data-api]',function(e){
   
    var $el = $(e.target);
    var $parent = $(this);


    if ($el.is('[data-button]')){
        
        $parent.trigger('data-api');

        return false;

    }else if ($el.is('[data-sync-button]')){

         $parent.trigger('data-api');

         return false;
    }

  });


  //handle data-container
  $('body').on('click','[data-container]',function(e){
   
    var $el = $(e.target);
    var $parent = $(this);


    if ($el.is('[data-button]')){
        
        $parent.trigger('data-container');

        return false;

    }else if ($el.is('[data-sync-button]')){

         $parent.trigger('data-container');

         return false;
    }

  });


  //handle data-trigger-batch
  $('body').on('click','[data-api],[data-container],[data-blank]',function(e){
  	
  	var $el = $(e.target);
  	var $parent = $(this);

    if ($el.is('[data-trigger-batch]')){
     var code = $el.data('trigger-batch');
         code = eval_expr_return('',code); 	
         code = code();
         $.each(code,function(k,v){
           $parent.find('[' + v + ']').trigger(v);   	
         });
    }

  });

  $('body').on('data-button','[data-api],[data-container]',function(e){
  	var $el = $(e.target);
  	
  	if ($el.is('[data-button]')){
       $el.trigger('click');
  	}

  });

  $('body').on('click','[data-api],[data-container],[data-blank]',function(e){
  	
  	var $el = $(e.target);
    
    if ($el.is('[data-v-slide]')){
      
      var $div = $el.find('div');

      if (!$el.data('clicked')){
        $el.data('clicked',true); 
        $div.slideDown('slow');
      }else{
      	// $el.data('clicked',false); 
      	// $div.slideUp('slow');
      }



    }


  });


  //triggers here
  $('[data-set]').trigger('data-set');
  $('[data-trigger]').trigger('data-trigger');
  $('[data-array]').trigger('data-array');


   




 
 });

})(jQuery,window,undefined);
