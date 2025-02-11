/* display message after user selects a page for the gallery */
function lg_page_change() {
  var theID = jQuery('#gallery_id').val();
  if (theID != '-1') {
    jQuery('#gallery_prev').val(pageURLs[theID]);
    jQuery('#gallery_prev_p').html(pageURLs[theID]);
    if (pageCodes[theID]) {
      jQuery('#lg_insertcode').hide();
    } else {
      jQuery('#lg_insertcode').show();
      jQuery('#a_insert_shortcode').attr('href', 'admin.php?page=lazyest-gallery&insert_shortcode=' + theID);
    }
  } else {
    if (window.confirm(lazyestmgr.newpage)) window.location = "/wp-admin/page-new.php";
  }
}

function lg_random_change() {
  if ('random_image' == jQuery('#folder_image').val()) {
    jQuery('random_subfolder_div').slideDown();
  } else {
    jQuery('random_subfolder_div').slideUp();
  }
}

/* edit folder and images scripts */

/* table drag n drop onDrop */
function lg_onDrop(table, row) {
	var i = 1;
	jQuery(table).find('input[type=hidden]').each(function(){
  	if (jQuery(this).attr('name').indexOf('index') > -1) {
  		jQuery(this).val(i);
  		i++;
  	}
	});  
  var sorted_cells = table.getElementsByTagName('th');
  for (i = 0;
  (i < sorted_cells.length); i++) {
    if (sorted_cells[i].className.search(/\bsorttable_sorted\b/) != -1) {
      sorted_cells[i].className.replace('sorttable_sorted', '');
    }
    if (sorted_cells[i].className.search(/\bsorttable_sorted_reverse\b/) != -1) {
      sorted_cells[i].className.replace('sorttable_sorted_reverse', '');
    }
  }
}

/* rebuild url after move or copy */
function stripMoveCopy() {
  var theSearch = String(window.location.search);
  var qs = theSearch.split('&');
  newURL = window.location.protocol + '//' + window.location.host + window.location.pathname;
  for (i = 0; i < qs.length; i++) {
    if (qs[i].match('page') || qs[i].match('folder')) {
      newURL = newURL + qs[i] + '&';
    }
  }
  newURL = newURL.substring(0, newURL.length - 1);
  return newURL;
}

function lg_refreshFolder() {
	folderForm = jQuery('#sort_images_form' );
	data = {
    action: 'lg_refresh_folder',
    _wpnonce: jQuery('#_wpnonce' ).val(),
    folder : jQuery( "input[name='directory']", folderForm ).val(),
    lg_paged : jQuery( "input[name='lg_paged']", folderForm ).val()
  }
  jQuery.post(ajaxurl, data, function (response) {  	
  	jQuery('#imagesbox' ).queue( function() {
  		jQuery(this).fadeOut();
			jQuery('#sort_images' ).replaceWith( response )	;
			if(typeof lg_js_loadNext == 'function') {
	    	lg_js_loadFirst();	    		    	
			}
  		jQuery(this).fadeIn(); 	
			if(typeof lg_js_loadNext == 'function') {
  			lg_js_loadNext();  			
     	} 
     	prepareDragDropTables()
		 	jQuery(this).dequeue();        
   	});
  });
}

/* ajax list subfolders */
function lg_admin_list_folder() {
  if (jQuery('.lg_admin_list_folders').length) {
    jQuery('.lg_admin_list_folders').each(function () {
      var thisFolder = jQuery(this).attr('title');
      var data = {
        action: 'lg_admin_list_folders',
        folder: thisFolder
      };
      var theID = '#' + jQuery(this).attr('id');
      jQuery.post(ajaxurl, data, function (response) {
        jQuery(theID).html(response);
      });
    });
  }
}

