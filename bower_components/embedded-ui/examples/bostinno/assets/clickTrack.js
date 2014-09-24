(function($, exports, undefined){
    exports.Streetwise = exports.Streetwise || {};

    var clickTracker = {
        trackClick: function($el) {
            _gaq.push([
                '_trackEvent',
                'click',
                $el.data('action'),
                'userId_'+$el.data('user-id')+'_'+$el.data('label'),
                1,
                1
            ]);
        },

        onDocumentReady: function() {
            var self = this;
            $('.js-track-click').on('click', function(e){
                self.trackClick($(this));
            });
        }
    };

    Streetwise.clickTracker = Streetwise.clickTracker || clickTracker;

    $('document').ready(function() {
        Streetwise.clickTracker.onDocumentReady();
    });
}(jQuery, window));