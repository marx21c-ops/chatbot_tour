'use client'

import { useState, useEffect, useRef } from 'react'
import type { Waypoint } from '@/data/courses'

function haversineDist(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000
}

export function useNavigation(waypoints: Waypoint[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [distance, setDistance] = useState<number | null>(null)
  const [bearing, setBearing] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const watchId = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive || waypoints.length === 0) return

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const target = waypoints[currentIndex]
        if (!target) return

        const dist = haversineDist(lat, lng, target.lat, target.lng)
        setDistance(Math.round(dist))

        if (dist < 10) {
          setCurrentIndex((i) => Math.min(i + 1, waypoints.length - 1))
        }

        const dLng = ((target.lng - lng) * Math.PI) / 180
        const y = Math.sin(dLng) * Math.cos((target.lat * Math.PI) / 180)
        const x =
          Math.cos((lat * Math.PI) / 180) * Math.sin((target.lat * Math.PI) / 180) -
          Math.sin((lat * Math.PI) / 180) * Math.cos((target.lat * Math.PI) / 180) * Math.cos(dLng)
        setBearing(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360)
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    )

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
    }
  }, [isActive, waypoints, currentIndex])

  const start = () => {
    setCurrentIndex(0)
    setIsActive(true)
  }

  const stop = () => {
    setIsActive(false)
    setCurrentIndex(0)
    setDistance(null)
    setBearing(null)
  }

  const current = waypoints[currentIndex] ?? null
  const isFinished = isActive && currentIndex >= waypoints.length - 1 && distance !== null && distance < 10

  return { current, currentIndex, total: waypoints.length, distance, bearing, isActive, isFinished, start, stop }
}
