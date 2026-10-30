# 0003 · Gli agenti propongono, io decido

**Stato:** accettata · 2026-10-30

## Contesto
Voglio delegare la scrittura del codice, non la responsabilità del prodotto. Una frase in `CLAUDE.md` non basta a impedire un'azione irreversibile: alza solo una probabilità.

## Decisione
- Intervengo in due punti: **approvo il piano** e **faccio il merge**.
- `main` è protetto da branch protection: si entra solo da PR con CI verde e mia approvazione.
- Auditor e critic aprono issue o commenti con prove e proposte; non modificano il codice da soli.
- Le scelte architetturali le registro io come ADR; quando rifiuto una proposta scrivo il perché, così non viene riproposta.

## Conseguenze
- Il collo di bottiglia sono le mie approvazioni: il sistema deve rendermele rapide (PR piccole, test leggibili, piani brevi).
- La sicurezza non dipende dal comportamento degli agenti.
