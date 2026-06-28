import locations from '@/data/locations.json'
import mullaeIntro from '@/data/mullae/intro.json'
import mullaeQA from '@/data/mullae/qa.json'
import ikseonIntro from '@/data/ikseon/intro.json'
import ikseonQA from '@/data/ikseon/qa.json'
import seochonIntro from '@/data/seochon/intro.json'
import seochonQA from '@/data/seochon/qa.json'
import ChatContainer from '@/components/chat/ChatContainer'
import type { Location, DocentIntro, QASet, LocationData } from '@/lib/types'

const allLocations = locations as Location[]

const locationDataMap: Record<string, LocationData> = {
  mullae: {
    location: allLocations.find(l => l.id === 'mullae')!,
    intro: mullaeIntro as DocentIntro,
    qaSet: mullaeQA as QASet[],
  },
  ikseon: {
    location: allLocations.find(l => l.id === 'ikseon')!,
    intro: ikseonIntro as DocentIntro,
    qaSet: ikseonQA as QASet[],
  },
  seochon: {
    location: allLocations.find(l => l.id === 'seochon')!,
    intro: seochonIntro as DocentIntro,
    qaSet: seochonQA as QASet[],
  },
}

const defaultData = locationDataMap.mullae

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
