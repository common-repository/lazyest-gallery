<?php 

/**
 * Widgets for Lazyest Gallery.
 * 
 * This file holds the widgets for Lazyest Gallery
 *   
 * @package Lazyest Gallery
 * @subpackage Widgets
 * @copyright 2008-2013 Brimosoft
 * @version 1.1.20 (r466)
 * 
 * @link http://codex.wordpress.org/Widgets_API for WordPress Widgets API
 * @link http://core.trac.wordpress.org/browser/tags/3.5/wp-includes/widgets.php for WP_Widget class
 */


// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// Deactivate the lazyest-widgets plugin
include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
if ( is_plugin_active( 'lazyest-widgets/lazyest-widgets.php' ) )
	deactivate_plugins( 'lazyest-widgets/lazyest-widgets.php' );

/**
 * Lazyest_Widgets
 * 
 * @package Lazyest Gallery 1.1
 * @subpackage Widgets
 * @author Marcel Brinkkemper
 * @copyright 2008-2013 Brimosoft
 * @version 1.1.20
 * @access public
 */
class Lazyest_Widgets {
	
	 /**
   * @staticvar Lazyest_Widgets $instance single object in memory
   */ 
  private static $instance;
  
  /**
   * Lazyest_Widgets::__construct()
   * 
   * @return void
   */
  function __construct() {}
  
  /**
   * Lazyest_Widgets::init()
   * Initialize.
   * @return void
   */
  private function init() {
  	$this->actions();
  }
  
  /**
   * Lazyest_Widgets::instance()
   * 
   * @return object Lazyest_Widgets
   */
  public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new Lazyest_Widgets;
			self::$instance->init();
		}
		return self::$instance;  	
  }
  
  /**
   * Lazyest_Widgets::actions()
   * Add Actions.
   * 
   * @since 1.1.20
   * @uses add_action() for 'widget_init'
   * @return void
   */
  function actions() {
  	add_action( 'widgets_init', array( $this, 'register_widgets' ) );
  }
  
  /**
   * Lazyest_Widgets::register_widgets()
   * Regietsr the widgets in the WordPress Widgets API.
   * 
	 * @since 1.1.20
	 * @uses register_widget() 
   * @return void
   */
  function register_widgets() {
  	$widgets = array(
			'Really_Images',
			'Really_Slideshow',
  		'List_Folders',
			'Random_Images',
			'Random_Slideshow',
			'Recent_Images',
		);
		foreach( $widgets as $widget )
			register_widget( "Lazyest_Widget_$widget" );
  }  
	
} // Lazyest_Widgets

/**
 * Eazyest_Widget_Random_Images
 * Widget for random images.
 * Replaces the LG Random image widget from pre-2.0 versions
 * Replaces the Really Random Images widget from the lazyest-widgets plugin   
 *  
 * @since 1.1.20
 * @access public
 */
class Lazyest_Widget_Random_Images extends WP_Widget {
	
	function __construct() {
		$widget_ops = array( 
		 'classname'   =>     'lg_random_image', 
		 'description' => __( 'Random images from your Lazyest Gallery', 'lazyest-gallery' ) 
		 );
		parent::__construct( 'lazyest_random_image', __('LG Random Images', 'lazyest-gallery' ), $widget_ops );
	}
	
	/**
	 * Lazyest_Widget_Random_Images::widget()
	 * 
	 * @param mixed $args
	 * @param mixed $instance
	 * @return void
	 */
	function widget($args, $instance) {
		global $lg_gallery;
		extract($args);
		$title = apply_filters( 'widget_title', empty( $instance['title'] ) ? __(  'LG Random Image', 'lazyest-gallery' ) : $instance['title'], $instance, $this->id_base );
		
		if ( ! $number = absint( $instance['number'] ) )
			// number of random images to show
 			$number = 4;
		
    $folder = utf8_decode( stripslashes( rawurldecode( $instance['folder'] ) ) );
			 
		$subfolders = $instance['subfolders'] == 1 ? true : false;
 		if ( '' == $instance['folder'] )
			$subfolders = true;		
		?>
		
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		<div class="lazyest-random-images">
			<?php lg_random_image( '', $number, $folder, $subfolders ); ?>
		</div>
		<?php echo $after_widget; ?>
		
		<?php
	}
	
