'use client'

import { useEffect, useRef } from 'react'

export default function CameraBackground({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        // 카메라 권한이 없거나 오류 발생 시 아무것도 하지 않음 (기존 배경 유지)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
