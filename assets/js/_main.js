/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function(){
  // FitVids init
  $("#main").fitVids();

  // init sticky sidebar
  $(".sticky").Stickyfill();

  var stickySideBar = function(){
    var show = $(".author__urls-wrapper button").length === 0 ? $(window).width() > 1024 : !$(".author__urls-wrapper button").is(":visible");
    // console.log("has button: " + $(".author__urls-wrapper button").length === 0);
    // console.log("Window Width: " + windowWidth);
    // console.log("show: " + show);
    //old code was if($(window).width() > 1024)
    if (show) {
      // fix
      Stickyfill.rebuild();
      Stickyfill.init();
      $(".author__urls").show();
      $(".author__urls-wrapper button").attr("aria-expanded", "true");
    } else {
      // unfix
      Stickyfill.stop();
      $(".author__urls").hide();
      $(".author__urls-wrapper button").attr("aria-expanded", "false");
    }
  };

  stickySideBar();

  $(window).resize(function(){
    stickySideBar();
  });

  // Follow menu drop down

  $(".author__urls-wrapper button").on("click", function() {
    var $button = $(this);
    $(".author__urls").fadeToggle("fast", function() {
      $button.attr("aria-expanded", $(this).is(":visible"));
    });
    $button.toggleClass("open");
  });

  // Expand or collapse publication TL;DR summaries.
  $(".pub-card__tldr-toggle").on("click", function() {
    var $button = $(this);
    var panel = document.getElementById($button.attr("aria-controls"));

    if (!panel) {
      return;
    }

    var $panel = $(panel);
    var willExpand = $button.attr("aria-expanded") !== "true";
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    $panel.stop(true, true);
    $button.attr("aria-expanded", willExpand ? "true" : "false");

    if (willExpand) {
      panel.hidden = false;

      if (reduceMotion) {
        $panel.show();
      } else {
        $panel.hide().slideDown(180);
      }
    } else if (reduceMotion) {
      $panel.hide();
      panel.hidden = true;
    } else {
      $panel.slideUp(160, function() {
        panel.hidden = true;
        $panel.removeAttr("style");
      });
    }
  });

  // init smooth scroll
  var mastheadOffset = -Math.ceil($(".masthead").outerHeight() || 0) - 12;
  $("a").smoothScroll({offset: mastheadOffset});

  // add lightbox class to all image links
  $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-zoom-in',
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

});