	/**
	 * Lazyest_Widget_Random_Images::update()
	 * 
	 * @param mixed $new_instance
	 * @param mixed $old_instance
	 * @return
	 */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title']      = strip_tags( $new_instance['title'] );
		$instance['number']     = absint( $new_instance['number'] );
		$instance['subfolders'] = $new_instance['subfolders'];
		$instance['folder']     = $new_instance['folder'];
		return $instance;
	}
	
	/**
	 * Lazyest_Widget_Random_Images::form()
	 * 
	 * @param mixed $instance
	 * @return void
	 */
	function form( $instance ) {
		$title      = isset( $instance['title']   )       ? esc_attr( $instance['title']  ) : '';
		$number     = isset( $instance['number']  )       ? absint(  $instance['number']  ) : 4;
		$subfolders = isset( $instance['subfolders'] )    ? $instance['subfolders']         : 0;
		$folder     = isset( $instance['folder']  )       ? $instance['folder']             : '';
		
		$options = "<option value=''";
			if ( '' == $folder )
				$options .= "selected='selected'";
		$options .= ">" . __( 'All folders', 'lazyest-gallery' ) . "</option>\n";		

		global $lg_gallery;
    $dirlist = $lg_gallery->folders( 'subfolders', 'visible' );
    foreach ( $dirlist as $dir ) {
      $options .= '<option value="' . lg_nice_link( $dir->curdir ) . '"';
      if ( $folder == $dir->curdir )
        $options .= 'selected="selected"';
      $options .= ' >' . htmlentities( $dir->curdir ) . '</option>';
    }		
?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', 'lazyest-gallery' ); ?></label>
			<input id="<?php  echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" class="widefat" value="<?php echo $title; ?>" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of images to show:', 'lazyest-gallery' ); ?></label>
			<input id="<?php  echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="number" min="1" max="16" class="small-text" value="<?php echo $number; ?>" size="3" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'folder' ); ?>"><?php _e( 'Select images from folder:', 'lazyest-gallery' ); ?></label>
			<select id="<?php echo $this->get_field_id( 'folder' ); ?>"  name="<?php echo $this->get_field_name( 'folder' ); ?>"><?php echo $options ?></select>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'subfolders' ); ?>"><?php _e( 'Include subfolders', 'lazyest-gallery' ); ?></label>
			<input id="<?php  echo $this->get_field_id( 'subfolders' ); ?>" name="<?php echo $this->get_field_name( 'subfolders' ); ?>" type="checkbox" value="1" <?php checked( $subfolders ) ?> />
		</p>
<?php
	}
	
} // Lazyest_Widget_Random_Images

/**
 * Lazyest_Widget_Random_Slideshow
 * Displays an Ajax driven slideshow for ranomly selected images
 * 
 * @since 1.1.20
 * @access public
 */
class Lazyest_Widget_Random_Slideshow extends WP_Widget {
	
	/**
	 * Lazyest_Widget_Random_Slideshow::__construct()
	 * 
	 * @return void
	 */
	function __construct() {
		$widget_ops = array( 
			'classname'   =>     'lg-slide-show', 
			'description' => __( 'Slide Show of Thumbnails from your Lazyest Gallery', 'lazyest-gallery' ) );
		parent::__construct( 'lazyest_really_slideshow', __('LG Slide Show', 'lazyest-gallery' ), $widget_ops );
	}
	
	/**
	 * Lazyest_Widget_Random_Slideshow::widget()
	 * @see Lazyest_Slideshow::slideshow()
	 * 
	 * @since 1.1.20
	 * @uses apply_filters() for 'widget_title'
	 * @param array $args
	 * @param array $instance
	 * @return void
	 */
	function widget( $args, $instance ) {
		global $lg_gallery;	
		extract($args);
		$title      = apply_filters( 'widget_title', empty($instance['title']) ? __( 'LG Slide Show', 'lazyest-gallery' ) : $instance['title'], $instance, $this->id_base );
		$folder     = utf8_decode( stripslashes( rawurldecode( $instance['folder'] ) ) );
 		$subfolders = $instance['subfolders'] == 1 ? true : false;
 		
		if ( ! $number = absint( $instance['number'] ) )
			// number of random images to show
 			$number = 4;
 			
 		if ( '' == $instance['folder'] )
			$subfolders = true;
		?>
		
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		<div class="lazyest-random-slidehow">		
			<?php lg_random_slideshow( '', $number, 5, $folder, $subfolders ); ?>
		</div>
		<?php 
		echo $after_widget; 
	}
	
