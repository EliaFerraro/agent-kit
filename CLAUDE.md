# agent-kit

Questo repo è il **kit**, non un progetto applicativo. Contiene il piano e, man mano, i file che vengono copiati nei progetti.

## Dove sta cosa
- `docs/PLAN.md` è la fonte di verità sull'obiettivo. Se una modifica lo contraddice, fermati e chiedi.
- `docs/ROADMAP.md` dice cosa fare ora. Lavora solo sulla fase in corso; non anticipare le successive.
- `template/` contiene **solo** file generici, validi per qualunque progetto. Niente riferimenti a jamly o ad altri progetti specifici.

## Regole
- Ogni scelta non ovvia diventa una ADR in `docs/decisions/`, numerata in sequenza, con contesto, decisione e conseguenze.
- Non aggiungere a `template/` un componente che non è stato provato su un progetto reale (vedi ADR 0001).
- Ogni hook o controllo aggiunto va accompagnato dalla prova che sa fallire.
- Scrivi in italiano, frasi brevi.

## Definition of done
- La checklist della fase in `docs/ROADMAP.md` è aggiornata.
- Le decisioni prese sono registrate come ADR.
- `docs/PLAN.md` è ancora coerente con quello che c'è nel repo.
- Merge su `main` solo dopo la mia approvazione.
