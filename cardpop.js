/* Card names in the words: hover (mouse), tap (touch) or focus (keyboard) one to see the card, whole, with its artist,
   without leaving the page. scripts/site_cardlinks.py marks the names. */
(function () {
  var pop = document.createElement("div");
  pop.className = "cardpop";
  pop.setAttribute("role", "dialog");
  pop.hidden = true;
  pop.innerHTML = '<img alt=""><span class="cp-art"></span><button type="button" class="cp-close">Close</button>';
  document.body.appendChild(pop);
  var img = pop.querySelector("img"), art = pop.querySelector(".cp-art"), cur = null, timer = null;

  function place(el) {
    var r = el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, m = 10;
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var x = Math.min(Math.max(m, r.left + r.width / 2 - w / 2), vw - w - m);
    var y = r.bottom + 10;
    if (y + h > vh - m) y = r.top - h - 10;
    if (y < m) y = Math.max(m, (vh - h) / 2);
    pop.style.left = x + "px";
    pop.style.top = y + "px";
  }
  function show(el, touch) {
    clearTimeout(timer);
    if (cur && cur !== el) cur.setAttribute("aria-expanded", "false");
    cur = el;
    if (img.getAttribute("src") !== el.dataset.img) img.src = el.dataset.img;
    img.alt = el.dataset.name;
    art.textContent = "Art: " + el.dataset.artist;
    pop.setAttribute("aria-label", el.dataset.name);
    pop.classList.toggle("touch", !!touch);
    pop.hidden = false;
    place(el);
    el.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () { pop.classList.add("on"); });
  }
  function hide() {
    clearTimeout(timer);
    pop.classList.remove("on");
    pop.hidden = true;
    if (cur) cur.setAttribute("aria-expanded", "false");
    cur = null;
  }
  function later() { clearTimeout(timer); timer = setTimeout(hide, 120); }

  document.addEventListener("pointerover", function (e) {
    if (e.pointerType !== "mouse") return;
    var el = e.target.closest && e.target.closest(".cn");
    if (el) show(el, false);
  });
  document.addEventListener("pointerout", function (e) {
    if (e.pointerType !== "mouse") return;
    var el = e.target.closest && e.target.closest(".cn");
    if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) later();
  });
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest(".cn");
    if (el) {
      e.preventDefault();
      if (cur === el && pop.classList.contains("touch")) hide();
      else show(el, e.pointerType !== "mouse");
      return;
    }
    if (cur) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cur) { var el = cur; hide(); el.focus(); return; }
    var el2 = e.target.closest && e.target.closest(".cn");
    if (el2 && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (cur === el2) hide(); else show(el2, false);
    }
  });
  document.addEventListener("focusin", function (e) {
    var el = e.target.closest && e.target.closest(".cn");
    if (el && el.matches(":focus-visible")) show(el, false);
  });
  document.addEventListener("focusout", function (e) {
    if (e.target.closest && e.target.closest(".cn")) later();
  });
  window.addEventListener("scroll", function () { if (cur) { if (pop.classList.contains("touch")) place(cur); else hide(); } }, { passive: true });
  window.addEventListener("resize", function () { if (cur) place(cur); });
  img.addEventListener("load", function () { if (cur) place(cur); });
})();