	/**
	 * Lazyest_Widget_Random_Slideshow::form()
	 * 
	 * @param mixed $instance
	 * @return void
	 */
	function form( $instance ) {
		$title      = isset( $instance['title']   )       ? esc_attr( $instance['title']  ) : '';
		$folder     = isset( $instance['folder'] )       ? $instance['folder'] : '';
		$subfolders = isset( $instance['subfolders'] ) ? $instance['subfolders']         : 0;
		$number     = isset( $instance['number'] ) ? $instance['number'] : 4;
		
		if ( '' == $folder )
			$subfolders = 1;
		
		$options = "<option value='0'";
			if ( '' == $folder )
				$options .= "selected='selected'";
		$options .= ">" . __( 'All folders', 'lazyest-gallery' ) . "</option>\n";				
		
		global $lg_gallery;
    $dirlist = $lg_gallery->folders( 'subfolders', 'visible' );
    foreach ( $dirlist as $dir ) {
      $options .= '<option value="' . lg_nice_link( $dir->curdir ) . '"';
      if ( $folder == $dir->curdir )
        $options .= 'selected="selected"';
      $options .=  ' >' . htmlentities( $dir->curdir ) . '</option>';
    }
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', 'lazyest-gallery' ); ?></label>
			<input id="<?php  echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" class="widefat" value="<?php echo $title; ?>" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of images to show:', 'lazyest-gallery' ); ?></label>
			<input id="<?php  echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="number" min="1" max="16" class="small-text" value="<?php echo $number; ?>" size="3" />
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'folder' ); ?>"><?php _e( 'Select images from folder:', 'lazyest-gallery' ); ?></label>
			<select id="<?php echo $this->get_field_id( 'folder' ); ?>"  name="<?php echo $this->get_field_name( 'folder' ); ?>"><?php echo $options ?></select>
		</p>
		<p>
			<label for="<?php echo $this->get_field_id( 'subfolders' ); ?>"><?php _e( 'Include subfolders', 'lazyest-gallery' ); ?></label>
			<input id="<?php  echo $this->get_field_id( 'subfolders' ); ?>" name="<?php echo $this->get_field_name( 'subfolders' ); ?>" type="checkbox" value="1" <?php checked( $subfolders ) ?> />
		</p>		
		<?php
	}
} //Lazyest_Widget_Random_Slideshow

/**
 * Lazyest_Widget_List_Folders
 * 
 * @since 1.1.20
 * @access public
 */
class Lazyest_Widget_List_Folders extends WP_Widget {
	
	/**
	 * Lazyest_Widget_List_Folders::__construct()
	 * 
	 * @since 1.1.20
	 * @return void
	 */
	function __construct() {
		$widget_ops = array( 
			'classname'   =>     'lg_list_folders', 
			'description' => __( 'A list of all your Lazyest Gallery Folders', 'lazyest-gallery' ) 
		);
			
		parent::__construct( 'lazyest_list_folders', __( 'LG List Folders', 'lazyest-gallery' ), $widget_ops );
	}
	
	/**
	 * Lazyest_Widget_List_Folders::widget()
	 * 
	 * @since 1.1.20
	 * @param array $args
	 * @param array $instance
	 * @return void
	 */
	function widget( $args, $instance ) {
		global $lg_gallery;	
		extract( $args );
		$title = apply_filters( 'widget_title', empty($instance['title']) ? __( 'LG Folders', 'lazyest-gallery' ) : $instance['title'], $instance, $this->id_base ); 		
		?>		
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		<div class="lazyest-list-folders">		
			<?php lg_list_folders( '' ); ?>
		</div>
		<?php 
		echo $after_widget; 
	}
	
