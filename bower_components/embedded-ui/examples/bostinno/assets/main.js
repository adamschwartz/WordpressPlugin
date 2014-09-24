(function($, exports, undefined) {

    // Shim for IE Object.create
    if (typeof Object.create != 'function') {
        (function () {
            var F = function () {};
            Object.create = function (o) {
                if (arguments.length > 1) { throw Error('Second argument not supported');}
                if (o === null) { throw Error('Cannot set a null [[Prototype]]');}
                if (typeof o != 'object') { throw TypeError('Argument must be an object');}
                F.prototype = o;
                return new F();
            };
        })();
    }

    // Shim for ie preventDefault
    try{
        if (document.createEventObject && typeof document.createEventObject().constructor.prototype.preventDefault !== 'function')
                document.createEventObject().constructor.prototype.preventDefault = function() {
                    this.returnValue = false;
                };
    }
    catch(err){
    }
    
    exports.Streetwise = exports.Streetwise || {};
	
	var initializing = false, nonNativeAdsLoaded = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	function baseClass(){}
	
	baseClass.extend = function(props) {
		var _super = this.prototype;
		var proto = Object.create(_super);
		for (var name in props) {
			proto[name] = typeof props[name] === "function" && 
				typeof _super[name] == "function" && fnTest.test(props[name]) ?
					(function(name, fn){
						return function() {
							var tmp = this._super;
							
							this._super = _super[name];
							
							var ret = fn.apply(this, arguments);        
							this._super = tmp;
							
							return ret;
						};
					})(name, props[name]) :
						props[name];
		}
		var newClass = typeof proto.init === "function" ?
		proto.init : function(){};
		newClass.prototype = proto;
		proto.constructor = newClass;
		newClass.extend = baseClass.extend;
		
		return newClass;
	};
	
	Streetwise.baseClass = baseClass;
    Streetwise.ui = {};
    
    Streetwise.ui.openInPopup = function(e, $el){
        e.preventDefault();
        var specs = $el.data('specs') || '';
        window.open($el.attr('href'), $el.attr('title'), specs);
    };
    
    Streetwise.ui.showLoader = function() {
        $('body').css('cursor', 'wait');
    };
    
    Streetwise.ui.hideLoader = function() {
        $('body').css('cursor', 'default');
    };

    Streetwise.ui.addCommentMention = function(userObj) {
        if (!userObj || typeof userObj !== 'object' || $('#Comment_comment_content').length === 0
                || typeof $('#Comment_comment_content').data('mentionsInput') !== 'object')
            return;
        if (!userObj.id || !userObj.name || !userObj.value || !userObj.type)
            return;
        $('#Comment_comment_content').data('mentionsInput').reset();
        $('#Comment_comment_content').data('mentionsInput').add(userObj);
    };
    
    Streetwise.ui.showCommentReplyForm = function($el) {
        $('.comment-reply-icons').removeClass('commenting');
        if ($el.parent().hasClass('comment-icons-container'))
            $el.parent().addClass('commenting');
        if ($el.closest('.comment-content-wrap').find('.comment-reply-form-container').length > 0)
            $el.closest('.comment-content-wrap').find('.comment-reply-form-container')
                .append($('#comment-form')).show();
        else
            Streetwise.ui.showNewCommentForm();
        $('#Comment_comment_content').focus();
        $('#Comment_comment_parent').val($el.data('reply_to_id'));
        $('#cancel-comment-reply').removeClass('hidden');
        Streetwise.ui.addCommentMention({
            id: $el.data('user-id'),
            name: $el.data('user-name'),
            value: $el.data('user-name'),
            type: 'user'
        });
    };
    
    Streetwise.ui.showNewCommentForm = function() {
        $('.comment-reply-form-container').hide();
        $('#Comment_comment_parent').val(0);
        $('#cancel-comment-reply').addClass('hidden');
        $('#new-comment-form-container').append($('#comment-form'));
    };

    Streetwise.ui.isOnScreen = function($el) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
    
        var elemTop = $el.offset().top;
        var elemBottom = elemTop + $el.height();
    
        return ((elemBottom < docViewBottom) && (elemTop > docViewTop));
    };
    
    Streetwise.ui.showNewComment = function($comment) {
        var $target = ($comment.find("> div.row-fluid").data("parent") > 0)
            ? $(".comment-children:first", "#comment-"+$comment.find("> div.row-fluid").data("parent"))
            : $("> ul", "#post-comments");
        if(!$('#post-comments .comments-thread li').length > 0) $comment.addClass('new');
        $target.append($comment);
        $previousComment = $comment.prev('li').find('.comment-content-wrap');
        if(!$previousComment.length > 0)
            $previousComment = $comment.parent().parent().find('.comment-content-wrap:first');
        $comment.find('.comment-content-wrap .comment-caret').addClass(
                                                            ($previousComment.hasClass('white'))
                                                            ? 'white' : 'grey');
        $comment.parent().parent().parent().parent().next('li')
            .find('.comment-content-wrap:first .comment-caret').addClass('new');
        $("#cancel-comment-reply").click();
        if (Streetwise.ui.isOnScreen($comment))
            return;
        $("html, body").animate({
                    scrollTop: $comment.offset().top - $(window).height()/2
                }, 400);
    };
    
    Streetwise.ui.mentionsData = false;
    
    Streetwise.ui.loadCommentMentionsData = function(cb) {
        if (Streetwise.ui.mentionsData) return cb(Streetwise.ui.mentionsData);
        var data;
        $.getJSON('/comment/mentions-data/', function (result){
            Streetwise.ui.mentionsData = result;
            cb(Streetwise.ui.mentionsData);
        });
        return 1;
    };
    
    Streetwise.ui.commentFormMentions = function() {
        if (!$('#Comment_comment_content').length > 0)
            return;
        $('#Comment_comment_content').mentionsInput({
            onDataRequest: function(mode, query, callback){
                Streetwise.ui.loadCommentMentionsData(function(data){
                    var matches = _.filter(data, function(item){
                        return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1; });
                    callback.call(this, matches);
                });
            }
        });
    };

    Streetwise.ui.submitLikeForm = function($el) {
        $('#Like_comment_id').val($el.data('comment_id'));
        $('#Like_post_id').val($el.data('post_id'));
        $('#Like_container').val($el.data('container'));
        $('#like-form').submit();
    };
    
    Streetwise.ui.toggleLike = function($el) {
        if ($el.hasClass('like-logged-out'))
            return;
        if ($el.hasClass('post-plus-one'))
            return Streetwise.ui.togglePostLike($el);
        if ($el.data('is-comment'))
            return Streetwise.ui.toggleCommentLike($el);
    };

    Streetwise.ui.toggleCommentLike = function($el) {
        var $parent = $el.parent();
        var $counter = $parent.parent().find('.js-update-comment-like-count-target');
        if($counter.length > 0) {
            var count = parseInt($parent.parent().find('.js-update-comment-like-count-target').text().trim().slice(1));
            var newCount = ($parent.hasClass('liked')) ? count-1 : count+1;
            $counter.text('+'+newCount);
            if (newCount == 0)
                $counter.hide();
            else
               $counter.show();
        }
        $parent.toggleClass('liked');
        $el.toggleClass('hide');
        Streetwise.ui.submitLikeForm($el);
    };

    Streetwise.ui.togglePostLike = function($el) {
        var $counter = $el.parent().find('.js-update-like-count-target');
        if($counter.length > 0)
        {
            var count = $counter.text().trim();
            if (count == '-')
                count = 0;
            else
                count = parseInt(count);
            var newCount = ($('.sw-plus-one-icon').hasClass('liked'))
                ? count-1
                : count+1;
            if (newCount == 0)
                newCount = '-';
            $('.js-update-like-count-target').text(newCount);
        }

        var plusOne = $el.text().trim();
        if (plusOne == '-')
            plusOne = 0;
        if ($('.sw-plus-one-icon').hasClass('liked'))
            $('.sw-plus-one-icon').removeClass('liked');
        else
            $('.sw-plus-one-icon').addClass('liked');
        $('.sw-like-count').text(count);
        Streetwise.ui.submitLikeForm($el);
    };

    Streetwise.ui.loginAndToggleLike = function($el) {
        var oldCompleteFunction = Streetwise.loginComplete;
        Streetwise.loginComplete = function() {
            $('.sw-like').removeClass('like-logged-out');
            Streetwise.ui.toggleLike($el);
            Streetwise.loginComplete = oldCompleteFunction;
        };
        $('#login').click();
    };
    
    Streetwise.ui.loginToCreateChannel = function() {
	var oldCompleteFunction = Streetwise.loginComplete;
	Streetwise.loginComplete = function() {
	    $('#channel-create-form').submit();
	    Streetwise.loginComplete = oldCompleteFunction;
	};
	$('#login').click();
    };
    
    Streetwise.ui.fitTrendingLinks = function(){
        var widthCount = 0;
        var $trendingBar = $('#trending');
        $trendingBar.find('> li').show();
        $.each($('#trending > li') , function(i,el){
            $el = $(el);
            widthCount += $el.outerWidth();
            if(widthCount > $trendingBar.width())
                $el.hide();
        });
        if($trendingBar.find('> li:visible:last').hasClass('spacer'))
            $trendingBar.find('> li:visible:last').hide();
    };

    Streetwise.trackLogin = function(newUser, userId, redirectUrl) {
        _gaq = _gaq || [];
        var loginOrSignup = (newUser == true || newUser == 'true' ? 'signup' : 'login');
        _gaq.push([
            '_trackEvent',
            'userId_'+userId,
            loginOrSignup,
            window.location.href,
            1,
            1
        ]);
        if (typeof redirectUrl != 'undefined')
            _gaq.push(function() {
                window.location.href = redirectUrl;
            });
    };

    Streetwise.loginComplete = function(newUser, userId) {
        Streetwise.trackLogin(newUser, userId);
        window.location.reload();
    };
    
    Streetwise.loginFinished = function(newUser, userId) {
	$('#auth-dialog').dialog('close');
	Streetwise.syncswrst(function(){Streetwise.loginComplete(newUser, userId);});
    };
    
    Streetwise.ui.loginToComment = function() {
        var oldCompleteFunction = Streetwise.loginComplete;
        Streetwise.loginComplete = function() {
	    $('#comment-form').submit();
	    Streetwise.loginComplete = oldCompleteFunction;
        };
        $('#login').click();
    };
    
    Streetwise.ui.loginToSubscribe = function() {
	var oldCompleteFunction = Streetwise.loginComplete;
	var $loginButton = $('#login');
	var originalLoginTitle = $loginButton.data('title');
	$loginButton.data('title',
		'That email belongs to a registered user. Please login to subscribe');
	Streetwise.loginComplete = function() {
	    $('#subscribe-form').submit();
	    Streetwise.loginComplete = oldCompleteFunction;
	};
	$loginButton.click();
	$loginButton.data('title', originalLoginTitle);
    };
    
    loginToDoX = function(cb, title) {
	var oldCompleteFunction = Streetwise.loginComplete;
	var $loginButton = $('#login');
	var originalLoginTitle = $loginButton.data('');
	if (title) $loginButton.data('title', title);
	Streetwise.loginComplete = cb;
	$loginButton.click();
	$loginButton.data('title', originalLoginTitle);
    };
    
    Streetwise.ui.loginToJoinCommunity = function($el){
	loginToDoX(function() {$el.closest('form').submit();},
		   'Please login to join this community');
    };
    
    Streetwise.ui.loginToRequestChannelMembership = function() {
	var oldCompleteFunction = Streetwise.loginComplete;
        Streetwise.loginComplete = function() {
	    $('#join-channel').submit();
	    Streetwise.loginComplete = oldCompleteFunction;
        };
        $('#login').click();
    };
    
    Streetwise.ui.circularNav = {};
    
    Streetwise.ui.circularNav.toggleCircleNav = function(e , $el) {
		e.preventDefault();
		$el.parent().toggleClass('is-out');
		if($el.parent().hasClass('is-out')) $el.find('.icon-white').removeClass('icon-plus').addClass('icon-minus');
        else $el.find('.icon-white').removeClass('icon-minus').addClass('icon-plus');
    };
    
    Streetwise.ui.circularNav.bindLinks = function() {
	$('.nav-circular').find('a').click(function(e) {
	    if (!$(this).attr('href'))
    		e.preventDefault();
	    $(this).closest('.nav-circular').find('.center-button').click();
	});
    };
    
    Streetwise.ui.inPlaceEditToggler = function ($input, $display, $inputContainer, $displayContainer) {
	if (!$inputContainer) $inputContainer = $input;
	if (!$displayContainer) $displayContainer = $display;
	return function(showHide) {
	    var actions = {};
	    
	    actions.hide = function () {
		$inputContainer.hide();
		$display.text($postTitleInput.val());
		$displayContainer.show();
	    };
	    
	    actions.show = function () {
		$displayContainer.hide();
		$inputContainer.show();
	    };
	    
	    if (typeof actions[showHide] === 'function')
		actions[showHide]();
	};
    };
    
    Streetwise.ui.centerElement = function($el){
        if(($(window).outerWidth(true) - $el.outerWidth(true)) / 2 < 0)
            return $el.css('left' , '0px');
        $el.css('left' , ($(window).outerWidth(true) - $el.outerWidth(true)) / 2);
	return 1;
    };
    
    Streetwise.ui.toggleUserDropdown = function($el){
        $el.parent().find('.caret').toggleClass('caret-inverse');
        if($el.parent().find('.caret').hasClass('caret-inverse')){
            $('body').on('click.user-dropdown' , function(e){
                if($(e.target).closest('.is-logged-in').closest('.navbar-fixed-top').length > 0 
                    || $(e.target).closest('.right').hasClass('is-logged-in'))
                    return;
                $el.parent().css('height' ,'45px');
                $el.parent().find('.caret').removeClass('caret-inverse');
                $('body').off('click.user-dropdown');
            });
            $el.parent().css('height', $el.parent().find('.user-dropdown').outerHeight(true));
        }
        else{
            $el.parent().css('height' ,'45px');
        }
    };
    
	Streetwise.ui.initiateSpotlightPosts = function(){
		$('#homepage-spotlight').responsiveSlides({
			timeout: 5000,
			nav: true,
			navContainer: '#homepage-spotlight',
			prevText: '‹',
			nextText: '›',
			pause: true,
			manualControls: '.js-spotlight-pager'
		});
        $('#homepage-spotlight .post-details > .js-post-author-link').on('click', function(e) {
            e.preventDefault();
            window.location = $(this).data('href');
        });
	};

    Streetwise.ui.initiateVideoClickHandlers = function(){
        $('.js-video-play-button').on('click', function() {
            var $parentContainer = $(this).parent();
            var width = $parentContainer.find('.video-unit-img-container').width()
            var height = $parentContainer.find('.video-unit-img-container').height();
            var videoUrl = $parentContainer.find('.js-post-video-url').text();
            if (/youtube|vimeo/.test(videoUrl))
                videoUrl += (/\?/.test(videoUrl) ? '&' : '?') + 'autoplay=1';
            $parentContainer.find('.video-unit-img-container').remove();
            $(this).remove();
            $parentContainer.prepend('<iframe width="'+width+'" height="'+height+'"'
                                        +' src="'+videoUrl+'" frameborder="0" allowfullscreen></iframe>');
        });
    };
	
	Streetwise.ui.initiateNewsletterFlyover = function(){
		if ($('.newsletter-flyover').length < 1 || $.cookie('hide_flyins') === 'true')
			return;
        if ($('#bottom-right-flyin').length > 0)
            return Streetwise.ui.initiateBottomRightFlyin();
        if ($('#center-flyin').length > 0)
            return Streetwise.ui.initiateCenterFlyin();
	};

    Streetwise.ui.initiateBottomRightFlyin = function(){
        var $contentContainer = $('#content');
        if (window.location.search.indexOf('locker=') === -1) {
            $('.js-trigger-flyover-close').on('click.flyoverClose',function(){
                $(this).closest('.newsletter-flyover').removeClass('in');
                $.cookie('hide_flyins', 'true', {expires: 2, path: '/'});
            });
        }
        var callback = _.throttle(function(){
            if ($(window).scrollTop()
                >= ($contentContainer.offset().top + ($contentContainer.height() / 3 )) - $(window).height()){
                $('.newsletter-flyover').addClass('in');
                $(window).off('scroll.articleFlyover');
            }
        }, 200);
        $(window).on('scroll.articleFlyover' , callback);
    };

    Streetwise.ui.initiateCenterFlyin = function(){
        var left = ($(window).width() - 600) / 2;
        var top = ($(window).height() - 400) / 2;
        $('#center-flyin > .flyin-container').css({left: left, top: top});
        $('#center-flyin').addClass('in').show();
        if (window.location.search.indexOf('locker=') === -1) {
            $('body').on('keyup.centerFlyin', function(event) {
                if (event.keyCode != 27)
                    return;
                if ($('#center-flyin').is(':visible')) {
                    $('#center-flyin').fadeOut('fast');
                    $('body').off('keyup.centerFlyin');
                }
                $.cookie('hide_flyins', 'true', {expires: 2, path: '/'});
            });
            $('#center-flyin').on('click.centerFlyin', function() {
                $(this).fadeOut('fast');
                $('body').off('click.centerFlyin');
                $.cookie('hide_flyins', 'true', {expires: 2, path: '/'});
            });
			$('.js-trigger-flyover-close').on('click.flyoverClose',function(){
                $(this).parent().closest('.newsletter-flyover').removeClass('in').hide();
                $.cookie('hide_flyins', 'true', {expires: 2, path: '/'});
            });
		}else if (window.location.search.indexOf('locker=') !== -1
				  && $('.js-trigger-flyover-close').length > 0)
			$('.js-trigger-flyover-close').hide();
        $('#center-flyin > .flyin-container').on('click.flyinContainer', function(event) {
            event.stopPropagation();
        });
	};

    Streetwise.ui.watchNewsletterFlyoverInputs = function(){
        if ($('.newsletter-flyover').length < 1)
            return;
        $('.js-flyover-submit').removeClass('disabled');
        $('.newsletter-flyover').on('keydown.submitFlyover', '.js-email-input', function(event) {
            if (event.keyCode != 13)
                return;
            $('body').css('cursor', 'wait');
            Streetwise.clickTracker.trackClick($(this).parent().find('.js-flyover-submit'));
            Streetwise.ui.disableNewsletterFlyoverInputs();
            Streetwise.syncswrst(Streetwise.ui.submitNewsletterSubscriptionFlyover);
        });
        $('.newsletter-flyover, .flyin-container').on('click.submitFlyover', '.js-flyover-submit', function(event) {
            event.preventDefault();
            $('body').css('cursor', 'wait');
            Streetwise.ui.disableNewsletterFlyoverInputs();
            Streetwise.syncswrst(Streetwise.ui.submitNewsletterSubscriptionFlyover);
        });
    };

    Streetwise.ui.disableNewsletterFlyoverInputs = function(){
        $('.js-flyover-submit').addClass('disabled');
        $('.newsletter-flyover').off('keydown.submitFlyover');
        $('.newsletter-flyover .flyin-container').off('click.submitFlyover');
    };

    Streetwise.ui.submitNewsletterSubscriptionFlyover = function(){
        var data = {
            subscriptionEmail: $('.newsletter-flyover .js-email-input').val(),
            subscriptionListId: $('.newsletter-flyover .js-newsletter-list-id').val(),
            swrstysmbtfo: $('#swrstysmbtfo').text().trim()
        };
        $.post('/ajax/mailchimp/subscribe/', data, function(r) {
            $('body').css('cursor', 'default');
            result = $.parseJSON(r);
            if (result.errors) {
                $('.newsletter-flyover .js-message-text').css('text-align', 'center');
                Streetwise.ui.watchNewsletterFlyoverInputs();
                return $('.newsletter-flyover .js-message-text').text(result.errors);
            }
            if (result.success) {
                if (result.signup)
                    Streetwise.trackLogin(true, result.userId);
                $.cookie('hide_flyins', 'true', {expires: 2, path: '/'});
                var html = '<span style="display:inline-block;margin:22px 0;">Thanks!<br>Keep an eye on your inbox.</span>';
                if ($('#center-flyin').length > 0)
                    $('#center-flyin').css({display: 'block', 'text-align': 'center'});
                $('.newsletter-flyover .js-flyin-message').html(html);
                setTimeout(function() {
                    if ($('.newsletter-flyover').hasClass('in'))
                        $('.newsletter-flyover').removeClass('in')
                    else
                        $('.newsletter-flyover').fadeOut('fast');
                }, 5000);
            }
        });
    };
	
    Streetwise.bg = {};
    Streetwise.bg.setBackgroundPosition = function($el){
        $el.each(function(index ,element){
            var offset = $(element).offset();
            $(element).css('backgroundPosition' , "-"+offset.left+"px -"+offset.top+"px" );
        });
    };
    
    Streetwise.adTag = Streetwise.adTag || {};
    
    Streetwise.adTag.ord = Math.floor(Math.random() * 1e16);
    
    Streetwise.adTag.resetOrd = function() {
    	Streetwise.adTag.ord = false;
    };
    
    Streetwise.adTag.load = function(id) {
    	var adFrame = $('#'+id);
    	var ord = Streetwise.adTag.ord || Math.floor(Math.random() * 1e16);
    	adFrame.width(adFrame.data('width'))
    	    .height(adFrame.data('height'))
    	    .attr('src', adFrame.data('src')+';ord='+ord+'?');
    };
    
    Streetwise.adTag.reload = function(id) {
        Streetwise.adTag.resetOrd();
        Streetwise.adTag.load(id);
    };
    
    Streetwise.adTag.reloadAll = function(){
        $('.'+((Streetwise.isMobile && screen.width < 768)? 'mobile' : 'desktop')+'-ad-tag').each(function(){
            Streetwise.adTag.reload($(this).attr('id'));
        });
    };
    
    Streetwise.isMobile = (/iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase()));
    
    Streetwise.syncswrst = function(cb) {
	$.get('/syncswrst/', function(r){
	    $('#swrstysmbtfo').text(r);
	    $('input[name="swrstysmbtfo"]').val(r);
	    if (typeof cb === 'function')
		cb();
	});
    };
    
    Streetwise.ui.toggleSocial = function($el) {
	if ($el.data('socialpopoverfired') === 'yes')
	    return;
	var iframe = $el.parent().find('iframe');
	if (iframe && iframe.data('src'))
	    $el.parent().find('iframe').attr('src', iframe.data('src'));
	$el.popover({content: $el.parent().find('.social-tooltip').html(),
		html: true,
		container: $el.parent(),
		trigger: 'click',
		placement: 'top'});
	$el.data('socialpopoverfired', 'yes');
	$el.popover('show');  
    };
    
    Streetwise.ui.lazyLoadSocialButton = function($el){
	if (!$el.is(':visible'))
	    return;
	var src = $el.data('src');
	if (src && !$el.attr('src')) $el.attr('src', src);
    };
    
    Streetwise.ui.openAuthDialog = function(url, title, cssClass) {
	$dialog = $('#auth-dialog');
	$('#auth-frame-container').data('target', url);
	$dialog.dialog('option', 'title', title);
	$('#auth-dialog').removeClass('login signup')
	    .addClass(cssClass);
	$dialog.dialog('open');
	if (!loginDialogMonitorIntervalId)
	    startLoginDialogMonitor($dialog);
    };
    
    Streetwise.ui.addFlashMessage = function(message, classes) {
	var flashMessage = _.template("<div class='alert <%= classes %>'>\
		<button type='button' class='close' data-dismiss='alert'>&times;</button>\
		<%= message %></div>",{message:message, classes:classes});
	$('#flash-messages').append(flashMessage);
    };
	
	Streetwise.weather = {
		load: function(){
			if (typeof $.simpleWeather !== 'function' || $('#weather-widget').length < 1)
			    return;
			$.simpleWeather({
				success: function(weather){
				  $('#weather-widget').html(_.template( $('#js-sw-weather').html() ,weather));
				},
				error: function(error) {
				  $('#weather-widget').html('<p>'+error+'</p>');
				}
			});
		}
	};
	
	Streetwise.nativeAds = {};
	Streetwise.nativeAds.setupAd = function(el){
		var $el = $(el);
		if ($el.css('display') == 'none')
			return Streetwise.nativeAds.loadNonNativeAds();
		$el.data('ad-monitor-interval',
			setInterval(function(){
				iframe = $el.find('[id$=__container__] iframe').first()[0];
				if (!(iframe && iframe.nodeName == 'IFRAME'))
					return;
				if(iframe.contentDocument
					 && iframe.contentDocument.body != null){
					clearInterval($el.data('ad-monitor-interval'));
					$el.data('ad-monitor-interval', null);
					setTimeout(function(){
						try{
							$el.trigger('ad-loaded');
						}catch(err){
							Streetwise.nativeAds.setupAd(el);
						}}, 800);
				}
		}, 800));
	};

	Streetwise.nativeAds.loadNonNativeAds = function() {
		if (nonNativeAdsLoaded)
			return;
		nonNativeAdsLoaded = true;
		$.get('/ajax/channel-widgets/', function(r) {
			if ($(r).length > 2) {
				var widgets = $(r);
				widgets.splice(1, 1);
			} else
				var widgets = $(r);
			$('#partner-channel-widget').parent().html(widgets[0]);
			$('#latest-member-articles-widget').parent().html(widgets[1]);
			$('.sidebar-widget-container .dotdotdot').dotdotdot({watch: true});
		});
	};
	
	Streetwise.translateHoverToClick = function(e){
		var data = {
			link: $(e.target),
			dropMenu: ($(e.target).hasClass('js-header-submenu-links'))
						? $(e.target).next()
						: ($(e.target).is('img')) ? $(e.target).parent().next() : ($(e.target).hasClass('avatar-overlay-container') ? $(e.target).parent().parent().find('.dropdown-menu') : $(e.target).parent().find('.dropdown-menu'))
		};
		if (!$(data.dropMenu).hasClass('js-menu-visible')) {
			($(data.dropMenu).hasClass('hide'))
				$(data.dropMenu).removeClass('hide');
			e.preventDefault();
			$(data.dropMenu).parent().parent().find('.dropdown-menu').removeClass('show js-menu-visible');
			$(data.dropMenu).addClass('show js-menu-visible');
			if ($(data.dropMenu).hasClass('sub-menu-content')){
				$(data.dropMenu).parent().parent().find('.sub-menu-content').not($(data.dropMenu)).addClass('hide').removeClass('show js-menu-visible');
			}
		}
		$('body').bind('touchstart.headerDropdown', data, function(e){
			if (!$(e.target).closest($(data.dropMenu)).length
					&& $(data.dropMenu).hasClass('js-menu-visible')
						&& ($(data.dropMenu).hasClass('dropdown-menu') || $(data.dropMenu).hasClass('dropdown-search'))
							&& !$(e.target).hasClass('js-header-links')) {
				$(data.dropMenu).removeClass('show js-menu-visible');
				$('body').unbind('touchstart.headerDropdown');
			}
		});
	};
	
	Streetwise.headerSubMenuHighlight = function(e){
		var firstLink = $(e.target).next().find('.sub-menu').find('li').first();
		if (e.type == "mouseenter") {
			$(firstLink).addClass('sub-menu-item-active');
		}else{
			$(firstLink).removeClass('sub-menu-item-active');
		}
	};
	
	$('document').ready(function(){
        $('.gpt-ad').each(function(){
            Streetwise.nativeAds.setupAd(this);
        });

        $('body').on('click', '.open-in-popup', function(e){
            Streetwise.ui.openInPopup(e, $(this));
        });
        
        $('body').on('click', '.comment-reply', function(e){
            Streetwise.ui.showCommentReplyForm($(this));
        });
        
        $('body').on('click', '#cancel-comment-reply', function(){
            Streetwise.ui.showNewCommentForm();
        });
        
        $('body').on('click', '.comment-submit-logged-out', function(e) {
            e.preventDefault();
            Streetwise.ui.loginToComment();
        });
	
		$('body').on('click', '.join-channel-logged-out', function(e) {
			e.preventDefault();
			Streetwise.ui.loginToRequestChannelMembership();
		});
        
        $('body').on('click', '.sw-like', function(e) {
            Streetwise.ui.toggleLike($(this));
        });
        
        $('body').on('click', '.like-logged-out', function(e) {
            Streetwise.ui.loginAndToggleLike($(this));
        });
		
		if (Streetwise.isMobile)
		$('body').on('touchstart', '.js-header-links, .js-header-submenu-links', function(e) {
			Streetwise.translateHoverToClick(e);
		});
		
		$('body').on('hover', '.js-header-links', function(e){
			Streetwise.headerSubMenuHighlight(e);
		});
		
		var loginDialogMonitorIntervalId = false;
		
		var stopLoginDialogMonitor = function() {
			clearInterval(loginDialogMonitorIntervalId);
		};
	
		var secureUrl = false;
	
		if ($('#login').length > 0)
			$.getJSON('/login/secure-url/', function(r){
				secureUrl = r.url;
			});
		
		var loginDialogMonitor = function($el) {
			var url = secureUrl || 'closeme';
			var regexp = new RegExp(url);
			var corrupted = false;
			$el.find('iframe').each(function() {
			$iframe = $(this);
			if (!regexp.test($iframe.attr('src'))){
				$iframe.remove();
				corrupted = true;
			}
			});
			if (corrupted) $el.dialog('close');
		};
	
		var startLoginDialogMonitor = function($el) {
			loginDialogMonitorIntervalId = setInterval(function() {
			loginDialogMonitor($el); }, 500);
		};
	
		$('body').on('click', '.auth-frame-dep', function(e) {
			var $el = $(this);
			$dialog = $('#auth-dialog');
			e.preventDefault();
			$('#auth-frame-container').data('target', $el.attr('href'));
			if ($el.data('title'))
			$dialog.dialog('option', 'title', $el.data('title'));
			$('#auth-dialog').removeClass('login signup').addClass($el.attr('id') === 'login'? 'login' : 'signup')
			$dialog.dialog('open');
			if (!loginDialogMonitorIntervalId)
			startLoginDialogMonitor($dialog);
		});
		
		$('body').on('click', '.js-onclick-disable', function(e){
			$(this).addClass('disabled').css('pointer-events', 'none').attr('disabled');
		});
		
		if (typeof $.fn.fitVids === 'function')
			$('body').fitVids({
				customSelector: "iframe[src*='cdn9.fliqz.com']"
			});
		
			$('.nav.nav-circular .center-button').click(function(e) {
				Streetwise.ui.circularNav.toggleCircleNav(e , $(this));
			});
			
			$(window).resize(function(){
				Streetwise.ui.fitTrendingLinks();
			});

			if (typeof $.fn.dotdotdot === 'function')
				$(".post-details .title , .dotdotdot").dotdotdot({watch: true});
						
			Streetwise.ui.fitTrendingLinks();
			Streetwise.ui.commentFormMentions();
		
			Streetwise.ui.circularNav.bindLinks();
		
			$('.'+((Streetwise.isMobile && screen.width < 768)? 'mobile' : 'desktop')+'-ad-tag').each(function() {
				var id = $(this).attr('id');
				Streetwise.adTag.load(id); 
			});
			
			$('.js-trigger-close-mobile-ad').click(function(e){
				$(this).closest('.adTag-wrap').hide();
			});
			
			if (Streetwise.isMobile && screen.width < 768)
				$('.mobile-ad-tag-iframe').load(function(){
					$(this).closest('.adTag-wrap').show();
				});
			
			$('.trigger-user-dropdown').on('click' , function(){Streetwise.ui.toggleUserDropdown($(this));});       
		
		$('body').on('click', '.social-button', function(){
			var $el = $(this);
			Streetwise.ui.toggleSocial($el);
		});
	
		$('body').on('click', '.create-channel', function() {
			$('#channel-create-dialog').dialog({resizable: false}).dialog('open');
		});
		
		$('body').on('click', '.channel-submit-logged-out', function(e){
			e.preventDefault();
			Streetwise.ui.loginToCreateChannel();
		});
		
		$('body').on('click', '.join-community-logged-out', function(e){
			e.preventDefault();
			Streetwise.ui.loginToJoinCommunity($(this));
		});
		
		if ($('iframe.post-wide-social').length)
			$('iframe.post-wide-social').bind("scrollin", {distance:200}, function(){
			Streetwise.ui.lazyLoadSocialButton($(this));
			});
			
		$('a[data-toggle="tab"]').on('shown', function (e) {
			$('iframe.post-wide-social').each(function() {
			if (Streetwise.ui.isOnScreen($(this)))
				Streetwise.ui.lazyLoadSocialButton($(this));
			});
		});
		
		$('.trigger-channel-upgrade-cta').on('click', function(e){
			e.preventDefault();
		   $('.channel-upgrade-modal').first().dialog({draggable : false , resizable : false , modal : true , width: 527 ,
			   height: 500
		   });
		   $('.channel-upgrade-modal').first().dialog('open'); 
		});
		
		$.cookie('test_cookie', 'cookieSet', { path: '/' });
		if ($.cookie('test_cookie') !== 'cookieSet')
		    Streetwise.ui.addFlashMessage("You are currently browsing with cookies disabled.\
			    In order for this site to function properly, cookies must be enabled.", "alert-error");	
		$.removeCookie('test_cookie');
		
		if ($('#homepage-spotlight').length > 0)
			Streetwise.ui.initiateSpotlightPosts();

        if ($('.js-video-play-button').length > 0)
            Streetwise.ui.initiateVideoClickHandlers();
		
		
		Streetwise.ui.initiateNewsletterFlyover();
        Streetwise.ui.watchNewsletterFlyoverInputs();
    });
}(jQuery, window));

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/,'').replace(/\s+$/, '');
  };
}

Streetwise.getURLParameter = function(name) {
	return decodeURIComponent(
		(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[null])[1]
	);
};
