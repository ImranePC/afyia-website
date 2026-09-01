import { ScullyConfig } from '@scullyio/scully';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'afyia-website',
  distFolder: 'dist/afyia-website/browser',
  outDir: './dist/static',
  defaultPostRenderers: [],
  routes: {
    '/:lang': {
      type: 'default',
      lang: { values: ['fr', 'en'] }
    },
    '/:lang/contact': {
      type: 'default',
      lang: { values: ['fr', 'en'] }
    }
  },
  extraRoutes: ['/contact', '/about', '/news', '/software', '/biotechnology', '/industrial-process', '/human-health', '/legal-mentions', '/news/:id', '/products', 'products/:id', '/product/:id']
};