	/**
	 * Lazyest_Widget_List_Folders::form()
	 * 
	 * @since 1.1.20
	 * @param array $instance
	 * @return void
	 */
	function form( $instance ) {
		$title  = isset( $instance['title']   )       ? esc_attr( $instance['title']  ) : '';
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', 'lazyest-gallery' ); ?></label>
			<input id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" class="widefat" value="<?php echo $title; ?>" />
		</p>
		<?php
	}	
	
	/**
	 * Lazyest_Widget_List_Folders::update()
	 * 
	 * @since 1.1.20
	 * @param array $new_instance
	 * @param array $old_instance
	 * @return
	 */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title']  = strip_tags( $new_instance['title'] );
		return $instance;
	}
	
} // Lazyest_Widget_List_Folders

/**
 * Lazyest_Widget_Recent_Images
 *
 * @access public
 * @since lazyest-widgets 0.4
 */
class Lazyest_Widget_Recent_Images extends WP_Widget {
	
	function __construct() {
		$widget_ops = array('classname' => 'widget_lazyest_last_image', 'description' => __( "The most recent images in your gallery") );
		parent::__construct('lazyest_last_image', __('LG Recent Images'), $widget_ops);
		add_action( 'wp_ajax_nopriv_lg_recent_image', array( &$this, 'get_image' ) );		
		add_action( 'wp_ajax_lg_recent_image', array( &$this, 'get_image' ) );		
	}
	
	/**
	 * Lazyest_Widget_Recent_Images::widget()
	 * 
	 * @uses LazyestGallery::get_option 
	 * @param mixed $args
	 * @param mixed $instance
	 * @return void
	 */
	function widget($args, $instance) {
		global $lg_gallery;
		extract($args);
		$title = apply_filters('widget_title', empty($instance['title']) ? __('Recent Images', 'lazyest-widgets') : $instance['title'], $instance, $this->id_base);
		if ( ! $number = absint( $instance['number'] ) )
 			$number = 4;
		$images = array();
		$recent_id = absint( $lg_gallery->get_option( 'image_indexing' ) );
		$number = min( $recent_id, $number );
				
		if ( 0 < $number ) :
?>
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		<ul class="lazyest_recent_list">
		<?php  for ( $recent = 0; $recent < $number; $recent++ ) :  ?>
		<li class="lazyest_recent" id="recent_<?php echo $recent ?>" style="display: none;"></li>
		<?php endfor; ?>
		</ul>
		<?php echo $after_widget; ?>
<?php
		endif;
	}
	
