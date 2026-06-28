'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Location, DocentIntro, QASet, ChatMessage } from '@/lib/types'
import { findBestAnswer } from '@/lib/matcher'
import QuickReplyChips from './QuickReplyChips'
import ChatInput from './ChatInput'
import CameraBackground from '@/components/CameraBackground'

interface ChatContainerProps {
  location: Location
  intro: DocentIntro
  qaSet: QASet[]
  allQASets?: QASet[]
}

type CharacterEmotion = 'greeting' | 'listening' | 'speaking' | 'thinking' | 'error'

export default function ChatContainer({ location, intro, qaSet, allQASets }: ChatContainerProps) {
  const [currentMessage, setCurrentMessage] = useState<ChatMessage>({
    id: 'intro',
    role: 'bot',
    text: `${intro.greeting}\n\n${intro.intro}`,
    timestamp: Date.now(),
    type: 'text',
    quickReplies: intro.quickReplies,
  })
  const [isTyping, setIsTyping] = useState(false)
  const [emotion, setEmotion] = useState<CharacterEmotion>('greeting')
  const [, setHistory] = useState<ChatMessage[]>([])
  const [displayedText, setDisplayedText] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const fullTextRef = useRef(currentMessage.text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isTyping) return
    const text = currentMessage.text
    fullTextRef.current = text
    setDisplayedText('')
    setShowQuickReplies(false)

    let index = 0
    intervalRef.current = setInterval(() => {
      index++
      setDisplayedText(text.slice(0, index))
      if (index >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setShowQuickReplies(true)
      }
    }, 40)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentMessage.text, isTyping])

  const sendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text,
      timestamp: Date.now(),
      type: 'text',
    }
    setHistory(prev => [...prev, currentMessage, userMsg])
    setEmotion('thinking')
    setIsTyping(true)

    setTimeout(() => {
      const pool = allQASets ?? qaSet
      const matched = findBestAnswer(text, location.id, pool)

      let botMsg: ChatMessage
      if (matched) {
        botMsg = {
          id: 'bot-' + Date.now(),
          role: 'bot',
          text: matched.answer,
          imageUrl: matched.imageUrl,
          timestamp: Date.now(),
          type: 'text',
          quickReplies: getRandomQuickReplies(intro.quickReplies, 2),
        }
        setEmotion('speaking')
      } else {
        botMsg = {
          id: 'bot-' + Date.now(),
          role: 'bot',
          text: `아직 그 질문에 대해 잘 배우지 못했어요.\n\n이런 질문은 어떠세요?`,
          timestamp: Date.now(),
          type: 'error',
          quickReplies: intro.quickReplies,
        }
        setEmotion('error')
      }
      setCurrentMessage(botMsg)
      setIsTyping(false)
    }, 700)
  }

  return (
    <CameraBackground>
      <header className="px-5 pt-5 pb-1">
        <h1 className="text-lg font-bold text-white drop-shadow-sm">Triptory</h1>
        <p className="text-xs text-white/70">AI 도슨트와 떠나는 여행</p>
      </header>

      <div className="flex-1 flex flex-col items-stretch px-0 pt-8 overflow-y-auto min-h-0">
        {isTyping ? (
          <div className="px-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-sm">
              <div className="flex gap-1.5 justify-center">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="px-0 mb-8">
            <div className="bg-white/95 backdrop-blur-sm px-6 py-5 shadow-sm w-full">
              {currentMessage.imageUrl && (
                <div className="mb-3 rounded-xl overflow-hidden bg-amber-50/80 h-36 flex items-center justify-center text-sm text-amber-600 border border-amber-200">
                  🖼️ {location.name} 이미지
                </div>
              )}
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {displayedText.length < fullTextRef.current.length && (
                  <span className="inline-block w-0.5 h-4 bg-amber-500 animate-pulse ml-0.5 align-middle" />
                )}
              </p>
            </div>
            {showQuickReplies && currentMessage.quickReplies && currentMessage.quickReplies.length > 0 && (
              <div className="mt-3 px-6">
                <p className="text-[11px] text-white/60 mb-2 text-center">이런 것도 궁금하세요?</p>
                <QuickReplyChips items={currentMessage.quickReplies} onSelect={sendMessage} />
              </div>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-end px-6 pb-4">
          <DocentCharacter emotion={emotion} />
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </CameraBackground>
  )
}

function DocentCharacter({ emotion }: { emotion: CharacterEmotion }) {
  const label = getCharacterLabel(emotion)
  const labelColor = getCharacterLabelColor(emotion)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Image
          src="/trory.png"
          alt="Triptory 도슨트"
          width={240}
          height={240}
          className="object-contain drop-shadow-lg"
          priority
          unoptimized
        />
        {emotion === 'thinking' && (
          <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
            💭
          </div>
        )}
      </div>
      <p className={`text-sm font-medium drop-shadow-sm ${labelColor}`}>
        {label}
      </p>
    </div>
  )
}

function getCharacterLabel(emotion: CharacterEmotion) {
  switch (emotion) {
    case 'greeting': return '도슨트가 환영합니다!'
    case 'listening': return '듣고 있어요...'
    case 'speaking': return '도슨트가 설명 중'
    case 'thinking': return '생각하고 있어요...'
    case 'error': return '아직 배우지 못했어요'
  }
}

function getCharacterLabelColor(emotion: CharacterEmotion) {
  switch (emotion) {
    case 'greeting': return 'text-amber-200'
    case 'listening': return 'text-sky-200'
    case 'speaking': return 'text-amber-200'
    case 'thinking': return 'text-purple-200'
    case 'error': return 'text-orange-200'
  }
}

function getRandomQuickReplies(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
