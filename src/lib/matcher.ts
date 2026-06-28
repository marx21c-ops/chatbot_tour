import type { QASet } from './types'

function normalize(text: string): string {
  return text
    .replace(/[은는이가을를의과와에로부터에게서에서부터까지도만이나든지/]/g, ' ')
    .replace(/[?？！!,.…\s]+/g, ' ')
    .trim()
    .toLowerCase()
}

function extractKeywords(text: string): string[] {
  const normalized = normalize(text)
  const tokens = normalized.split(/\s+/).filter(Boolean)
  const result = new Set<string>()
  for (const token of tokens) {
    if (token.length >= 2) result.add(token)
    for (let i = 2; i <= token.length; i++) {
      result.add(token.slice(0, i))
    }
  }
  return Array.from(result)
}

function scoreByKeywords(userKeywords: string[], qa: QASet): number {
  const qaQuestion = normalize(qa.question)
  const qaKeywords = qa.keywords.map(k => k.toLowerCase())
  let score = 0
  for (const uk of userKeywords) {
    if (qaQuestion.includes(uk)) score += 1.5
    if (qaKeywords.some(k => k.includes(uk) || uk.includes(k))) score += 2.0
  }
  return score * (qa.weight ?? 1.0)
}

export function findBestAnswer(
  userInput: string,
  currentLocationId: string,
  allQA: QASet[],
): QASet | null {
  const input = userInput.trim()
  if (!input) return null

  const candidates = allQA.filter(q => q.locationId === currentLocationId)
  if (candidates.length === 0) return null

  const normalizedInput = normalize(input)

  const exactMatch = candidates.find(
    q => normalize(q.question).includes(normalizedInput) || normalizedInput.includes(normalize(q.question)),
  )
  if (exactMatch) return exactMatch

  const keywordMatch = candidates.find(
    q => q.keywords.some(k => normalizedInput.includes(k.toLowerCase())),
  )
  if (keywordMatch) return keywordMatch

  const userKeywords = extractKeywords(input)
  if (userKeywords.length === 0) return null

  const scored = candidates
    .map(q => ({ qa: q, score: scoreByKeywords(userKeywords, q) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.length > 0 ? scored[0].qa : null
}
