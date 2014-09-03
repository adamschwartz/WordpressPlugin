<?php

function eager_is_valid_embed_code($code) {
  if (is_string($code) && preg_match('/\A[a-zA-Z\d_\-]{10,}\z/', $code))
    return true;
  else
    return false;
}

function eager_get_embed_code(){
  // This is inserted by the download builder.  If you are installing from GitHub, it
  // will be ignored.
  $embeddedCode = "{{.EmbedCode}}";

  $options = get_option('eager_options');

  if (eager_is_valid_embed_code($options['eager_embedcode'])){
    return $options['eager_embedcode'];
  } else if (eager_is_valid_embed_code($embeddedCode)){
    return $embeddedCode;
  } else {
    return null;
  }
}

function eager_get_embed_html() {
  $code = eager_get_embed_code();
  if ($code){
    echo '<script src="//fast.eager.io/'.$code.'.js"></script>';
  }
}
add_action('wp_head', 'eager_get_embed_html');

?>
