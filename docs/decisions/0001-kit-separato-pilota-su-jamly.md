# 0001 · Kit in un repo separato, costruito su un pilota reale

**Stato:** accettata · 2026-10-30

## Contesto
Voglio un sistema agentico riutilizzabile su tutti i miei repo. Progettare un kit astratto prima di averlo usato porta quasi sempre a rifarlo: non si sa ancora cosa è generico e cosa è specifico.

## Decisione
- Il kit vive in questo repo separato, che è la fonte unica.
- I componenti si costruiscono e si provano prima su **jamly** (fasi 1–3), poi si estraggono qui (fase 4).
- In `template/` entra solo ciò che ha funzionato su un progetto reale.

## Conseguenze
- All'inizio `template/` resta vuoto e il valore del repo è il piano.
- Le prime fasi producono modifiche in jamly, non qui; qui si aggiornano roadmap e decisioni.
