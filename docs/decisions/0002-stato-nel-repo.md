# 0002 · Lo stato del lavoro vive nel repo, non nella sessione

**Stato:** accettata · 2026-10-30

## Contesto
Voglio che una feature avanzi per 12–24 ore senza di me, anche quando finisco i limiti d'uso. Una sessione può fermarsi in qualunque momento: limite raggiunto, ambiente scaduto, errore. Ciò che sta solo nel contesto della sessione si perde.

## Decisione
- Spec (issue), piano (`docs/plans/`), avanzamento (`docs/progress.md`) e decisioni (`docs/decisions/`) sono file committati.
- Gli agenti fanno commit piccoli e frequenti e aggiornano `progress.md` a ogni passo concluso.
- La ripresa è affidata a uno scheduled task nel cloud che riparte da `progress.md`, ed è idempotente.

## Conseguenze
- Nessuna dipendenza dal PC acceso o da una sessione aperta.
- Serve disciplina sul formato di `progress.md`: è il contratto tra una sessione e la successiva.
- Più commit nella storia dei branch; si risolve con squash al merge.
