(function () {
  "use strict";

  function initNavigation() {
    var nav = document.getElementById("site-nav");

    if (!nav) {
      return;
    }

    var button = nav.querySelector("button[aria-controls='site-nav-hidden-links']");
    var visibleLinks = nav.querySelector(".visible-links");
    var hiddenLinks = nav.querySelector(".hidden-links");
    var brand = nav.querySelector(".masthead__brand");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var menuAnimation;
    var menuAnimationSequence = 0;
    var resizeFrame;

    if (!button || !visibleLinks || !hiddenLinks || !brand) {
      return;
    }

    function setMenuState(open) {
      button.classList.toggle("close", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    }

    function stopMenuAnimation() {
      if (menuAnimation) {
        menuAnimation.cancel();
        menuAnimation = null;
      }
    }

    function openMenu(animate) {
      var wasHidden = hiddenLinks.classList.contains("hidden");
      var startFrame;
      var sequence = ++menuAnimationSequence;

      if (wasHidden) {
        hiddenLinks.classList.remove("hidden");
        startFrame = {
          opacity: 0,
          transform: "translateY(-6px) scale(0.985)"
        };
      } else {
        var currentStyle = window.getComputedStyle(hiddenLinks);
        startFrame = {
          opacity: currentStyle.opacity,
          transform: currentStyle.transform === "none" ? "translateY(0) scale(1)" : currentStyle.transform
        };
      }

      stopMenuAnimation();
      setMenuState(true);

      if (animate === false || reduceMotion.matches || !hiddenLinks.animate) {
        return;
      }

      menuAnimation = hiddenLinks.animate(
        [
          startFrame,
          { opacity: 1, transform: "translateY(0) scale(1)" }
        ],
        {
          duration: 170,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
        }
      );

      menuAnimation.addEventListener("finish", function () {
        if (sequence === menuAnimationSequence) {
          menuAnimation = null;
        }
      }, { once: true });
    }

    function closeMenu(animate) {
      var isHidden = hiddenLinks.classList.contains("hidden");
      var sequence = ++menuAnimationSequence;

      setMenuState(false);

      if (isHidden) {
        stopMenuAnimation();
        return;
      }

      if (animate === false || reduceMotion.matches || !hiddenLinks.animate) {
        stopMenuAnimation();
        hiddenLinks.classList.add("hidden");
        return;
      }

      var currentStyle = window.getComputedStyle(hiddenLinks);
      var startFrame = {
        opacity: currentStyle.opacity,
        transform: currentStyle.transform === "none" ? "translateY(0) scale(1)" : currentStyle.transform
      };

      stopMenuAnimation();
      menuAnimation = hiddenLinks.animate(
        [
          startFrame,
          { opacity: 0, transform: "translateY(-4px) scale(0.99)" }
        ],
        {
          duration: 135,
          easing: "cubic-bezier(0.4, 0, 1, 1)"
        }
      );

      menuAnimation.addEventListener("finish", function () {
        if (sequence === menuAnimationSequence) {
          hiddenLinks.classList.add("hidden");
          menuAnimation = null;
        }
      }, { once: true });
    }

    function updateNavigation() {
      var menuWasOpen = button.getAttribute("aria-expanded") === "true";

      while (hiddenLinks.firstElementChild) {
        visibleLinks.appendChild(hiddenLinks.firstElementChild);
      }

      closeMenu(false);

      var compact = window.matchMedia("(max-width: 767px)").matches;
      var availableWidth = nav.clientWidth - brand.getBoundingClientRect().width;

      if (compact) {
        while (visibleLinks.lastElementChild) {
          hiddenLinks.insertBefore(visibleLinks.lastElementChild, hiddenLinks.firstElementChild);
        }
      } else {
        while (visibleLinks.scrollWidth > availableWidth && visibleLinks.lastElementChild) {
          hiddenLinks.insertBefore(visibleLinks.lastElementChild, hiddenLinks.firstElementChild);
          availableWidth = nav.clientWidth - brand.getBoundingClientRect().width - button.offsetWidth - 30;
        }
      }

      var hiddenCount = hiddenLinks.children.length;
      button.setAttribute("count", String(hiddenCount));
      button.classList.toggle("hidden", hiddenCount === 0);

      if (hiddenCount > 0 && menuWasOpen) {
        openMenu(false);
      }
    }

    button.addEventListener("click", function () {
      var willOpen = button.getAttribute("aria-expanded") !== "true";

      if (willOpen) {
        openMenu(true);
      } else {
        closeMenu(true);
      }
    });

    hiddenLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeMenu(true);
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) {
        closeMenu(true);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu(true);
        button.focus();
      }
    });

    window.addEventListener("resize", function () {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(updateNavigation);
    });

    updateNavigation();
  }

  function initPublicationSummaries() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.querySelectorAll(".pub-card__tldr-toggle").forEach(function (button) {
      var panel = document.getElementById(button.getAttribute("aria-controls"));
      var animation;
      var animationSequence = 0;

      if (!panel) {
        return;
      }

      function readPanelFrame() {
        var style = window.getComputedStyle(panel);

        return {
          height: panel.getBoundingClientRect().height + "px",
          marginTop: style.marginTop,
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
          opacity: style.opacity,
          transform: style.transform === "none" ? "translateY(0)" : style.transform
        };
      }

      function collapsedFrame() {
        return {
          height: "0px",
          marginTop: "0px",
          paddingTop: "0px",
          paddingBottom: "0px",
          opacity: 0,
          transform: "translateY(-0.25rem)"
        };
      }

      function stopAnimation() {
        if (animation) {
          animation.cancel();
          animation = null;
        }
      }

      function animatePanel(startFrame, endFrame, expanding) {
        var sequence = ++animationSequence;
        var activeAnimation;

        animation = panel.animate(
          [startFrame, endFrame],
          {
            duration: expanding ? 210 : 170,
            easing: expanding ? "cubic-bezier(0.2, 0.8, 0.2, 1)" : "cubic-bezier(0.4, 0, 1, 1)",
            fill: "both"
          }
        );
        activeAnimation = animation;

        animation.addEventListener("finish", function () {
          if (sequence !== animationSequence) {
            return;
          }

          if (!expanding) {
            panel.hidden = true;
          }

          activeAnimation.cancel();
          animation = null;
        }, { once: true });
      }

      button.addEventListener("click", function () {
        var willExpand = button.getAttribute("aria-expanded") !== "true";
        var currentFrame = panel.hidden ? null : readPanelFrame();

        stopAnimation();
        button.setAttribute("aria-expanded", willExpand ? "true" : "false");

        if (willExpand) {
          panel.hidden = false;

          if (reduceMotion.matches || !panel.animate) {
            return;
          }

          animatePanel(currentFrame || collapsedFrame(), readPanelFrame(), true);
        } else if (panel.hidden || reduceMotion.matches || !panel.animate) {
          panel.hidden = true;
        } else {
          animatePanel(currentFrame || readPanelFrame(), collapsedFrame(), false);
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initPublicationSummaries();
  });
}());
