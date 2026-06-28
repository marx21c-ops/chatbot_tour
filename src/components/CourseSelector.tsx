'use client'

import Image from 'next/image'

export interface CourseOption {
  id: string
  locationId: string
  locationName: string
  name: string
  waypointCount: number
  image: string
}

interface CourseSelectorProps {
  courses: CourseOption[]
  onSelect: (courseId: string | null) => void
}

const locationColors: Record<string, string> = {
  bukchon: 'from-amber-600/80 to-amber-800/80',
  gyeongbokgung: 'from-blue-600/80 to-blue-800/80',
  insadong: 'from-rose-600/80 to-rose-800/80',
}

export default function CourseSelector({ courses, onSelect }: CourseSelectorProps) {
  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src="/trory.png"
          alt="Triptory"
          fill
          className="object-cover opacity-40"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black flex items-end pb-6 px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Triptory</h1>
            <p className="text-sm text-white/60">원하는 여행 코스를 선택하세요</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 space-y-3">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelect(course.id)}
            className="w-full text-left bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-colors border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${locationColors[course.locationId] ?? 'from-gray-500 to-gray-700'} flex items-center justify-center text-2xl flex-shrink-0`}>
                🗺️
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white/50">{course.locationName}</p>
                <p className="text-base font-semibold text-white truncate">{course.name}</p>
                <p className="text-xs text-white/40">웨이포인트 {course.waypointCount}개</p>
              </div>
            </div>
          </button>
        ))}

        <button
          onClick={() => onSelect(null)}
          className="w-full text-left bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition-colors border border-dashed border-white/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
              🎒
            </div>
            <div>
              <p className="text-base font-semibold text-white">자유 탐험</p>
              <p className="text-xs text-white/40">코스 없이 자유롭게 둘러보기</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
