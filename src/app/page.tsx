import locations from '@/data/locations.json'
import bukchonIntro from '@/data/bukchon/intro.json'
import bukchonQA from '@/data/bukchon/qa.json'
import gyeongbokgungIntro from '@/data/gyeongbokgung/intro.json'
import insadongIntro from '@/data/insadong/intro.json'
import ChatContainer from '@/components/chat/ChatContainer'
import type { Location, DocentIntro, QASet, LocationData } from '@/lib/types'

const allLocations = locations as Location[]

const locationDataMap: Record<string, LocationData> = {
  bukchon: {
    location: allLocations.find(l => l.id === 'bukchon')!,
    intro: bukchonIntro as DocentIntro,
    qaSet: bukchonQA as QASet[],
  },
  gyeongbokgung: {
    location: allLocations.find(l => l.id === 'gyeongbokgung')!,
    intro: gyeongbokgungIntro as DocentIntro,
    qaSet: [],
  },
  insadong: {
    location: allLocations.find(l => l.id === 'insadong')!,
    intro: insadongIntro as DocentIntro,
    qaSet: [],
  },
}

const defaultData = locationDataMap.bukchon

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-100 h-full">
      <ChatContainer
        locations={allLocations}
        locationDataMap={locationDataMap}
        defaultData={defaultData}
      />
    </div>
  )
}
