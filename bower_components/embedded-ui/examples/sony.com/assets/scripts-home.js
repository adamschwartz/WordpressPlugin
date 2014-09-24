


(function(e) {
	e.fn.ellipsis = function() {
		return this.each(function() {
			var a = e(this);
			if (a.css("overflow") == "hidden") {
				var c = a.html(),
					d = a.hasClass("multiline"),
					b = e(this.cloneNode(true)).hide().css("position", "absolute").css("overflow", "visible").width(d ? a.width() : "auto").height(d ? "auto" : a.height());
				a.after(b);
				for (d = d ?
				function() {
					return b.height() > a.height()
				} : function() {
					return b.width() > a.width()
				}; c.length > 0 && d();) {
					c = c.substr(0, c.length - 1);
					b.html(c + "[...]")
				}
				a.html(b.html());
				b.remove()
			}
		})
	}
})(jQuery);

/*!
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/
(function(a){a.fn.fitVids=function(b){var c={customSelector:null};if(!document.getElementById("fit-vids-style")){var e=document.createElement("div"),d=document.getElementsByTagName("base")[0]||document.getElementsByTagName("script")[0];e.className="fit-vids-style";e.id="fit-vids-style";e.style.display="none";e.innerHTML="&shy;<style>                 .fluid-width-video-wrapper {                   width: 100%;                                position: relative;                         padding: 0;                              }                                                                                       .fluid-width-video-wrapper iframe,          .fluid-width-video-wrapper object,          .fluid-width-video-wrapper embed {             position: absolute;                         top: 0;                                     left: 0;                                    width: 100%;                                height: 100%;                            }                                         </style>";d.parentNode.insertBefore(e,d)}if(b){a.extend(c,b)}return this.each(function(){var f=["iframe[src*='player.vimeo.com']","iframe[src*='youtube.com']","iframe[src*='youtube-nocookie.com']","iframe[src*='kickstarter.com'][src*='video.html']","object","embed"];if(c.customSelector){f.push(c.customSelector)}var g=a(this).find(f.join(","));g=g.not("object object");g.each(function(){var l=a(this);if(this.tagName.toLowerCase()==="embed"&&l.parent("object").length||l.parent(".fluid-width-video-wrapper").length){return}var h=(this.tagName.toLowerCase()==="object"||(l.attr("height")&&!isNaN(parseInt(l.attr("height"),10))))?parseInt(l.attr("height"),10):l.height(),i=!isNaN(parseInt(l.attr("width"),10))?parseInt(l.attr("width"),10):l.width(),j=h/i;if(!l.attr("id")){var k="fitvid"+Math.floor(Math.random()*999999);l.attr("id",k)}l.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",(j*100)+"%");l.removeAttr("height").removeAttr("width")})})}})(jQuery);

//jQuery Cookie plugin https://github.com/carhartl/jquery-cookie#readme
jQuery.cookie = function(d, e, b) {
	if (arguments.length > 1 && String(e) !== "[object Object]") {
		b = jQuery.extend({}, b);
		if (e === null || e === undefined) {
			b.expires = -1
		}
		if (typeof b.expires === "number") {
			var g = b.expires,
				c = b.expires = new Date();

			c.setDate(c.getDate() + g)
		}
		e = String(e);
		return (document.cookie = [encodeURIComponent(d), "=", b.raw ? e : encodeURIComponent(e), b.expires ? "; expires=" + b.expires.toUTCString() : "", b.path ? "; path=" + b.path : "", b.domain ? "; domain=" + b.domain : "", b.secure ? "; secure" : ""].join(""))
	}
	b = e || {};

	var a, f = b.raw ?
	function(h) {
		return h
	} : decodeURIComponent;
	return (a = new RegExp("(?:^|; )" + encodeURIComponent(d) + "=([^;]*)").exec(document.cookie)) ? f(a[1]) : null
};

//jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function(x, t, b, c, d) {
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},

	easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},

	easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},

	easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},

	easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},

	easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},

	easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},

	easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},

	easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},

	easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},

	easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},

	easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},

	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},

	easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},

	easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},

	easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},

	easeInExpo: function(x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},

	easeOutExpo: function(x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},

	easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},

	easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},

	easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},

	easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},

	easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else
		var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},

	easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else
		var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},

	easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else
		var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},

	easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},

	easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},

	easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},

	easeInBounce: function(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},

	easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		}
	},

	easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
});

//alerts
var alerts = (function() {
	var d, b, a;
	return {
		init: function() {
			d = $("#alert");
			b = d.find(".close-btn").children("a");
			a = d.find(".content").attr("id");
			c()
		}
	};


	function c() {
		if ($.cookie(a) != "hide") {
			d.children(".content").removeClass("visually-hidden");
			d.data("origText", d.find(".description").html());
			d.find(".description").ellipsis();

			b.click(function() {
				d.children(".content").animate({
					opacity: 0
				}, 200, function() {
					d.children(".content").slideUp("normal", function() {
						d.removeClass("loaded")
					})
				});

				$.cookie(a, "hide");
				return false
			});

			d.attr("data-size", controler.size);
			$.cookie(a, "show");
			$(window).resize(function() {
				if (d.attr("data-size") != controler.size) {
					d.find(".description").html(d.data("origText"));
					if (controler.size != "s") {
						d.find(".description").ellipsis()
					}
					d.attr("data-size", controler.size)
				}
			})
		}
	}
})();

//nav
//nav
var nav = (function(){
	var $menuBtn,
		$nav,
		$navContent,
		$navList,
		$navListItems,
		$allNavListItems,
		$allNavLinks,
		$firstDropdownLists,
		$dropdownList,
		$dropdownListitems,
		$dropdownLinks,
		navTracker = 0,
		navHeight;

	/****** public methods ******/
	return{
		init:function(obj){
			$nav = $('nav');
			$menuBtn = $('#menu-btn a');
			nav.btn = $menuBtn;

			$menuBtn.click(function() {
				var $this = $(this);

				search.close();

				if($this.parent().hasClass("closed")){
					nav.animateMenu("show");
				}else{
					nav.animateMenu("hide");
				}
				return false;
			});

			buildNav();
		},
		animateMenu:function(showOrHide){
			if(showOrHide == 'show'){
				$menuBtn.parent().removeClass('closed').addClass('open');

				$navContent.css({'left': 0});

			}else if(showOrHide == 'hide'){
				$menuBtn.parent().removeClass('open').addClass('closed');
				$navContent.css({'left': 480});
				$navContent.find('.current').removeClass('current');
				navTracker = 0;
			}
		}
	}
	/****** private methods ******/
	function buildNav(){
		// $nav.find('.sub').each(function(){
		// 	$(this).children('ul').prepend('<li class="title"><a href="#"><span>'+$(this).children('a').children('span').text()+'</span></a></li>');
		// });

		$navContent = $nav.children('.content'),
		$navList = $navContent.children('ul');
		$navListItems = $navList.children('li');
		$allNavListItems = $navList.find('li');
		$allNavLinks = $navListItems.find('a');
		$firstDropdownLists = $navListItems.children('li');
		$dropdownList = $navListItems.find('ul');
		$dropdownListItems = $navListItems.find('li');
		$dropdownLinks = $dropdownList.find('a');
		navHeight = $navList.height();

		$navList.addClass('current');

		$allNavListItems.hover(
			function(){
				//if(controler.size != 's'){
					//alert('add Hover');
					$(this).addClass('hover');
					//adjustDropdown($(this).children('ul'));
				//}
			},
			function(){
				//if(controler.size != 's'){
					//alert('remove hover');
					$(this).removeClass('hover');
					//adjustDropdown($(this).children('ul'));
				//}
		});

		//add active class to links when clicked
		$allNavLinks.click(function(){
			var $this = $(this),
				$parent = $this.parent();

			//if ther is a sub menu
			if($parent.hasClass('sub')){
				//if it is small view
				if(controler.size == 's'){
					//label next level and make it visible
					//$this.next("ul").addClass("next-nav").css("display", "block");
					slideNav('forward');

					if ( $parent.hasClass('current') ) {
						$parent.removeClass('current');
					} else {
						$parent.addClass('current');
					}

				//if it is not small view
				}else{
					if($parent.hasClass('top') && $this.hasClass('clicked')){
						//alert('deActivateDropdowns');
						deActivateDropdowns();
					}else{
						//alert('activateDropdown');
						activateDropdown($this);
					}
				}
				return false;

			}else if($parent.hasClass('title') == true){
				slideNav("back");
				$parent.parent().parent().addClass('previous');
				return false;
			}


		});

		// the following has been replaced by a pure CSS solution, but may be useful if a more limber solution is needed in the future
		//
		// add .expandleft for situations where flyouts would appear behind edge of screen
        // if ( $('body').hasClass('l') && document.width <= 1200 ) {
        //     $('nav ul#nav-list > li:last-child').addClass('expandleft');
        // }

        // if ( $('body').hasClass('m') ) {
        //     $('nav ul#nav-list > li:nth-last-child(2), nav ul#nav-list > li:last-child').addClass('expandleft');
        // }

		$(window).resize(function(){
			resize();
		});

		if(controler.size == 's'){
			resize();
		}

	};

	function resize(){
		if(controler.size == 's'){
			var newWidth;
			if(controler.windowWidth > 480){
				newWidth = 480;
			}else{
				newWidth = controler.windowWidth;
			}
			$navList.width(newWidth);
			$dropdownList.width(newWidth).css('left', newWidth);
			if($menuBtn.parent().hasClass('open')){
				$navContent.css('left', -(navTracker*newWidth));
			}
			$navContent.addClass('mobile');
		}else{
			if($navContent.hasClass('mobile')){
				//close the mobile menu if it is showing
				$menuBtn.parent().removeClass('open').addClass('closed');
				$navContent.find('.current').removeClass('current');
				$navContent.attr('style','').removeAttr('style');
				$navList.attr('style','').removeAttr('style');
				$dropdownList.attr('style','').removeAttr('style');
			}

		}
	};

	function slideNav(direction){
		var contentWidth,
			navMargin = $navContent.css('left');

		navMargin = parseInt(navMargin.replace('px',''));

		if(controler.windowWidth > 480){
			contentWidth = 480;
		}else{
			contentWidth = controler.windowWidth;
		}

		if(direction == 'forward'){
			navTracker++;

			$navContent.stop().animate({
				'left': navMargin - contentWidth
			}, 300, function(){

			});
		}else if(direction == 'back'){
			navTracker--;
			$navContent.stop().animate({
				'left': navMargin + contentWidth
			}, 300, function(){
				$navContent.find('.previous').removeClass('previous').removeClass('current');
			});
		}
	}

	function activateDropdown(link){
		//alert('activateDropdown');
		var $link = $(link),
			$parent = $link.parent(),
			$siblings = $parent.siblings(),
			$activeChildren;

		//if the clicked link is active
		if($link.hasClass('clicked')){
			//alert('has been clicked');
			//make it not active
			$parent.removeClass('hover');
			$link.removeClass('clicked');
			//make children not active
			$activeChildren = $parent.find('.hover');
			$clickedChildren = $parent.find('.clicked');
			$activeChildren.removeClass('hover');
			$clickedChildren.removeClass('clicked');

		//if the clicked link is not active
		}else{
			//alert('does not have hover');
			//make it active
			$parent.addClass('hover');
			$link.addClass('clicked');
			//remove active states from siblings
			$siblings.each(function(){
				var $this = $(this);
				if($this.children('a').hasClass('clicked')){
					$activeChildren = $this.find('.hover');
					$clickedChildren = $this.find('.clicked');
					$this.removeClass('hover');
					$activeChildren.removeClass('hover');
					$clickedChildren.removeClass('clicked');
				}
			});

			//adjustDropdown($parent.children('ul'));

		}
	};
	function deActivateDropdowns(){
		//alert('deActivateDropdowns');
		var $active = $navList.find('.hover'),
			$clicked = $navList.find('.clicked');

		$active.removeClass('hover');
		$clicked.removeClass('clicked');
		$firstDropdownLists.css('left', -9999);
	};

	function adjustDropdown(list){
		var $list = $(list),
			$activeTab = $navList.children('.hover'),
			$otherLists = $navList.children('li:not(.hover)').children('ul'),
			$activeDropdown = $activeTab.children('ul'),
			offset = $list.offset().left + 235,
			windowWidth = $(window).width(),
			currentLeft = parseInt($activeDropdown.css('left').replace('px',''));

		$otherLists.css('left', -9999);
		/*
		if(offset > windowWidth){
			$activeDropdown.css('left', currentLeft-(offset - windowWidth));
		}else{
			$activeDropdown.css('left', 'auto');
		}*/

	};

})();

