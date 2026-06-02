import { SplitText, Timeline, Tween } from 'deja-vue'
import DefaultTheme from 'vitepress/theme'
import type { App, Component } from 'vue'

import './demo.css'
import './style.css'

const demoComponents = import.meta.glob<{ default: Component }>(
  '../components/**/*.vue',
  { eager: true }
)

export default {
  extends: DefaultTheme,
  enhanceApp ({ app }: { app: App }) {
    app.component('SplitText', SplitText)
    app.component('Timeline', Timeline)
    app.component('Tween', Tween)

    for (const path in demoComponents) {
      const name = path.slice(path.lastIndexOf('/') + 1, -4)
      app.component(name, demoComponents[path].default)
    }
  }
}
