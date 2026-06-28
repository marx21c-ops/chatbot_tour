'use client'

interface QuickReplyChipsProps {
  items: string[]
  onSelect: (text: string) => void
}

export default function QuickReplyChips({ items, onSelect }: QuickReplyChipsProps) {
  if (items.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-1 mb-2 mx-1">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(item)}
          className="flex-shrink-0 px-3.5 py-2 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors whitespace-nowrap"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