//Search
var search = (function() {
	var d, a, c, v;
	return {
		init: function() {
			d = $("#search-input");
			a = $("#search");
			c = $("#search-button");
			v = $("#search-dropdown-arrow");
			search.btn = c;
			b()
		},

		open: function() {
			c.removeClass("closed").addClass("open");
			a.addClass("show");
			v.show();
		},

		close: function() {
			c.removeClass("open").addClass("closed");
			a.removeClass("show");
			v.hide();
		}
	};


	function b() {
		d.addClass("empty").attr("value", "Search");
		c.children("a").click(function() {
			var f = $(this),
				e = f.parent();

			if (c.hasClass("closed")) {
				search.open();
				nav.animateMenu("hide");
			} else {
				search.close();
				nav.animateMenu("show");
			}
			return false
		});

		d.focus(function() {
			if (d.attr("value") == "Search") {
				d.removeClass("empty").attr("value", "")
			}
		});

		d.blur(function() {
			if (d.attr("value") == "") {
				d.addClass("empty").attr("value", "Search")
			}
		})
	}
})();


function sanitize(a) {
	var d = "";
	var c = "";
	for (var b = 0; b < a.length; b++) {
		d = a.charCodeAt(b);
		if (d == 32) {
			c += a[b]
		} else {
			if ((d > 47 && d < 58) || (d > 62 && d < 127)) {
				c += a[b]
			} else {
				c += "&#" + d + ";"
			}
		}
	}
	return c
}
bSearchEntered = false;

