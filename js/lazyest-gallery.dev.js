/* Scripts for Lazyest Gallery Frontend */
/* Copyright (c) Brimosoft http://brimosoft.nl */
/* By Marcel Brinkkemper */


function lg_doCounts() { 
  
  /* count images in folders table */
  if ( jQuery('.folder-count-all').length ) {
    jQuery('.folder-count-all').each( function() {
      var theID = jQuery(this).attr('id');
      var thisFolder = lazyest_virtual.root + jQuery(this).attr('title');
      var data = {
        action: 'lg_folder_subcount',
        allcount: 'true',
        folder: thisFolder
      };                 
      jQuery.post( lazyest_ajax.ajaxurl, data, function(response) {   
        theID = '#' + theID;                 
        jQuery(theID).html(response);
      });    
    });
  }
    
  /* count subfolders in folders table */  
  if ( jQuery('.folder-count-sub').length ) {
    jQuery('.folder-count-sub').each( function() {
      var theID = jQuery(this).attr('id');
      var thisFolder = lazyest_virtual.root + jQuery(this).attr('title');
      var data = {
        action: 'lg_folder_subcount',
        folder: thisFolder
      };              
      jQuery.post( lazyest_ajax.ajaxurl, data, function(response) {        
        theID = '#' + theID;                 
        jQuery(theID).html(response);
      });    
    });
  }
}

