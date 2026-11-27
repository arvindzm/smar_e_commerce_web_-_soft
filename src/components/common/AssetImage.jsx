import { resolveImage } from '../../utils/assets'
import ImagePlaceholder from './ImagePlaceholder'

// Shows an image from src/assets (or a URL). Until the file exists it shows a
// placeholder labelled with the exact file path to add, so it is easy to replace.
export default function AssetImage({ src, alt, className, imgClassName = 'object-contain', compact = false }) {
  const url = resolveImage(src)

  if (!url) {
    return <ImagePlaceholder label={src || alt} className={className} compact={compact} />
  }

  return <img src={url} alt={alt} loading="lazy" decoding="async" className={`${className} ${imgClassName}`} />
}
