import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  appearance: 'dark',
  base: '/deja-vue/docs/',
  cleanUrls: true,
  description: 'Declarative GSAP Animations for Vue 3',
  head: [['link', { href: '/deja-vue/docs/icon.svg', rel: 'icon' }]],
  themeConfig: {
    logo: '/icon.svg',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { link: '/', text: 'Home' },
      { link: '/guide/concepts', text: 'Concepts' },
      { link: '/guide/getting-started', text: 'Guide' },
      { link: '/api/components', text: 'API' }
    ],

    search: {
      provider: 'local'
    },

    sidebar: [
      {
        items: [
          { link: '/guide/getting-started', text: 'Getting Started' },
          { link: '/guide/concepts', text: 'Core concepts' },
          { link: '/guide/targeting', text: 'Animation targets' },
          { link: '/guide/tween', text: 'Tween Component' },
          { link: '/guide/timeline', text: 'Timeline Component' },
          { link: '/guide/controls', text: 'Animation Controls' },
          { link: '/guide/nesting', text: 'Nesting Animations' },
          { link: '/guide/split-text', text: 'Split text' },
          { link: '/guide/migration', text: 'Upgrading' },
          { link: '/guide/troubleshooting', text: 'Troubleshooting' }
        ],
        text: 'Guide'
      },
      {
        items: [
          { link: '/api/components', text: 'Components' },
          { link: '/api/composables', text: 'Composables' },
          { link: '/api/types', text: 'Types' }
        ],
        text: 'API Reference'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fiadone/deja-vue' }
    ]
  },
  title: 'Déjà Vue',
  titleTemplate: 'Declarative GSAP Animations for Vue 3'
})
