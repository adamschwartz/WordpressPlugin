(function($, exports, undefined){
    Streetwise.channelTracker = Streetwise.channelTracker || {};
    
    Streetwise.channelTracker.trackImpressions = function(trackingElement){
        $.each(trackingElement, function() {
            _gaq.push(['_trackEvent',
                'channel_'+$(this).data('channel'),
                'channel_impression',
                $(this).data('type'),
                1,
                1]);
        });
    };
    
    $('document').ready(function() {
        $('body').on('click', '.js-channel-track', function(e){
            _gaq.push(['_trackEvent',
                'channel_'+$(this).data('channel'),
                'channel_click',
                $(this).data('type'),
                1,
                1]);
        });
        
        Streetwise.channelTracker.trackImpressions($('.js-channel-track'));
    });
}(jQuery, window));