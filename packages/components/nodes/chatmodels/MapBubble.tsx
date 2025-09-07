export default function MapBubble({ url, title }: { url: string; title?: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="underline">
      📍 {title || 'Open in Google Maps'}
    </a>
  )
}