function isEmpty(a) {
	if (a == null || a.value.length == 0) {
		return true
	}
}
function errorFormSubmit() {
	sStr = document.forms.error_search_form.error_search_box.value;
	formSubmit(true, sStr, document.forms.error_search_form)
}
function formSubmit(c, e, d) {
	var b = document.forms.formSony.action;
	if (arguments.length == 1) {
		var a = document.forms.formSony.st;
		if (!bSearchEntered || (c && isEmpty(a))) {
			alert("Please enter a search term and then click the GO button.");
			return
		}
		if (!isEmpty(a)) {
			b.value = "search"
		}
		document.forms.formSony.st = document.forms.formSony.st;
		document.forms.formSony.submit()
	} else {
		if (arguments.length == 2) {
			d = document.forms.formSony;
			if (e.length == 0) {
				alert("Please enter a search term and then click the GO button.");
				return
			}
			d.st.value = e;
			d.submit()
		} else {
			d.st.value = e;
			d.submit()
		}
	}
}
function validForm(a) {
	if (a.st.value == "" || a.st.value == "Search" || a.st.value == "search") {
		return false
	}
	return true
}

//Tabs
var tabs = (function(){
	var $tabWrapper,
		$tabNav,
		$currentTab,
		$tabs,
		$tabContentWrapper,
		$tabContent,
		$dropdown;

	/****** public methods ******/
	return{
		init:function(){
			$tabWrapper = $('#tabs');

			buildTabs();
		}
	}
	/****** private methods ******/
	function buildTabs(){
		$tabNav = $('#tab-nav');
		$currentTab = $tabNav.children('.current');
		$tabs = $tabNav.children('li');

		$tabNav.addClass('length-'+$tabs.length);

		$tabWrapper.children('.content').prepend('<div id="tab-dropdown"><p>Select category</p><div class="select"><select id="tab-select"></select></div></div>');

		$dropdown = $tabWrapper.children('.content').children('#tab-dropdown').find('select');
		$tabContentWrapper = $tabWrapper.children('.content').children('#tab-content');

		$tabs.each(function(){
			var $link = $(this).find('a');

			$dropdown.append('<option value="'+$link.attr('href')+'">'+$link.find('.icon').text()+'</option>');

			$link.click(function(){
				if(controler.size == 's'){

				}else{
					loadTab($(this).parent().parent().parent());
				}
				return false;
			});
		});

		$dropdown.change(function(){
			var dataID = $(this).children("option:selected").attr('value');

			$tabs.each(function(){
				if($(this).find('a').attr('href') == dataID){

					loadTab($(this));
					return false;
				}
			});
		});

		//set up tab content
		buildTabContent();
	}

	function buildTabContent(){
		$tabContent = $tabContentWrapper.children('.content');

		$tabContent.each(function(){
			var $this = $(this),
			 	$featured = $this.find('.featured'),
			 	$video,
			 	$img = $featured.find('.img'),
			 	imgLink = $img.children('a').attr('href'),
			 	videoID;

			 //check if image is linked to a youtube video
			 if($img.length > 0){
				 if(imgLink.indexOf('youtu.be') >= 0){
				 	$img.children('a').append('<span class="play-icon"></span>');
				 	$img.after('<div class="video"></div>');

				 	$video = $featured.find('.video');

				 	videoID = imgLink.replace('http://youtu.be/','');

				 	$img.children('a').click(function(){
				 		//load video inline
				 		$img.hide();
				 		// add unique id to video div for omniture tracking
				 		$video.attr('id', videoID);
				 		// add YouTube embed code to video div and autoplay the movie
				 		$video.show().html('<iframe id="player1" src="http://www.youtube.com/embed/'+videoID+'?enablejsapi=1&version=3&autoplay=1&autohide=1&modestbranding=0&rel=0" width="390" height="228" frameborder="0" allowTransparency="true"></iframe>');
				 		// make video fluid using fitvideo plugin
				 		$video.fitVids();

				 		return false;
				 	});
				 }
			 }

			//if content has a twitter button
			var $twitterBtn = $featured.find('.twitter');
			if($twitterBtn.length > 0){
				$twitterBtn.append('<div class="twitter-tooltip"></div>');
				var $twitterTooltip = $featured.find('.twitter-tooltip');

				$twitterBtn.children('a').hover(
					function(){
						$twitterTooltip.show();
					},
					function(){
						$twitterTooltip.hide();
					}
				);
			}
		});


		// Check to see if tab has the class current
		if($currentTab.length <= 0){
	     //load first tab
	     loadTab($tabs[0]);
		} else {
			//load content for default tab
			loadTab($tabs[$currentTab.index()]);
		}



	};

	function loadTab(tabToLoad){
		var $tabToLoad = $(tabToLoad),
			dataID = $tabToLoad.find('a').attr('href').replace('#','');

		$tabContent.each(function(){
			var $this = $(this);
			if($this.attr('id') == dataID){
				$this.removeClass('visually-hidden');
			}else{
				$this.addClass('visually-hidden');
				$this.find('.video').children().remove();
				$this.find('.img').show();
			}
		});



		$tabNav.children('.current').removeClass('current');
		$tabToLoad.addClass('current');
		$dropdown.children('option').each(function(){
			if($(this).attr('value') == dataID){
				$(this).attr('selected', true);
			}
		});
	}


})();

