# Piano — agent-kit

> Documento vivo. Descrive **dove vogliamo arrivare**. Cosa fare e in che ordine sta in [ROADMAP.md](ROADMAP.md), il perché delle scelte in [decisions/](decisions/).

## 1. Obiettivo

Un sistema agentico riutilizzabile che mi permette di sviluppare i miei progetti con agenti Claude Code che lavorano **da soli e a lungo** (anche 12–24 ore senza che io guardi), mentre io mi occupo solo di:

- **decisioni di prodotto**: cosa costruire e perché;
- **decisioni architetturali**: come è fatto il sistema e quali compromessi accettiamo;
- **approvazione**: merge delle PR, guardando test e comportamento, non ogni riga.

Io "possiedo" la feature, non ogni linea di codice. Per capire come funziona ciò che gli agenti scrivono, ogni feature produce una spiegazione didattica (`docs/learn/`).

Il sistema è **opt-in**: in qualunque repo posso continuare a lavorare a mano o in chat. Gli agenti lavorano solo quando glielo chiedo o quando ho acceso un'automazione per quel repo.

### Come capisco che funziona

1. Scrivo un'issue, chiudo il telefono, e il giorno dopo trovo una PR con CI verde che rispetta la definition of done.
2. Se finisco i limiti d'uso a metà, il lavoro riparte da solo al reset, dal punto in cui si era fermato.
3. Un progetto nuovo si attiva con il kit in meno di 30 minuti.
4. Quando un agente sbaglia, la correzione diventa una regola, un hook o un test nel kit, e non si ripete in nessun progetto.

## 2. Principi

Presi dal metodo *Harness Engineering* (Alexio Cassani, Codemotion 2026) e adattati.

1. **Agent = Modello + Harness.** Il modello non lo controllo; tutto il resto sì. Il lavoro è sull'harness.
2. **Lo stato vive nel repo, non nella sessione.** Spec, piano, avanzamento e decisioni sono file committati. Una sessione può morire in qualunque momento senza perdere nulla.
3. **Irreversibile → boundary, non istruzione.** Una frase in `CLAUDE.md` alza solo una probabilità. Ciò che non si può annullare si impedisce con permessi, sandbox, branch protection.
4. **La definition of done è presidiata, non solo dichiarata.** Il contract la dichiara, una skill la esegue, uno Stop hook impedisce di finire finché non passa.
5. **Evidenze, non verdetti.** Quando un controllo fallisce, all'agente torna l'output reale dell'errore.
6. **Ogni controllo va visto fallire.** Un check mai visto rosso potrebbe non essere collegato.
7. **Gli agenti propongono, io decido.** Nessun agente fa merge su `main` o cambia l'architettura da solo.
8. **Contract corto.** `CLAUDE.md` contiene solo ciò che il codice non può dire: trappole, motivazioni, comandi giusti, definition of done.
9. **Costruire dal basso.** Prima si usa su un progetto reale (jamly), poi si estrae ciò che è generico.

## 3. Architettura: tre livelli

Vincolo tecnico che decide tutto: **una sessione cloud vede solo ciò che è committato nel repo e le skill attive sul mio account claude.ai.** La configurazione del mio PC (`~/.claude/`) non arriva nel cloud, e i plugin dichiarati nel repo nel cloud non vengono installati.

| Livello | Dove vive | Cosa contiene | Vale per |
|---|---|---|---|
| **Account** | Skill sul mio account claude.ai | Il *metodo*: scrivere spec, implementare un'issue, criticare, spiegare, riprendere il lavoro | Ogni sessione cloud, su ogni repo |
| **Kit** | Questo repo, copiato nei progetti | Ruoli (subagent), hook, permessi, regole, template issue, CI di base, scheletro di `CLAUDE.md` | Ogni progetto che lo adotta |
| **Progetto** | Il repo del progetto | `CLAUDE.md` specifico, decisioni architetturali, `progress.md`, `docs/learn/` | Solo quel progetto |

Il kit si distribuisce come una libreria: **questo repo è l'originale**, ogni progetto ne ha una **copia** (serve perché la sessione cloud clona solo il repo su cui lavora). Uno script di sync aggiorna i file generici senza toccare quelli specifici del progetto. Niente git submodule.

### Struttura finale di questo repo

```
agent-kit/
├── CLAUDE.md                 # come lavorare su questo repo
├── docs/
│   ├── PLAN.md               # questo file
│   ├── ROADMAP.md            # fasi e checklist
│   └── decisions/            # ADR del kit
├── template/                 # ciò che viene copiato in ogni progetto
│   ├── CLAUDE.md.template
│   ├── .claude/
│   │   ├── settings.json     # permessi + hook
│   │   ├── agents/           # ruoli
│   │   ├── skills/           # skill specifiche di sviluppo
│   │   ├── rules/            # stile, testing, sicurezza (path-scoped)
│   │   └── hooks/            # script degli hook
│   ├── .github/
│   │   ├── ISSUE_TEMPLATE/   # feature, bug
│   │   └── workflows/ci.yml  # test, lint, typecheck
│   └── docs/
│       ├── decisions/        # dove il progetto registra le sue ADR
│       ├── learn/            # spiegazioni didattiche
│       └── progress.md       # stato del lavoro in corso
├── account-skills/           # sorgenti delle skill da attivare sull'account
├── evals/                    # test dell'harness stesso
└── scripts/
    ├── bootstrap.sh          # attiva il kit in un repo
    └── sync-kit.sh           # aggiorna il kit in un repo
```

## 4. Ruoli degli agenti

