# Transfer Note: Sudoku Solver → AuditAgent / Prüfungsworkflow

Dieses Projekt bildet einen regelbasierten Constraint-Solver ab: Eingaben werden validiert, einzelne Platzierungen gegen Zeile/Spalte/Region geprüft, und eine Lösung wird per Backtracking gesucht.

## Transfer zu AuditAgent

- **Regelvalidierung:** Prüfregeln können ähnlich wie Sudoku-Constraints formuliert werden: Pflichtfelder, zulässige Werte, Konflikte zwischen Angaben.
- **Konflikt-Erklärung:** Die API gibt nicht nur `valid: false`, sondern konkrete Konfliktarten zurück. Für AuditAgent ist das wichtig, damit Prüfer nachvollziehen, warum ein Beleg oder eine Buchung auffällig ist.
- **Deterministische Checks:** Im Gegensatz zu ML-Scores sind regelbasierte Solver auditierbar und reproduzierbar.
- **Human-in-the-loop:** Der Solver kann harte Regelverletzungen markieren; der Prüfer entscheidet anschließend über Wesentlichkeit und weitere Prüfungshandlungen.
