'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
  onPhoto?: () => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({ onSend, onPhoto, disabled, placeholder }: ChatInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [disabled])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || disabled) return
    onSend(text)
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/20 bg-black/40 backdrop-blur-sm px-4 py-3">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder ?? '궁금한 것을 물어보세요...'}
        disabled={disabled}
        className="flex-1 rounded-full bg-white/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/50 disabled:opacity-50 focus:ring-2 focus:ring-amber-400"
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onPhoto?.()}
        disabled={disabled}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>
    </form>
  )
}
