import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Deja Vue",
  description: "A declarative component-based GSAP library for Vue 3",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/api' }
    ],

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
    ]
  }
})
