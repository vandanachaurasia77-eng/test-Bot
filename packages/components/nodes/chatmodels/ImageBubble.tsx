export default function ImageBubble({ imageUrl, caption }: { imageUrl: string; caption?: string }) {
  return (
    <div className="space-y-2">
      <img src={imageUrl} alt={caption || 'image'} className="max-w-xs rounded" />
      {caption ? <div className="text-sm opacity-80">{caption}</div> : null}
    </div>
  )
}