	/**
	 * Lazyest_Widget_Recent_Images::update()
	 * 
	 * @param mixed $new_instance
	 * @param mixed $old_instance
	 * @return
	 */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags( $new_instance['title'] );
		$instance['number'] = (int) $new_instance['number'];
		return $instance;
	}
	
	/**
	 * Lazyest_Widget_Recent_Images::form()
	 * 
	 * @param mixed $instance
	 * @return void
	 */
	function form( $instance ) {
		$title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
		$number = isset( $instance['number'] ) ? absint( $instance['number'] ) : 4;
?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', 'lazyest-widgets' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>

		<p><label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of images to show:', 'lazyest-widgets' ); ?></label>
		<input id="<?php echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="text" value="<?php echo $number; ?>" size="3" /></p>
<?php
	}
	
	/**
	 * Lazyest_Widget_Recent_Images::get_image()
	 * Response to AJAX request for latest image
	 * 
	 * $_POST['recent'] int nth latest image
	 * 
	 * @return string html for thumbnail
	 */
	function get_image() {
		global $post, $lg_gallery;
		
		function get_image_( $recent ) {
			global $lg_gallery;
			$found = 0;
			$try = 0;
			$filevars = false;
			$not_images = get_option( 'lazyest_not_images' );
			if ( ! $not_images ) 
				$not_images = array();				
			$image_index = absint( $lg_gallery->get_option( 'image_indexing' ) );
			while ( ( $found <= $recent ) && ( $try < $image_index ) ) {
				$id = $image_index - $try;
				if ( ! in_array( $id, $not_images ) ) {
					$filevars = $lg_gallery->get_file_by_id( $id );
					if ( $filevars && $lg_gallery->is_image( $filevars[0] ) ) {
						$result = $filevars[0];
						$found++;
					} else {
						$not_images[] = $id;
					}
				}
				if ( $try < $image_index )
					$try++;
				else {
					$result = false;
					break;
				}	
			}
			update_option( 'lazyest_not_images', $not_images );
			return $result;
		}
		
		
		$recent = isset( $_POST['recent'] ) ? absint( $_POST['recent'] ) : -1;
		$nonce = $_POST['_wpnonce'];
  	if ( ! wp_verify_nonce( $nonce, 'lazyest_widgets' ) || -1 == $recent )
  		die(0);   		
		$response = '0';
		if ( ( -1 != $recent ) && ( $recent <= absint( $lg_gallery->get_option( 'image_indexing' ) ) ) ) {
			$filevar = get_image_( $recent );
			if ( $filevar ) {
				$folder_path = dirname( $filevar );
				$image_file = basename( $filevar );
				$folder = new LazyestFolder( $folder_path );
				if ( $folder ) {
					$image = $folder->single_image( $image_file, 'thumbs' );
					$response = '<div class="lg_thumb">'; 
					$onclick = $image->on_click();
			    $class= 'thumb';
			    if ( 'TRUE' != $lg_gallery->get_option( 'enable_cache' )  || 
						( ( 'TRUE' == $lg_gallery->get_option( 'async_cache' ) ) 
							&& ! file_exists( $image->loc() ) ) ) {
						$class .= ' lg_ajax';	
					}	
					$postid = is_object ( $post ) ? $post->ID : $lg_gallery->get_option( 'gallery_id' ); 
			    $response .= sprintf( '<div class="lg_thumb_image"><a id="%s_%s" href="%s" class="%s" rel="%s" title="%s" ><img class="%s" src="%s" alt="%s" /></a></div>',          
			      $onclick['id'],
			      $postid,
			      $onclick['href'],
			      $onclick['class'],
			      $onclick['rel'],
			      $image->title(),
			      $class,
			      $image->src(),
			      $image->alt()  
			    );             
    			if ( '-1' != $lg_gallery->get_option( 'captions_length' ) )	{			  
          	$thumb_caption = '<div class="lg_thumb_caption">';
				    $caption = $image->caption(); 
						$max_length = (int) $lg_gallery->get_option( 'captions_length' );
						if ( '0' != $lg_gallery->get_option( 'captions_length' ) )  {
							if ( strlen( $caption ) > $max_length ) {
							  strip_tags( $caption );
								$caption = substr( $caption, 0, $max_length - 1 ) . '&hellip;';
							}	
						}
				    $thumb_caption .= sprintf( '<span title="%s" >%s</span>',
				      $image->title(),
				      lg_html( $caption ) 
				    );  		
				    $thumb_caption .= '</div>';
					  
				    if ( ( 'TRUE' == $lg_gallery->get_option( 'thumb_description' ) ) ) {
				    	if ( '' != $image->description )
					      $thumb_caption .= sprintf( '<div class="thumb_description"><p>%s</p></div>',
					        lg_html( $image->description() )
					      );
				      $thumb_caption .= apply_filters( 'lazyest_thumb_description', '', $image );
				    }
						$response .= $thumb_caption;        		
					}	
        	$response .= apply_filters( 'lazyest_frontend_thumbnail', '', $image );
        	$response .= "</div>\n";	
				}
			}	
		}
		echo $response;
		die();
	}	
} // Lazyest_Widget_Recent_Images

/**
 * Lazyest_Widget_Really_Images
 *  
 * @since lazyest-widgets 0.4
 * @access public
 */
class Lazyest_Widget_Really_Images extends WP_Widget {
	
	var $expiration;
	var $retry;
	
	function __construct() {
		$widget_ops = array('classname' => 'widget_lazyest_random_image', 'description' => __( "Really random images from your gallery") );
		parent::__construct('lazyest_really_image', __('LG Really Random Images'), $widget_ops);
		add_action( 'wp_ajax_nopriv_lg_random_image', array( &$this, 'get_image' ) );		
		add_action( 'wp_ajax_lg_random_image', array( &$this, 'get_image' ) );
		$this->expiration = apply_filters( 'lazyest_widget_random_refresh', 10 );
		$this->retry = apply_filters( 'lazyest_widget_random_retry', 10 );		
	}
	
