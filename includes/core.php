<?php
function eager_get_embed_html() {
  $code = eager_get_embed_code();
  if ($code){
    echo '<script data-cfasync="false" src="//fast.eager.io/{{.EmbedCode}}.js"></script>';
  }
}

add_action('wp_head', 'eager_get_embed_html');
?>
