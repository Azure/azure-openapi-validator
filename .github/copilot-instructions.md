# GitHub Copilot Instructions for azure-openapi-validator

## Project Overview

This is `azure-openapi-validator` (aka `LintDiff`), a linter for Azure OpenAPI specifications. It is an extension of AutoRest and supports Spectral lint rule format. The repository contains automated linter rules that apply to API specs in the azure-rest-api-specs repository.

## Architecture

This is a monorepo managed by Rush.js with the following main packages:

- `packages/azure-openapi-validator/core` - Core functionality (`@microsoft.azure/openapi-validator-core`)
- `packages/azure-openapi-validator/autorest` - AutoRest extension (`@microsoft.azure/openapi-validator`)
- `packages/rulesets` - Ruleset implementations (`@microsoft.azure/openapi-validator-rulesets`)
  - `src/spectral/` - Spectral format rules
  - `src/native/` - Native TypeScript rules
- `regression` - Regression tests

## Build and Test Commands

### Prerequisites
- Node.js >= 20
- Rush.js (`npm install -g @microsoft/rush`)

### Essential Commands

**Build:**
```bash
rush update    # Install dependencies
rush build     # Build all projects
```

**Test:**
```bash
rush test                                                    # Run all tests
npx jest --config ./jest.native.config.js                  # Native tests only (in packages/rulesets)
npx jest --config ./jest.config.js                         # Spectral tests only (in packages/rulesets)
```

**Lint:**
```bash
rush lint      # Run linter on all projects
rush lint:fix  # Auto-fix linting issues
```

**Other:**
```bash
rush prep              # Complete pre-PR workflow: update, build, lint, test, regen-ruleindex, change
rush regen-ruleindex   # Regenerate docs/rules.md after rule changes
rush change            # Generate Rush changelog entries
rush regression-test   # Run regression tests
```

## Development Workflow

### Before Submitting a PR
1. Ensure branch is based on up-to-date `main`
2. Run `rush prep` - this will execute all necessary checks
3. If adding/modifying rules, run `rush regen-ruleindex` to update `docs/rules.md`
4. Run `rush change` and follow prompts to generate changelog entries
5. For significant changes, manually update `changelog.md`

### Adding New Linter Rules
1. Add rule to staging pipeline first (set to run only in staging)
2. Wait for at least 10 PRs to verify no false positives
3. Create release PR to move rule to production

## Coding Conventions

### TypeScript
- Target: ES2019
- Module: CommonJS
- Strict null checks enabled
- No implicit any
- Import helpers from tslib (set `noEmitHelpers: true`, `importHelpers: true`)

### Code Style
- **Prettier** configured as auto-formatter
  - No semicolons (`semi: false`)
  - Print width: 140 characters
- **ESLint** enforced - all projects must pass `rush lint` with `--max-warnings=0`
- Use existing libraries when possible
- Prefer clear, descriptive variable names

### Null Safety Pattern
**Important:** After calling `resolveRef()` in swagger-workspace.ts, always check `!source.value` since $ref resolution can return `{ file, value: undefined }` when the target doesn't exist.

Example:
```typescript
const source = workspace.resolveRef(ref)
if (!source.value) {
  // Handle undefined case
  return
}
// Safe to use source.value
```

### Rule Properties
When writing validation rules:
- Provide clear error messages
- Include documentation links
- Set appropriate severity (error/warning/info)
- Follow existing rule patterns in `packages/rulesets/src/`

## Testing

- Jest is used for testing
- Test files should be colocated with source files or in `__tests__` directories
- Coverage threshold: 80% for functions
- Native tests use `jest.native.config.js`
- Spectral tests use `jest.config.js`

## Common Tasks

### Running Locally from Source
See CONTRIBUTING.md section "How to run LintDiff locally from source"

### Setting Rule to Staging Only
See CONTRIBUTING.md section "How to set a Spectral rule to run only in staging"

### Regenerating Rules Documentation
```bash
rush regen-ruleindex
```
This updates `docs/rules.md` with the current rules index.

### Reproducing LintDiff Failures
Follow instructions in CONTRIBUTING.md under "How to locally reproduce a LintDiff failure"

## Important Files

- `rush.json` - Monorepo configuration
- `common/config/rush/command-line.json` - Custom Rush commands
- `docs/rules.md` - Generated index of all rules (regenerate with `rush regen-ruleindex`)
- `CONTRIBUTING.md` - Detailed contribution guidelines (41KB+)
- `changelog.md` - Project changelog

## Documentation

All rules should have documentation in `docs/` directory. When adding a new rule, create a corresponding `.md` file in `docs/` with:
- Rule description
- Examples of violations
- Examples of correct usage
- Links to relevant Azure API guidelines

## Dependencies

- Uses pnpm (v8.15.7) as package manager (configured in rush.json)
- Strict peer dependencies enabled
- Node.js >= 18.0.0 required (suppress LTS warning)

## Deployment

Changes merge to `main` deploy to staging LintDiff. For production deployment:
1. Create release PR with changelog
2. Tag release
3. Build and publish to npm
4. Verify deployment using CloudMine/Kusto queries

See CONTRIBUTING.md "How to deploy your changes" for detailed instructions.