/* ajax list folder image count */
function lg_folder_subcount() {
  if (jQuery('.lg_folder_subcount').length) {
    jQuery('.lg_folder_subcount').each(function () {
      var thisFolder = jQuery(this).attr('title');
      var data = {
        action: 'lg_folder_subcount',
        folder: thisFolder
      };
      var theID = '#' + jQuery(this).attr('id');
      jQuery.post(ajaxurl, data, function (response) {
        jQuery(theID).html(response);
      });
    });
  }
}


/* ajax rebuild database */  
function nextDatabase( toGo, toDo ) {
  var data = {
    action: 'lg_rebuild_database',
    folder: toGo
  }
  jQuery.post( ajaxurl, data, function( response ) { 
    toGo = parseInt( response, 10 );
    percentage = 100 - Math.floor( 100 * toGo / toDo );
    jQuery('#database-bar').progressBar( percentage );
    if ( 0 < toGo ) {
      nextDatabase( toGo, toDo );
    } else {
      jQuery('#rebuild-database').html( lazyestmgr.rebuildReady );
    }        
  });
}

/* ajax rebuild cache */  
function nextRebuild( toGo, toDo, toCache ) {
  var data = {
    action: 'lg_rebuild_cache',
    folder: toGo,
    image: toCache
  }
  jQuery.post( ajaxurl, data, function( response ) {
		progress = response.split(',');   	
    toGo = parseInt( progress[0], 10 );
    toCache = parseInt( progress[1], 10 );
    percentage = 100 - Math.floor( 100 * toGo / toDo );
    jQuery('#cache-bar').progressBar( percentage );
    if ( 0 < toGo ) {
      nextRebuild( toGo, toDo, toCache );
    } else {
      jQuery('#rebuild-cache').html( lazyestmgr.rebuildReady );
    }        
  });
}

// prepare drag and drop tables

var isMANUAL = lazyestmgr.manual;
function prepareDragDropTables() {
  if (isMANUAL == 'MANUAL') {
    if ( jQuery('#sort_images').length )
      jQuery('#sort_images').tableDnD({
        onDrop: lg_onDrop,
        onDragClass: 'lg_alternate',
        dragHandle: 'dragHandle'
      });
    if ( jQuery('#sort_gallery').length )
      jQuery('#sort_gallery').tableDnD({
        onDrop: lg_onDrop,
        onDragClass: 'lg_alternate',
        dragHandle: 'dragHandle'
      });
  }	
}

