# Design-Notizen

- **Produktsuche im Header:** immer erreichbar, weil Besuchende Produkte und Themen direkt finden können.
- **Einheitenrechner:** eigene Rechnerseite und direkter Einstieg im Hauptmenü, da tabellarische Umrechnungen ein eigenständiges Informationsbedürfnis bilden. Werte sind als zu prüfende Platzhalter markiert.
- **Warenkorb:** vom Header aus sichtbar und auf Produktkarten direkt befüllbar, um den Demo-Kaufpfad kurz zu halten.
- **FAQ-Sektion:** nahe dem unteren Bereich der Startseite, um häufige Fragen nach der ersten Orientierung zu beantworten.
- **Newsletter:** nach Ratgeber- und FAQ-Inhalten platziert; Anmeldehinweis und Zustimmung sind als Platzhalter angelegt.
- **Cookie- und Hinweisdialoge:** klar getrennt und mit gleichwertigen Auswahloptionen. Es gibt im Prototyp kein Tracking.
- **Spritzen- und Dosierrechner:** nicht umgesetzt. Ein Rechner, der aus Wirkstoffmenge und gewünschter Einzeldosis eine Injektionsmenge ableitet, könnte als Dosieranleitung verstanden werden. Vor einer Umsetzung braucht es fachlich geprüfte Zweckbestimmung und Sicherheitsvorgaben. Der vorhandene Rechner beschränkt sich auf abstrakte Einheitenumrechnung.
- **Produktvergleich und Wunschliste:** noch nicht aktiviert. Ausschließlich Platzhalterartikel liegen vor.
- **Mehrseitige Vorschau:** die lokale Vorschau trennt Katalog, Produktdetails, Warenkorb, Checkout-Mock, Zubehör-Finder, Rechner, Ratgeberartikel, Studienindex, FAQ, Konto und Rechtstexte in eigene Ansichten. Die URL wechselt per `?page=...`, damit die Vorschau auch direkt aus einer lokalen HTML-Datei navigierbar bleibt.
- **Designreferenz:** die Bereichsaufteilung orientiert sich an der klaren Shop-/Lexikon-/FAQ-Struktur von The Peptide Desk. Farben, Typografie, Produktgrafiken und Layout wurden eigenständig für diesen Prototyp gestaltet.
- **Bewegung:** Seiten und Karten blenden beim Aufruf dezent ein, die neutrale Hero-Grafik schwebt leicht, und Karten reagieren auf Hover. `prefers-reduced-motion` schaltet diese Bewegung ab.
- **Scroll-Visual:** direkt nach dem Hero liegt eine scrollgesteuerte Markenanimation mit geschlossener, neutraler Vial, blauem Liquid, Lichtreflexen und schwebenden Partikeln. Sie dient als atmosphärisches Markenbild, nicht als Produkt- oder Anwendungsvideo.