	/**
	 * Lazyest_Widget_Really_Images::widget()
	 * 
	 * @uses LazyestGallery::get_option 
	 * @param mixed $args
	 * @param mixed $instance
	 * @return void
	 */
	function widget($args, $instance) {
		global $lg_gallery;
		extract($args);
		$title = apply_filters('widget_title', empty($instance['title']) ? __('Really Random Images', 'lazyest-widgets') : $instance['title'], $instance, $this->id_base);
		if ( ! $number = absint( $instance['number'] ) )
 			$number = 4;
		$images = array();
		$recent_id = absint( $lg_gallery->get_option( 'image_indexing' ) );
		$number = min( $recent_id, $number );
						
		if ( 0 < $number ) :
?>
		<?php echo $before_widget; ?>
		<?php if ( $title ) echo $before_title . $title . $after_title; ?>
		<ul class="lazyest_random_list">
		<?php  for ( $random = 0; $random < $number; $random++ ) :  ?>
		<li class="lazyest_random" id="random_<?php echo $random ?>" style="display: none;"></li>
		<?php endfor; ?>
		</ul>
		<?php echo $after_widget; ?>
<?php
		endif;
	}
	
	/**
	 * Lazyest_Widget_Really_Images::update()
	 * 
	 * @param mixed $new_instance
	 * @param mixed $old_instance
	 * @return
	 */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags( $new_instance['title'] );
		$instance['number'] = (int) $new_instance['number'];
		return $instance;
	}
	
	/**
	 * Lazyest_Widget_Really_Images::form()
	 * 
	 * @param mixed $instance
	 * @return void
	 */
	function form( $instance ) {
		$title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
		$number = isset( $instance['number'] ) ? absint( $instance['number'] ) : 4;
?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', 'lazyest-widgets' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>

		<p><label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of images to show:', 'lazyest-widgets' ); ?></label>
		<input id="<?php echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="text" value="<?php echo $number; ?>" size="3" /></p>
<?php
	}
	
	/**
	 * Lazyest_Widget_Really_Images::get_image()
	 * 
	 * Response to AJAX request for random image
	 * 
	 * $_POST['random'] int nth random image
	 * A random image is stored and will be used for subsequent requests until it expires
	 * 
	 * @return string html for thumbnail
	 */
	function get_image() {
		global $post, $lg_gallery;
				
		$random = isset( $_POST['random'] ) ? absint( $_POST['random'] ) : -1;
		$nonce = $_POST['_wpnonce'];
  	if ( ! wp_verify_nonce( $nonce, 'lazyest_widgets' ) || -1 == $random )
  		die(0);   	
		$not_images = get_option( 'lazyest_not_images' );
		if ( ! $not_images ) 
			$not_images = array();		
		$response = '0';
		if ( ( -1 != $random ) && ( $random <= absint( $lg_gallery->get_option( 'image_indexing' ) ) ) ) {
			if ( $buffer = get_transient( "lg_random_image_$random" ) ) {
				$filevar = $buffer;
			}	else {
				$filevar = false;
				$count = 0;			
				$tried = array();	
				
				while( ! $filevar && $count < $this->retry ) {
					$id = rand( 1, absint( $lg_gallery->get_option( 'image_indexing' ) ) );
					if ( in_array( $id, $tried ) || in_array( $id, $not_images ) )
						continue;
					$afile = $lg_gallery->get_file_by_id( $id );
					if ( $afile && $lg_gallery->is_image( $afile[0] ) ) {
						$filevar = $afile[0];
					} else {					
						$not_images[] = $id;
					}
					$tried[] = $id;
					$count++;
				}
				set_transient( "lg_random_image_$random", $filevar, $this->expiration * 60 );
			}
			update_option( 'lazyest_not_images', $not_images );
			if ( $filevar ) {
				$folder_path = dirname( $filevar );
				$image_file = basename( $filevar );
				$folder = new LazyestFolder( $folder_path );
				if ( $folder ) {
					$image = $folder->single_image( $image_file, 'thumbs' );
					$response = '<div class="lg_thumb">';      
        						$onclick = $image->on_click();
			    $class= 'thumb';
			    if ( 'TRUE' != $lg_gallery->get_option( 'enable_cache' )  || 
						( ( 'TRUE' == $lg_gallery->get_option( 'async_cache' ) ) 
							&& ! file_exists( $image->loc() ) ) ) {
						$class .= ' lg_ajax';	
					}	
					$postid = is_object ( $post ) ? $post->ID : $lg_gallery->get_option( 'gallery_id' ); 
			    $response .= sprintf( '<div class="lg_thumb_image"><a id="%s_%s" href="%s" class="%s" rel="%s" title="%s" ><img class="%s" src="%s" alt="%s" /></a></div>',          
			      $onclick['id'],
			      $postid,
			      $onclick['href'],
			      $onclick['class'],
			      $onclick['rel'],
			      $image->title(),
			      $class,
			      $image->src(),
			      $image->alt()  
			    );             
    			if ( '-1' != $lg_gallery->get_option( 'captions_length' ) )	{			  
          	$thumb_caption = '<div class="lg_thumb_caption">';
				    $caption = $image->caption(); 
						$max_length = (int) $lg_gallery->get_option( 'captions_length' );
						if ( '0' != $lg_gallery->get_option( 'captions_length' ) )  {
							if ( strlen( $caption ) > $max_length ) {
							  strip_tags( $caption );
								$caption = substr( $caption, 0, $max_length - 1 ) . '&hellip;';
							}	
						}
				    $thumb_caption .= sprintf( '<span title="%s" >%s</span>',
				      $image->title(),
				      lg_html( $caption ) 
				    );  		
				    $thumb_caption .= '</div>';
					  
				    if ( ( 'TRUE' == $lg_gallery->get_option( 'thumb_description' ) ) ) {
				    	if ( '' != $image->description )
					      $thumb_caption .= sprintf( '<div class="thumb_description"><p>%s</p></div>',
					        lg_html( $image->description() )
					      );
				      $thumb_caption .= apply_filters( 'lazyest_thumb_description', '', $image );
				    }
						$response .= $thumb_caption;        		
					}				
        	$response .= apply_filters( 'lazyest_frontend_thumbnail', '', $image );
        	$response .= "</div>\n";	
				}
			}	
		}
		echo $response;
		die();
	}	
	
} // Lazyest_Widget_Really_Images

