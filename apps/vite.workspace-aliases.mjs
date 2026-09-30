import path from "path";
import { fileURLToPath } from "url";

const packagesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../packages",
);

export const qlpPackages = [
  "api-client",
  "components",
  "contexts",
  "curriculum",
  "datatable-builder",
  "form-builder",
  "hooks",
  "lib",
  "ui",
];

export function qlpWorkspaceAliases() {
  return qlpPackages.map((pkg) => ({
    find: `@qlp/${pkg}`,
    replacement: path.join(packagesRoot, pkg, "src"),
  }));
}
