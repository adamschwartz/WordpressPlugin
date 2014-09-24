(function($ , exports , undefined){

	Streetwise = exports.Streetwise || {};
	Streetwise.mobileHeader = Streetwise.mobileHeader || {};
	
	var mobileHeader = Streetwise.baseClass.extend({
		setSearchBarState : function(e){
			var searchBar = $('#mobile-search-bar');
			
			if ($(e.target).hasClass('js-logged-out-avatar') && !searchBar.is(':visible'))
				return;
			if (!searchBar.is(':visible') && !$(e.target).hasClass('js-search-icon'))
				return;
			if (searchBar.is(':visible') || $(e.target).hasClass('header-avatar'))
				searchBar.slideUp('slow');
			else
				searchBar.slideDown('slow');
		}
	});
	
	Streetwise.mobileHeader = new mobileHeader();
	
	$(document).ready(function(){
		$('body').on('click','.js-sw-dropdown ', function(e){
			Streetwise.mobileHeader.setSearchBarState(e);
		});
	});
}(jQuery, window));