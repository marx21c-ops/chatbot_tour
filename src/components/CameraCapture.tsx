'use client'

import { useEffect, useRef } from 'react'

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const onCloseRef = useRef(onClose)
  const onCaptureRef = useRef(onCapture)
  onCloseRef.current = onClose
  onCaptureRef.current = onCapture

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        onCloseRef.current()
      }
    }
    start()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const capture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (blob) onCaptureRef.current(blob)
    }, 'image/jpeg', 0.8)
  }

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col">
      <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex justify-center gap-8 py-6 bg-black/60">
        <button
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"
        >
          취소
        </button>
        <button
          onClick={capture}
          className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>
        <div className="w-14" />
      </div>
    </div>
  )
}
