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
    id: 'mullae_course_1',
    locationId: 'mullae',
    name: '문래동 철공소·예술 산책 (약 1시간 30분)',
    waypoints: [
      {
        id: 'mwp_1',
        name: '문래창작촌 입구',
        lat: 37.5175,
        lng: 126.8885,
        description: '철공소 골목과 예술 작업실이 만나는 문래동의 중심부입니다.',
      },
      {
        id: 'mwp_2',
        name: '문래로 18길 철공소 골목',
        lat: 37.5172,
        lng: 126.888,
        description: '실제로 가동 중인 철공소를 가장 가까이서 볼 수 있는 골목입니다. 쇳소리와 용접 불꽃을 직접 경험해보세요.',
      },
      {
        id: 'mwp_3',
        name: '문래동 카페 거리',
        lat: 37.5168,
        lng: 126.889,
        description: '공장을 개조한 감성 카페들이 모여 있는 곳입니다. 철제 인테리어가 그대로 살아있어요.',
      },
      {
        id: 'mwp_4',
        name: '경인선 철도변 산책로',
        lat: 37.516,
        lng: 126.8895,
        description: '옛 철길을 따라 조성된 산책로입니다. 문래동의 산업 유산을 느낄 수 있는 공간이에요.',
      },
    ],
  },
  {
    id: 'ikseon_course_1',
    locationId: 'ikseon',
    name: '익선동 한옥 골목 투어 (약 1시간)',
    waypoints: [
      {
        id: 'iwp_1',
        name: '익선동 골목 입구',
        lat: 37.5715,
        lng: 126.991,
        description: '차 한 대도 못 들어갈 만큼 좁은 골목이 시작되는 지점입니다. 100년 전 정세권의 설계가 숨쉬는 곳이에요.',
      },
      {
        id: 'iwp_2',
        name: '익선동 중앙 골목',
        lat: 37.5712,
        lng: 126.9905,
        description: '11개의 골목이 미로처럼 얽힌 익선동의 중심입니다. 길을 잃어도 좋아요, 새로운 발견이 기다리고 있어요.',
      },
      {
        id: 'iwp_3',
        name: '한옥 카페 마당',
        lat: 37.5708,
        lng: 126.9908,
        description: '100년 된 한옥을 개조한 카페가 모여 있는 곳입니다. 천장의 옛 서까래를 바라보며 쉬어가세요.',
      },
    ],
  },
  {
    id: 'seochon_course_1',
    locationId: 'seochon',
    name: '서촌 문학 산책 코스 (약 2시간)',
    waypoints: [
      {
        id: 'swp_1',
        name: '통인동 입구',
        lat: 37.5798,
        lng: 126.973,
        description: '서촌 여행의 시작점입니다. 통인시장에서 도시락을 싸서 출발해보세요.',
      },
      {
        id: 'swp_2',
        name: '옥인동 윤동주 하숙집터',
        lat: 37.5802,
        lng: 126.9715,
        description: '윤동주 시인이 1942년 머물렀던 하숙집 \'임호(林湖)\'가 있던 자리입니다. 지금은 표석만 남아 있어요.',
      },
      {
        id: 'swp_3',
        name: '인왕산 자락 시비',
        lat: 37.5808,
        lng: 126.97,
        description: '인왕산 산책로에 자리한 시비들입니다. 윤동주 시인의 시구가 새겨져 있어요.',
      },
      {
        id: 'swp_4',
        name: '박노수 가옥',
        lat: 37.579,
        lng: 126.9735,
        description: '한국화의 거장 박노수의 옛집입니다. 지금은 전시공간으로 개방되어 있어요.',
      },
    ],
  },
]