//promos
var promos = (function() {
	var i, g, j, h = false;
	return {
		init: function() {
			i = $("#promos");
			l()
		}
	};


	function l() {
		g = i.find(".promo-item");
		j = i.find("img");
		g.each(function() {
			var a = $(this),
				c = a.find(".description"),
				b = c.children("p");
			b.hide();

			a.children("a").hover(function() {
				b.slideDown(150, "easeOutCubic", function() {})
			}, function() {
				b.slideUp(250, "easeOutCubic", function() {})
			})
		});

		$(window).resize(function() {
			k()
		});

		k()
	}
	function k() {
		var a;
		if (controler.size == "s") {
			if (controler.windowWidth > 480) {
				a = (480 - 60) / 2
			} else {
				a = (controler.windowWidth - 60) / 2
			}
			g.addClass("adjusted").width(a);
			j.addClass("adjusted").css("margin-left", -((220 - a) / 2))
		} else {
			if (controler.size == "m") {
				g.addClass("adjusted").width(170);
				j.addClass("adjusted").css("margin-left", -25)
			} else {
				if (controler.size == "l") {
					g.addClass("adjusted").width(220);
					j.addClass("adjusted").css("margin-left", "auto")
				}
			}
		}
	}
})();

//footer
var footer = (function() {
	var f, g, e;
	return {
		init: function() {
			f = $("#footer");
			h()
		}
	};


	function h() {
		e = f.find(".corporate-info");
		g = f.find(".corp-btn").find("a");
		e.hover(function() {
			if (e.hasClass("clicked") == false) {
				e.addClass("hover")
			}
		}, function() {
			if (e.hasClass("clicked") == false) {
				e.removeClass("hover")
			}
		});

		g.click(function() {
			if (e.hasClass("clicked")) {
				e.removeClass("clicked").removeClass("hover")
			} else {
				e.addClass("clicked")
			}
			return false
		})
	}
})();

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT / GPLv2 License.
*/
(function(w){

	// This fix addresses an iOS bug, so return early if the UA claims it's something else.
	var ua = navigator.userAgent;
	if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){
		return;
	}

    var doc = w.document;

    if( !doc.querySelector ){ return; }

    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
		x, y, z, aig;

    if( !meta ){ return; }

    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
    }

    function checkTilt( e ){
		aig = e.accelerationIncludingGravity;
		x = Math.abs( aig.x );
		y = Math.abs( aig.y );
		z = Math.abs( aig.z );

		// If portrait orientation and in one of the danger zones
        if( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
			if( enabled ){
				disableZoom();
			}
        }
		else if( !enabled ){
			restoreZoom();
        }
    }

	w.addEventListener( "orientationchange", restoreZoom, false );
	w.addEventListener( "devicemotion", checkTilt, false );

})( this );

