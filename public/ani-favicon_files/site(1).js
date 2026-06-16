$ = jQuery;

$.fn.randomize = function(selector) {
	var $elems = selector ? $(this).find(selector) : $(this).children(),
		$parents = $elems.parent();

	$parents.each(function() {
		$(this).children(selector).sort(function() {
			return Math.round(Math.random()) - 0.5;
		}).detach().appendTo(this);
	});
	return this;
};

function initSlider() {
	//randomize
	$('#block-homepagecarousel').find('.field--name-field-image').randomize('.field--item');
	//slick
	$('#block-homepagecarousel .field--name-field-image').slick({
		arrows: false,
		dots: true,
		fade: true,
		autoplay: true,
		autoplaySpeed: 5500,
		cssEase: 'linear',
		pauseOnHover: 'false',
	});
	resizeSlider();
}

function initLeftSidebar() {
	resizeLeftSidebar();
}

function resizeLeftSidebar() {
	var height = $(window).height();
	var width = $('.fixed-left').width();
	var menuHeight = $('.navbar-nav').height();
	if (!(breakpoint == "xs") && (height > 625)) {
		$('.fluid-right').css('padding-left', width);
	} else if (!(breakpoint == "xs") && (height < 625)) {
		$('.fluid-right').css('padding-left', width);
	} else {
		$('.fluid-right').css('padding-left', 0);
	}
	$('.fluid-right').fadeIn('slow');
}

function resizeSlider() {
	if (breakpoint == 'xs') {
		var height = $('.node--view-mode-homepage .field--name-body').height() + 60;
	} else {
		var height = $(window).height() - $('.footer').outerHeight();
	}
	$('.slick-slider').height(height);
}

function initOrientation() {
	var orientation = checkOrientation();
	$('body').addClass(orientation);
}

function resizeOrientation() {
	if (checkOrientation() == "portrait") {
		$('body').removeClass('landscape').addClass('portrait');
	} else {
		$('body').removeClass('portrait').addClass('landscape');
	}
}

function initBackground() {
	$('#block-homepagecarousel .field--name-field-image .field--item, .field--name-field-banner').each(function() {
		var url = $(this).find('img').attr('src');
		$(this).css('background-image', 'url(' + url + ')');
	});
}

function initMenu() {
	$('.navbar-nav').on('shown.bs.dropdown', function() {
		$('.navbar-nav > li').removeClass('recede');
		$('.navbar-nav > li.open').siblings().addClass('recede');
	});
	$('.navbar-nav').on('hidden.bs.dropdown', function() {
		$('.navbar-nav > li').removeClass('recede');
	});
	$('.sibling-menu').appendTo('.submenu-area');
}

function initMenuTitle() {
	var menuParent = "";
	menuParent = $('header .navbar-nav > li.active > a').text();
	if (menuParent == "") {
		menuParent = $('.group-left .field--label').text();
	}
	$('.group-left .field--label').replaceWith('<h2 class="menu-title">' + menuParent + '</h2>');
}
function stickFooter() {
	var height = $(window).height() - $('.footer').outerHeight();
	$('.fluid-right .content-wrapper').css('min-height', height);
}

function initSearch() {
	$('#search .gsc-input-box').find('input').attr('placeholder', "Search Site");
}

function handleArchives() {
	var src = $('.field--name-field-database-path .field--item').text();
	// var div = '/db_archive' + src + '#container';
	var div = src;
	$('.group-right .field--name-field-database-path').replaceWith('<iframe src="' + div + '"></iframe>')
}

function handleNewDatabase() {
	var src = $('.node--view-mode-new-database-frame .field--name-field-database-path .field--item').text();
	// var div = '/db_archive' + src + '#container';
	var div = src;
	$('.group-right .field--name-field-database-path').replaceWith('<iframe src="' + div + '"></iframe>')
}

function handleFrames() {
	$('iframe').iframeAutoHeight();
}

function handleExternalLinks() {
	$('a').each(function() {
		var a = new RegExp('/' + window.location.host + '/');
		if (!a.test(this.href)) {
			$(this).click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				window.open(this.href, '_blank');
			});
		}
	});
}

// deal with redirects when user clicks login button, can be repurposed for any links directing to the login page
function handleLoginRedirect() {

	const loginButtons = document.querySelectorAll('.js-button-login');
	loginButtons.forEach(btn => {
		btn.addEventListener('click', function(e) {
			e.preventDefault();
			var params = new URLSearchParams();
			var destination = window.location.pathname.toString()
			if (destination.includes('register') || destination.includes('password') || destination.includes('search')) {
				params.set("destination", '/');
			} else {
				params.set("destination", destination);
			}
			window.location = '/user/login?' + params.toString();
		})
	})
}


function initApAccordion() {
	$('.accordion-toggle-heading').on('click', (e) => {
		$('.fa-minus').removeClass('fa-minus').addClass('fa-plus')
		if ($(e.target).hasClass('collapsed')) {
			$(e.target).find('.accordion-icon').toggleClass('fa-plus').toggleClass('fa-minus');
		}
	})
}

function initTooltips() {
	let tooltips = $('[data-toggle="tooltip"]')
	console.log({ tooltips })
	tooltips.tooltip({
		trigger: 'hover',
		placement: 'top'
	})
}

function addPasswordResetButton() {
	$('#user-login-form #edit-actions').append('<a href="/user/password" class="btn btn-danger">Forgot Password?</a>');
}

function addBetaForNewFeedDb() {
	const bg_color = "#BBCE45";
	const linkContainer = document.querySelector('.col-xs-12 .menu.nav');
	const parentLink = linkContainer.querySelector("a[href='/feed-composition-database']");

	// Create the duplicate link from parent

	let duplicateLink = parentLink.parentNode.cloneNode(true);
	duplicateLink.classList.add("duplicate-link");

	let newLink = duplicateLink.querySelector("a");
	newLink.href = '/feed-database/v2';
	newLink.style = `background:${bg_color}`;
	newLink.textContent = newLink.textContent + ' BETA';


	// Append the duplicate link to the container
	linkContainer.appendChild(duplicateLink);

	function adjustDuplicateLink() {
		const parentRect = parentLink.getBoundingClientRect();
		// duplicateLink.style.width = `${parentRect.width}px`;
		// duplicateLink.style.height = `${parentRect.height}px`;
	}

	adjustDuplicateLink();
	window.addEventListener('resize', adjustDuplicateLink);

}


$(document).on('touch click', '.dropdown-menu', function(e) {
	e.stopPropagation();
});

$(document).ready(function() {
	initOrientation();
	initBackground();
	initMenu();
	initLeftSidebar();
	handleLoginRedirect();
	initSlider();
	initMenuTitle();
	handleArchives();
	handleNewDatabase();
	handleExternalLinks();
	initApAccordion();
	addPasswordResetButton();
	handleFrames();
	// addBetaForNewFeedDb();
	// initTooltips();
});

$(window).on('load', function() {
	stickFooter();
	initSearch();
	$('iframe').fadeTo('slow', 1);
	//handleEmpties();
	//	ajaxLinks();
	//	handleArchiveURLs();
});


$(window).resize(function() {
	resizeOrientation();
	resizeLeftSidebar();
	resizeSlider();
	stickFooter();
});
