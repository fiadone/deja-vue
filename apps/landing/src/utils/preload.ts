export type PreloadableAsset = (
  | { type: 'image', source: string }
  | { type: 'font', source: string, family: string, options?: FontFaceDescriptors }
)

export function preloadAsset (asset: PreloadableAsset) {
  switch (asset.type) {
    case 'font':
      return preloadFont(asset.family, asset.source, asset.options)
    case 'image':
      return preloadImage(asset.source)
    default:
      return Promise.resolve(null)
  }
}

export async function preloadFont (family: string, source: string, options?: FontFaceDescriptors): Promise<[string, FontFace | null]> {
  const format = source.slice(source.lastIndexOf('.') + 1)
  const font = new FontFace(family, `url(${source}) format("${format}")`, {
    display: 'swap',
    style: 'normal',
    weight: '400',
    ...options
  })

  try {
    await font.load()
    document.fonts.add(font)
    return [source, font]
  } catch (error) {
    console.warn(error)
    return [source, null]
  } 
}

export function preloadImage (source: string): Promise<[string, HTMLImageElement | null]> {
  const image = new Image()
  return new Promise(resolve => {
    image.onload = () => resolve([source, image])
    image.onerror = error => {
      console.warn(error)
      return [source, null]
    }
    image.src = source
  })
}

export async function preloadManifest (manifest: PreloadableAsset[]) {
  const assets = (await Promise.all(manifest.map(preloadAsset))).filter(asset => !!asset)
  return Object.fromEntries(assets)
}