jQuery(window).ready(function(){     
  
  lg_doCounts();
  
   /* pagination events */
  if ( lazyest_ajax.pagination == 'ajax' ) {

	  /* prev next for folder thumbnails */
	  jQuery('.folder_pagination a').live( 'click', function() {
	    var folderForm = jQuery(this).closest('form');
	    var folderDiv = jQuery(this).closest('.folders');
	    var galleryDiv = jQuery(this).closest('.lg_gallery');
	    var current = parseInt( jQuery("input[name='current']", folderForm ).val(), 10 );
	    var paged;  		   
	    switch (jQuery(this).attr('class')) {
	     case 'first-page' : paged = 0; break;
	     case 'prev-page'  : paged = current - 1; break;
	     case 'next-page'  : paged = current + 1; break;
	     case 'last-page'  : paged = parseInt( jQuery("input[name='last_page']", folderForm ).val(), 10 );
	    }         
	    
	    data = {
	      action: 'lg_next_dirs',
	      folder: jQuery("input[name='folder']", folderForm ).val(),			 
				user_id: jQuery("input[name='user_id']", folderForm ).val(),      
				virtual: jQuery("input[name='virtual']", folderForm ).val(),           
	      perpage: jQuery("input[name='perpage']", folderForm ).val(),    
	      columns: jQuery("input[name='columns']", folderForm ).val(),  
	      ajax_nonce: jQuery("input[name='ajax_nonce']", folderForm ).val(),
	      request_uri: jQuery("input[name='request_uri']", folderForm ).val(),
	      lg_paged:  paged
	    }
	    jQuery.post( lazyest_ajax.ajaxurl, data, function(response) {
				folderDiv.replaceWith( response ) 
				if(typeof lg_js_loadFirst == 'function') {    
	  			lg_js_loadFirst();
	  		}      
	   	 	lg_doCounts();						   
				if(typeof lg_js_loadNext == 'function') {    
	  			lg_js_loadNext();
	  		} 
	  		jQuery(window).trigger('lazyest_refresh');
	  	});
	    return false;
	  });
	  
	  /* prev next for image thumbnails */
	  jQuery('.image_pagination a').live( 'click', function() {
	    var imageForm = jQuery(this).closest('form');
	    var thumbDiv = jQuery(this).closest('.thumb_images');
	    var galleryDiv = jQuery(this).closest('.lg_gallery');
	    var current = parseInt( jQuery("input[name='current']", imageForm ).val(), 10 );
	    var paged;     
	    switch (jQuery(this).attr('class')) {
	     case 'first-page' : paged = 0; break;
	     case 'prev-page'  : paged = current - 1; break;
	     case 'next-page'  : paged = current + 1; break;
	     case 'last-page'  : paged = parseInt( jQuery("input[name='last_page']", imageForm ).val(), 10 );
	    }        	  
	    data = {
	      action: 'lg_next_thumbs',
	      folder: lazyest_virtual.root + jQuery("input[name='folder']", imageForm ).val(),      
	      perpage: jQuery("input[name='perpage']", imageForm ).val(),    
	      columns: jQuery("input[name='columns']", imageForm ).val(),  
	      post_id: jQuery("input[name='post_id']", imageForm ).val(),
	      ajax_nonce: jQuery("input[name='ajax_nonce']", imageForm ).val(),
	      request_uri: jQuery("input[name='request_uri']", imageForm ).val(), 
	    	virtual: lazyest_virtual.root,      
	      lg_pagei:  paged
	    }			
	    jQuery.post( lazyest_ajax.ajaxurl, data, function(response) {
				thumbDiv.replaceWith( response );
				if(typeof lg_js_loadFirst == 'function') {  
	  			lg_js_loadFirst();     
	  		}      	   					   
				if(typeof lg_js_loadNext == 'function') {    
	  			lg_js_loadNext();
	  		}	 
	  		jQuery(window).trigger('lazyest_refresh');
	    });
	    return false;
	  });
	   
	  jQuery("input[name='lg_paged']").live( 'keypress', function(e) {
	    var c = e.which ? e.which : e.keyCode;
	    if (c == 13) {    	
	      e.preventDefault();
				var folderForm = jQuery(this).closest('form');
			  var folderDiv = jQuery(this).closest('.folders');
			  var galleryDiv = jQuery(this).closest('.lg_gallery');
			  var current = parseInt( jQuery( "input[name='current']", folderForm ).val(), 10 );
			  var newPage = parseInt( jQuery(this).val(), 10 );	  		  
			  if ( newPage != current ) {  	
			    var lastPage = jQuery( "input[name='last_page']", folderForm ).val();
			    if ( newPage < 1 ) {
			      newPage = 1;        
			      jQuery(this).val('1');
			    }
			    if ( newPage > lastPage ) {
			      newPage = lastPage;
			      jQuery(this).val(lastPage);  
			    }   
			    data = {
			      action: 'lg_next_dirs',
			      folder: jQuery("input[name='folder']", folderForm ).val(),			 
						user_id: jQuery("input[name='user_id']", folderForm ).val(),      
						virtual: jQuery("input[name='virtual']", folderForm ).val(),     
			      perpage: jQuery("input[name='perpage']", folderForm ).val(),    
			      columns: jQuery("input[name='columns']", folderForm ).val(),  
			      request_uri: jQuery("input[name='request_uri']", folderForm ).val(),
			    	ajax_nonce: jQuery("input[name='ajax_nonce']", folderForm ).val(),
			      lg_paged:  newPage
			    } 
					
			    jQuery.post( lazyest_ajax.ajaxurl, data, function(response) {
		  			folderDiv.replaceWith( response )  				
						if(typeof lg_js_loadFirst == 'function') {    
	      			lg_js_loadFirst();
	      		} 			       
	       	 	lg_doCounts();						   
						if(typeof lg_js_loadNext == 'function') {    
	      			lg_js_loadNext();
						}						
	  				jQuery(window).trigger('lazyest_refresh');				
			  	});     
			  }
	      return false;
	    }
	  });
	  
	  jQuery("input[name='lg_pagei']").live( 'keypress', function(e) {
	    var c = e.which ? e.which : e.keyCode;
	    if (c == 13) {
	      e.preventDefault();
			  var imageForm = jQuery(this).closest('form');
			  var thumbDiv = jQuery(this).closest('.thumb_images');
			  var galleryDiv = jQuery(this).closest('.lg_gallery');
			  var current = parseInt( jQuery( "input[name='current']", imageForm ).val(), 10 );
			  var newPage = parseInt( jQuery(this).val(), 10 );  
			  if ( newPage != current ) {  	
			    var lastPage = jQuery( "input[name='last_page']", imageForm ).val();  
			    if ( newPage < 1 ) {
			      newPage = 1;        
			      jQuery(this).val('1');
			    }
			    if ( newPage > lastPage ) {
			      newPage = lastPage;
			      jQuery(this).val(lastPage);  
			    }
			    data = {
			      action: 'lg_next_thumbs',
			      folder: lazyest_virtual.root + jQuery("input[name='folder']", imageForm ).val(),      
			      perpage: jQuery("input[name='perpage']", imageForm ).val(),    
			      columns: jQuery("input[name='columns']", imageForm ).val(),  
			      request_uri: jQuery("input[name='request_uri']", imageForm ).val(),
			    	ajax_nonce: jQuery("input[name='ajax_nonce']", imageForm ).val(),    	
			    	post_id: jQuery("input[name='post_id']", imageForm ).val(),
			    	virtual: lazyest_virtual.root, 
			      lg_pagei:  newPage
			    }	    
					jQuery.post( lazyest_ajax.ajaxurl, data, function(response) {
						thumbDiv.replaceWith( response );
						if(typeof lg_js_loadFirst == 'function') {  
			  			lg_js_loadFirst();     
			  		}      	   					   
						if(typeof lg_js_loadNext == 'function') {    
			  			lg_js_loadNext();
			  		}	  			  		
	  				jQuery(window).trigger('lazyest_refresh');
	    		});  
			  }
	      return false;
	    }
	  });
	  
	jQuery(window).bind('lazyest_refresh', function(){
		if((typeof Shadowbox=='object')&&(typeof Shadowbox.setup=='function'))
			Shadowbox.setup();
		if(jQuery().fancybox)
			jQuery('a.lg').attr('rel', 'folder').fancybox();
	});
  
  } 
  /* end pagination event */ 
  
  
});  

