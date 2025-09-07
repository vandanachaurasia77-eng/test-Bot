import React from 'react'

export default function QuickReplies({ text, choices, onSelect }: {
  text: string; choices: string[]; onSelect: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <div>{text}</div>
      <div className="flex flex-wrap gap-2">
        {choices.map(c => (
          <button key={c}
            onClick={() => onSelect(c)}
            className="px-3 py-1 rounded-full border">
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
