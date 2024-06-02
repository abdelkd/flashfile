/** @type {import('prettier').Config} */
const prettierConfig = {
  experimentalTernaries: true,
  singleQuote: true,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
};

export default prettierConfig;
