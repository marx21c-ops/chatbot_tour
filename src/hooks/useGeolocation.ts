'use client'

import { useState, useEffect, useRef } from 'react'
import type { Location } from '@/lib/types'

const PROXIMITY_THRESHOLD = 0.005

function haversineDist(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useGeolocation(locations: Location[]) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([])
  const [closestLocation, setClosestLocation] = useState<Location | null>(null)
  const watchId = useRef<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setUserPos({ lat, lng })

        const near = locations.filter((loc) => haversineDist(lat, lng, loc.lat, loc.lng) < PROXIMITY_THRESHOLD)
        setNearbyLocations(near)

        if (near.length > 0) {
          setClosestLocation(near[0])
        } else {
          const sorted = [...locations].sort(
            (a, b) =>
              haversineDist(lat, lng, a.lat, a.lng) - haversineDist(lat, lng, b.lat, b.lng),
          )
          setClosestLocation(sorted[0] ?? null)
        }
      },
      (err) => console.warn('GPS error:', err.message),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 },
    )

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
    }
  }, [locations])

  return { userPos, nearbyLocations, closestLocation }
}
