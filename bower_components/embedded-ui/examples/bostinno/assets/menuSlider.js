/*****************************************************************************

Plugin: menuSlider

Description: Creates slide menu from left or right.

trigger is class passed to plugin that correlates to the button that should
be clicked

data-transform-length: attribute on menu defines length in pixels that menu should slide out,
						positive to slide from left, negative to slide from right

*****************************************************************************/
(function($, exports, undefined){

	var menuSlider = Streetwise.baseClass.extend({
		
		init : function(element, options){
			this.targetMenu = $(element);
			this.trigger = options.trigger;
			this.bindEvents();
			this.contentToSlide;
			this.watchWindowSize(this);
		},
		
		bindEvents : function(){
			$('body').on('click.menuSlider', this.trigger , $.proxy(function(){
				if ($(window).width() > 767)
					this.toggleMenu('body');
				else
					this.toggleMenu('.js-menu-slide-content');
			}, this));
		},
		
		toggleMenu : function(content){
			this.contentToSlide = content;
			if (this.targetMenu.hasClass('hide')) {
				this.targetMenu.removeClass('hide').addClass('show');
				this.showMenu(content);
			}
			else{
				this.hideMenu(content);
				setTimeout($.proxy(function(){
					this.targetMenu.removeClass('show').addClass('hide');
				}, this), 450);
			}
		},
		
		showMenu : function(content){
			$(content).css('transition','transform 450ms ease');
			$(content).css('-webkit-transition','-webkit-transform 450ms ease');
			$(content).css('-webkit-transform','translate('+this.targetMenu.data('transform-length')+', 0)');
			$(content).css('transform','translate('+this.targetMenu.data('transform-length')+', 0)');
			$(content).css('-ms-transform','translate('+this.targetMenu.data('transform-length')+', 0)');
		},
		
		hideMenu : function(content){
			$(content).css('transition','transform 450ms ease');
			$(content).css('-webkit-transition','-webkit-transform 450ms ease');
			$(content).css('-webkit-transform','translate(0, 0)');
			$(content).css('transform','translate(0, 0)');
			$(content).css('-ms-transform','translate(0, 0)');
		},
		
		watchWindowSize : function($this){
			var callback = _.throttle(function(){
				if ($(window).width() > 767
						&& ($this.targetMenu.hasClass('show') || $('#mobile-search-bar').is(':visible'))){
					$this.hideMenu($this.contentToSlide);
					$this.targetMenu.removeClass('show').addClass('hide');
					$('#mobile-search-bar').hide();
				}	
			}, 200);
			$(window).on('resize', callback);
		}
	});
	
	$.fn.menuSlider = function(){
		var pluginArgs = arguments;
		return this.each(function(){
			var element = $(this);

			if (element.data('menuSlider'))
				var plugin = element.data('menuSlider');
			else{
				var plugin = new menuSlider(this, pluginArgs[0]);
				element.data('menuSlider', menuSlider);
			}
		});
	};
	
})(jQuery , window);