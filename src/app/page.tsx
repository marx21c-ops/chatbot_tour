import locations from '@/data/locations.json'
import bukchonIntro from '@/data/bukchon/intro.json'
import bukchonQA from '@/data/bukchon/qa.json'
import ChatContainer from '@/components/chat/ChatContainer'
import type { Location, DocentIntro, QASet } from '@/lib/types'

const allQA = bukchonQA as QASet[]

export default function Home() {
  const location = locations[0] as unknown as Location
  const intro = bukchonIntro as unknown as DocentIntro
  const qaSet = bukchonQA as unknown as QASet[]

  return (
    <div className="flex flex-col flex-1 bg-zinc-100 h-full">
      <ChatContainer
        location={location}
        intro={intro}
        qaSet={qaSet}
        allQASets={allQA}
      />
    </div>
  )
}
