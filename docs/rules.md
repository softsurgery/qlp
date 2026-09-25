# Component conventions

Follow these when adding or changing shared UI in `@qlp/components`.

## Feature folders

Put a reusable feature in its own directory under `packages/components/src/shared/`. Keep the component, helpers, and i18n together.

## i18n

- Colocate locales with the feature: `i18n/locales/en.json` and `ar.json`.
- Use a dedicated namespace named after the feature.
- Pass the namespace string directly. Do not wrap it in a constant.

```tsx
// ❌ BAD
export const FEATURE_I18N_NS = "feature";
const { t } = useTranslation(FEATURE_I18N_NS);

// ✅ GOOD
const { t } = useTranslation("feature");
```

Register the feature resources in each app that uses it (`apps/web`, `apps/admin`) under that same namespace string.
