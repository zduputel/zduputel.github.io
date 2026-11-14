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
    "cv.html":       ["en", "cv-fr.html"],
    "perso.html":    ["fr", "perso-en.html"],
    "perso-en.html": ["en", "perso.html"]
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
    return '<a href="' + base + (l === "fr" ? 'perso.html">Perso' : 'perso-en.html">Personal') + '</a> | ' +
      '<a href="' + base + 'about.html">' + (l === "fr" ? "À propos de ce site" : "About this website") + '</a>\n' +
      (l === "fr" ? "Mise à jour : " : "Last update: ") + date +
      '<span id="commit"></span>';
  }

  // Version du site : dernier commit du depot GitHub (en ligne seulement).
  var DEPOT = "zduputel/zduputel.github.io";
  var commit = null;
  function afficherCommit() {
    var s = document.getElementById("commit");
    if (s && commit) {
      s.innerHTML = ' (commit <a href="' + commit.url + '">' + commit.sha + '</a>)';
    }
  }
  if (location.protocol !== "file:" && window.fetch) {
    fetch("https://api.github.com/repos/" + DEPOT + "/commits?per_page=1")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d[0]) {
          commit = { sha: d[0].sha.slice(0, 7), url: d[0].html_url };
          afficherCommit();
        }
      })
      .catch(function () {});
  }

  // Pied de page : appele depuis le bas de chaque page.
  window.piedDePage = function () {
    document.write('<span id="pied">' + pied(langue) + '</span>');
  };

  document.write('<span id="menu">' + html(langue) + '</span>');

  // Petit mot pour les curieux qui ouvrent la console du navigateur.
  if (window.console && !window.__bonjourAffiche) {
    window.__bonjourAffiche = true;
    console.log(
      "%c\n   _/\\/\\_      __/\\/\\/\\__\n__/      \\/\\_/          \\/\\/\\____\n",
      "color: IndianRed; font-family: monospace;");
    console.log(
      "Bonjour, curieux ! / Hello, curious one!\n" +
      "Ce site est fait a la main, en HTML et CSS, sans framework.\n" +
      "This site is hand-made with plain HTML and CSS, no framework.\n" +
      "Code : https://github.com/" + DEPOT);
  }

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
      afficherCommit();
    }
  });
})();

window.secouer = function () {
  document.body.classList.add("seisme");
  setTimeout(function () { document.body.classList.remove("seisme"); }, 2000);
};
