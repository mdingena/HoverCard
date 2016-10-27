// ==UserScript==
// @name        HoverCard: BoardGames.SE MTG Gatherer Card Link Rollover
// @description Display MTG cards in tooltip when hovering over Gatherer and Autocard links
// @grant       none
// @include     http://boardgames.stackexchange.com/questions/*
// @include     http://meta.boardgames.stackexchange.com/questions/*
// @version     1.0.0
// @namespace https://greasyfork.org/users/38387
// ==/UserScript==

var userscript = function($) {
	
	var hoverCard = {
		url  : 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&',
		card : function( href, key ) {
			if( href.indexOf( '#' ) == -1 ) {
				var query = href.substring( href.indexOf( '?' ) + 1 );
			} else {
				var query = href.substring( href.indexOf( '?' ) + 1, href.indexOf( '#' ) );
			}
			var query = query.split( '&' );
			var result = {};
			result.success = false;
			for( var i = 0; i < query.length; ++i ) {
				var pair = query[ i ].split( '=' );
				if( pair[ 0 ] == 'name' || pair[ 0 ] == 'multiverseid' ) {
					result.success = true;
					result.key = pair[ 0 ];
					result.value = pair[ 1 ];
					break;
				}
			}
			return result;
		},
		init : function() {
			var styleHead = $( '<style>' ).attr( 'id', 'mtg-hovercard' ).text( '#hoverCard { position: fixed; display: none; width: 223px; height: 311px; background: black; border-radius: 11px; overflow: hidden; box-shadow: 0 0 10px #444 }' ),
				popupHtml = '<div id="hoverCard"></div>';
			$( 'head' ).append( styleHead );
			$( '#mainbar' ).append( popupHtml );
		},
		show : function( anchor ) {
			var card = hoverCard.card( $( anchor ).attr( 'href' ) );
			if( !card.success ) {
				return false;
			}
			var html = '<img src="' + hoverCard.url + card.key + '=' + card.value + '" />';
			$( '#hoverCard' ).stop().css({
				top  : 0,
				left : 0
			}).hide();
			$( '#hoverCard' ).html( html ).css( 'max-width', $( '#mainbar' ).width() ).show();
			var popupWidth    = 223, //$( '#hoverCard' )[0].offsetWidth + 1,
				popupHeight   = 311, //$( '#hoverCard' )[0].offsetHeight,
				popupMaxWidth = $( '#mainbar' ).width(),
				anchorWidth   = $( anchor )[0].offsetWidth,
				anchorHeight  = $( anchor )[0].offsetHeight,
				anchorPosRel  = $( anchor )[0].getBoundingClientRect();
			$( '#hoverCard' ).hide();
			var offsetTop  = anchorPosRel.top + anchorHeight + 8,
				offsetLeft = ( popupMaxWidth / 2 ) - ( popupWidth / 2 );
			if( offsetTop > ( document.documentElement.clientHeight - popupHeight - 8 ) ) {
				//offsetTop = offsetTop - ( offsetTop - ( document.documentElement.clientHeight - popupHeight - 8 ) );
				offsetTop = offsetTop - popupHeight - anchorHeight - 16;
			}
			if( popupWidth < popupMaxWidth ) {
				var leeway       = popupMaxWidth - popupWidth - offsetLeft - 1,
					anchorCenter = anchorPosRel.left + ( anchorWidth / 2 ),
					popupCenter  = offsetLeft + ( popupWidth / 2 );
				var nudgeRight   = anchorCenter - popupCenter;
				nudgeRight       = nudgeRight > leeway ? leeway : nudgeRight;
				offsetLeft       = offsetLeft + nudgeRight;
			}
			offsetLeft = offsetLeft < 0 ? 0 : offsetLeft;
			offsetLeft = anchorWidth > popupMaxWidth * 0.8 ? 0 : offsetLeft;
			$( '#hoverCard' ).fadeTo( 350, 1.0 ).css({
				top  : Math.floor( offsetTop ),
				left : Math.floor( offsetLeft )
			});
		},
		hide : function() {
			$( '#hoverCard' ).fadeTo( 350, 0.0, function() {
				$( this ).hide();
			});
		}
	};
	
	StackExchange.ready( function() {
		hoverCard.init();
		$( 'body' ).on( 'mouseenter mouseleave', 'a[href^="http://www.wizards.com/magic/autocard.asp"], a[href^="http://gatherer.wizards.com/Pages/Card/Details.aspx"]', function( e ) {
			if( e.type == 'mouseenter' ) {
				hoverCard.show( this );
			} else if( e.type == 'mouseleave' ) {
				hoverCard.hide();
			}
		});
    });
	
};

var el = document.createElement('script');
el.type = 'text/javascript';
el.text = '(' + userscript + ')(jQuery);';
document.head.appendChild(el);