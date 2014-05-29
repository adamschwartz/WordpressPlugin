<?php
/*
Plugin Name: Eager
Description: Install Eager on your site to enable installation of apps from the Eager App Store.
Version: 1.0
Author: Eager
Author URI: http://eager.io
Plugin URI: http://wordpress.org/extend/plugins/wp-eager/
*/

define('EAGER_VERSION', '1.0');
define('EAGER_DIR', plugin_dir_path(__FILE__));
define('EAGER_URL', plugin_dir_url(__FILE__));

function eager_load() {
  if(is_admin())
    require_once(EAGER_DIR.'includes/admin.php');

  require_once(EAGER_DIR.'includes/core.php');
}

eager_load();

function eager_uninstall() {}

function eager_activation() {
  register_uninstall_hook(__FILE__, 'eager_uninstall');
}
register_activation_hook(__FILE__, 'eager_activation');

function eager_deactivation() {}
register_deactivation_hook(__FILE__, 'eager_deactivation');

?>
