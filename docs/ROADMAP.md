# Roadmap

Ogni fase è utile da sola e ha un **criterio di uscita** verificabile. Non si passa alla successiva finché il criterio non è soddisfatto. Il pilota è **jamly**: le fasi 1–3 si costruiscono lì, la fase 4 estrae ciò che è generico in questo repo.

## Fase 0 · Piano ✅
- [x] Visione, principi e architettura in [PLAN.md](PLAN.md)
- [x] Prime decisioni in [decisions/](decisions/)

**Uscita:** il piano è scritto e approvato da me.

## Fase 1 · Fondamenta (su jamly)
- [ ] `CLAUDE.md` di jamly scritto come contract corto, con definition of done
- [ ] Permessi in `.claude/settings.json`: deny su segreti e comandi distruttivi
- [ ] CI su GitHub Actions: test, lint, typecheck
- [ ] Branch protection su `main`: solo PR con CI verde
- [ ] Template issue: feature e bug
- [ ] Ambiente cloud configurato: setup script, rete limitata

**Uscita:** un'issue reale implementata da una sessione cloud avviata dal telefono, con PR e CI verde, senza che io scriva codice.

## Fase 2 · Sensori
- [ ] Skill `verify-done`: esegue ogni criterio della definition of done e riporta una riga per criterio
- [ ] Stop hook che impedisce di finire con test, lint o typecheck rossi, e rimanda l'errore reale
- [ ] PostToolUse hook: format e lint sui file modificati
- [ ] Subagent `critic`
- [ ] Ogni hook fatto fallire apposta una volta

**Uscita:** ho visto un agente provare a finire con un test rosso, venire bloccato e correggersi da solo.

## Fase 3 · Autonomia lunga
- [ ] Convenzione `docs/progress.md`
- [ ] Skill `riprendi-lavoro`, idempotente
- [ ] Scheduled task di ripresa nel cloud
- [ ] Segnalazione "ho bisogno di te" quando l'agente è bloccato
- [ ] Command log (colonna Record)

**Uscita:** una feature avanza per 24 ore senza mia interazione, attraversando almeno un limite d'uso.

## Fase 4 · Estrazione nel kit
- [ ] Separare in jamly i file generici da quelli specifici
- [ ] Popolare `template/` in questo repo
- [ ] `scripts/bootstrap.sh` e `scripts/sync-kit.sh`
- [ ] Skill di livello account: `scrivi-spec`, `critico`, `spiega-feature`
- [ ] Questo repo impostato come template repository

**Uscita:** un secondo progetto attivato con il kit in meno di 30 minuti, e un aggiornamento del kit propagato a jamly con lo script.

## Fase 5 · Qualità continua
- [ ] Subagent `explainer` e cartella `docs/learn/`
- [ ] Codebase auditor settimanale, un tema per volta, max 5 issue
- [ ] Eval-set dell'harness: 10 task in `evals/` tratti da errori reali
- [ ] Ogni errore ricorrente di un agente diventa regola, hook o task di eval

**Uscita:** un mese di issue dell'auditor smistate, e l'eval-set che gira a ogni modifica del kit.

## Fase 6 · Parallelismo
- [ ] 2–3 sessioni in parallelo su aree diverse del codice
- [ ] Auto-fix delle PR
- [ ] Agent teams per review e dibattito su decisioni difficili
- [ ] (Opzionale) visualizzazione dello stato degli agenti

**Uscita:** una settimana con più feature avanzate in parallelo, senza conflitti tra branch.
