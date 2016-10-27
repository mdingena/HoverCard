// ==UserScript==
// @name        HoverCard: BoardGames.SE MTG Gatherer Card Link Rollover
// @description Display MTG cards in tooltip when hovering over Gatherer and Autocard links
// @grant       none
// @include     http://boardgames.stackexchange.com/questions/*
// @include     http://meta.boardgames.stackexchange.com/questions/*
// @version     1.0.1
// @namespace https://greasyfork.org/users/38387
// ==/UserScript==

var userscript = function($) {
	
	var hoverCard = {
		url  : 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&',
		card : function( href, key ) {
			var query;
			if( href.indexOf( '#' ) == -1 ) {
				query = href.substring( href.indexOf( '?' ) + 1 );
			} else {
				query = href.substring( href.indexOf( '?' ) + 1, href.indexOf( '#' ) );
			}
			query = query.split( '&' );
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
			var css  = '#hoverCard {';
				css += 'position: fixed; ';
				css += 'display: none; ';
				css += 'width: 223px; ';
				css += 'height: 311px; ';
				css += 'background: #191919; ';
				css += 'background: -moz-linear-gradient(top,  #191919 0%, #282828 100%); ';
				css += 'background: -webkit-linear-gradient(top,  #191919 0%,#282828 100%); ';
				css += 'background: linear-gradient(to bottom,  #191919 0%,#282828 100%); ';
				css += 'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#191919", endColorstr="#282828",GradientType=0 ); ';
				css += 'border-radius: 11px; ';
				css += 'overflow: hidden; ';
				css += 'box-shadow: 0 0 7px #333; ';
				css += '}';
				css += '#hoverCard::before {';
				css += 'position: absolute; ';
				css += 'bottom: 0; ';
				css += 'width: 100%; ';
				css += 'height: 50px; ';
				css += 'color: #999; ';
				css += 'text-align: center; ';
				css += 'font-weight: bold; ';
				css += 'text-shadow: 0 -2px 2px #191919, 0 1px 1px #444; ';
				css += 'content: "Gathering...";';
				css += '}';
				css += '#hoverCard img {';
				css += 'position: absolute; ';
				css += '}';
			var styleHead = $( '<style>' ).attr( 'id', 'mtg-hovercard' ).text( css ),
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
			}).hide().html( html );
			var popupWidth    = 223,
				popupHeight   = 311,
				popupMaxWidth = $( '#mainbar' ).width(),
				anchorWidth   = $( anchor )[0].offsetWidth,
				anchorHeight  = $( anchor )[0].offsetHeight,
				anchorPosRel  = $( anchor )[0].getBoundingClientRect(),
				contentPosRel = $( '#mainbar' )[0].getBoundingClientRect();
			var offsetTop  = anchorPosRel.top + anchorHeight + 8,
				offsetLeft = ( popupMaxWidth / 2 ) - ( popupWidth / 2 );
			if( offsetTop > ( document.documentElement.clientHeight - popupHeight - 8 ) ) {
				offsetTop = offsetTop - popupHeight - anchorHeight - 16;
			}
			if( popupWidth < popupMaxWidth ) {
				var leeway       = popupMaxWidth - popupWidth - offsetLeft - 1 + ( anchorPosRel.left - contentPosRel.left ),
					anchorCenter = anchorPosRel.left + ( anchorWidth / 2 ),
					popupCenter  = offsetLeft + ( popupWidth / 2 );
				var nudgeRight   = anchorCenter - popupCenter;
				nudgeRight       = nudgeRight > leeway ? leeway : nudgeRight;
				offsetLeft       = offsetLeft + nudgeRight;
			}
			offsetLeft = offsetLeft < 0 ? anchorPosRel.left : offsetLeft;
			offsetLeft = anchorWidth > popupMaxWidth * 0.7 ? anchorPosRel.left : offsetLeft;
			$( '#hoverCard' ).fadeTo( 350, 1.0 ).css({
				top  : Math.floor( offsetTop ),
				left : Math.floor( offsetLeft )
			});
		},
		hide : function() {
			$( '#hoverCard' ).stop().fadeTo( 350, 0.0 );
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