import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  shortcuts: {
    'button-icon': 'p-2 rounded-2 bg-background border border-current/10 [&>svg]:size-6 [&>svg]:md:size-5',
    'label': 'tracking-wide pt-0.125em'
  },
  theme: {
    colors: {
      background: '#0f0f11',
      foreground: '#17161a',
      primary: '#74c34c',
      secondary: '#ae84ae'
    }
  }
})
