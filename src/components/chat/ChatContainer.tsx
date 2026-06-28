'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import type { Location, ChatMessage, LocationData } from '@/lib/types'
import { findBestAnswer } from '@/lib/matcher'
import { analyzeImage } from '@/lib/vision'
import QuickReplyChips from './QuickReplyChips'
import ChatInput from './ChatInput'
import CameraBackground from '@/components/CameraBackground'
import CameraCapture from '@/components/CameraCapture'
import LocationSheet from '@/components/LocationSheet'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useNavigation } from '@/hooks/useNavigation'
import { courses } from '@/data/courses'

interface ChatContainerProps {
  locations: Location[]
  locationDataMap: Record<string, LocationData>
  defaultData: LocationData
}

type CharacterEmotion = 'greeting' | 'listening' | 'speaking' | 'thinking' | 'error'

export default function ChatContainer({ locations, locationDataMap, defaultData }: ChatContainerProps) {
  const { closestLocation } = useGeolocation(locations)
  const activeId = closestLocation?.id ?? defaultData.location.id
  const allQASets = useMemo(() => Object.values(locationDataMap).flatMap(d => d.qaSet), [locationDataMap])

  const [currentMessage, setCurrentMessage] = useState<ChatMessage>(() => ({
    id: 'intro',
    role: 'bot',
    text: `${defaultData.intro.greeting}\n\n${defaultData.intro.intro}`,
    timestamp: Date.now(),
    type: 'text',
    quickReplies: defaultData.intro.quickReplies,
  }))
  const [isTyping, setIsTyping] = useState(false)
  const [emotion, setEmotion] = useState<CharacterEmotion>('greeting')
  const [, setHistory] = useState<ChatMessage[]>([])
  const [displayedText, setDisplayedText] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [navCourseId, setNavCourseId] = useState<string | null>(null)
  const [manualLocationId, setManualLocationId] = useState<string | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [sheetMode, setSheetMode] = useState<'location' | 'course'>('location')
  const fullTextRef = useRef(currentMessage.text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textScrollRef = useRef<HTMLParagraphElement>(null)

  const resolvedLocationId = manualLocationId ?? activeId
  const resolvedActive = locationDataMap[resolvedLocationId] ?? defaultData
  const { location: activeLoc, intro: activeIntro, qaSet: activeQaSet } = resolvedActive

  const handleSelectLocation = (id: string) => {
    setManualLocationId(id)
    setNavCourseId(null)
    const data = locationDataMap[id]
    if (data) {
      const msg: ChatMessage = {
        id: 'loc-' + Date.now(),
        role: 'bot',
        text: `📍 **${data.location.name}**(으)로 이동했어요!\n\n${data.intro.greeting}\n\n${data.intro.intro}`,
        timestamp: Date.now(),
        type: 'locationChange',
        quickReplies: data.intro.quickReplies,
      }
      setCurrentMessage(msg)
      setEmotion('greeting')
    }
  }

  const handleSelectCourse = (courseId: string | null) => {
    setNavCourseId(courseId)
    if (courseId) {
      const c = courses.find(co => co.id === courseId)
      if (c) setManualLocationId(c.locationId)
    }
  }

  useEffect(() => {
    if (!navCourseId) return
    const c = courses.find(co => co.id === navCourseId)
    if (!c) return
    const data = locationDataMap[c.locationId]
    if (!data) return
    nav.start()
    const msg: ChatMessage = {
      id: 'course-start',
      role: 'bot',
      text: `🗺️ **${data.location.name}** 코스를 선택하셨습니다.\n\n${data.intro.greeting}\n\n${data.intro.intro}\n\n첫 번째 목적지로 안내할게요!`,
      timestamp: Date.now(),
      type: 'text',
      quickReplies: data.intro.quickReplies,
    }
    setCurrentMessage(msg)
    setEmotion('greeting')
  }, [navCourseId])

  useEffect(() => {
    document.addEventListener('touchstart', unlockAudio, { once: true })
    document.addEventListener('click', unlockAudio, { once: true })
    return () => {
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('click', unlockAudio)
    }
  }, [])

  const course = courses.find(c => c.locationId === resolvedLocationId && c.id === navCourseId)
  const nav = useNavigation(course?.waypoints ?? [])

  useEffect(() => {
    if (manualLocationId) return
    if (closestLocation && closestLocation.id !== defaultData.location.id) {
      const data = locationDataMap[closestLocation.id]
      if (data && closestLocation.id !== activeId) {
        const msg: ChatMessage = {
          id: 'loc-' + Date.now(),
          role: 'bot',
          text: `📍 ${data.location.name} 근처에 오셨네요!\n\n${data.intro.greeting}\n\n${data.intro.intro}`,
          timestamp: Date.now(),
          type: 'locationChange',
          quickReplies: data.intro.quickReplies,
        }
        setCurrentMessage(msg)
        setEmotion('greeting')
      }
    }
  }, [closestLocation?.id])

  useEffect(() => {
    if (!nav.isActive || !nav.current) return
    const wp = nav.current
    let txt = `🚶 다음: ${wp.name} (${nav.distance ?? '?'}m)\n${wp.description}`
    if (nav.isFinished) {
      txt = '🎉 코스가 완료되었습니다! 수고하셨어요.'
      setNavCourseId(null)
      nav.stop()
    }
    const msg: ChatMessage = {
      id: 'nav-' + Date.now(),
      role: 'bot',
      text: txt,
      timestamp: Date.now(),
      type: 'text',
    }
    setCurrentMessage(msg)
    setEmotion('speaking')
  }, [nav.currentIndex, nav.distance])

  const audioUnlockedRef = useRef(false)
  const audioQueueRef = useRef<string | null>(null)

  function stripTTS(text: string) {
    return text
      .replace(/[\u2700-\u27BF]|[\u{1F000}-\u{1FFFF}]|[\u{FE00}-\u{FEFF}]/gu, '')
      .replace(/[*_#]/g, '')
      .replace(/\s+/g, ' ').trim()
  }

  function speakText(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (!audioUnlockedRef.current) {
      audioQueueRef.current = text
      return
    }
    window.speechSynthesis.cancel()
    const clean = stripTTS(text)
    if (!clean) return
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.85
    utterance.pitch = 1.0
    utterance.volume = 1.0
    const voices = window.speechSynthesis.getVoices()
    const kor = voices.find(v =>
      v.lang.startsWith('ko') && /natural|premium|enhanced|google|microsoft/i.test(v.name)
    ) ?? voices.find(v => v.lang.startsWith('ko'))
    if (kor) utterance.voice = kor
    window.speechSynthesis.speak(utterance)
  }

  function unlockAudio() {
    if (audioUnlockedRef.current) return
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    audioUnlockedRef.current = true
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctx.resume()
      ctx.close()
    } catch {}
    const silent = new SpeechSynthesisUtterance('')
    silent.volume = 0
    window.speechSynthesis.speak(silent)
    window.speechSynthesis.cancel()
    if (audioQueueRef.current) {
      speakText(audioQueueRef.current)
      audioQueueRef.current = null
    }
  }

  useEffect(() => {
    if (isTyping) return
    const text = currentMessage.text.replace(/\n+/g, ' ')
    fullTextRef.current = text
    setDisplayedText('')
    setShowQuickReplies(true)
    speakText(text)

    let index = 0
    intervalRef.current = setInterval(() => {
      index++
      setDisplayedText(text.slice(0, index))
      if (textScrollRef.current) {
        textScrollRef.current.scrollLeft = textScrollRef.current.scrollWidth
      }
      if (index >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setShowQuickReplies(true)
      }
    }, 40)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      window.speechSynthesis.cancel()
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
      const pool = allQASets ?? activeQaSet
      const matched = findBestAnswer(text, activeLoc.id, pool)
      let botMsg: ChatMessage
      if (matched) {
        botMsg = {
          id: 'bot-' + Date.now(),
          role: 'bot',
          text: matched.answer,
          imageUrl: matched.imageUrl,
          timestamp: Date.now(),
          type: 'text',
          quickReplies: getRandomQuickReplies(activeIntro.quickReplies, 2),
        }
        setEmotion('speaking')
      } else {
        botMsg = {
          id: 'bot-' + Date.now(),
          role: 'bot',
          text: `아직 그 질문에 대해 잘 배우지 못했어요.\n\n이런 질문은 어떠세요?`,
          timestamp: Date.now(),
          type: 'error',
          quickReplies: activeIntro.quickReplies,
        }
        setEmotion('error')
      }
      setCurrentMessage(botMsg)
      setIsTyping(false)
    }, 700)
  }

  const handlePhoto = async (blob: Blob) => {
    setIsTyping(true)
    setEmotion('thinking')
    const result = await analyzeImage(blob, activeLoc.name)
    const botMsg: ChatMessage = {
      id: 'vision-' + Date.now(),
      role: 'bot',
      text: result,
      timestamp: Date.now(),
      type: 'text',
      quickReplies: activeIntro.quickReplies,
    }
    setCurrentMessage(botMsg)
    setEmotion('speaking')
    setIsTyping(false)
  }

  return (
    <CameraBackground>
      <header className="px-5 pt-5 pb-1 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white drop-shadow-sm">Triptory</h1>
          <p className="text-xs text-white/70">AI 도슨트와 떠나는 여행</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => { setSheetMode('location'); setShowSheet(true) }} className="text-xs text-white/60 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm transition-colors whitespace-nowrap">
            📍 {manualLocationId || (closestLocation && closestLocation.id !== defaultData.location.id) ? activeLoc.name : '현재위치'}
          </button>
          {nav.isActive ? (
            <button onClick={() => { nav.stop(); setNavCourseId(null) }} className="text-xs text-white bg-red-500/80 hover:bg-red-500 px-2.5 py-1 rounded-full backdrop-blur-sm transition-colors whitespace-nowrap">
              ⏹ 코스 종료
            </button>
          ) : (
            <button onClick={() => { setSheetMode('course'); setShowSheet(true) }} className="text-xs text-white bg-amber-500/80 hover:bg-amber-500 px-2.5 py-1 rounded-full backdrop-blur-sm transition-colors whitespace-nowrap">
              🗺️ 코스 선택
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-end overflow-y-auto min-h-0 gap-2 px-4 pb-2">
        <div className="self-end mr-6">
          <DocentCharacter emotion={emotion} />
        </div>

        {isTyping ? (
          <div className="w-full bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-sm">
            <div className="flex gap-1.5 justify-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-sm">
              <p ref={textScrollRef} className="text-sm text-zinc-700 whitespace-nowrap overflow-x-auto scrollbar-hide">
                {displayedText}
                {displayedText.length < fullTextRef.current.length && (
                  <span className="inline-block w-0.5 h-4 bg-amber-500 animate-pulse ml-0.5 align-middle" />
                )}
              </p>
            </div>
            {showQuickReplies && currentMessage.quickReplies && currentMessage.quickReplies.length > 0 && (
              <div className="w-full">
                <p className="text-[11px] text-white/60 mb-1 text-center">이런 것도 궁금하세요?</p>
                <QuickReplyChips items={currentMessage.quickReplies} onSelect={sendMessage} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex-shrink-0">
        <ChatInput onSend={sendMessage} onPhoto={() => setShowCamera(true)} disabled={isTyping} />
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={(blob) => { handlePhoto(blob); setShowCamera(false) }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showSheet && (
        <LocationSheet
          locations={locations}
          activeId={resolvedLocationId}
          courses={courses}
          activeCourseId={navCourseId}
          onSelectLocation={handleSelectLocation}
          onSelectCourse={handleSelectCourse}
          onClose={() => setShowSheet(false)}
          mode={sheetMode}
        />
      )}
    </CameraBackground>
  )
}

function DocentCharacter({ emotion }: { emotion: CharacterEmotion }) {
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
    </div>
  )
}

function getCharacterLabel(_emotion: CharacterEmotion) {
  return ''
}

function getRandomQuickReplies(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
