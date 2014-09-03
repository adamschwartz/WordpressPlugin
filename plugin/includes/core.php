<?php

function eager_is_valid_embed_code($code) {
  if (is_string($code) && preg_match('/\A[a-zA-Z\d_\-]{10,}\z/', $code))
    return true;
  else
    return false;
}

function eager_embed_code() {
  $options = get_option('eager_options');
  $code = $options['eager_eagerembedcode'];

  if (eager_is_valid_embed_code($code))
    echo '<script src="//fast.eager.io/'.$code.'.js"></script>';
  else
    echo '';
}
add_action('wp_head', 'eager_embed_code');

?>
