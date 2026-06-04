import { marked } from 'marked'
import DOMPurify from 'dompurify'

const rawPosts = import.meta.glob('../../posts/*.md', {
  query: '?raw',
  eager: true,
  import: 'default',
})

marked.setOptions({
  gfm: true,
  breaks: true,
})

const excerptLength = 140

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '').trim()
}

function parseValue(value) {
  const cleanValue = stripQuotes(value.trim())
  if (cleanValue === 'true') return true
  if (cleanValue === 'false') return false
  return cleanValue
}

function parseFrontmatter(source) {
  const normalized = source.replace(/^\uFEFF/, '')
  const match = normalized.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/)

  if (!match) {
    return { meta: {}, body: normalized.trim() }
  }

  const meta = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf(':')
      if (separatorIndex === -1) return acc

      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()
      acc[key] = parseValue(value)
      return acc
    }, {})

  return {
    meta,
    body: normalized.slice(match[0].length).trim(),
  }
}

function normalizeTags(value) {
  if (!value) return []
  const rawTags = Array.isArray(value)
    ? value
    : String(value)
        .replace(/^\[|\]$/g, '')
        .split(',')

  return rawTags.map((tag) => stripQuotes(String(tag)).trim()).filter(Boolean)
}

function slugFromPath(path) {
  return path.split(/[\\/]/).pop().replace(/\.md$/i, '')
}

function titleFromBody(body, fallback) {
  const match = body.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : fallback
}

function plainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerptFromBody(body) {
  const text = plainText(body)
  if (text.length <= excerptLength) return text
  return `${text.slice(0, excerptLength).trim()}...`
}

function timestampFromDate(date) {
  const timestamp = Date.parse(date)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function parsePost([path, source]) {
  const slug = slugFromPath(path)
  const { meta, body } = parseFrontmatter(source)
  const title = meta.title || titleFromBody(body, slug)
  const date = meta.date || ''

  return {
    slug,
    title,
    date,
    timestamp: timestampFromDate(date),
    tags: normalizeTags(meta.tags),
    excerpt: meta.excerpt || excerptFromBody(body),
    cover: meta.cover || '',
    draft: meta.draft === true,
    body,
    html: DOMPurify.sanitize(marked.parse(body)),
  }
}

export const posts = Object.entries(rawPosts)
  .map(parsePost)
  .filter((post) => !post.draft)
  .sort((a, b) => b.timestamp - a.timestamp || a.title.localeCompare(b.title))

export function formatDate(date) {
  if (!date) return 'Undated'

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsedDate)
}
