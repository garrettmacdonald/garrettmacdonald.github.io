// West Hartford Electric concept site: menu, form demo behavior
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Preselect the job type from ?job=panel etc.
  var job = new URLSearchParams(location.search).get("job");
  if (job) {
    var radio = document.querySelector('input[name="job"][value="' + CSS.escape(job) + '"]');
    if (radio) radio.checked = true;
  }

  // Show how many photos were picked
  document.querySelectorAll(".upload input[type=file]").forEach(function (input) {
    input.addEventListener("change", function () {
      var label = input.closest(".upload").querySelector("strong");
      var n = input.files ? input.files.length : 0;
      if (label && n) label.textContent = n + (n === 1 ? " photo added" : " photos added");
    });
  });

  // Concept preview: forms don't send anywhere yet
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var card = form.closest(".form-card") || form;
      card.classList.add("sent");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
