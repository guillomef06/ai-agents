# Full-Stack GitHub Copilot Bundle

> Bundle de configuration GitHub Copilot pour VS Code — instructions, agents spécialisés, prompts réutilisables, skills, et serveurs MCP. Pensé pour les équipes full-stack qui veulent des standards de qualité cohérents et de bonnes pratiques IA intégrées dès le départ.
>
> **JetBrains + Copilot Plugin** : bénéficie automatiquement du fichier `.github/copilot-instructions.md` (standards globaux).

## Philosophie

- **SOLID, KISS, DRY, YAGNI** — aucune abstraction spéculative
- **Security first** — OWASP Top 10 intégré dans chaque workflow
- **Fichiers petits et ciblés** — chargement progressif, pas de monolithe de 500 lignes
- **GitHub Copilot natif** — exploite toutes les primitives : agents `.agent.md`, instructions `.instructions.md`, prompts `.prompt.md`, skills `SKILL.md`, MCP

---

## Structure du bundle

```
.
├── .github/                             # Source de vérité — actif dans ce workspace
│   ├── copilot-instructions.md          # Standards globaux — chargé automatiquement (VS Code + JetBrains)
│   ├── agents/                          # Agents spécialisés — sélecteur @ dans le chat VS Code
│   │   ├── backend-dev.agent.md
│   │   ├── frontend-dev.agent.md
│   │   ├── full-stack-dev.agent.md
│   │   ├── ionic-dev.agent.md
│   │   ├── test-writer.agent.md
│   │   ├── e2e-tester.agent.md
│   │   ├── security-reviewer.agent.md
│   │   └── code-reviewer.agent.md       # + 3 workers internes (review-*)
│   ├── instructions/                    # Instructions auto-attachées par type de fichier
│   │   ├── typescript.instructions.md   # applyTo: **/*.{ts,tsx}
│   │   ├── python.instructions.md       # applyTo: **/*.py
│   │   ├── java.instructions.md         # applyTo: **/*.java
│   │   ├── spring-boot.instructions.md  # applyTo: **/*.java, pom.xml, application*.{yml,properties}
│   │   ├── react.instructions.md        # applyTo: **/*.{jsx,tsx}
│   │   ├── angular.instructions.md      # applyTo: **/*.{component,service,...}.ts
│   │   ├── ionic.instructions.md        # applyTo: **/*.page.{ts,html,scss}
│   │   ├── testing.instructions.md      # applyTo: **/*.{test,spec}.*
│   │   └── security.instructions.md     # On-demand (description-based)
│   ├── prompts/                         # Commandes / dans le chat (slash commands)
│   │   ├── code-review.prompt.md
│   │   ├── pr-description.prompt.md
│   │   ├── refactor.prompt.md
│   │   ├── explain-code.prompt.md
│   │   ├── generate-tests.prompt.md
│   │   └── debug.prompt.md
│   ├── skills/                          # Connaissances métier chargées à la demande
│   │   ├── solid-principles/SKILL.md
│   │   ├── owasp-security/SKILL.md
│   │   ├── clean-code/SKILL.md
│   │   ├── design-patterns/SKILL.md
│   │   ├── api-design/SKILL.md
│   │   ├── testing-best-practices/SKILL.md
│   │   ├── liquibase/SKILL.md
│   │   └── ui-polish/SKILL.md
│   └── hooks/                           # Hooks automatiques (Stop / SessionStart / PostToolUse)
│       └── scripts/
│           └── run-tests-on-stop.js
├── .vscode/
│   ├── mcp.json                         # Serveurs MCP (filesystem, github, memory, search, playwright)
│   ├── settings.json                    # Settings Copilot + qualité de code
│   └── extensions.json                  # Extensions recommandées
├── vscode/                              # Bundle distributable — à copier dans un projet VS Code
│   ├── .github/                         # Copie synchronisée de .github/
│   └── .vscode/                         # mcp.json, settings.json, extensions.json
└── intellij/                            # Bundle distributable — à copier dans un projet JetBrains
    └── .github/                         # Agents avec tools: granulaires (pas de hooks)
```

---

## Compatibilité IDE

| Primitive | VS Code + Copilot | JetBrains + Copilot Plugin |
|---|---|---|
| `copilot-instructions.md` | ✅ Chargé automatiquement | ✅ Chargé automatiquement |
| `.instructions.md` scoped | ✅ Auto par glob `applyTo` | ❌ (voir tip ci-dessous) |
| `.agent.md` (agents custom) | ✅ Sélecteur `@` dans chat | ❌ |
| `.prompt.md` (slash `/`) | ✅ | ❌ |
| Skills (`SKILL.md`) | ✅ Via `/` et auto-discovery | ❌ |
| MCP servers | ✅ Via `.vscode/mcp.json` | ✅ Via Settings IDE (manuel) |

**JetBrains** : seul `copilot-instructions.md` est lu automatiquement. Pour le reste (MCP, instructions), suivre le guide [`.github/jb-setup/README.md`](.github/jb-setup/README.md).