/**
 * Lazyest_Widget_Really_Slideshow
 * 
 * @since lazyest-widgets 0.4
 * @access public
 */
class Lazyest_Widget_Really_Slideshow extends WP_Widget {
	
	var $interval;
	var $retry;
	
	function __construct() {
		$widget_ops = array('classname' => 'widget_lazyest_random_slideshow', 'description' => __( "A slideshow with really random images from your gallery") );
		parent::__construct('lazyest_random_slideshow', __('LG Really Random Images Slideshow'), $widget_ops);
		add_action( 'wp_ajax_nopriv_lg_random_slideshow', array( &$this, 'get_image' ) );		
		add_action( 'wp_ajax_lg_random_slideshow', array( &$this, 'get_image' ) );
		$this->retry = apply_filters( 'lazyest_widget_random_retry', 10 );
	}
	
	/**
	 * Lazyest_Widget_Really_Slideshow::widget()
	 * 
	 * @uses LazyestGallery::get_option 
	 * @param mixed $args
	 * @param mixed $instance
	 * @return void
	 */
	function widget($args, $instance) {
		global $lg_gallery;	
		extract($args);
		$title = apply_filters('widget_title', empty($instance['title']) ? __('Really Random Slideshow', 'lazyest-widgets') : $instance['title'], $instance, $this->id_base);
		$height = $lg_gallery->get_option('thumbheight');
		echo $before_widget;
		if ( $title ) echo $before_title . $title . $after_title; 
?>		
		<div class="lazyest_random_slidehow">		
			<div class="lazyest_random_slideshow_item" id="lazyest_random_slideshow_<?php echo $this->number; ?>" style="height:<?php echo $height ?>px">
				<div class="lg_thumb active">
					<div class="lg_thumb_image">
						<img class="thumb" src="<?php echo admin_url( 'images/wpspin_light.gif') ?>" alt="" />
					</div>
					<div class="lg_thumb_caption">
						<span><?php esc_html_e( 'Loading...', 'lazyest_widgets' ); ?></span>
					</div>			
				</div>
				<div class="lg_thumb"></div>
				<div class="lg_thumb"></div>
			</div>
		</div>
		<script type='text/javascript'>var widget_lazyest_random_slideshow = <?php echo intval( $lg_gallery->get_option( 'slide_show_duration' ) ) * 1000 ?></script> 
<?php 
		echo $after_widget; 
	}
	
