// Liens "bibtex" de la page Publications : un clic affiche la reference
// BibTeX sous la publication (service public Crossref), un second clic la masque.
(function () {
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("a.bibtex");
    if (!a || !window.fetch) return;
    ev.preventDefault();
    var deja = a.parentNode.querySelector('pre.bibtex[data-doi="' + a.dataset.doi + '"]');
    if (deja) { deja.remove(); return; }
    var pre = document.createElement("pre");
    pre.className = "bibtex";
    pre.setAttribute("data-doi", a.dataset.doi);
    pre.textContent = "…";
    // Insere le bloc juste apres la parenthese fermante de la ligne de liens.
    var t = a.nextSibling;
    while (t && !(t.nodeType === 3 && t.nodeValue.indexOf(")") !== -1)) {
      t = t.nextSibling;
    }
    if (t) {
      var suite = t.splitText(t.nodeValue.indexOf(")") + 1);
      a.parentNode.insertBefore(pre, suite);
    } else {
      a.parentNode.insertBefore(pre, a.nextSibling);
    }
    fetch(a.href)
      .then(function (r) { if (!r.ok) throw r.status; return r.text(); })
      .then(function (t) { pre.textContent = t.trim(); })
      .catch(function () {
        pre.textContent = "BibTeX indisponible pour le moment / not available right now.";
      });
  });
})();
