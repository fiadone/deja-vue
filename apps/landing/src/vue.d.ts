import 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $touch: boolean
  }
}

export {}
