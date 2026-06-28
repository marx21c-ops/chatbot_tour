export interface Waypoint {
  id: string
  name: string
  lat: number
  lng: number
  description: string
  imageUrl?: string
}

export interface TourCourse {
  id: string
  locationId: string
  name: string
  waypoints: Waypoint[]
}

export const courses: TourCourse[] = [
  {
    id: 'bukchon_course_1',
    locationId: 'bukchon',
    name: '북촌 1코스 (약 1시간 30분)',
    waypoints: [
      {
        id: 'wp_1',
        name: '북촌문화센터',
        lat: 37.5835,
        lng: 126.9855,
        description: '한옥 내부를 볼 수 있는 무료 전시관입니다. 과거 가옥의 내부 구조가 그대로 보존되어 있어요.',
      },
      {
        id: 'wp_2',
        name: '가회동 31번지 일대',
        lat: 37.5828,
        lng: 126.9868,
        description: '사진 명소로 유명한 한옥 골목입니다. 골목골목 숨은 풍경을 발견해보세요.',
      },
      {
        id: 'wp_3',
        name: '북촌로 11길',
        lat: 37.5815,
        lng: 126.9872,
        description: '북촌의 대표적인 뷰 포인트입니다. 한옥 지붕이 어우러진 전망을 감상하세요.',
      },
      {
        id: 'wp_4',
        name: '백인제가옥',
        lat: 37.5808,
        lng: 126.986,
        description: '일제강점기 부잣집 한옥의 화려함을 체험할 수 있는 유료 관람지입니다.',
      },
    ],
  },
]
