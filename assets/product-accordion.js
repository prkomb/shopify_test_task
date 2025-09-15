(function () {
  function initAccordion(root) {
    var allowMultiple = root.getAttribute("data-allow-multiple") === "true";
    var items = Array.from(root.querySelectorAll(".accordion-item"));
    items.forEach(function (item) {
      var trigger = item.querySelector(".accordion-trigger");
      var panel = item.querySelector(".accordion-panel");
      if (!trigger || !panel) return;
      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";
        if (!allowMultiple) {
          items.forEach(function (other) {
            if (other !== item) {
              var oTrig = other.querySelector(".accordion-trigger");
              var oPanel = other.querySelector(".accordion-panel");
              if (oTrig && oPanel) {
                oTrig.setAttribute("aria-expanded", "false");
                oPanel.hidden = true;
              }
            }
          });
        }
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }
  function initAll() {
    document.querySelectorAll(".product-accordion").forEach(initAccordion);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
