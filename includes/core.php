<?php
function eager_embed_code() {
  $options = get_option('eager_options');
  if isset($options['embedcodebox_template'])
    echo '<script src="//fast.eager.io/'.get_option('eager_options').'.js"></script>';
  else
    echo ''
}

add_action('wp_head', 'eager_embed_code');
?>
