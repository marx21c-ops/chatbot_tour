'use client'

import type { ChatMessage } from '@/lib/types'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.role === 'bot'
  const isError = message.type === 'error'
  const isLocationChange = message.type === 'locationChange'

  if (isLocationChange) {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-zinc-100 text-zinc-600 text-xs px-4 py-1.5 rounded-full">
          📍 {message.text}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div className="flex gap-2 max-w-[85%] sm:max-w-[75%]">
        {isBot && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm mt-1">
            🏛️
          </div>
        )}
        <div>
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              isBot
                ? isError
                  ? 'bg-orange-50 border border-orange-200 text-zinc-700'
                  : 'bg-zinc-50 border border-zinc-200 text-zinc-800'
                : 'bg-amber-500 text-white'
            }`}
          >
            {message.text}
            {message.imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden bg-zinc-200 h-32 w-full flex items-center justify-center text-xs text-zinc-400">
                🖼️ 이미지
              </div>
            )}
          </div>
          {isBot && !isError && (
            <div className="text-[10px] text-zinc-400 mt-1 ml-1">
              Triptory 도슨트
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
