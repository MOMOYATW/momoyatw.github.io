/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');
var $brand = $('#site-nav .masthead__brand');

var breaks = [];

function updateNav() {
  var menuWasOpen = !$hlinks.hasClass('hidden');

  // Rebuild from the original order before calculating the current layout.
  while($hlinks.children().length) {
    $hlinks.children().first().appendTo($vlinks);
  }

  breaks = [];
  $hlinks.addClass('hidden');

  var compactNav = window.matchMedia('(max-width: 767px)').matches;
  var availableSpace = $nav.width() - $brand.outerWidth(true);

  if(compactNav) {
    // Keep the monogram visible and move every navigation link into the menu.
    while($vlinks.children().length) {
      breaks.push($vlinks.width());
      $vlinks.children().last().prependTo($hlinks);
    }
  } else {
    // Move links into the menu until the remaining items fit.
    while($vlinks.width() > availableSpace && $vlinks.children().length) {
      breaks.push($vlinks.width());
      $vlinks.children().last().prependTo($hlinks);
      availableSpace = $nav.width() - $brand.outerWidth(true) - $btn.width() - 30;
    }
  }

  if($hlinks.children().length) {
    $btn.removeClass('hidden');

    if(menuWasOpen) {
      $hlinks.removeClass('hidden');
      $btn.addClass('close');
      $btn.attr('aria-expanded', 'true');
    } else {
      $btn.removeClass('close');
      $btn.attr('aria-expanded', 'false');
    }
  } else {
    $btn.addClass('hidden');
    $btn.removeClass('close');
    $btn.attr('aria-expanded', 'false');
  }

  $btn.attr('count', $hlinks.children().length);
}

// Window listeners

$(window).resize(function() {
  updateNav();
});

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
  $(this).attr('aria-expanded', !$hlinks.hasClass('hidden'));
});

$hlinks.on('click', 'a', function() {
  $hlinks.addClass('hidden');
  $btn.removeClass('close');
  $btn.attr('aria-expanded', 'false');
});

updateNav();
