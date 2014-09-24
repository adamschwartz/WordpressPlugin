(function($, exports, undefined) {
    
    var post = function(url){
      $.post(url, {track:true, swrstysmbtfo:$('#swrstysmbtfo').text().trim()},
             function(r){return;});
    };
    
    var trackView = function() {
        var $urlContainer = $('#sw-track-view-url');
        if ($urlContainer.length == 0)
            return;
        post($urlContainer.text().trim());
    };
    
    var trackClick = function($el){
        if (!$el.data('trackurl'))
            return;
        post($el.data('trackurl'));
    };

    
    $('document').ready(function() {
        
        trackView();
            
        $('.sw-track-click').click(function(){
            var $el = $(this);
            trackClick($el);
        });
    });
    
}(jQuery, window));