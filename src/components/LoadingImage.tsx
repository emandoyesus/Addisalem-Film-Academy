import { useEffect, useRef, useState, type ComponentProps } from 'react'

/* <img> with a shimmering placeholder until the bytes arrive. On slow or
   unstable connections a full-size photo can take seconds, so the reserved box
   shows a moving skeleton instead of empty black. The class is dropped the
   moment the image paints (or errors), keeping transparency and letterboxing
   clean. Use it anywhere an image is lazy-loaded. */
export function LoadingImage({
  className = '',
  onLoad,
  onError,
  ...props
}: ComponentProps<'img'>) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  /* Cached images can finish before React attaches onLoad; catch that case. */
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <img
      {...props}
      ref={ref}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      onError={(event) => {
        setLoaded(true)
        onError?.(event)
      }}
      className={`${className}${loaded ? '' : ' media-skeleton'}`}
    />
  )
}
