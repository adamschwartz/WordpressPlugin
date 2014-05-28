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

  // Output (I want to cry so hard...)
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
  if(false !== strpos($file, 'msp-helloworld'))
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
    'eager_eagerembedcode',
    'Embed code',
    'eager_eagerembedcode_desc',
    'eager'
  );

  add_settings_field(
    'eager_eagerembedcode',
    'Template',
    'eager_eagerembedcode_field',
    'eager',
    'eager_eagerembedcode'
  );
}
add_action('admin_init', 'eager_settings_init');

// Validate input
function eager_options_validate($input) {
  return $input;
  // global $allowedposttags, $allowedrichhtml;
  // if(isset($input['eagerembedcode']))
  //   $input['eagerembedcode'] = wp_kses_post($input['eagerembedcode']);
  // return $input;
}

// Description text
function eager_eagerembedcode_desc() {
  echo '<p>Enter the 10 character code obtained from <a href="http://eager.io">Eager</a>. See <a href="http://eager.io/help/wp-eager">Eager Wordpress Installation Help</a> for more information.</p>';
}

// Filed output
function eager_eagerembedcode_field() {
  $options = get_option('eager_options');

  $eagerembedcode = esc_textarea($eagerembedcode); // Sanitise output
?>
  <input type="text" id="eagerembedcode" name="eager_options[eagerembedcode]" cols="50" rows="5" value="<?php echo $eagerembedcode;?>">
<?php
}

?>
