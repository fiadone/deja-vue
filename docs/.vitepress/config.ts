import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Déjà Vue",
  description: "Declarative GSAP Animations for Vue 3",
  appearance: 'dark',
  head: [['link', { rel: 'icon', href: '/icon.svg' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/components' }
    ],

    logo: '/icon.svg',

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Tween Component', link: '/guide/tween' },
          { text: 'Timeline Component', link: '/guide/timeline' },
          { text: 'Animation Controls', link: '/guide/controls' },
          { text: 'Nesting Animations', link: '/guide/nesting' }
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
