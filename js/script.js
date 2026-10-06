/* =========================================================
   Faders — shared site behaviour
   No external dependencies. Defensive by default:
   - all user input is escaped before ever being placed in the DOM
   - the contact form never uses innerHTML with raw input
   - no inline event handlers (everything wired up here)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a link is chosen (mobile)
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Gallery: filtering ---------- */
  function initGalleryFilter() {
    var bar = document.querySelector(".filter-bar");
    var grid = document.querySelector(".gallery-grid");
    if (!bar || !grid) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll(".gallery-item"));

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      bar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      var filter = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        item.style.display = match ? "" : "none";
      });
    });
  }

  /* ---------- Gallery: lightbox ---------- */
  function initLightbox() {
    var grid = document.querySelector(".gallery-grid");
    var lightbox = document.querySelector(".lightbox");
    if (!grid || !lightbox) return;

    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lightbox-cap");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");

    var visibleItems = [];
    var currentIndex = 0;

    function collectVisible() {
      visibleItems = Array.prototype.slice
        .call(grid.querySelectorAll(".gallery-item"))
        .filter(function (item) {
          return item.style.display !== "none";
        });
    }

    function show(index) {
      if (!visibleItems.length) return;
      currentIndex = (index + visibleItems.length) % visibleItems.length;
      var item = visibleItems[currentIndex];
      var img = item.querySelector("img");
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      lbCap.textContent = img.getAttribute("alt") || "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    }

    function close() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lbImg.src = "";
    }

    grid.addEventListener("click", function (e) {
      var item = e.target.closest(".gallery-item");
      if (!item) return;
      collectVisible();
      var idx = visibleItems.indexOf(item);
      show(idx === -1 ? 0 : idx);
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
    nextBtn.addEventListener("click", function () { show(currentIndex + 1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(currentIndex - 1);
      if (e.key === "ArrowRight") show(currentIndex + 1);
    });
  }

  /* ---------- Contact form ---------- */

  // Strip anything that could be used for markup/script injection.
  // We never render this back as HTML, but we sanitize defensively anyway.
  function sanitize(value) {
    return value
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 2000);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldError(fieldEl, message) {
    var wrapper = fieldEl.closest(".field");
    var errorEl = wrapper.querySelector(".error");
    if (message) {
      wrapper.classList.add("invalid");
      if (errorEl) errorEl.textContent = message;
    } else {
      wrapper.classList.remove("invalid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;

    var status = form.querySelector(".form-status");
    var honeypot = form.querySelector('input[name="company"]'); // bot trap, hidden via CSS

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: if a bot filled this hidden field, silently drop the submission.
      if (honeypot && honeypot.value !== "") {
        return;
      }

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");

      var nameVal = sanitize(name.value);
      var emailVal = sanitize(email.value);
      var messageVal = sanitize(message.value);

      var valid = true;

      if (nameVal.length < 2) {
        setFieldError(name, "Please enter your name.");
        valid = false;
      } else {
        setFieldError(name, "");
      }

      if (!isValidEmail(emailVal)) {
        setFieldError(email, "Please enter a valid email address.");
        valid = false;
      } else {
        setFieldError(email, "");
      }

      if (messageVal.length < 10) {
        setFieldError(message, "Message should be at least 10 characters.");
        valid = false;
      } else {
        setFieldError(message, "");
      }

      if (!valid) {
        status.className = "form-status show";
        status.textContent = "Please fix the highlighted fields and try again.";
        return;
      }

      // Validation passed — write the sanitized values back into the fields
      // (in case sanitize() trimmed anything) and hand off to the real
      // submission below. This form posts to FormSubmit (see README), which
      // emails the message straight to the site owner's inbox.
      name.value = nameVal;
      email.value = emailVal;
      message.value = messageVal;

      status.className = "form-status show ok";
      status.textContent = "Sending your message...";

      // form.submit() performs the real POST to the "action" URL without
      // re-triggering this "submit" event listener, so there's no loop.
      form.submit();
    });

    // Clear inline errors as the user corrects a field
    form.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        setFieldError(el, "");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initGalleryFilter();
    initLightbox();
    initContactForm();
  });
})();
