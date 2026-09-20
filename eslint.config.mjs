import next from 'eslint-config-next/core-web-vitals'

/* eslint-config-next 16 ships a flat config, so it is spread directly.
   Routing it through FlatCompat validated a flat config as eslintrc and
   threw on the plugin graph's circular references. */
const config = [
  { ignores: ['.next/**', 'next-env.d.ts', 'drizzle/**'] },
  ...next,
]

export default config
