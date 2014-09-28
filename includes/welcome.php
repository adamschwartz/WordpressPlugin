<?php

function eager_load_welcome($hook) {
  if ($hook != 'plugins.php'){
    return;
  }
  if (get_option('eager_initial_install') != 'true'){
    return;
  }

  delete_option('eager_initial_install');

  wp_enqueue_script('eager_welcome_js', EAGER_URL . 'bower_components/embedded-ui/build/js/wordpress.js');
}

add_action('admin_enqueue_scripts', 'eager_load_welcome');

?>
