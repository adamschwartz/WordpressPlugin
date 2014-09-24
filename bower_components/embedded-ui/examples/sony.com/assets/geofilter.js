$(window).load(function() {

    // Function to check url parameters
    $.urlParam = function(name){
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results===null){
           return null;
        }
        else{
           return results[1] || 0;
        }
    };

    // set element variables
    var geofilter = $('#geofilter');
    var header = $('header');
    var content = $('body > #container');
    var article = $('body > #container article');
    var langcurrentindicator = $('#social-media ul li.language > a');

    // set geofilter offset based on element height
    var geofilteroffset = $('#geofilter').height();

    // set var for open/closed state
    var geofilterstate = 1;

    // Hide the language filter drop down
    var languagefilterhide = function() {
        langcurrentindicator.css('cursor', 'default');
        langcurrentindicator.unbind('click');
        langcurrentindicator.click( function (e) {
            e.preventDefault();
        });
        langcurrentindicator.off('click');
    };

    // set methods for hiding and showing the geofilter
    var geofiltershow = function(country_code) {

        if(country_code.toLowerCase() != 'us') {

            geofilter_html = $.get(
                '/geofilter/' + country_code + '.json',
                function(data, textStatus, xhr) {
                    $('#geofilter').html(data.html);

                    geofilteroffset = $('#geofilter').height();

                    geofilter.animate({
                        'top': 0
                    });

                    content.animate({
                        'top': geofilter.height()
                    });

                    header.animate({
                        // 'top': geofilter.height()
                    }, function() {
                        // override some of the css temporarily to allow the nav bar
                        // and content to track nicely with scrolling
                        header.css({
                            'position': 'relative',
                            'top': 0
                        });
                        article.css({
                            'margin-top': 0
                        });
                    });

                    geofilterstate = 1;

                    // Fire omniture tracking
                    s.linkTrackVars="hier3,eVar18,eVar30,events";
                    s.linkTrackEvents="event20";
                    s.hier3 = data.region_code;
                    s.eVar18="D=pageName";
                    s.eVar30="D=h3";
                    s.events="event20";
                    s.tl(this,'o','geo-filter load');

                }
            )
            .fail( function() {
                languagefilterhide();
            });
        }
    };

    var geofilterhide = function() {
        var geofilteroffset = geofilter.height();
        geofilter.animate({
            'top': -geofilteroffset
        });

        content.animate({
            'top': 0
        });

        header.animate({
            'top': 0
        }, function() {
            // restore fixed position for sticky nav on desktop and tablet

            if ( !$('body').hasClass('s') ) {
                header.css({
                    'position': 'fixed'
                });
                article.css({
                    'margin-top': '104px'
                });
            }
        });

        geofilterstate = 0;
    };

    var geofilterhidesmooth = function() {
        var geofilteroffset = geofilter.height();
        geofilter.animate({
            'top': -geofilteroffset
        });

        content.animate({
            'top': 0
        });

        // restore fixed position for sticky nav
        if ( !$('body').hasClass('s') ) {
            header.css({
                'position': 'fixed',
                'top': '0px'
            });
            article.css({
                'margin-top': '104px'
            });
        }

        geofilterstate = 0;
    };

    // set geofilter panel to be hidden just off top of page
    geofilter.css({
        'top': -geofilteroffset
    });

    // if using a mobile device, set the panel's margins
    var setmobilemargins = function() {
        if ( $('body').hasClass('s') && document.width > 480 ) {
            var geomargin = (document.width - 480 ) / 2;
            geofilter.css({
                'left': geomargin,
                'right': geomargin
            });
        }
    };
    setmobilemargins();

    // open geofilter panel when page loads
    cookie_value = $.cookie('geofilter_country');
    debug_value = $.urlParam('geofilter_debug');

    if(debug_value || cookie_value) {
        geofiltershow(debug_value||cookie_value);
        // Update list of options in the flag pull down if there is another country option
        country_value = debug_value || cookie_value;

        if(country_value.toLowerCase() != 'us') {
            $.get(
                '/geofilter/language/' + country_value + '.json',
                function(data, textStatus, xhr) {
                    $('#choose-language ul li:first').after(data.html);
                    langcurrentindicator.addClass('usable');
                }
            )
            .fail( function() {
                languagefilterhide();
            });

        }
        else {
            languagefilterhide();
        }

    } else {
        languagefilterhide();
    }

    // recalculate and reposition elements when the window is resized
    $(window).resize( function() {

        if ( geofilterstate == 1 ) {
            var geofilteroffset = $('#geofilter').height();
            content.css({
                'top': geofilteroffset
            });
        }
        setmobilemargins();
    });

    // hide geofilter panel when clicking on X button
    geofilter.on('click', 'a.close', function(e) {
        e.preventDefault();
        geofilterhide();
    });

    // hide geofilter panel after 15s
    // setTimeout(geofilterhide, 15000);

    // hide geofilter panel if user scrolls beyond bottom edge
    $(window).scroll( function() {
        if ( $(window).scrollTop() > geofilteroffset ) {
            geofilterhidesmooth();
        }
    });

    // hide geofilter panel if user clicks on US Flag / Sony.com link
    geofilter.on('click', 'a.geofilter-sonydotcomus', function(e) {
        e.preventDefault();
        geofilterhide();
    });

    // hide geofilter panel if user clicks anywhere outside the panel while it is still visible
    // if ( geofilterstate == 1 ) {
    //     content.click( function(e) {
    //         geofilterhide();
    //     });
    // }

});