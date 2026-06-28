'use client'

import type { Location } from '@/lib/types'
import type { TourCourse } from '@/data/courses'

interface LocationSheetProps {
  locations: Location[]
  activeId: string
  courses: TourCourse[]
  activeCourseId: string | null
  onSelectLocation: (id: string) => void
  onSelectCourse: (id: string | null) => void
  onClose: () => void
  mode: 'location' | 'course'
}

const locationColors: Record<string, string> = {
  bukchon: 'from-amber-500/80 to-amber-700/80',
  gyeongbokgung: 'from-blue-500/80 to-blue-700/80',
  insadong: 'from-rose-500/80 to-rose-700/80',
}

export default function LocationSheet({ locations, activeId, courses, activeCourseId, onSelectLocation, onSelectCourse, onClose, mode }: LocationSheetProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-t-3xl px-6 pt-6 pb-8 max-h-[70vh] overflow-y-auto">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {mode === 'location' && (
          <>
            <h2 className="text-white font-semibold text-sm mb-3">📍 장소 선택</h2>
            <div className="space-y-2">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => { onSelectLocation(loc.id); onClose() }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeId === loc.id ? 'bg-white/20 border border-white/30' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${locationColors[loc.id] ?? 'from-gray-500 to-gray-700'} flex items-center justify-center text-sm flex-shrink-0`}>
                    🏛️
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{loc.name}</p>
                    <p className="text-xs text-white/40">{loc.address}</p>
                  </div>
                  {activeId === loc.id && <span className="ml-auto text-xs text-amber-400">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'course' && (
          <>
            <h2 className="text-white font-semibold text-sm mb-3">🗺️ 코스 선택</h2>
            <div className="space-y-2">
              {courses.map((c) => {
                const loc = locations.find(l => l.id === c.locationId)
                return (
                  <button
                    key={c.id}
                    onClick={() => { onSelectCourse(c.id); onClose() }}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeCourseId === c.id ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${locationColors[c.locationId] ?? 'from-gray-500 to-gray-700'} flex items-center justify-center text-sm flex-shrink-0`}>
                      🗺️
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-white/40">{loc?.name ?? c.locationId} · 웨이포인트 {c.waypoints.length}개</p>
                    </div>
                    {activeCourseId === c.id && <span className="ml-auto text-xs text-amber-400">✓</span>}
                  </button>
                )
              })}
              <button
                onClick={() => { onSelectCourse(null); onClose() }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  !activeCourseId ? 'bg-white/20 border border-white/30' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                  🎒
                </div>
                <div>
                  <p className="text-sm font-medium text-white">자유 탐험</p>
                  <p className="text-xs text-white/40">코스 없이 자유롭게 둘러보기</p>
                </div>
                {!activeCourseId && <span className="ml-auto text-xs text-amber-400">✓</span>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