> **Tip JetBrains** : pour bénéficier d'une instruction spécifique, ajoutez-la au contexte du chat avec `#file:.github/instructions/angular.instructions.md`.

---

## Installation

### Option A — Copier dans un projet existant
```bash
# Dézipper le bundle à la racine du projet, puis :
git add .github/ .vscode/
git commit -m "chore: add GitHub Copilot dev bundle"
```

### Option B — Git submodule / template repo
```bash
# Utiliser ce repo comme template GitHub, puis cloner dans votre projet
git clone https://github.com/your-org/copilot-bundle .copilot-bundle
cp -r .copilot-bundle/.github .copilot-bundle/.vscode .
```

### Prérequis

1. **VS Code** dernière version stable (≥ 1.112)
2. **Extension GitHub Copilot Chat** activée
3. Pour les MCP servers, **Node.js 18+** requis (`npx` doit être disponible)
4. Variables d'environnement à définir dans votre shell (`.bashrc`, `.zshrc`, ou variables système) :
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."   # GitHub MCP server
   export BRAVE_API_KEY="BSA..."                    # Brave Search MCP server
   ```

---

## Agents spécialisés

Dans VS Code, ouvrez le chat Copilot et sélectionnez un agent via le sélecteur `@` (ou tapez `@` suivi du nom).

| Agent | Quand l'utiliser |
|---|---|
| `@backend-dev` | APIs, bases de données, microservices, auth |
| `@frontend-dev` | Composants UI, accessibilité, performance |
| `@ionic-dev` | Pages Ionic, Capacitor, navigation mobile, iOS/Android |
| `@full-stack-dev` | Orchestrateur : clarifie le besoin, délègue aux subagents, synthétise |
| `@test-writer` | Tests unitaires et intégration |
| `@e2e-tester` | Tests E2E Playwright/Cypress — parcours utilisateur critiques |
| `@security-reviewer` | Audit OWASP, analyse de vulnérabilités |
| `@code-reviewer` | Revue de PR multi-perspectives (4 subagents en parallèle) |

> `review-correctness`, `review-quality`, `review-architecture` sont des workers internes — ils n'apparaissent pas dans le sélecteur `@` mais sont invoqués automatiquement par `@code-reviewer`.

---

## Instructions auto-attachées

Quand vous ouvrez ou modifiez un fichier, Copilot charge automatiquement l'instruction correspondante :

| Fichier ouvert | Instruction chargée |
|---|---|
| `*.ts`, `*.tsx` | Standards TypeScript strict, no `any` |
| `*.py` | PEP8, type hints, sécurité Python |
| `*.java`, `pom.xml`, `application*.yml` | Spring Boot — Lombok, JPA, Security, JWT, H2 guard |
| `*.java` | Java idiomatique — DI constructeur, DTOs, records |
| `*.jsx`, `*.tsx` | React hooks, accessibilité ARIA |
| `*.component.ts`, `*.service.ts`… | Angular standalone, RxJS, OnPush, JWT storage |
| `*.page.ts`, `*.page.html` | Ionic lifecycle, Capacitor, mobile perf |
| `*.test.*`, `*.spec.*` | AAA pattern, isolation, mocking |

L'instruction `security.instructions.md` est chargée **à la demande** (on-demand) quand le contexte est lié à la sécurité.

---

## Prompts réutilisables (slash commands)

Tapez `/` dans le chat Copilot pour accéder aux prompts :

| Commande | Utilisation |
|---|---|
| `/code-review` | Revue structurée (SOLID, sécurité, tests, performance) |
| `/pr-description` | Génère la description d'une PR |
| `/refactor` | Refactoring ciblé sans changement de comportement |
| `/explain-code` | Explication méthodique d'un bout de code |
| `/generate-tests` | Génération de tests complets avec AAA |
| `/debug` | Diagnostic structuré cause racine → fix → test |

---

## Skills (connaissances profondes à la demande)

Les skills sont chargés automatiquement quand Copilot détecte que le contexte correspond, ou via `/` :

| Skill | Contenu |
|---|---|
| `/solid-principles` | Détection de violations, patterns de refactoring par langage |
| `/owasp-security` | Checklist OWASP Top 10, guide de findings avec exemples fix |
| `/clean-code` | Naming, fonctions courtes, suppression des commentaires inutiles |
| `/design-patterns` | Pattern picker GoF, implémentations concrètes |
| `/api-design` | REST, GraphQL, gRPC — naming, codes HTTP, pagination, erreurs |
| `/testing-best-practices` | Pyramide de tests, stratégie de mocking, TDD, gestion du flaky |
| `/liquibase` | Changelogs YAML, changesets, rollbacks, contextes, intégration Spring Boot |
| `/ui-polish` | Animations, micro-interactions, skeleton loaders, transitions de page |

---

## Serveurs MCP

Configurés dans `.vscode/mcp.json`. Le premier démarrage déclenche `npx` pour installer les serveurs.

| Serveur | Capacités |
|---|---|
| `filesystem` | Lecture/écriture sécurisée dans le workspace |
| `github` | Issues, PRs, repos — nécessite `GITHUB_PERSONAL_ACCESS_TOKEN` |
| `memory` | Mémoire persistante entre sessions de chat |
| `brave-search` | Recherche web (docs, CVEs, versions) — nécessite `BRAVE_API_KEY` |
| `sequential-thinking` | Raisonnement structuré étape par étape |
| `playwright` | Automatisation navigateur pour tests E2E et scraping |

**Pour JetBrains** : Settings → Tools → AI Assistant → MCP Servers → ajouter les mêmes configurations.

---

## Hooks automatiques

Les hooks s'exécutent automatiquement à des moments clés du cycle de vie du chat. Configurés dans les agents ou dans `.vscode/settings.json`.

| Hook | Déclencheur | Comportement |
|---|---|---|
| **Stop** (test-writer) | Avant que `@test-writer` rende la main | Lance la suite de tests — bloque l'agent si échec, il doit corriger et réessayer |
| **SessionStart** (code-reviewer) | À l'ouverture d'une session `@code-reviewer` | Exécute `.github/hooks/scripts/audit-context.js` — pré-charge le contexte d'audit |
| **PostToolUse** (global) | Après chaque modification de fichier `.ts`, `.tsx`, `.js` | Lance Prettier automatiquement sur le fichier modifié |

> Le hook **Stop** sur `@test-writer` est le mécanisme de boucle : il garantit que les tests passent avant que l'agent ne considère son travail terminé.

---

## Dual bundle — VS Code vs JetBrains

Le dossier `.github/` à la racine est la source de vérité active (workspace VS Code courant). Deux copies synchronisées sont maintenues pour distribution :

| Dossier | Pour qui | Différences |
|---|---|---|
| `vscode/` | Équipes VS Code | Hooks inclus, `tools: [read, edit, search, execute, todo]` (short aliases), `.vscode/` complet |
| `intellij/` | Équipes JetBrains | Pas de hooks (non supportés), `tools:` granulaires explicites, pas de `.vscode/` |

**Workflow de synchronisation** : après toute modification dans `.github/`, répercuter sur `vscode/.github/` (contenu identique) et `intellij/.github/` (même contenu mais conserver les `tools:` JetBrains dans les agents).

### Settings VS Code notables (v1.112+)

```json
"chat.useCustomizationsInParentRepositories": true
```
> Monorepo support — découvre automatiquement les fichiers `.github/` dans les dossiers parents jusqu'à la racine du repo quand vous ouvrez un sous-dossier dans VS Code.

---

## Personnalisation

### Ajouter une technologie
1. Créer `.github/instructions/<tech>.instructions.md` avec `applyTo` approprié
2. (optionnel) Créer `.github/agents/<tech>-dev.agent.md`

### Ajouter un skill
1. Créer `.github/skills/<nom>/SKILL.md` — `name` doit correspondre exactement au nom du dossier
2. Ajouter les références dans `.github/skills/<nom>/references/`

### Ajouter un serveur MCP
1. Ajouter dans `.vscode/mcp.json`
2. Documenter les prérequis (env vars) dans ce README

---

## Optimiser la consommation de requêtes premium

GitHub Copilot distingue les requêtes **standard** (illimitées) des requêtes **premium** (quota mensuel). Voici comment maximiser l'efficacité.

### Ce qui consomme des requêtes premium
- Chaque tour dans une session agent (`@backend-dev`, `@full-stack-dev`…)
- Les subagents invoqués par un orchestrateur (`full-stack-dev` → `backend-dev` + `frontend-dev` + `security-reviewer` = 3+ requêtes)
- Les allers-retours de clarification dans une même session longue

### Bonnes pratiques

| Situation | Recommandation |
|---|---|
| Petite complétion, renommage, fix évident | Utiliser la **complétion inline** (Copilot classique dans l'éditeur) — ne consomme pas de premium |
| Question simple, explication de code | Choisir un modèle léger (`GPT-4o mini`) via `Ctrl+Alt+/` |
| Feature complète, audit, génération de tests | Utiliser le modèle premium et un agent spécialisé |
| Tâche mono-stack | Invoquer directement `@backend-dev` ou `@frontend-dev` plutôt que `@full-stack-dev` |
| Session longue et polluée | Ouvrir une nouvelle conversation — le contexte accumulé augmente le coût de chaque tour |

### Préparer son brief avant d'invoquer un agent

Moins de clarifications = moins de tours = moins de requêtes. Fournir dès le premier message :
- Le stack exact (framework + version)
- Le modèle de données (champs, types, relations)
- Les règles de validation et les cas d'erreur attendus

> Les agents (`@backend-dev`, `@full-stack-dev`…) ont une phase de clarification obligatoire — si le brief est complet dès le départ, ils sautent cette phase et passent directement à l'implémentation.

---

## Contribuer au bundle

En suivant les principes du bundle lui-même :
- **KISS** : un fichier = une préoccupation
- **YAGNI** : n'ajouter agents/skills/instructions que pour un besoin concret
- **Security** : jamais de secrets ou clés dans les fichiers commités