function lazyestSlideSwitch() {
	jQuery('.lazyest_random_slideshow_item').each( function(){		
		var the_id = jQuery(this).attr( 'id' );	
		var active = jQuery( '#'+the_id+' div.lg_thumb.active' );
	  var next = active.next().length ? active.next() : jQuery('#'+the_id+' div.lg_thumb:first');
		var data = {
			action: 'lg_random_slideshow',
			_wpnonce : lazyest_widgets._nonce		
		}
		jQuery.post( lazyest_widgets.ajaxurl, data, function(response) {
			next.html(response);
			active.addClass('last-active');
			next.css({opacity: 0.0})
				.addClass('active')
				.animate({opacity: 1.0}, 500, function() {
				active.removeClass('active last-active');
				active.animate({opacity: 0.0},500);
	   	});
		});
	});
}

function lazyestRecentSwitch() {
	jQuery('.lazyest_recent_slideshow_item').each( function(){		
		var the_id = jQuery(this).attr( 'id' );	
		var active = jQuery( '#'+the_id+' div.lg_thumb.active' );
	  var next = active.next().length ? active.next() : jQuery('#'+the_id+' div.lg_thumb:first');
	  var thisInstance = the_id.charAt(25);
	  var thisRecent = parseInt(jQuery('span#recent_'+thisInstance).text());	  
	  var thisLatest = parseInt(jQuery('span#latest_'+thisInstance).text());
		var data = {
			action: 'lg_recent_slideshow',
			recent: thisRecent, 
			latest: thisLatest,
			_wpnonce : lazyest_widgets._nonce		
		}
		jQuery.post( lazyest_widgets.ajaxurl, data, function(response) {
			thisRecent++;
			if ( thisRecent == thisLatest ) {
				thisRecent = 0;				
			}				
			jQuery('#recent_'+thisInstance).html(thisRecent);
			next.html(response);
			active.addClass('last-active');
			next.css({opacity: 0.0})
				.addClass('active')
				.animate({opacity: 1.0}, 500, function() {
				active.removeClass('active last-active');
				active.animate({opacity: 0.0},500);
	   	});
		});
	});
}

jQuery(document).ready( function() {
	
	if( jQuery( '.lazyest_recent').length ) {
		jQuery( '.lazyest_recent').each( function() {
			var the_id = jQuery(this).attr( 'id' );
			var data = {
				action : 'lg_recent_image',
				recent : the_id.substring(7),
				_wpnonce : lazyest_widgets._nonce
			}
			jQuery.post( lazyest_widgets.ajaxurl, data, function(response) {
				if ( '0' != response ) {
					jQuery('#'+the_id).html(response);
					jQuery('#'+the_id).show();
					if(typeof lg_js_loadFirst == 'function') {    
	  				lg_js_loadFirst();
	  			}
					if(typeof lg_js_loadNext == 'function') {    
	      			lg_js_loadNext();      	
					}		  
				}
			});	
		});
	}
	
	if( jQuery( '.lazyest_random').length ) {
		jQuery( '.lazyest_random').each( function() {
			var the_id = jQuery(this).attr( 'id' );
			var data = {
				action : 'lg_random_image',
				random : the_id.substring(7),
				_wpnonce : lazyest_widgets._nonce
			}
			jQuery.post( lazyest_widgets.ajaxurl, data, function(response) {
				if ( '0' != response ) {
					jQuery('#'+the_id).html(response);
					jQuery('#'+the_id).show();
					if(typeof lg_js_loadFirst == 'function') {    
	  				lg_js_loadFirst();
	  			}
					if(typeof lg_js_loadNext == 'function') {    
	      			lg_js_loadNext();      	
					}		  
				}
			});	
		});
	}
	
	lazyestSlideSwitch();
	lazyestRecentSwitch();
}); 

if ( jQuery('.lazyest_random_slideshow_item').length ) { 
    jQuery( function(){
	    setInterval( 'lazyestSlideSwitch()', lazyest_widgets.slideshow_duration );
    });
}