| Ruolo | Quando lavora | Cosa produce | Cosa non può fare |
|---|---|---|---|
| **Spec writer** | Su mia richiesta | Issue esplicita da una mia idea: contesto, criteri di accettazione, fuori ambito, casi di test | Decidere il prodotto al posto mio |
| **Planner** | All'inizio di ogni issue | Piano in `docs/plans/<issue>.md`, decisioni architetturali da approvare | Scrivere codice |
| **Implementer** | Dopo il piano approvato | Codice + test su un branch, commit piccoli, `progress.md` aggiornato | Fare merge, toccare segreti o deploy |
| **Critic** | Prima della PR | Obiezioni concrete al lavoro dell'implementer, su contesto pulito | Modificare il codice |
| **Test writer** | Insieme all'implementer | Test ancorati ai criteri di accettazione, non al codice scritto | Indebolire test esistenti |
| **Explainer** | A feature chiusa | `docs/learn/<feature>.md`: struttura, concetti del framework, alternative scartate, punti del codice da guardare | — |
| **Codebase auditor** | Settimanale, un tema per volta | Max 3–5 issue `audit` con prove e proposta, senza duplicare issue già aperte o rifiutate | Correggere direttamente |

## 5. Il flusso di una feature

```
idea → [spec writer] → issue → [planner] → piano ──(io approvo)──▶
[implementer + test writer] ⇄ hook/CI ⇄ [critic] → PR verde ──(io faccio merge)──▶
[explainer] → docs/learn
```

I punti in cui intervengo sono due: **approvo il piano** e **faccio il merge**. Tutto il resto gira da solo.

## 6. Autonomia lunga e ripresa dopo i limiti

Obiettivo: la feature avanza per 12–24 ore senza di me, anche attraverso un limite d'uso.

- **Stato su file:** `docs/progress.md` dice quale issue è in corso, cosa è fatto, cosa manca, il prossimo passo e gli eventuali blocchi. Si aggiorna a ogni passo concluso, con un commit.
- **Commit piccoli e frequenti:** il lavoro salvato è quello pushato sul branch.
- **Ripresa automatica:** uno scheduled task nel cloud parte a intervalli regolari con l'istruzione "riprendi dal `progress.md`". Se ho finito i limiti, le esecuzioni vengono rifiutate fino al reset; la prima dopo il reset riparte dal punto salvato.
- **Idempotenza:** riprendere due volte non deve fare danni. Se il lavoro è già finito o bloccato in attesa di me, la ripresa non fa nulla.
- **Richiesta di aiuto:** se l'agente è bloccato su una decisione mia, lo scrive in `progress.md`, si ferma e me lo segnala (issue o commento sulla PR).

## 7. Boundary

| Anello | Cosa impedisce |
|---|---|
| **Permessi** (`.claude/settings.json` del repo) | Leggere `.env` e segreti, comandi distruttivi (`rm -rf`, `git push --force`), modificare config di deploy e CI senza chiedere |
| **Ambiente cloud** | Rete limitata ai domini necessari; chiavi come network secrets, che l'agente usa senza vedere |
| **GitHub** | `main` protetto: si entra solo da PR con CI verde e approvata da me |
| **Hook** | Stop gate sulla definition of done; pre-action gate sui comandi pericolosi |

La branch protection è la rete di sicurezza vera: non dipende dal comportamento dell'agente.

## 8. Matrice harness: stato obiettivo

Cinque componenti per quattro ruoli. Questa è la griglia che il kit deve riempire alla fine; lo stato attuale si verifica a ogni fase.

| | Guide | Sensor | Boundary | Record |
|---|---|---|---|---|
| **Contesto** | `CLAUDE.md` corto, definition of done | "esegui la verifica prima di dichiarare finito" | Path e segreti esclusi dal contesto | Transcript delle sessioni |
| **Tool** | Skill con descrizioni precise | Errori dei tool che spiegano come riprovare | Allow/deny per tool | Log delle tool call |
| **Infrastruttura** | Setup script dell'ambiente cloud | Test, lint, typecheck eseguibili | Rete limitata, nessuna credenziale di produzione | Branch e commit come snapshot |
| **Orchestrazione** | Definizioni dei ruoli | Critic e auditor su contesto pulito | Tool limitati per ruolo | `progress.md` e piani come handoff |
| **Hook** | SessionStart che inietta lo stato corrente | PostToolUse: format e lint | PreToolUse: gate sui comandi pericolosi | Command log con chiave di sessione |

## 9. Costi e limiti

Le sessioni cloud consumano lo stesso budget del piano (finestra di 5 ore + tetto settimanale), in proporzione a quante ne girano insieme. Per questo:

- parallelismo realistico: **2–3 sessioni**, non dieci;
- agent teams solo per review e dibattito, non per l'implementazione di routine;
- auditor settimanale, non giornaliero;
- ogni automazione ha un intervallo pensato, non "il più spesso possibile".

## 10. Fuori ambito (per ora)

- Interfaccia grafica stile "omini isometrici": prima il sistema, poi eventualmente la visualizzazione. Per sapere chi ha bisogno di me bastano la lista sessioni di claude.ai/code e le notifiche dell'app.
- Deploy automatico in produzione da parte degli agenti.
- Uso del PC o della rete aziendale: il kit vive solo su account e macchine personali.

## 11. Domande aperte

Da decidere man mano, ognuna diventerà una ADR:

- Stack di test di riferimento per i progetti frontend (Vitest + Playwright?).
- Ogni quanto parte lo scheduled task di ripresa (ogni 1 o 2 ore?).
- Come mi arriva la segnalazione "ho bisogno di te" (issue, commento PR, notifica app).
- Quali skill vanno a livello account e quali restano nel kit.
