export async function analyzeImage(_blob: Blob, locationName: string): Promise<string> {
  const mockResponses: Record<string, string> = {
    북촌: `사진을 분석해보니 북촌 한옥마을의 전통 한옥 건축물이 잘 담겨 있네요.

🏠 **한옥의 특징**
- 곡선미가 살아있는 기와지붕
- 나무와 흙으로 만든 친환경 재료
- 대청마루와 온돌방이 있는 전통 구조

이 한옥은 1930년대에 지어진 것으로 추정되며, 현재도 실제 주민이 거주하는 생활 공간입니다. 조용히 관람해주세요!`,
    경복궁: `사진 속 건축물은 경복궁의 핵심 전각입니다.

🏛️ **건축 정보**
- 웅장한 규모의 조선 시대 목조 건축
- 다포식(多包式) 공포 양식이 특징
- 단청(丹靑)의 화려한 색감이 돋보입니다

경복궁은 조선을 대표하는 법궁으로, 그 역사적 가치를 UNESCO 세계문화유산으로 인정받았습니다.`,
    인사동: `인사동 거리의 생생한 모습이 잘 포착되었습니다.

🎨 **거리의 풍경**
- 전통과 현대가 공존하는 거리
- 화랑과 갤러리, 공방이 늘어서 있음
- 골목골목 숨은 문화 공간이 가득

인사동은 '걷기만 해도 문화가 되는' 서울의 대표적인 문화 거리입니다. 골목골목 들어가보면 특별한 공방과 갤러리를 발견할 수 있어요.`,
  }

  await new Promise((r) => setTimeout(r, 800))

  for (const [key, response] of Object.entries(mockResponses)) {
    if (locationName.includes(key)) return response
  }

  return `📸 사진을 잘 찍으셨네요! 지금 계신 곳은 **${locationName}**입니다. 더 궁금하신 점이 있으면 물어봐 주세요.`
}
