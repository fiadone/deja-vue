import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/deja-vue/docs/',
  title: "Déjà Vue",
  description: "Declarative GSAP Animations for Vue 3",
  appearance: 'dark',
  head: [['link', { rel: 'icon', href: '/icon.svg' }]],
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Concepts', link: '/guide/concepts' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/components' }
    ],

    logo: '/icon.svg',

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Core concepts', link: '/guide/concepts' },
          { text: 'Animation targets', link: '/guide/targeting' },
          { text: 'Tween Component', link: '/guide/tween' },
          { text: 'Timeline Component', link: '/guide/timeline' },
          { text: 'Animation Controls', link: '/guide/controls' },
          { text: 'Nesting Animations', link: '/guide/nesting' },
          { text: 'Split text', link: '/guide/split-text' },
          { text: 'Upgrading', link: '/guide/migration' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Components', link: '/api/components' },
          { text: 'Composables', link: '/api/composables' },
          { text: 'Types', link: '/api/types' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fiadone/deja-vue' }
    ],

    search: {
      provider: 'local'
    }
  }
})
