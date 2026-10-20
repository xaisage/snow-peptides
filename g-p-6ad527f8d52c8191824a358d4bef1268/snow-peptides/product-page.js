(() => {
  const products = [
    ['ghk-cu','GHK-Cu','Haut- & Matrixforschung',49,'Kupferbindendes Tripeptid, das in der Literatur im Kontext von Haut- und Extrazellulärmatrix-Modellen untersucht wird.'],
    ['kpv','KPV','Entzündungsmodelle',39,'Kurzes α-MSH-abgeleitetes Peptid; publizierte Arbeiten untersuchen es in präklinischen Entzündungsmodellen.'],
    ['bpc-157','BPC-157','Gewebe- & Reparaturmodelle',59,'In der präklinischen Literatur vor allem in Modellen zu Gewebe- und Reparaturprozessen untersucht; klinische Aussagekraft ist begrenzt.'],
    ['tb-500','Thymosin β4 (TB-500)','Zellmigration & Gewebemodelle',69,'Thymosin-β4-bezogene Forschung betrachtet unter anderem Zellmigration und Gewebeprozesse; Fragmentbezeichnungen können variieren.'],
    ['cjc-1295','CJC-1295','Endokrine Signalwege',79,'In der Literatur als langwirksames GHRH-Analog im Zusammenhang mit endokrinen Signalwegen beschrieben.'],
    ['ipamorelin','Ipamorelin','Endokrine Signalwege',59,'Ghrelin-Rezeptor-Agonist, der in pharmakologischen und endokrinen Forschungszusammenhängen untersucht wurde.'],
    ['mots-c','MOTS-c','Mitochondriale & metabolische Forschung',89,'Mitochondrien-kodiertes Peptid; Forschungsarbeiten betrachten mitochondriale und metabolische Signalwege.'],
    ['semax','Semax','Neuropeptid- & ZNS-Forschung',54,'ACTH-abgeleitetes Peptid, das in neurobiologischen Forschungsarbeiten beschrieben wird.'],
    ['selank','Selank','Neuropeptid- & ZNS-Forschung',54,'Tuftsin-abgeleitetes Peptid; Literatur beschreibt Untersuchungen in neuropharmakologischen Kontexten.'],
    ['epitalon','Epitalon','Chronobiologie & Zellmodelle',64,'Synthetisches Tetrapeptid, das in begrenzten Zell- und präklinischen Literaturkontexten untersucht wird.'],
    ['aod-9604','AOD-9604','Stoffwechsel- & Peptidfragmentforschung',74,'GH-Fragment-Analog; Forschungsarbeiten untersuchten pharmakologische und metabolische Fragestellungen.'],
    ['kisspeptin-10','Kisspeptin-10','Reproduktive Neuroendokrinologie',69,'Kisspeptin-Sequenz aus der Forschung zur neuroendokrinen Regulation der Reproduktionsachse.'],
    ['probenroehrchen','Probenröhrchen Set','Labororganisation',19,'Zubehör-Prototyp für die strukturierte Aufbewahrung und Kennzeichnung von Proben.'],
    ['kryo-etiketten','Kryo-Etiketten','Labororganisation',14,'Zubehör-Prototyp für eine gut lesbare Probenkennzeichnung.']
  ];
  const [slug] = new URLSearchParams(location.search).get('produkt')?.split('/') || [];
  const product = products.find(([id]) => id === slug);
  if (!product) {
    document.title = 'Produkt nicht gefunden — Snow Peptides';
    document.querySelector('.product-page-layout').hidden = true;
    document.querySelector('.research-note').hidden = true;
    const message = document.createElement('section');
    message.className = 'product-not-found';
    message.innerHTML = '<span class="eyebrow">SNOW PEPTIDES</span><h1>Dieses Produkt gibt es hier nicht.</h1><p>Der Produktlink ist ungültig oder das Produkt wurde aus dem Demo-Sortiment entfernt.</p><a class="button button-dark" href="./sortiment.html">Zum Sortiment <span>↗</span></a>';
    document.querySelector('#product-page').append(message);
    return;
  }
  const [,name,study,price,summary] = product;
  const accessory = slug === 'probenroehrchen' || slug === 'kryo-etiketten';
  document.title = `${name} — Snow Peptides`;
  document.querySelector('#page-title').textContent = name;
  document.querySelector('#page-label').textContent = `SNOW · ${name}`;
  document.querySelector('#page-summary').textContent = summary;
  document.querySelector('#page-study').textContent = study;
  document.querySelector('#page-price').textContent = `€${price}`;
  const addButton = document.querySelector('#add-inquiry');
  addButton.dataset.add = name;
  const wishlistButton = document.querySelector('#detail-wishlist');
  wishlistButton.dataset.wishlist = name;
  try {
    const saved = JSON.parse(localStorage.getItem('snow-peptides-wishlist-v1') || '[]');
    const isSaved = Array.isArray(saved) && saved.includes(name);
    wishlistButton.classList.toggle('is-saved', isSaved);
    wishlistButton.setAttribute('aria-pressed', String(isSaved));
    wishlistButton.setAttribute('aria-label', `${name} ${isSaved ? 'aus Wunschliste entfernen' : 'zur Wunschliste hinzufügen'}`);
    wishlistButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.8 4.8 0 0 1 12 6.5a4.8 4.8 0 0 1 8.8 2.3Z"/></svg>${isSaved ? 'Auf der Wunschliste' : 'Auf die Wunschliste'}`;
  } catch { /* Storage can be unavailable in private browsing. */ }
  if (accessory) {
    document.querySelector('#page-badge').textContent = 'ZUBEHÖR';
    document.querySelector('#page-eyebrow').lastChild.textContent = ' LABORZUBEHÖR';
    document.querySelector('#page-status').textContent = 'Zubehör-Prototyp · Spezifikationen ausstehend';
    document.querySelector('#literature-heading').textContent = 'Produktinformation';
    document.querySelector('#page-evidence').textContent = 'Material, Abmessungen, Temperaturbereich und Kompatibilität sind im Prototyp noch nicht spezifiziert.';
    document.querySelector('#literature-link').hidden = true;
    document.querySelector('#research-note-copy').textContent = 'Demo-Produktseite. Technische Spezifikationen, Verfügbarkeit und Bezugsbedingungen sind noch nicht hinterlegt.';
  } else {
    document.querySelector('#page-evidence').textContent = `Das Themenfeld ordnet die verfügbare Fachliteratur ein und stellt keine Aussage über eine nachgewiesene Wirkung, Sicherheit oder klinische Eignung dar. Bitte prüfe jede Quelle und ihren Evidenzgrad im jeweiligen Kontext.`;
    document.querySelector('#literature-link').href = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(name)}`;
  }
})();
