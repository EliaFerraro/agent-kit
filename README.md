# agent-kit

Il mio harness agentico riutilizzabile: il sistema che permette ad agenti Claude Code di sviluppare i miei progetti in autonomia, mentre io prendo le decisioni di prodotto e architetturali e approvo il risultato.

**Stato:** Fase 0, piano. Il kit si costruisce un pezzo per volta, usandolo prima sul progetto pilota **jamly**.

## Da dove partire

- [docs/PLAN.md](docs/PLAN.md): dove vogliamo arrivare. Obiettivo, principi, architettura, ruoli degli agenti, flusso, boundary.
- [docs/ROADMAP.md](docs/ROADMAP.md): le fasi, ognuna con il suo criterio di uscita.
- [docs/decisions/](docs/decisions/): il perché delle scelte, una decisione per file.

## L'idea in tre righe

- **Agent = Modello + Harness.** Il modello non lo controllo; contesto, tool, boundary, hook e orchestrazione sì.
- **Lo stato vive nel repo.** Spec, piani e avanzamento sono file, così il lavoro sopravvive alla fine di una sessione e riprende da solo dopo un limite d'uso.
- **Gli agenti propongono, io decido.** Approvo i piani e faccio il merge; tutto il resto è presidiato da test, hook e branch protection.

## Come si userà (dalla Fase 4)

```bash
# attivare il kit in un repo
./scripts/bootstrap.sh ../mio-progetto

# aggiornare il kit in un repo che lo usa già
./scripts/sync-kit.sh ../mio-progetto
```

Il kit resta opzionale: in ogni repo posso sempre lavorare a mano o in chat.
