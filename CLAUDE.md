# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Repository

**Kommanda** is a restaurant order management backend (POS system) used as a **teaching exercise** for an Argentine university (materia: Desarrollo de Software). The codebase is intentionally spread across many git branches that show incremental feature implementations — this is by design.

**The code is written in Spanish** — variable names, class names, method names, comments, and domain concepts all use Spanish (e.g., `Plato`, `Comanda`, `pedido`, `buscarPorId`). Follow this convention when adding or modifying code.

## Running the App

```bash
npm install
npm start          # Express server on port 3000
```

**Database (MongoDB required):**
```bash
docker run --rm -it --name mongo-kommanda -p 27017:27017 mongo
./seed.sh          # Seed 20 menu items (5 entradas, 5 principales, 5 postres, 5 bebidas)
```

**Swagger UI:** `http://localhost:3000/api-docs` (available from `clase-1/2-rutas-hardcodeadas` onwards)

There is no test suite (`npm test` is a placeholder).

**Node version:** The system Node may be old. Use `~/.nvm/versions/node/v22.14.0/bin/npm` for any `npm install` operations.

## Intended Branch Progression

The goal is one continuous linear teaching history across all three class series. The intended final sequence is:

```
clase-1/1-solo-dominio
  → clase-1/2-rutas-hardcodeadas
  → clase-1/3-crear-plato
  → clase-1/4-crear-plato-con-errores
  → clase-1/5-ver-platos
  → clase-1/6-platos-controller          ← clase-2 starts here (clase-2/1-base is same commit)
    → clase-2/2-actualizar-plato
    → clase-2/3-crear-comanda
    → clase-2/4-ver-comanda
    → clase-2/4.5-marcar-plato-listo-comanda-falla
    → clase-2/5-marcar-plato-listo-comanda
    → clase-2/6-comanda-service
    → clase-2/7-buscar-comanda            ← clase-odm starts here
      → clase-odm/1-separando-archivos
      → clase-odm/2-inyeccion-de-dependencias
      → clase-odm/3-repo-platos
      → clase-odm/4-repo-comandas
```

**Current state:**
- `clase-1/*` — **done**. Clean linear sequence, pushed.
- `clase-2/*` — **done**. Clean linear sequence on top of `clase-1/6-platos-controller`, pushed.
- `clase-odm/*` — **done locally, not yet pushed**. Clean linear sequence on top of `clase-2/7-buscar-comanda`. Needs docs retro-applied then push.
- `main` — points to `clase-1/1-solo-dominio` (the exercise starting point).

## The Retro-Apply Pattern

When a change needs to be present in all branches of a sequence (e.g., adding a file, splitting a module), the pattern is:

1. **Amend the first commit** in the sequence to include the change (checkout in detached HEAD, make changes, `git commit --amend --no-edit`)
2. **Rebase the rest** of the chain onto the amended commit: `git rebase --onto <new-base> <old-base> <tip-branch>`
3. **Fix any broken references** caused by the change (e.g., import paths), amending the affected commits and rebasing the tail again
4. **Update all branch pointers**: `git branch -f <name> <hash>`
5. **Force push**: `git push --force origin <branch1> <branch2> ...`

**Recurring conflict patterns during rebase:**

- *Same-spot import additions* — two commits both add imports at the top of the same file. Resolution: keep both sets of imports.
- *Import removals that no longer match* — a later commit deletes an import line that was since renamed (e.g., `dominio.js` → `plato.js`). Resolution: take the "theirs" side (the deletion), which removes the now-renamed line.

**Gotchas:**
- **zsh arrays are 1-indexed**, not 0-indexed. Never use `${ARRAY[0]}` — it returns nothing. Use `sed -n '1p'`, `sed -n '2p'`, etc. to extract lines from command output, or use explicit variable names.
- The `git rebase --onto A B C` command replays commits reachable from `C` but not from `B`, onto `A`. `C` must be a branch name (not a bare hash) for the branch pointer to be updated after the rebase.

## Branch Structure Reference

| Series | Branches | Status |
|--------|----------|--------|
| clase-1 | `clase-1/1-solo-dominio` → `clase-1/6-platos-controller` | Done, pushed |
| clase-2 | `clase-2/1-base` → `clase-2/7-buscar-comanda` | Done, pushed |
| clase-odm | `clase-odm/1-separando-archivos` → `clase-odm/4-repo-comandas` | Done locally, not pushed |

Legacy flat branches (`clase-1-solo-dominio`, `clase-1-crear-plato`, `clase-1-rebuild`, `clase-2/base`, `clase-odm-inicial`, `clase-odm-repo-platos`, `clase-odm-injecting-deps`, `clase-odm-repos`, etc.) exist but are not part of the active teaching sequence.

## Architecture

The app uses a strict **layered architecture**. Dependencies flow inward:

```
HTTP (Express routes) → Controllers → Services → Repositories → MongoDB
                                ↘ Domain objects ↙
```

- **[index.js](index.js)** — entry point, starts server
- **[src/app/](src/app/)** — server setup, route bindings, MongoDB connection, and `context.js` which is the **dependency injection container** that wires all components together
- **[src/controllers/](src/controllers/)** — parse HTTP requests, call services, serialize responses
- **[src/services/](src/services/)** — business logic; construct domain objects, delegate persistence to repositories
- **[src/repositories/](src/repositories/)** — MongoDB access; marshal between domain objects and DB documents
- **[src/domain/](src/domain/)** — plain domain classes, one file per class: `plato.js`, `categoria.js`, `comanda.js`, `platoPedido.js`, `estadoComanda.js`
- **[src/excepciones/](src/excepciones/)** — domain-specific error classes (`PlatoInvalido`, `ComandaInexistente`, etc.)

The project uses **ES modules** (`"type": "module"` in package.json) — use `import`/`export`, not `require`.

## Domain Model

- **Plato** — a menu item with name, category (`ENTRADA | PRINCIPAL | POSTRE | BEBIDA`), price, and availability flag
- **Comanda** — an order for a table; contains a list of `PlatoPedido` entries, beverage and payment status; progresses through `EstadoComanda` states (`INGRESADO → ENTRADAS_LISTAS → ... → PAGADO`)
- **PlatoPedido** — a dish instance within an order (quantity, notes, ready flag)

## API Surface

| Method | Path | Description |
|--------|------|-------------|
| POST | `/platos` | Create dish |
| GET | `/platos` | List all dishes |
| GET | `/platos/:id` | Get dish |
| PUT | `/platos/:id` | Full update |
| PATCH | `/platos/:id` | Toggle availability |
| POST | `/comandas` | Create order |
| GET | `/comandas/:id` | Get order |
| GET | `/comandas` | Search (filters: `bebidasPendientes`, `platosPendientes`) |
| PATCH | `/comandas/:id` | Update beverage status |
| POST | `/comandas/:id/platos` | Add dish to order |
| PATCH | `/comandas/:id/platos/:ordenPlato` | Update dish in order |
