const path = require("node:path");

/**
 * Roda o ESLint de cada subprojeto (backend/frontend) apenas contra os
 * arquivos staged, respeitando o eslint.config.mjs local de cada um.
 */
const scoped = (subdir) => (files) => {
  const root = path.join(process.cwd(), subdir);
  const relative = files
    .map((f) => path.relative(root, f))
    .map((f) => JSON.stringify(f))
    .join(" ");

  if (!relative) return [];

  // --fix conserta o que dá automaticamente; sem --max-warnings=0
  // pra warnings não bloquearem o commit (erros de verdade ainda bloqueiam).
  return [
    `bash -c "cd ${subdir} && npx --no-install eslint --fix ${relative}"`,
  ];
};

module.exports = {
  "backend/**/*.ts": scoped("backend"),
  "frontend/**/*.{ts,tsx,js,jsx,mjs}": scoped("frontend"),
};
