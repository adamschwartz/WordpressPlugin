$(document).ready(function() {

    // element vars
    var $window = $(window);
    var $body = $('body');
    var $herowrapper = $('#hero');
    var $heroinner = $('#hero #hero-inner');
    var $heroframe = $('#hero #hero-inner .hero-frame');
    var $herounit = $('#hero #hero-inner .hero-frame');
    var $herothumb = $('#hero #hero-inner .hero-frame .thumb');
    var $herothumbclone;
    var $herothumbprogress = $('#hero #hero-inner .thumb-progress');
    var $herothumbprogressclone;

    // dimension vars
    var herowidth;
    var heroheight = $herowrapper.height();
    var herounitcount = $herounit.length;

    var responsivesize;
    var layoutsize;

    var getdimensions = function() {
        if ( $body.hasClass('l') ) {
            responsivesize = 'l';
            layoutsize = 940;
        } else if ( $body.hasClass('m') && $body.hasClass('l') === false ) {
            responsivesize = 'm';
            layoutsize = 740;
        } else if ( $body.hasClass('s') ) {
            responsivesize = 's';
            layoutsize = 480;
        }

        if ( responsivesize == 's' ) {
            herowidth = 480;
        } else {
            herowidth = $window.width();
        }
    };
    getdimensions();

    // reference vars
    var currentframe = 1;
    var nextframe = 2;
    var prevframe = herounitcount;
    var autoadvanceenabled = parseInt($herowrapper.data('advance'), 10);
    var autoadvancetimer = parseInt($herowrapper.data('timing'), 10);
    var cyclecount = 1;

    // initial setup
    var herosetup = function() {

        // set omniture tracking var
        //s.linkTrackVars = "eVar7";
        //s.eVar7 = $heroframe.filter('[data-hero-frame=1]').attr('data-evar');
        //s.tl(this,'o','hero image load');

        s.linkTrackVars = "eVar7";
        s.eVar7 = $heroframe.filter('[data-hero-frame=1]').attr('data-evar');
        s.tl(this,'o','hero image load',null,'navigate');
        //s.linkTrackVars=s.eVar7='';
        s.linkTrackEvents=s.events=s.linkTrackVars=s.eVar7='';

        if ( herounitcount > 1) {
            // clone the first and last frames to allow for 'infinite' rotation
            var $heroclonelast = $heroframe.filter('[data-hero-frame=' + herounitcount + ']').clone().prependTo( $heroinner );
            var $heroclonefirst = $heroframe.filter('[data-hero-frame=1]').clone().appendTo( $heroinner );

            // remove the iframes from cloned heroes since they aren't needed
            $heroclonefirst.find('iframe').remove();
            $heroclonelast.find('iframe').remove();

            // reselect all hero frames, including the two new ones above
            $heroframe = $('#hero #hero-inner > div');

            // clone the original thumbs and move into wrapper
            $herothumbclone = $herothumb.clone().prependTo( $herowrapper );

            if ( autoadvanceenabled == 1 ) {
                // clone the thumb progress bar and move into wrapper
                $herothumbprogressclone = $herothumbprogress.clone().prependTo( $herowrapper );
            }

            // set references to be used for movement
            $herothumbclone.each( function(i) {
                $(this).attr('data-thumb-frame', i);
            });
        }
    };
    herosetup();

    // set slider and frame positions
    var setheropos = function() {

        // set each hero frame to full screen width
        $heroframe.css({
            'width': herowidth
        });

        if ( herounitcount > 1) {
            // set width for slider container and push prepended hero out of the viewport
            $heroinner.css({
                'width': herowidth * (herounitcount + 2), // +2 to account for the cloned frames
                'left': -(herowidth * currentframe)
            });
        } else {
            $heroinner.css({
                'width': herowidth
            });
        }
    };
    setheropos();

    // set thumbnails positions
    var setthumbpos = function() {

        if ( herounitcount > 1) {
            // determine proper layout and set position based on screen size and number of heroes
            var herothumboffsethorizontal = (herowidth - layoutsize) / 2;

            if ( responsivesize == 'l' ) {
                var herothumboffsetvertical = 440;
            } else if ( responsivesize == 'm') {
                var herothumboffsetvertical = 420;
            } else if ( responsivesize == 's' ) {
                var herothumboffsetvertical = 398;
            }

            // position thumbs
            $herothumbclone.each( function(i) {
                $(this).css({
                    'width': layoutsize/herounitcount,
                    'top': herothumboffsetvertical,
                    'left': (i * layoutsize/herounitcount) + herothumboffsethorizontal
                });
            });

            if ( autoadvanceenabled == 1 ) {
                // position thumb progress bars
                $herothumbprogressclone.each( function(i) {
                    $(this).css({
                        'width': layoutsize/herounitcount,
                        'top': herothumboffsetvertical - $(this).height(),
                        'left': (i * layoutsize/herounitcount) + herothumboffsethorizontal
                    });
                });
            }
        }
    };
    setthumbpos();

    // slider movement
    // frame can be an integer
    // changetype can be one of 'auto', 'click', 'swipe'
    var changeframe = function(frame, changetype) {

        if ( herounitcount > 1) {
            frame = parseInt(frame);

            if ( frame == currentframe ) {
                // if the request frame is the same as the current frame, do nothing
            } else if ( changetype == 'click' ) {
                // if it's a click change, animate whichever direction is appropriate
                $heroinner.animate({
                    'left': -(herowidth * frame)
                }, function(e) {

                    // set new frame references
                    currentframe = frame;

                    if ( currentframe == herounitcount ) {
                        nextframe = 1;
                    } else {
                        nextframe = currentframe + 1;
                    }
                    if ( currentframe == 1 ) {
                        prevframe = herounitcount;
                    } else {
                        prevframe = currentframe - 1;
                    }
                });

                // if autoadvance is turned on, and was interrupted by a click (which is always true here)...
                // ...restore it and reset the progress bar
                if ( autoadvanceenabled == 1 ) {
                    advanceframes('start');
                    thumbprogress(frame);
                }

            } else if ( changetype == 'auto' || changetype == 'swipe' ) {
                // if it's an auto-advance or swipe...
                if ( currentframe == herounitcount && frame == 1 ) {

                    // update cycle count, or stop if we've gone around 3 times
                    if ( cyclecount < 3 ) {
                        cyclecount++;
                    } else {
                        // disable autorotation
                        autoadvanceenabled = 0;
                        // stop any animations
                        $('*').stop();
                        // stop frame advancement
                        advanceframes('stop');
                        // clear any thumb progress
                        $('div', $herothumbprogressclone).remove();
                    }

                    // ...and if we're at the end and want to loop around...
                    // ...spoof infinite rotation by advancing to the cloned "first" frame
                    $heroinner.animate({
                        'left': -(herowidth * (herounitcount + 1)) // +1 to continue on to cloned frame
                    }, function(e) {

                        // once animation finishes, seamlessly shift back to the beginning of the slider
                        $heroinner.css({
                            'left': -(herowidth)
                        });

                        // set new frame references
                        currentframe = 1;
                        nextframe = 2;
                        prevframe = herounitcount;
                    });

                } else if (currentframe == 1 && frame == herounitcount && changetype != 'auto') {

                    // ...or if we're at the beginning and want to go backwards...
                    // ...spoof infinite rotation by receding to the cloned "last" frame
                    $heroinner.animate({
                        'left': 0
                    }, function(e) {
                        // once animation finishes, seamlessly shift back to the end of the slider
                        $heroinner.css({
                            'left': -(herowidth * herounitcount)
                        });

                        // set new frame references
                        currentframe = herounitcount;
                        nextframe = 1;
                        prevframe = herounitcount - 1;
                    });

                } else {

                    // ...otherwise just animate whichever direction is appropriate
                    // (mostly duplicated from 'click' case above)
                    $heroinner.animate({
                        'left': -(herowidth * frame)
                    }, function(e) {

                        // set new frame references
                        currentframe = frame;

                        if ( currentframe == herounitcount ) {
                            nextframe = 1;
                        } else {
                            nextframe = currentframe + 1;
                        }
                        if ( currentframe == 1 ) {
                            prevframe = herounitcount;
                        } else {
                            prevframe = currentframe - 1;
                        }
                    });

                }

                // if autoadvance is turned on, and was interrupted by a swipe, restore it...
                if ( changetype == 'swipe' ) {
                    advanceframes('start');
                }

                // ...and reset the progress bar
                if ( autoadvanceenabled == 1 ) {
                    thumbprogress(frame);
                }
            }
        }

        // update omniture var
        s.linkTrackVars = "eVar7";
        s.eVar7 = $heroframe.filter('[data-hero-frame=' + frame + ']').attr('data-evar');
        s.tl(this,'o','hero image load');

    };

    // progress bars
    var thumbprogress = function(frame) {

        if ( herounitcount > 1) {
            // clear out any existing progress bars
            $('div', $herothumbprogressclone).stop().css({
                'width': 0
            });

            // determine which bar represents the current frame
            var $currentbar = $herothumbprogressclone.filter('[data-thumb-progress=' + parseInt(frame) + ']');

            // animate the bar
            $('div', $currentbar).animate({
                'width': '100%'
            }, autoadvancetimer, 'linear', function() {
                $('div', $currentbar).css({
                    'width': 0
                });
            });
        }
    };
    if ( autoadvanceenabled == 1 ) {
        thumbprogress(1);
    }

    // slider auto-advancing
    var advanceinterval;
    var advanceframes = function(flag) {
        if ( flag == 'start' && autoadvanceenabled == 1 ) {
            advanceinterval = setInterval( function() {
                changeframe(nextframe, 'auto');
            }, autoadvancetimer);
        } else if ( flag == 'stop') {
            clearInterval(advanceinterval);
        }
    };

    if ( herounitcount > 1 ) {
        advanceframes('start');
    }

    // clicks and swipes
    if ( herounitcount > 1) {

        // slider change by clicking thumbnail
        $herothumbclone.click( function(e) {
            if ( $hotspot.hasClass('active') || $herobubble.is(':visible') ) {
                // don't do anything if any hero bubbles are open
            } else {
                // grab desired frame from thumbnail reference; +1 to adjust indexing
                var desiredframe = parseInt( $(this).attr('data-thumb-frame') ) + 1;

                if ( autoadvanceenabled == 1 ) {
                    // temporarily halt the auto-advance
                    if ( desiredframe != currentframe ) {
                        advanceframes('stop');
                    }
                }

                // move to new frame
                changeframe(desiredframe, 'click');
            }
        });

        // slider change by swiping
        $herowrapper.on('swipeleft', function(e) {

            if ( autoadvanceenabled == 1 ) {
                // temporarily halt the auto-advance
                advanceframes('stop');
            }

            // advance to next frame in order
            changeframe(nextframe, 'swipe');
        });

        $herowrapper.on('swiperight', function(e) {

            if ( autoadvanceenabled == 1 ) {
                // temporarily halt the auto-advance
                advanceframes('stop');
            }

            // recede to previous frame in order
            changeframe(prevframe, 'swipe');
        });
    }

    // recalculate dimensions on window resize event
    $window.resize( function() {
        getdimensions();
        setheropos();
        setthumbpos();
    });


    // hotspots and bubbles
    var $herocontainer = $('#hero');
    var $hotspot = $('a.hotspot');
    var $herobubble = $('.herobubble');
    var $hotspotcollection;

    $hotspot.click( function(e) {
        e.preventDefault();
        e.stopPropagation();
        $hotspotcollection = $(this).attr('data-hotspot-collection');
        if ( $(this).hasClass('active') ) {
            // if it's already open, close it...
            $herobubble.hide();
            $(this).removeClass('active');
            // ...and restart the auto-advance
            advanceframes('start');
            thumbprogress(currentframe);
        } else {
            // ...otherwise close any existing ones and open the new one
            $herobubble.hide();
            $hotspot.removeClass('active');
            $(this).addClass('active');
            // stop any animations to prevent queuing issues
            $('*').stop();
            // temporarily halt the auto-advance
            advanceframes('stop');
            // filter down to the correct hotspots (since there will be multiple within the carousel)
            $herobubble.filter('.' + $(this).attr('data-hotspot') + '[data-hotspot-collection=' + $hotspotcollection + ']').show();
        }
    });

    // hide any existing bubbles when clicking on background
    $herocontainer.click( function(e) {
        // conditional prevents this from running during other clicks in the container, such as on thumbnails
        if ( $hotspot.hasClass('active') || $herobubble.is(':visible') ) {
            $herobubble.hide();
            $hotspot.removeClass('active');
            // restart the auto-advance
            advanceframes('start');
            thumbprogress(currentframe);
        }
    });

    $herobubble.click( function(e) {
        e.stopPropagation();
    });

    // video overlay
    var $videothumb = $('#hero .videothumb');
    var $videoclosebutton = $('#hero .video-overlay a.video-close');
    var $videoframe;
    var videosrc;

    $videothumb.click( function(e) {
        e.preventDefault();
        // stop any animations to prevent queuing issues
        $('*').stop();
        // temporarily halt the auto-advance
        advanceframes('stop');
        // grab the correct video and overlay (since there will be multiple within the carousel)
        $(this).parent().parent().siblings('.video-overlay').fadeIn(1000, function() {
            $videoframe = $(this).find('iframe');

            // the first time it loads the src will already be there
            // but subsuquent loads will require setting the src anew
            if ( $videoframe.attr('src') == '' ) {
                $videoframe.attr('src', $videoframe.attr('data-src-ref'));
            }
        });
    });

    $videoclosebutton.click( function(e) {
        e.preventDefault();
        $(this).parent().parent().fadeOut(1000, function() {
            // stop the video by emptying the src attribute
            $videoframe.attr('src', '');
            // restart the auto-advance
            advanceframes('start');
            thumbprogress(currentframe);
        });
    });

    // followup overlay
    var $followupbutton = $('#hero a.followup-button');
    var $followupclosebutton = $('#hero .followup-close');

    $followupbutton.click( function(e) {
        e.preventDefault();
        // stop any animations to prevent queuing issues
        $('*').stop();
        // temporarily halt the auto-advance
        advanceframes('stop');
        // grab the correct overlay (in case there are multiple within the carousel)
        $(this).parents().siblings('.followup-overlay').fadeIn(1000, function() {
            // callback placeholder
        });
    });

    $followupclosebutton.click( function(e) {
        e.preventDefault();
        $(this).parents('.followup-overlay').fadeOut(1000, function() {
            // restart the auto-advance
            advanceframes('start');
            thumbprogress(currentframe);
        });
    });

    // expose some functionality to the global scope for use by third parties
    var sonyhero = {};
    sonyhero.advanceframes = advanceframes;
    sonyhero.thumbprogress = thumbprogress;
    sonyhero.currentframe = currentframe;
    window.sonyhero = sonyhero;

});