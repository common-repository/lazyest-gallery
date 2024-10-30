=== Lazyest Gallery ===
Contributors: macbrink, andredewaard
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=1257529
Tags: photo,album,picture,lazyest,image,gallery,easy,thumbs,slides,exif,popup,folders,lightbox,widget,ftp-upload,schortcode,comment,image,gallery
Tested up to: 3.9.1
Requires at least: 3.5
Stable tag: 1.1.21

Maybe the second-best Gallery plugin for WordPress

== Description ==

Create a photo gallery from your existing photo directories.

This gallery basically needs just two settings: Your image directory and your gallery page. Lazyest Gallery automatically creates a photo gallery with folders, sub folders, thumbnail pages and slide shows.

If you want more, the gallery offers a multitude of options by featuring a smart back end management site. You can sort photos through folders and add captions, comments and descriptions with minimal effort. If you are tired of uploading photos through the WordPress server, this plug-in will make it a breeze with their FTP auto-indexing integration.

Read the user guide on the [Lazyest Gallery website](http://brimosoft.nl/lazyest/gallery/user-guide/)

For more information about version 1.1.21, read the [release notes](http://brimosoft.nl/2014/04/08/security-fix-lazyest-gallery/)

Read all about the [version 1.1 series](http://brimosoft.nl/tag/1-1/)



If you are new to Lazyest Gallery, please consider [Eazyest Gallery](http://wordpress.org/extend/plugins/eazyest-gallery/). Eazyest Gallery is the successor to Lazyest Gallery and is far better integrated with WordPress, and [compatible with popular plugins](http://brimosoft.nl/lazyest/compatible-plugin/).

I will add no extra features to the plugin, but will update and support the plugin for bug fixes and compatibility issues.
[Eazyest Gallery](http://wordpress.org/extend/plugins/eazyest-gallery/) will replace Lazyest Gallery soon.
The Eazyest Gallery plugin offers the functionality of Lazyest Gallery, but is far better integrated in WordPress.

= Lazyest Gallery features: =

* Fully integrated in WordPress with Settings and Management pages
* Unlimited number of images in unlimited number of nested folders
* Automatic thumbnail and slide creation
* Add Captions, Descriptions and Custom fields to Folders and Images
* Comment on Images and Folders
* [Shortcodes](http://brimosoft.nl/lazyest/gallery/user-guide/shortcodes/) for Galleries, Folders, Slideshows and Images
* Arrange your folders and images by date, alphabetically or manually
* Widgets for Random Images, Slide Show, and Folder List
* WordPress Post Edit Screen upload button integration
* Translations for Dutch, Russian and German
* Expandable by [plugins](http://brimosoft.nl/lazyest/)

= Add on plugins: =

* Get an alternative way to show your Slides with the [Lazyest Slides plugin](http://wordpress.org/extend/plugins/lazyest-slides/)
* Add more widgets with the [Lazyest Widgets plugin](http://wordpress.org/extend/plugins/lazyest-widgets/)
* Backup your Gallery with the [Lazyest Backup plugin](http://wordpress.org/extend/plugins/lazyest-backup/)
* Add Beautiful Stacked Gallery effects with the [Lazyest Stack plugin](http://wordpress.org/extend/plugins/lazyest-stack/)
* Watermark your images with the [Lazyest Watermark plugin](http://wordpress.org/extend/plugins/lazyest-watermark/)
* Show your Image Locations on a Map with the [Lazyest Maps plugin](http://wordpress.org/extend/plugins/lazyest-maps/)
* Create a media standard feed for your gallery with [Lazyest Feed](http://wordpress.org/extend/plugins/lazyest-feed/) 

For latest information please check [the blog on the author web site](http://brimosoft.nl/posts/)

For help please check [the plugin web site](http://brimosoft.nl/lazyest/gallery/)

== Upgrade Notice ==

= 1.1.21 =
* Security update for Exif XSS vulnerability

== Changelog ==

= 1.1.21 =
* Security Fix: XSS vulnerability in EXIF code (ref: CVE-2014-2333) discovered by Daniel Marques @0xc0da
* Bug Fix: html code in image uploader button

= 1.1.20 =
* Changed: Widgets conform latest WP_Widget class
* Changed: Combined all javascript in one file
* Added: All Widgets from Lazyest Widgets included
* Bug Fix: Use of deprecated function `get_current_theme()`
* Bug Fix: Empty edit folder title in Folders table

= 1.1.19.1 =
* Bug Fix: Fatal error in pagination
* Bug Fix: Fix link to create new page

= 1.1.19 =
* Bug Fix: Issues in managing folders with encoded chars in filename
* Bug Fix: Use of deprecated function wp_load_image()
* Bug Fix: Default WordPress user roles became unselectable
* Changed: Submit box styling in manager screens
* Changed: Styling of Settings screen
* Added: constant LAZYEST_GALLERY_ROOT to override root folder for original images
* Added: constant LAZYEST_GALLERY_CACHE_ROOT to override root folder for cached images
* Added: constant LAZYEST_GALLERY_ADDRESS to override gallery url

= 1.1.18 =
* Changed: Use only forward slashes in gallery folder path
* Added: Check if gallery folder is not wp-content root
* Added: Check if WordPress is not installed in a subdirectory of the gallery folder
* Bug Fix: Message: wp_lazyestfiles table could not be removed
* Bug Fix: Fatal error on Widgets initialization
* Added: Filter for thumbnail location 'lazyest_gallery_thumb_location'
* Added: Filter for slide location 'lazyest_gallery_slide_location'
* Added: Filter for thumbnail src 'lazyest_gallery_thumb_src'
* Added: Filter for slide src 'lazyest_gallery_slide_src'
* Bug Fix: Border for "Select Files" button

= 1.1.17.4 =
* Bug Fix: Warning for wpdb::prepare 

= 1.1.17.2 =
* Bug fix: Thumbnails and slides do not create when exif module is not installed on the server
* Tested on WordPress 3.5-RC1

= 1.1.17.1 =
* Bug fix: Some leftover uninitialized variables

= 1.1.17 =
* Bug fix: Warning on open_basedir restriction
* Bug fix: Invisible folders and images with utf8 file names
* Bug fix: exif oriented portrait images resize to landscape images

= 1.1.16 =
* Bug fix: Fatal error on upload tab when Gallery is empty
* Bug fix: http port omitted in gallery address

= 1.1.15 =
* Bug fix: supply defaults to prevent PHP warning messages for wp_title
* Bug fix: Typo in Settings
* Bug fix: LG did not work for sites that don't serve http over port 80 
* Changed: class 'slide' added to gallery element for slide page

= 1.1.14 =
* Bug fix: Extra options and Lazyest Gallery menu did not appear on nwe installs
* Changed: Increased size of thumbnails in image manager

= 1.1.13 =
* Changed: Style rules for thumbnail captions to have them not left-aligned and cut-off
* Bug Fix: Remove link anchor when on_click = 'nothing'

= 1.1.12 =
* Bug Fix: Correctly display Admin screens
* Bug Fix: Hide Lazyest Gallery menu after restting options

= 1.1.11 =
* Bug fix: Manual sort does not work after upload
* Bug fix: Navigator invisible for Slide View
* Changed: use folder name as class for thumbs view element
* Bug fix: Admin screens lay out for WordPress 3.4

= 1.1.10.1 =
* Bug fix: Folder image count reset to 0

= 1.1.10 =
* Changed: Styling of [lg_image] shortcode by height, width and class
* Bug fix: Empty class attribute in folder image count
* Changed: Add extra fields in folder thumbnails view
* Bug fix: Incorrect comments edit url on manager screen
* Changed: removed function check_users() to improve performance 
* Bug fix: backslash in images url on Windows-based servers
* Bug fix: Upload failed on Internet Explorer 9
* Changed: Refresh folder display after each upload
* Bug fix: Refresh folder for empty folders
* Changed: Use file date when image date value is empty
* Bug fix: Prevent division by zero in image shortcode

= 1.1.9.1 =
* Bug fix: Image file validation

= 1.1.9 =
* Bug fix: Gallery user role management
* Changed: Do not show manage link on plugins page without valid settings
* Bug fix: Save Gallery path using DIRECTORY_SEPARATOR
* Bug fix: Resolve gallery address when DIRECTORY_SEPARATOR  is \
* Bug fix: Resolve gallery address for WordPress in subdirectory
* Bug fix: Decode url and utf8 encoded folder names in widgets
* Changed: AJAX image request memory and headers
* Changed: Use browser cache for AJAX generated slides and thumbnails
* Bug fix: Genesis framework Doctitle
* Changed: Extra validation for image uploads
* Bug Fix: Fatal error: Call to undefined function get_users() at install

= 1.1.8.1 =
* Bug fix: Permalinks in rewrite rules

= 1.1.8 =
* Bug fix: Directory not found for UNC path
* Bug fix: Escaping url could delete %20 spaces in folders
* Bug fix: Rewrite rules
* Security fix: Potential security risk in Admin for invalid folder names

= 1.1.7.1 =
* Bug fix: Incorrectly compacted javascript blocked image description editing

= 1.1.7 =
* Bug fix: div element does not close when folder has only one image
* Bug fix: Number of comments of posts in search were incorrect
* Bug fix: New subfolder got misplaced on duplicate IDs
* Bug fix: Warning on cropping image/png files

= 1.1.6 =
* Bug Fix: Display of full size images in thumbnail view
* Changed: Cropping the top for portrait oriented images
* Bug Fix: Empty rel tag for lightbox links stops prev - next functionality
* Bug Fix: No permalinks for links in gallery shortcode in posts
* Bug Fix: Locked folders when viewer level has not yet been set

= 1.1.5 =
* Bug Fix: Display of utf8 encoded folders names in widgets
* Bug fix: Error on accept renamed duplicate file names
* Added: Filter in image manager for image specific actions 

= 1.1.4 =
* Bug Fix: Cannot open utf8 encoded folder names
* Bug Fix: Undefined variable in comments.php
* Bug Fix: Cannot insert shortcode in page

= 1.1.3.3 =
* Added: Javascript reset of Lightbox plugins on refresh
* Bug Fix: Incorrect usage of onclick['title']
* Changed: Styling of upload progress bar for WordPress 3.3 

= 1.1.3.2 =
* Bug Fix: Browser uploader returns 'Security check on file upload
* Changed: small improvement for canonical url

= 1.1.3.1 =
* Bug Fix: Browser uploader returns -1 on fille upload

= 1.1.3 =
* Bug Fix: Insert an incomplete shortcode
* Changed: Use admin-ajax.php instead of media-upload.php for image uploader
* Bug Fix: Refresh folder after uploading image(s)
* Bug fix: jQuery conflict on pages where slideshow does not display
* Changed: Adjust width of thumbnail images to column settings

= 1.1.2.1 =
* Bug Fix: Incorrect fields setting for comments
* Bug fix for backlink in shortcodes with root option

= 1.1.1.1 =
* Bug Fix: Manually sorted images did not save sort order.

= 1.1.1 =
* Bug Fix: Overlapping Folders table in Admin
* Bug Fix: Fatal Error on non-existing image in shortcode
* Bug Fix: Create Folder in manually sorted folders
* Bug Fix: Drag and drop sorting
* Bug Fix: Sorting Folders and Images separately
* Bug Fix: Sorting Captions by clicking on table header
* Changed: Translatable strings
* Added: Filters and Actions for plugin developers

= 1.1 =
* Added: Pluggable filters and actions
* Added: User defined fields for folders and images
* Added: Themes for Lazyest Gallery
* Added: User authorization for upload, editing, and gallery and folder management
* Added: New pagination for Gallery and Admin
* Added: Ajax in frontend and backend
* Added: Upload tab integration
* Changed: Table layout is deprecated
* Improved: Comments loading time

Full changelog on the [Lazyest Gallery website](http://brimosoft.nl/lazyest/gallery/developing/)

== Installation ==

1. Install the plugin by using your Admin Plugin page
2. Activate the plugin
3. Go to Settings -> Lazyest Gallery
4. Enter your Pictures directory and your Gallery page
5. Save Changes

For detailed installation instructions please go to [the plugin installation site](http://brimosoft.nl/lazyest/installation/)

== Screenshots == 

= Version 1.1 screen shots =
For screenshots please visit the [Version 1.1 Gallery](http://demo.brimosoft.nl/gallery/version_1.1/)

== Frequently Asked Questions ==

Please check the [plugin web site](http://brimosoft.nl/lazyest/gallery/frequently-asked-questions/) for Frequently Asked Questions

== Uninstall ==

1. Deactivate plugin from your WordPress Admin Plugins page
2. Delete the plugin from your WordPress Admin Plugins page
3. The thumbs and slides folders in your gallery will be removed automatically, along with the captions.xml files. All comments will be reset to the gallery page. You cannot undo comments after uninstall. 

== License ==

* Copyright (c) 2004 - Nicholas Bruun Jespersen
* Copyright (c) 2005 - 2006 Valerio Chiodino
* Copyright (c) 2008-2011 - Marcel Brinkkemper 

* jQuery Context Menu,  Copyright (c) 2008 A Beautiful Site, LLC.
* TableDnD plug-in for JQuery,  Copyright (c) Denis Howlett
* jQuery Context Menu Plugin,  Copyright (c) Cory S.N. LaViska
* jQuery Progress Bar plugin,  Copyright (c) 2008 Gary Teo

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA