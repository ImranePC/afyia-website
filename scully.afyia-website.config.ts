import { ScullyConfig } from '@scullyio/scully';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'afyia-website',
  distFolder: 'dist/afyia-website/browser',
  outDir: './dist/static',
  defaultPostRenderers: [],
  routes: {},
  extraRoutes: ['/contact', '/legal-mentions', '/about']
};
