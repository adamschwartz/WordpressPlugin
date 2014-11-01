<?php

// Register menu item
function eager_admin_menu_setup() {
  add_submenu_page(
    'options-general.php',
    'Eager Settings',
    'Eager',
    'manage_options',
    'eager',
    'eager_admin_page_screen'
  );
}
add_action('admin_menu', 'eager_admin_menu_setup'); //menu setup

// Display page content
function eager_admin_page_screen() {
  global $submenu;

  // Access page settings
  $page_data = array();
  foreach ($submenu['options-general.php'] as $i => $menu_item) {
    if ($submenu['options-general.php'][$i][2] == 'eager')
      $page_data = $submenu['options-general.php'][$i];
  }

  // Output
  ?>
  <div class="wrap">
    <?php screen_icon();?>
    <h2><?php echo $page_data[3];?></h2>
    <form id="eager_options" action="options.php" method="post">
      <?php
        settings_fields('eager_options');
        do_settings_sections('eager');
        submit_button('Save options', 'primary', 'eager_options_submit');
      ?>
   </form>
  </div>
  <?php
}

// Settings link in plugin management screen
function eager_settings_link($actions, $file) {
  if (false !== strpos($file, 'eager'))
    $actions['settings'] = '<a href="options-general.php?page=eager">Settings</a>';
  return $actions;
}
add_filter('plugin_action_links', 'eager_settings_link', 2, 2);

// Register settings
function eager_settings_init() {
  register_setting(
    'eager_options',
    'eager_options',
    'eager_options_validate'
  );

  add_settings_section(
    'eager_embedcode',
    'Embed code',
    'eager_embedcode_desc',
    'eager'
  );

  add_settings_field(
    'eager_embedcode',
    'Eager Site embed code',
    'eager_embedcode_callback',
    'eager',
    'eager_embedcode'
  );
}
add_action('admin_init', 'eager_settings_init');

// Validate input
function eager_options_validate($input) {
  if (!eager_is_valid_embed_code($input['eager_embedcode']))
    add_settings_error('eager_embedcode', 'texterror', 'The site code should be 10 or more alphanumeric characters, underscore and hyphen with no spaces or punctuation, for example "j3-Vaj_3hG".', 'error');
  return $input;
}

// Description text
function eager_embedcode_desc() {
  echo '<p>Enter the code obtained from <a href="https://eager.io" target="_blank">Eager</a>. <a href="https://eager.io/help" target="_blank">Get help</a></p>';
}

// Filed output
function eager_embedcode_callback() {
  $code = eager_get_embed_code();

  // Output
  ?>
    <input type="text" id="eager_embedcode" name="eager_options[eager_embedcode]" maxlength="12" value="<?php echo $code; ?>">
  <?php
}
