(function () {
  function initSection(section) {
    var slidesDesktop = parseInt(
      section.getAttribute("data-slides-desktop") || "3",
      10
    );
    var slidesTablet = parseInt(
      section.getAttribute("data-slides-tablet") || "2",
      10
    );
    var slidesMobile = parseInt(
      section.getAttribute("data-slides-mobile") || "1",
      10
    );

    var spaceDesktop = parseInt(
      section.getAttribute("data-space-desktop") || "16",
      10
    );
    var spaceTablet = parseInt(
      section.getAttribute("data-space-tablet") || "12",
      10
    );
    var spaceMobile = parseInt(
      section.getAttribute("data-space-mobile") || "8",
      10
    );

    var enablePagination = section.getAttribute("data-pagination") === "true";
    var enableNavigation = section.getAttribute("data-navigation") === "true";

    var swiperEl = section.querySelector(".swiper");
    if (!swiperEl) return;

    var swiper = new Swiper(swiperEl, {
      slidesPerView: slidesMobile,
      spaceBetween: spaceMobile,
      pagination: enablePagination
        ? { el: section.querySelector(".swiper-pagination"), clickable: true }
        : undefined,
      navigation: enableNavigation
        ? {
            nextEl: section.querySelector(".swiper-button-next"),
            prevEl: section.querySelector(".swiper-button-prev"),
          }
        : undefined,
      breakpoints: {
        768: { slidesPerView: slidesTablet, spaceBetween: spaceTablet },
        1024: { slidesPerView: slidesDesktop, spaceBetween: spaceDesktop },
      },
    });

    function normalizeColor(value) {
      return (value || "").toString().trim().toLowerCase();
    }

    function filterByColor(colorValue) {
      var normalized = normalizeColor(colorValue);
      var slides = section.querySelectorAll(".swiper-slide");

      slides.forEach(function (slide) {
        var slideColor = normalizeColor(slide.getAttribute("data-color"));
        var match =
          !normalized || (slideColor && slideColor.indexOf(normalized) !== -1);
        slide.style.display = match ? "" : "none";
      });

      // Update Swiper after DOM changes
      swiper.update();
      // If all slides hidden, do nothing; otherwise, slide to first visible
      var firstVisibleIndex = Array.prototype.findIndex.call(
        section.querySelectorAll(".swiper-slide"),
        function (s) {
          return s.style.display !== "none";
        }
      );
      if (firstVisibleIndex > -1) {
        swiper.slideTo(firstVisibleIndex, 0);
      }
    }

    // Attempt to pre-filter by current selected color
    var colorSelectors = [];
    // Common patterns: select with name options[Color] or inputs for Color
    colorSelectors = colorSelectors.concat(
      Array.from(
        document.querySelectorAll('select[name^="options["][name$="]"]')
          .values || []
      )
    );
    colorSelectors = colorSelectors.concat(
      Array.from(document.querySelectorAll("select[data-option-name]")).filter(
        function (s) {
          return /color/i.test(s.getAttribute("data-option-name") || "");
        }
      )
    );
    colorSelectors = colorSelectors.concat(
      Array.from(document.querySelectorAll("[data-option-index]")).filter(
        function (el) {
          return /color/i.test(el.getAttribute("data-option-name") || "");
        }
      )
    );

    function getCurrentColor() {
      // Try selects first
      var select = Array.prototype.find.call(
        document.querySelectorAll('select[name^="options["]'),
        function (s) {
          return /color/i.test(s.name);
        }
      );
      if (select) return select.value;
      // Try radio inputs labeled as color
      var fieldset = Array.prototype.find.call(
        document.querySelectorAll("fieldset"),
        function (f) {
          return /color/i.test(
            f.getAttribute("data-option-name") ||
              f.querySelector("legend")?.textContent ||
              ""
          );
        }
      );
      if (fieldset) {
        var checked = fieldset.querySelector('input[type="radio"]:checked');
        if (checked) return checked.value;
      }
      // Fallback: look for URL param variant and infer? Skip for now
      return "";
    }

    // Initial
    filterByColor(getCurrentColor());

    // Listen for variant change events commonly used in themes
    document.addEventListener("variant:change", function (e) {
      try {
        var variant = e.detail && (e.detail.variant || e.detail);
        if (!variant) return;
        var colorName = "";
        if (Array.isArray(variant.options) && variant.options.length) {
          // guess color by option name via product json if available on event
          if (
            e.detail &&
            e.detail.product &&
            e.detail.product.options_with_values
          ) {
            var colorIndex = -1;
            e.detail.product.options_with_values.forEach(function (opt, idx) {
              if (/color/i.test(opt.name)) colorIndex = idx;
            });
            if (colorIndex >= 0) colorName = variant.options[colorIndex];
          } else {
            // fallback: best effort uses first option that looks like a color string
            colorName =
              variant.options.find(function (v) {
                return /\b(white|black|blue|red|green|yellow|beige|brown|grey|gray|pink|purple|navy)\b/i.test(
                  v
                );
              }) || variant.options[0];
          }
        }
        filterByColor(colorName);
      } catch (err) {
        console.warn("variant:change handling failed", err);
      }
    });

    // Also watch selects/radios change
    document.addEventListener("change", function (e) {
      var target = e.target;
      if (!target) return;
      var isColorSelect =
        target.matches &&
        target.matches('select[name^="options["]') &&
        /color/i.test(target.name);
      var isColorRadio =
        target.matches &&
        target.matches('input[type="radio"]') &&
        (/color/i.test(target.name) ||
          /color/i.test(
            target.closest("fieldset")?.getAttribute("data-option-name") || ""
          ));
      if (isColorSelect || isColorRadio) {
        var value = target.value;
        filterByColor(value);
      }
    });
  }

  function initAll() {
    document.querySelectorAll(".product-gallery-swiper").forEach(initSection);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