var controler = (function() {
	var d, a, b = false;
	return {
		ie6: false,
		size: "s",
		windowWidth: $(window).width(),
		init: function() {
			d = $("body");
			$search = $("#search").find("#search-input");
			if ($("html").hasClass("ie6")) {
				controler.ie6 = true
			}
			$(window).resize(function() {
				c()
			});

			c();

			search.init();

			alerts.init();

			nav.init();

			tabs.init();

			promos.init();

			footer.init()
		}
	};


	function c() {
		controler.windowWidth = $(window).width();

		if (b == false) {
			if (controler.windowWidth < 740) {
				controler.size = "s";
				d.addClass("s").removeClass("m").removeClass("l")
			} else {
				if (controler.windowWidth >= 740 && controler.windowWidth < 960) {
					controler.size = "m";
					d.addClass("m").removeClass("s").removeClass("l")
				} else {
					if (controler.windowWidth >= 960) {
						controler.size = "l";
						d.addClass("l").addClass("m").removeClass("s")
					}
				}
			}
		}
	}
})();

//pinterest
$(document).ready(function() {
	var a = $(".pin-it-button");
	openModal = function(b) {
		window.open(b, "signin", "width=665,height=300")
	};

	a.each(function() {
		var c = $(this),
			b = c.attr("href");
		c.click(function() {
			openModal(b);
			return false
		})
	})
});


$(document).ready(function(){
controler.init();
});

// test: open several levels of nav on page load
// $(document).ready(function() {
// 	$('nav ul#nav-list > li:first-of-type').addClass('hover');
// 	$('nav ul#nav-list > li:first-of-type ul > li:first-of-type').addClass('hover');
// 	$('nav ul#nav-list > li:first-of-type ul > li:first-of-type ul > li:first-of-type').addClass('hover');
// 	$('nav ul#nav-list > li:first-of-type ul > li:first-of-type ul > li:first-of-type ul > li:first-of-type').addClass('hover');
// });