# Transfer Note: Metric-Imperial Converter → AuditAgent / Prüfungsworkflow

Dieses Projekt ist ein kleines API-basiertes Validierungs- und Transformationssystem: Eingaben werden geparst, ungültige Zahlen/Einheiten erkannt, gültige Werte konvertiert und als strukturierte Antwort zurückgegeben.

## Transfer zu AuditAgent

- **Eingabevalidierung:** Ähnlich wie bei Belegen oder PBC-Daten muss AuditAgent zwischen falschem Format, falscher Einheit und plausiblen Eingaben unterscheiden.
- **Normalisierung:** Unterschiedliche Einheiten/Formate werden in standardisierte Werte überführt — relevant für Betrags-, Mengen- oder Datumsvergleiche.
- **Nachvollziehbare Ausgabe:** Die API liefert Rohwerte, Zieleinheit und Erklärungstext. Das entspricht prüfungstauglichen, erklärbaren Automationen.
- **Testbarkeit:** Unit- und Functional-Tests sichern einzelne Parser-Regeln sowie das API-Verhalten ab.
