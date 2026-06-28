export interface Location {
  id: string
  name: string
  lat: number
  lng: number
  address: string
}

export interface QASet {
  id: string
  locationId: string
  category: 'history' | 'culture' | 'people' | 'architecture' | 'food' | 'tip'
  question: string
  answer: string
  keywords: string[]
  imageUrl?: string
  weight?: number
}

export interface DocentIntro {
  locationId: string
  greeting: string
  intro: string
  quickReplies: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  imageUrl?: string
  timestamp: number
  type: 'text' | 'quickReply' | 'error' | 'locationChange'
  quickReplies?: string[]
}

export interface LocationData {
  location: Location
  intro: DocentIntro
  qaSet: QASet[]
}
