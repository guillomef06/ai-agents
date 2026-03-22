# GitHub Copilot — Setup JetBrains (IntelliJ, WebStorm, PyCharm…)

## Ce qui fonctionne automatiquement

Le plugin Copilot pour JetBrains lit automatiquement `.github/copilot-instructions.md`.
**Aucune configuration supplémentaire** n'est nécessaire pour que les standards globaux (SOLID, KISS, sécurité, tests) soient actifs.

---

## Ce qui ne fonctionne pas dans JetBrains

Les primitives suivantes sont **VS Code uniquement** :
- `.github/instructions/*.instructions.md` (instructions scoped par fichier)
- `.github/agents/*.agent.md` (agents custom)
- `.github/prompts/*.prompt.md` (slash commands)
- `.github/skills/*/SKILL.md` (skills)

**Conséquence** : sous JetBrains, Copilot applique uniquement les standards de `copilot-instructions.md`. Les instructions spécifiques TypeScript/Angular/Java ne s'appliquent pas automatiquement — vous pouvez les **coller manuellement dans le chat** si besoin.

---

## Configurer les serveurs MCP dans JetBrains

La configuration MCP se fait dans les Settings de l'IDE, pas via un fichier de repo.

### Chemin : `Settings → Languages & Frameworks → GitHub Copilot → MCP Servers`

Ajouter chaque serveur manuellement avec les paramètres ci-dessous.

---

### Serveur : filesystem

| Champ | Valeur |
|-------|--------|
| Name | `filesystem` |
| Type | `stdio` |
| Command | `npx` |
| Arguments | `-y @modelcontextprotocol/server-filesystem <chemin_absolu_du_projet>` |

---

### Serveur : github

| Champ | Valeur |
|-------|--------|
| Name | `github` |
| Type | `stdio` |
| Command | `npx` |
| Arguments | `-y @modelcontextprotocol/server-github` |
| Env variable | `GITHUB_PERSONAL_ACCESS_TOKEN = <votre_token>` |

Générer un token sur : https://github.com/settings/tokens
Scopes requis : `repo`, `read:user`

---

### Serveur : memory

| Champ | Valeur |
|-------|--------|
| Name | `memory` |
| Type | `stdio` |
| Command | `npx` |
| Arguments | `-y @modelcontextprotocol/server-memory` |

---

### Serveur : brave-search

| Champ | Valeur |
|-------|--------|
| Name | `brave-search` |
| Type | `stdio` |
| Command | `npx` |
| Arguments | `-y @modelcontextprotocol/server-brave-search` |
| Env variable | `BRAVE_API_KEY = <votre_clé>` |

Créer une clé gratuite sur : https://brave.com/search/api/

---

### Serveur : sequential-thinking

| Champ | Valeur |
|-------|--------|
| Name | `sequential-thinking` |
| Type | `stdio` |
| Command | `npx` |
| Arguments | `-y @modelcontextprotocol/server-sequential-thinking` |

---

## Prérequis

- **Node.js 18+** installé et `npx` disponible dans le PATH système (pas seulement dans le terminal VS Code)
- **Plugin GitHub Copilot** version ≥ 1.5.x (vérifier dans Settings → Plugins)

---

## Tip : copier une instruction dans le chat JetBrains

Pour les instructions non supportées nativement, ouvrez le fichier d'instruction correspondant et copiez son contenu dans le contexte du chat avec `#file:` :

```
#file:.github/instructions/angular.instructions.md
Refactorise ce composant en respectant ces standards.
```
