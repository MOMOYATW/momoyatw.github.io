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
    var resizeFrame;

    if (!button || !visibleLinks || !hiddenLinks || !brand) {
      return;
    }

    function closeMenu() {
      hiddenLinks.classList.add("hidden");
      button.classList.remove("close");
      button.setAttribute("aria-expanded", "false");
    }

    function updateNavigation() {
      var menuWasOpen = !hiddenLinks.classList.contains("hidden");

      while (hiddenLinks.firstElementChild) {
        visibleLinks.appendChild(hiddenLinks.firstElementChild);
      }

      closeMenu();

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
        hiddenLinks.classList.remove("hidden");
        button.classList.add("close");
        button.setAttribute("aria-expanded", "true");
      }
    }

    button.addEventListener("click", function () {
      var willOpen = hiddenLinks.classList.contains("hidden");
      hiddenLinks.classList.toggle("hidden", !willOpen);
      button.classList.toggle("close", willOpen);
      button.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    hiddenLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
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

      if (!panel) {
        return;
      }

      button.addEventListener("click", function () {
        var willExpand = button.getAttribute("aria-expanded") !== "true";

        if (animation) {
          animation.cancel();
        }

        button.setAttribute("aria-expanded", willExpand ? "true" : "false");

        if (willExpand) {
          panel.hidden = false;

          if (!reduceMotion.matches && panel.animate) {
            animation = panel.animate(
              [
                { opacity: 0, transform: "translateY(-0.25rem)" },
                { opacity: 1, transform: "translateY(0)" }
              ],
              { duration: 180, easing: "ease-out" }
            );
          }
        } else if (reduceMotion.matches || !panel.animate) {
          panel.hidden = true;
        } else {
          animation = panel.animate(
            [
              { opacity: 1, transform: "translateY(0)" },
              { opacity: 0, transform: "translateY(-0.2rem)" }
            ],
            { duration: 150, easing: "ease-in" }
          );
          animation.addEventListener("finish", function () {
            panel.hidden = true;
          }, { once: true });
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initPublicationSummaries();
  });
}());