/* initialization at document ready */
jQuery(document).ready(function () {  
  
  /* show elements relying of javascript */
  jQuery('.hide-if-no-js').show();

	lg_admin_list_folder();
	
	lg_folder_subcount();
	
	/* pagination scripts */
	jQuery("input[name='lg_paged']").live( 'keypress', function(e) {
    var c = e.which ? e.which : e.keyCode;
    if (c == 13) {
    	aVal = jQuery(this).val();
    	jQuery("input.current-page:text").each(function(){
    		jQuery(this).val(aVal);
    	});
    }	
	});

  /* ajax read context menu */
  if (jQuery('#lg_context').length) {
    var data = {
      action: 'lg_admin_contextmenu',
      folder: jQuery('#lg_context').attr('title')
    };
    jQuery.post(ajaxurl, data, function (response) {
      if ('none' != response) {
        jQuery('#lg_context').html(response);
        jQuery('#lg_context').attr('title', '');
        jQuery(".copy_to").contextMenu({
          menu: 'lg_context'
        }, function (action, el, pos) {
          var theManager = stripMoveCopy();
          window.location = theManager + '&copy_to=' + action + '&image=' + jQuery(el).attr('rel');
        });
        jQuery(".move_to").contextMenu({
          menu: 'lg_context'
        }, function (action, el, pos) {
          var theManager = stripMoveCopy();
          window.location = theManager + '&move_to=' + action + '&image=' + jQuery(el).attr('rel');
        });
        jQuery('.hide-if-no-folders').show();
      }
    });
  }

  /* invoke table drag n drop for manually sorting */  
  prepareDragDropTables()
  

  /* set move to top/bottom behavior for manually sorting */
  jQuery(".to_top,.to_bottom").click(function () {
    var row = jQuery(this).parents("tr:first");
    row.hide();
    if (jQuery(this).is(".to_top")) {
      var firstrow = jQuery("#image_list").children("tr:first");
      row.insertBefore(firstrow);
    } else {
      var lastrow = jQuery("#image_list").children("tr:last");
      row.insertAfter(lastrow);
    }
    row.hide();
    row.fadeIn('slow');

    var table = document.getElementById("sort_images");
    lg_onDrop(table, row);
  });

  /* ajax insert new folder for upload tabs */
  jQuery('.lg_upload-insertfolder').live( 'click', function () {
    var theID = jQuery(this).attr('id');
    var folderID = theID.substr(6);
    var folderDir = jQuery(this).attr('rel');
    var ajaxImg = '#ajax-loading_' + folderID;
    var actionsDiv = '#lg_actions_' + folderID;
    jQuery(ajaxImg).show();
    var data = {
      action: 'lg_insert_folder_shortcode',
      folder: folderDir
    };
    jQuery('.media-item').each(function () {
      if (jQuery(this).attr('id') != 'media-item-' + folderID) {
        jQuery(this).slideUp('slow')
      }
    });
    jQuery('.tablenav-pages').hide();
    jQuery.post(ajaxurl, data, function (response) {
      jQuery('#media-items').append(response);
      jQuery(actionsDiv).hide();
    });
  });

  /* ajax show folder contents for upload tabs */
  jQuery('.lg_upload-showfolder').live( 'click', function () {
    var theID = jQuery(this).attr('id');
    var folderID = theID.substr(6);
    var folderDir = jQuery(this).attr('rel');
    var ajaxImg = '#ajax-loading_' + folderID;
    var actionsDiv = '#lg_actions_' + folderID;
    var backDiv = '#lg_back_' + folderID;
    var current_URL = String(window.location) + '&folder=' + folderID;
    jQuery(ajaxImg).show();
    var data = {
      action: 'lg_upload_showfolder',
      folder: folderDir,
      current_url: current_URL
    };
    jQuery('.media-item').each(function () {
      if (jQuery(this).attr('id') != 'media-item-' + folderID) {
        jQuery(this).slideUp('slow')
      }
    });
    jQuery('.tablenav-pages').hide();
    jQuery.post(ajaxurl, data, function (response) {
      jQuery('#media-items').append(response );
      {      	
				if(typeof lg_js_loadFirst == 'function') {    
    			lg_js_loadFirst();
    		}          								   
				if(typeof lg_js_loadNext == 'function') {    
    			lg_js_loadNext();
    		}       		
      } 
      jQuery(actionsDiv).hide();
      jQuery(backDiv).show();
    });
  });
  
	jQuery('.lg_upload-insertimage').live( 'click', function () {
	  var theID = jQuery(this).attr('id');  
	  var imageID = theID.substr(6);
	  var ajaxImg = '#ajax-loading_' + imageID;
	  var actionsDiv = '#lg_actions_' + imageID;
	  var itemID = '#media-item-' + imageID;
	  var pinkyID = '#pinky_' + imageID;
	  var backID = '#lg_back_' + imageID;
	  jQuery(ajaxImg).show();
	  var data = {
	    action: 'lg_insert_image_shortcode',
	    image: jQuery(this).attr('rel')
	  };
	  jQuery('.lazyest-item').each(function () {
	    if (jQuery(this).attr('id') != 'media-item-' + imageID) {
	      jQuery(this).slideUp('slow')
	    }
	  });
	  jQuery('.tablenav-pages').hide();
	  jQuery.post(ajaxurl, data, function (response) {
	    jQuery(itemID).append(response);
	    jQuery(actionsDiv).hide();
	    jQuery(pinkyID).hide();
	    jQuery(backID).show();
	  });
	});

  if ( isMANUAL != 'MANUAL' ) {
	  /* ajax new (sub)folder for gallery or folder */
	  jQuery('.lgn_button').click(function () {
	    if ('' == jQuery('#lg_nw_folder').val()) return false;
	    jQuery('#lgn_ajax-loading').show();
	    var data = {
	      action: 'lg_folder_newfolder',
	      _wpnonce: jQuery('#_wpnonce').val(),
	      folder: jQuery('#folder_id').val(),
	      directory: jQuery('#directory').val(),
	      new_folder_name: jQuery('#lg_nw_folder').val(),
	      create_new_folder: 'Add'
	    }
	    var success = lazyestmgr.foldersuccess.replace('%s', jQuery('#lg_nw_folder').val());
	    var message = '<div class="updated"><p>' + success + '</p></div>';
	    jQuery.post(ajaxurl, data, function (response) {
	      if ( 0 < response.indexOf('postbox')) {
	        jQuery('#foldersdiv').html(response, function() { 
	        });
	        if (jQuery('#foldersdiv').is(':hidden')) jQuery('#foldersdiv').slideDown();
	      } else {      	
	        message = response;   
	      }
		    jQuery('#lgn_ajax-loading').hide( function() {      	  
					lg_admin_list_folder();
					lg_folder_subcount();
	      });
	      if ( jQuery('#message').length ){      
	      	jQuery( '#message' ).replaceWith(message);
				} else {
	      	jQuery( '#ajax-div' ).html(message);
				}
	    });
	    return false;
	  });
  }

  /* ajax delete cache */
  jQuery('#lg_clear-thumbs').click(function () {
    jQuery('#lga_ajax-loading').show();
    var data = {
      action: 'lg_clear_thumbs',
      folder: jQuery('#folder_id').val(),
      directory: jQuery('#directory').val(),
      file_to_delete: lazyestmgr.thumbs,
      cache: 'thumbs'
    }
    jQuery.post(ajaxurl, data, function (response) {
      jQuery('ajax-div').html(response);
      jQuery('#message').remove();
      return false;
    });
  });

  /* view switcher */
  jQuery('#lazyest-view-switch a').click(function () {
    if (jQuery(this).attr('id') == 'view-link-list') {
      jQuery('#sortimages').addClass('listview');
      jQuery(this).addClass('current');
      jQuery('#view-link-excerpt').removeClass('current');
    } else {
      jQuery('#sortimages').removeClass('listview');
      jQuery(this).addClass('current');
      jQuery('#view-link-list').removeClass('current');
    }
    return false;
  });

  /* title overlay */
  if (jQuery('#title').val() == '') jQuery('#title').siblings('#title-prompt-text').css('visibility', '');
  jQuery('#title-prompt-text').click(function () {
    jQuery(this).css('visibility', 'hidden').siblings('#title').focus();
  });
  jQuery('#title').blur(function () {
    if (this.value == '') jQuery(this).siblings('#title-prompt-text').css('visibility', '');
  }).focus(function () {
    jQuery(this).siblings('#title-prompt-text').css('visibility', 'hidden');
  }).keydown(function (e) {
    jQuery(this).siblings('#title-prompt-text').css('visibility', 'hidden');
    jQuery(this).unbind(e);
  });

  jQuery('#add-remove-editor').click(function () {
    if (jQuery('#edit_editors').is(':hidden')) {
      jQuery('#edit_editors').slideDown();
    } else {
      jQuery('#edit_editors').slideUp();
    }
    return false;
  });

  jQuery('#add-remove-author').click(function () {
    if (jQuery('#edit_authors').is(':hidden')) {
      jQuery('#edit_authors').slideDown();
    } else {
      jQuery('#edit_authors').slideUp();
    }
    return false;
  });

  /* ajax add editor to gallery */
  jQuery('#add-editor').click(function () {
    if ( jQuery('#not-editors option:selected').length ) {    
      jQuery('#editor-ajax-loading').css('visibility', 'visible');
      jQuery('#not-editors option:selected').each(function () {
        data = {
          action: 'lg_add_user',
          _wpnonce: jQuery('#_wpnonce').val(),
          id: jQuery(this).val(),
          type: 'editor'
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {
            option.remove().appendTo('#is-editors');
            var listHtml = '';
            var lc = 0;
            jQuery('#is-editors option').each(function () {
              if (lc < 6) {
                if (lc == 0) listHtml = jQuery(this).html();
                else listHtml = jQuery(this).html() + ', ' + listHtml;
                lc++
              }
            });
            if (lc == 6) listHtml = listHtml + '&hellip;';
            jQuery('#list-editors').html(listHtml);
            jQuery('#not-authors option').each(function () {
              if (option.val() == jQuery(this).val()) {
                jQuery(this).remove(); // editors have author capabilities, don't list them with editors'             
              }
            });
            listHtml = '';
            lc = 0;
            jQuery('#is-authors option').each(function () {
              if (option.val() == jQuery(this).val()) {
                jQuery(this).remove(); // editors have author capabilities, don't list them with editors              
              } else {
                if (lc < 6) {
                  if (lc == 0) listHtml = jQuery(this).html();
                  else listHtml = jQuery(this).html() + ', ' + listHtml;
                  lc++
                }
              }
              if (lc == 6) listHtml = listHtml + '&hellip;';
              jQuery('#list-authors').html(listHtml);
            });
          }
          jQuery('#editor-ajax-loading').css('visibility', 'hidden');
        });
      });  
    }

    return false;
  });

  /* ajax remove editor from gallery */
  jQuery('#remove-editor').click(function () {
    if ( jQuery('#is-editors option:selected').length ) {    
      jQuery('#editor-ajax-loading').css('visibility', 'visible');
      jQuery('#is-editors option:selected').each(function () {
        data = {
          action: 'lg_remove_user',
          _wpnonce: jQuery('#_wpnonce').val(),
          id: jQuery(this).val(),
          type: 'editor'
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {
            option.remove().appendTo('#not-editors').clone().appendTo('#not-authors');
            var listHtml = '';
            var lc = 0;
            jQuery('#is-editors option').each(function () {
              if (lc < 6) {
                if (lc == 0) listHtml = jQuery(this).html();
                else listHtml = jQuery(this).html() + ', ' + listHtml;
                lc++
              }
            });
            if (lc == 6) listHtml = listHtml + '&hellip;';
            jQuery('#list-editors').html(listHtml);
          }
          jQuery('#editor-ajax-loading').css('visibility', 'hidden');
        });
      });  
    }

    return false;
  });

  /* ajax add author to gallery */
  jQuery('#add-author').click(function () {
    if ( jQuery('#not-authors option:selected').length ) {    
      jQuery('#author-ajax-loading').css('visibility', 'visible');
      jQuery('#not-authors option:selected').each(function () {
        data = {
          action: 'lg_add_user',
          _wpnonce: jQuery('#_wpnonce').val(),
          id: jQuery(this).val(),
          type: 'author'
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {
            option.remove().appendTo('#is-authors');
            var listHtml = '';
            var lc = 0;
            jQuery('#is-authors option').each(function () {
              if (lc < 6) {
                if (lc == 0) listHtml = jQuery(this).html();
                else listHtml = jQuery(this).html() + ', ' + listHtml;
                lc++
              }
            });
            if (lc == 6) listHtml = listHtml + '&hellip;';
            jQuery('#list-authors').html(listHtml);
          }
          jQuery('#author-ajax-loading').css('visibility', 'hidden');
        });
      });  
    }
    return false;
  });

  /* ajax remove author from gallery */
  jQuery('#remove-author').click(function () {
    if ( jQuery('#is-authors option:selected').length ) {      
      jQuery('#author-ajax-loading').css('visibility', 'visible');
      jQuery('#is-authors option:selected').each(function () {
        data = {
          action: 'lg_remove_user',
          _wpnonce: jQuery('#_wpnonce').val(),
          id: jQuery(this).val(),
          type: 'author'
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {
            option.remove().appendTo('#not-authors');
            var listHtml = '';
            var lc = 0;
            jQuery('#is-authors option').each(function () {
              if (lc < 6) {
                if (lc == 0) listHtml = jQuery(this).html();
                else listHtml = jQuery(this).html() + ', ' + listHtml;
                lc++
              }
            });
            if (lc == 6) listHtml = listHtml + '&hellip;';
            jQuery('#list-authors').html(listHtml);
          }
          jQuery('#author-ajax-loading').css('visibility', 'hidden');
        });
      });  
    }
    return false;
  });

  /* ajax set viewer level for gallery */
  jQuery('#set_viewer_level').click(function () {
    jQuery('#viewer-ajax-loading').css('visibility', 'visible');
    data = {
      action: 'lg_set_viewer_level',
      _wpnonce: jQuery('#_wpnonce').val(),
      viewer_level: jQuery('input[name=viewer_level]:checked').val()
    }
    jQuery.post(ajaxurl, data, function (response) {
      if ('true' != response) {
        jQuery('#ajax-div').html('<div id="message" class="error"><p>' + response + '</p></div>');
      } else {
        jQuery('#ajax-div').html('<div id="message" class="updated"><p>' + lazyestmgr.viewersuccess + '</p></div>');
      }
      jQuery('#message').remove();
      jQuery('#viewer-ajax-loading').css('visibility', 'hidden');
    });
    return false;
  });

  /* ajax add manager in settings */
  jQuery('#add-manager').click(function () {
    if ( jQuery('#not-managers option:selected').length ) {  
      jQuery('#manager-ajax-loading').css('visibility', 'visible');    
      jQuery('#not-managers option:selected').each(function () {
        data = {
          action: 'lg_add_user',
          _wpnonce: jQuery('#_wpnonce').val(),
          lg_settings: jQuery('#lg_settings').val(),
          id: jQuery(this).val(),
          type: 'manager'
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {            
            option.remove().appendTo('#is-managers');
          }
          jQuery('#manager-ajax-loading').css('visibility', 'hidden');
        });
      });
    }    
    return false;
  });

  /* ajax remove manager in settings */
  jQuery('#remove-manager').click(function () {
    if ( jQuery('#is-managers option:selected').length ) {    
      jQuery('#manager-ajax-loading').css('visibility', 'visible');
      jQuery('#is-managers option:selected').each(function () {
        data = {
          action: 'lg_remove_user',
          _wpnonce: jQuery('#_wpnonce').val(),
          lg_settings: jQuery('#lg_settings').val(),
          id: jQuery(this).val(),
          type: 'manager'
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {
            option.remove().appendTo('#not-managers');
          }
          jQuery('#manager-ajax-loading').css('visibility', 'hidden');
        });
      });  
    }
    return false;
  });
  
  /* ajax add author to folder */
  jQuery('#add-fauthor').click( function() {
     if ( jQuery('#not-authors option:selected').length ) {   
      jQuery('#author-ajax-loading').css('visibility', 'visible');
      jQuery('#not-authors option:selected').each(function() {
        data = {
          action: 'lg_add_fauthor',
          _wpnonce: jQuery('#_wpnonce').val(),
          folder: jQuery('#directory').val(),
          id: jQuery(this).val()
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {
            option.remove().appendTo('#is-authors');
            var listHtml = '';
            var lc = 0;
            jQuery('#is-authors option').each(function () {
              if (lc < 6) {
                if (lc == 0) listHtml = jQuery(this).html();
                else listHtml = jQuery(this).html() + ', ' + listHtml;
                lc++
              }
            });
            if (lc == 6) listHtml = listHtml + '&hellip;';
            jQuery('#list-authors').html(listHtml);
          }
          jQuery('#author-ajax-loading').css('visibility', 'hidden');
        });      
      });
    }
    return false;     
  });
  
  /* ajax remove author form folder */
  jQuery('#remove-fauthor').click( function() {
     if ( jQuery('#is-authors option:selected').length ) {   
      jQuery('#author-ajax-loading').css('visibility', 'visible');
      jQuery('#is-authors option:selected').each(function() {
        data = {
          action: 'lg_remove_fauthor',
          _wpnonce: jQuery('#_wpnonce').val(),
          folder: jQuery('#directory').val(),
          id: jQuery(this).val()
        }
        var option = jQuery(this);
        jQuery.post(ajaxurl, data, function (response) {
          if ('true' == response) {
            option.remove().appendTo('#not-authors');
            var listHtml = '';
            var lc = 0;
            jQuery('#is-authors option').each(function () {
              if (lc < 6) {
                if (lc == 0) listHtml = jQuery(this).html();
                else listHtml = jQuery(this).html() + ', ' + listHtml;
                lc++
              }
            });
            if (lc == 6) listHtml = listHtml + '&hellip;';
            jQuery('#list-authors').html(listHtml);
          }
          jQuery('#author-ajax-loading').css('visibility', 'hidden');
        });      
      });
    }
    return false;     
  });
  
  if ( jQuery('#cache-bar').length ) {
	  jQuery('#cache-bar').progressBar( { boxImage: lazyestmgr.boxImage, barImage: lazyestmgr.barImage } );
	  jQuery('#rebuild-cache').click( function() { 
	    jQuery('#cache-bar').css('visibility', 'visible' );
	    var data = {
	      action: 'lg_rebuild_cache',
	      folder: 0,
	      image: 0
	    }    
	    jQuery.post( ajaxurl, data, function( response ) {
	    	progress = response.split(',');
	      var toGo = parseInt( progress[0], 10 );    
	      var toDo = toGo;
	      var toCache = parseInt( progress[1], 10 );     
	      if ( 0 < toGo ) {
	        var percentage = Math.floor( 100 / toDo );
	        jQuery('#cache-bar').progressBar( percentage );
	        nextRebuild( toGo, toDo, toCache );
	      } else {
	        jQuery('#cache-bar').progressBar( 100 );        
	      }        
	    } );    
	    return false;
	  });
	}
  
  if ( jQuery('#database-bar').length ) {
	  jQuery('#database-bar').progressBar( { boxImage: lazyestmgr.boxImage, barImage: lazyestmgr.barImage } );
	  jQuery('#rebuild-database').click( function() {      
	    jQuery('#database-bar').css('visibility', 'visible' );
	    var data = {
	        action: 'lg_truncate_table',
	        _wpnonce: jQuery('#lg_settings').val()        
	    }     
	    jQuery.post( ajaxurl, data, function( response ) {
	      if ( '1' != response ) {
	        jQuery('#ajax-div').html( '<div id="message" class="error"><p>'+response+'</p></div>' );
	        jQuery('#database-bar').css('visibility', 'hidden' );
	        return false;
	      }
	      var data = {
	        action: 'lg_rebuild_database',
	        folder: 0
	      }
	      jQuery.post( ajaxurl, data, function( response ) {
	        var toGo = parseInt( response, 10 );   
	        var toDo = parseInt( response, 10 );         
	        if ( 0 < toDo ) {
	          var percentage = Math.floor( 100 / toDo );
	          jQuery('#database-bar').progressBar( percentage );
	          nextDatabase( toGo, toDo );
	        } else {
	          jQuery('#database-bar').progressBar( 100 );        
	        }        
	      } );    
	    } );
	    return false;
	  });  
	}
	
});