<?php
/*
Plugin Name: Eager
Description: Install Eager on your site to enable installation of apps from the Eager App Store.
Version: 2.0
Author: Eager
Author URI: https://eager.io
Plugin URI: https://eager.io/wordpress
*/

define('EAGER_VERSION', '2.0');
define('EAGER_DIR', plugin_dir_path(__FILE__));
define('EAGER_URL', plugin_dir_url(__FILE__));

function eager_load() {
  if (is_admin()){
    require_once(EAGER_DIR.'includes/welcome.php');
  }

  require_once(EAGER_DIR.'includes/core.php');
}

eager_load();

function eager_notify() {
  $url = "http://notifier.eager.io/set/{{.EmbedCode}}";
  $notice = array(
    'site' => home_url(),
    'source' => 'wordpress'
  );

  $body = json_encode($notice);
  wp_remote_post($url, array(
    'body' => $body
  ));
}

function eager_activation() {
  eager_notify();

  update_option('eager_initial_install', 'true');
}
register_activation_hook(__FILE__, 'eager_activation');
