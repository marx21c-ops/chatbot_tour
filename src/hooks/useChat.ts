'use client'

import { useState, useCallback, useRef } from 'react'
import type { ChatMessage, Location, DocentIntro, QASet } from '@/lib/types'
import { findBestAnswer } from '@/lib/matcher'

interface UseChatOptions {
  location: Location
  intro: DocentIntro
  qaSet: QASet[]
  allQASets?: QASet[]
}

export function useChat({ location, intro, qaSet, allQASets }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial: ChatMessage = {
      id: 'intro-' + Date.now(),
      role: 'bot',
      text: `${intro.greeting}\n\n${intro.intro}`,
      timestamp: Date.now(),
      type: 'text',
      quickReplies: intro.quickReplies,
    }
    return [initial]
  })
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const sendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text,
      timestamp: Date.now(),
      type: 'text',
    }
    addMessage(userMsg)

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
      } else {
        botMsg = {
          id: 'bot-' + Date.now(),
          role: 'bot',
          text: `아직 그 질문에 대해 잘 배우지 못했어요.\n\n이런 질문은 어떠세요?`,
          timestamp: Date.now(),
          type: 'error',
          quickReplies: intro.quickReplies,
        }
      }
      addMessage(botMsg)
      setIsTyping(false)
    }, 600)
  }, [addMessage, location.id, qaSet, allQASets, intro])

  return { messages, isTyping, sendMessage }
}

function getRandomQuickReplies(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