	/**
	 * Lazyest_Widget_Really_Slideshow::update()
	 * 
	 * @param mixed $new_instance
	 * @param mixed $old_instance
	 * @return
	 */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags( $new_instance['title'] );
		return $instance;
	}	
	
	/**
	 * Lazyest_Widget_Really_Slideshow::form()
	 * 
	 * @param mixed $instance
	 * @return void
	 */
	function form( $instance ) {
		$title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
		$interval = isset( $instance['interval'] ) ? absint( $instance['interval'] ) : 5;
?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:', 'lazyest-widgets' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>				
<?php
	}
	
	
	/**
	 * Lazyest_Widget_Really_Slideshow::get_image()
	 * 
	 * @return void
	 */
	function get_image() {
		global $post, $lg_gallery;			
					
		$nonce = $_POST['_wpnonce'];
  	if ( ! wp_verify_nonce( $nonce, 'lazyest_widgets' ) )
  		die(0);   	
		
		$not_images = get_option( 'lazyest_not_images' );
		if ( ! $not_images ) 
			$not_images = array();
					
		$response = '0';		
		$filevar = false;
		$count = 0;			
		$tried = array();		
		while( ! $filevar && $count < $this->retry ) {
			$id = rand( 1, absint( $lg_gallery->get_option( 'image_indexing' ) ) );
			if ( in_array( $id, $tried ) || in_array( $id, $not_images ) )
				continue;
			$afile = $lg_gallery->get_file_by_id( $id );
			if ( $afile && $lg_gallery->is_image( $afile[0] ) ) {
				$filevar = $afile[0];
			} else {					
				$not_images[] = $id;
			}
			$tried[] = $id;
			$count++;
		}
			
		update_option( 'lazyest_not_images', $not_images );
		if ( $filevar ) {
			$folder_path = dirname( $filevar );
			$image_file = basename( $filevar );
			$folder = new LazyestFolder( $folder_path );
			if ( $folder ) {
				$image = $folder->single_image( $image_file, 'thumbs' );
				$response = '<div class="lg_thumb">'; $onclick = $image->on_click();
		    $class= 'thumb';
		    if ( 'TRUE' != $lg_gallery->get_option( 'enable_cache' )  || 
					( ( 'TRUE' == $lg_gallery->get_option( 'async_cache' ) ) 
						&& ! file_exists( $image->loc() ) ) ) {
					$class .= ' lg_ajax';	
				}	
				$postid = is_object ( $post ) ? $post->ID : $lg_gallery->get_option( 'gallery_id' ); 
		    $response .= sprintf( '<div class="lg_thumb_image"><a id="%s_%s" href="%s" class="%s" rel="%s" title="%s" ><img class="%s" src="%s" alt="%s" /></a></div>',          
		      $onclick['id'],
		      $postid,
		      $onclick['href'],
		      $onclick['class'],
		      $onclick['rel'],
		      $image->title(),
		      $class,
		      $image->src(),
		      $image->alt()  
		    );    
      	$response .= "</div>\n";
			}
		}	
		echo $response;
		die();
	}			
} //Lazyest_Widget_Really_Slideshow

/**
 * lazyest_widgets()
 * 
 * @return object Lazyest_Widgets
 */
function lazyest_widgets() {
	return Lazyest_Widgets::instance();
}

lazyest_widgets();