if ( jQuery('.lazyest_recent_slideshow_item').length ) { 
    jQuery( function(){
	    setInterval( 'lazyestRecentSwitch()', lazyest_widgets.slideshow_duration );
    });
}

function lg_js_slideshow() {
    jQuery('.lg_loading').each( function() {
      jQuery(this).hide();
    });
    jQuery('.lg_slideshow').each( function() { 
      jQuery(this).children('a').css({opacity: 0.0});
      jQuery(this).children('a').css({visibility: 'visible'});
      var maxWidth = 0; 
      var maxHeight = 0;  
      jQuery(this).children('a').each( function(index, object) {
        var imgWidth = parseInt(jQuery(object).find('img:first').width());
        maxWidth = (imgWidth > maxWidth)? imgWidth : maxWidth;
        var imgHeight = parseInt(jQuery(object).find('img:first').height());
        maxHeight = (imgHeight > maxHeight)? imgHeight : maxHeight;
      })
      jQuery(this).css({width:maxWidth+'px', height:maxHeight+'px'});
      var first = jQuery(this).children('a:first');
      var firstImg = first.find('img');     
      first.css({opacity: 1.0}); 
      var leftPad = ( maxWidth - parseInt( jQuery(this).children('a:first').find('img').width() ) ) / 2;
      var bottomPad = ( maxHeight - parseInt( jQuery(this).children('a:first').find('img').height() ) ) / 2;
      var caption = firstImg.attr('rel');
      if ( !caption ) caption = '';
      if ( caption == ' ' ) { caption = '' };  	
      first.css({opacity: 0.0})
        .addClass('show')
        .animate({opacity: 1.0}, lazyestshow.slideview )
        .css({left: leftPad+'px', bottom:bottomPad+'px'});  
   	  jQuery(this).children('.sscaption').animate({opacity: 0.0}, { queue:false, duration:0 }).animate({height: '0px'}, { queue:true, duration:lazyestshow.captionqueue });
      if ( jQuery(this).attr('id').match('lg_slideshow') && ( caption.length > 0 )  ) {
      jQuery(this).children('.sscaption').css({ width: firstImg.width(), left: leftPad+'px', bottom:bottomPad+'px' });
    	jQuery(this).children('.sscaption').animate({opacity: 0.7},lazyestshow.captionopcty ).animate({height: '100px'},lazyestshow.captionqueue );
    	jQuery(this).children('.sscaption').html(caption);      
      } 
    }); 
  	setInterval('lg_js_gallery_show()', lazyestshow.duration );	
}

function lg_js_gallery_show() {
  jQuery('.lg_slideshow').each( function() {    
    var current = jQuery(this).children('a.show');
  	var next = ((current.next().length) ? ((current.next().hasClass('sscaption'))? jQuery(this).children('a:first') :current.next()) : jQuery(this).children('a:first'));	
  	var nextImg = next.find('img');
    var leftPad = ( parseInt( jQuery(this).width() ) - parseInt( nextImg.width() ) ) / 2;
    var bottomPad = ( parseInt( jQuery(this).height() ) - parseInt( nextImg.height() ) ) / 2;
    var caption = nextImg.attr('rel');  
    if ( !caption ) caption = '';
    if ( caption == ' ' ) { caption = '' };
  	next.css({opacity: 0.0})
  	.addClass('show')
  	.animate({opacity: 1.0}, lazyestshow.slideview )
    .css({left: leftPad+'px', bottom:bottomPad+'px'});
  	current.animate({opacity: 0.0}, lazyestshow.slideview )
  	.removeClass('show');    
   	jQuery(this).children('.sscaption').animate({opacity: 0.0}, { queue:false, duration:0 }).animate({height: '0px'}, { queue:true, duration:lazyestshow.captionqueue });
    if ( jQuery(this).attr('id').match('lg_slideshow') && ( caption.length > 0 ) ) {
      jQuery(this).children('.sscaption').css({ width: nextImg.width(), left: leftPad+'px', bottom:bottomPad+'px' });	
    	jQuery(this).children('.sscaption').animate({opacity: 0.7},lazyestshow.captionopcty ).animate({height: '100px'},lazyestshow.captionqueue );
    	jQuery(this).children('.sscaption').html(caption);      
    }	
  });
}
var lazyest_slideshow = true;
var lazyestCounter = 0;

jQuery(window).load(function() {  
  if(typeof(lazyest_loading) === 'undefined') {
    if ( jQuery('.lg_slideshow').length ) {  
      lg_js_slideshow();
    }
  }
}) ;