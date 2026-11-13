// Menu commun a toutes les pages du site. Modifier ici uniquement.
// - Pages bilingues (accueil, CV) : le menu suit la langue de la page et le
//   dernier lien mene a la meme page dans l'autre langue.
// - Autres pages : le menu garde la langue choisie par le visiteur
//   (retenue dans son navigateur) ; le dernier lien bascule le menu.
(function () {
  var PAIRES = {
    "index.html":    ["fr", "index-en.html"],
    "index-en.html": ["en", "index.html"],
    "cv-fr.html":    ["fr", "cv.html"],
    "cv.html":       ["en", "cv-fr.html"]
  };
  var MENUS = {
    fr: [["index.html", "ACCUEIL"], ["publications.html", "PUBLICATIONS"],
         ["cv-fr.html", "CV"], ["people.html", "ALUMNI"]],
    en: [["index-en.html", "HOME"], ["publications.html", "PUBLICATIONS"],
         ["cv.html", "CV"], ["people.html", "ALUMNI"]]
  };
  var AUTRE = { fr: "ENGLISH", en: "FRANÇAIS" };

  // Chemins absolus en ligne (utile pour la page 404), relatifs en local.
  var base = (location.protocol === "file:") ? "" : "/";
  var page = location.pathname.split("/").pop() || "index.html";

  function lire() {
    try { return localStorage.getItem("langue"); } catch (e) { return null; }
  }
  function ecrire(l) {
    try { localStorage.setItem("langue", l); } catch (e) {}
  }

  var langue;
  if (PAIRES[page]) {
    langue = PAIRES[page][0];
    ecrire(langue);
  } else {
    langue = lire() ||
      ((navigator.language || "fr").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
  }

  function html(l) {
    var liens = MENUS[l].map(function (m) {
      return '<a href="' + base + m[0] + '">' + m[1] + '</a>';
    });
    var autre = (l === "fr") ? "en" : "fr";
    var cible = PAIRES[page] ? base + PAIRES[page][1] : "#";
    liens.push('<a href="' + cible + '" data-langue="' + autre + '">' + AUTRE[l] + '</a>');
    return liens.join(" | ");
  }

  function pied(l) {
    var d = new Date(document.lastModified);
    var mois = (l === "fr")
      ? ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = d.getDate() + " " + mois[d.getMonth()] + " " + d.getFullYear();
    return '<a href="' + base + 'perso.html">Perso</a> | ' +
      '<a href="' + base + 'sanskrit.html" lang="sa">संस्कृतम्</a> | ' +
      '<a href="' + base + 'about.html">' + (l === "fr" ? "À propos" : "About") + '</a>\n' +
      (l === "fr" ? "Mise à jour : " : "Last update: ") + date;
  }

  // Pied de page : appele depuis le bas de chaque page.
  window.piedDePage = function () {
    document.write('<span id="pied">' + pied(langue) + '</span>');
  };

  document.write('<span id="menu">' + html(langue) + '</span>');

  document.getElementById("menu").addEventListener("click", function (ev) {
    var a = ev.target.closest("a[data-langue]");
    if (!a) return;
    ecrire(a.getAttribute("data-langue"));
    if (!PAIRES[page]) {           // page commune : on bascule juste le menu
      ev.preventDefault();
      langue = a.getAttribute("data-langue");
      document.getElementById("menu").innerHTML = html(langue);
      var p = document.getElementById("pied");
      if (p) p.innerHTML = pied(langue);
    }
  });
})();
