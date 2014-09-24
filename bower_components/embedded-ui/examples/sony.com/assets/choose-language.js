$(document).ready(function() {

    // page container
    var $container = $('body #container');

    // current option show in mini-nav
    var $langcurrentindicator = $('#social-media ul li.language > a');

    // the dropdown container with options
    var $langdropdown = $('#social-media #choose-language');

    // language options within the dropdown
    var $langselectionoption = $('ul li', $langdropdown);

    // current option within the dropdown
    var $langcurrentselection = $('ul li.active', $langdropdown);

    // switch to keep track of open/close state
    var langdropdownstate = 0;


    // methods to open and close the dropdown
    var opendropdown = function() {
        $langdropdown.show();
        langdropdownstate = 1;
    };

    var closedropdown = function() {
        $langdropdown.hide();
        langdropdownstate = 0;
    };


    // open/close drowndown when clicking on indicator in mini-nav
    $langcurrentindicator.click( function(e) {
        e.preventDefault();
        if (langdropdownstate == 0) {
            opendropdown();

            // set omniture vars
            //s.linkTrackVars="hier3,eVar18,eVar30,events";
            //s.linkTrackEvents="event23";
            //s.hier3 = data.region_code;
            //s.eVar18="D=pageName";
            //s.eVar30="D=h3";
            //s.events="event23";
            //s.tl(this,'o','geo-filter drop-down open');
            s.linkTrackVars='events'; 
            s.linkTrackEvents='event23'; 
            s.events='event23'; 
            s.tl(this,'o', 'geo-filter drop-down open',null,'navigate');
            s.linkTrackEvents=s.linkTrackVars=s.events='';
        } else if (langdropdownstate == 1) {
            closedropdown();
        }
    });


    // close dropdown and do nothing when clicking on the active selection
    // other clicks will take the user to new destination
    $langselectionoption.click( function(e) {
        if ( $(this).hasClass('active') ) {
            e.preventDefault();
            closedropdown();
        }
    });

});