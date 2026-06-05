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

const renderer = new marked.Renderer()

renderer.image = function image(token) {
  const href = token.href || ''
  const title = token.title ? ` title="${escapeHtml(token.title)}"` : ''
  const text = escapeHtml(token.text || '')

  return `<figure class="markdown-image"><a href="${escapeHtml(href)}" target="_blank" rel="noreferrer"><img src="${escapeHtml(href)}" alt="${text}"${title} loading="lazy" referrerpolicy="no-referrer"></a>${text ? `<figcaption>${text}</figcaption>` : ''}</figure>`
}

marked.use({ renderer })

const excerptLength = 140
const mathCommands = {
  partial: '&part;',
  sum: '&sum;',
  prod: '&prod;',
  cdots: '&ctdot;',
  dots: '&hellip;',
  cdot: '&middot;',
  times: '&times;',
  ast: '&lowast;',
  pm: '&plusmn;',
  to: '&rarr;',
  rightarrow: '&rarr;',
  Leftarrow: '&lArr;',
  Rightarrow: '&rArr;',
  leftrightarrow: '&harr;',
  lfloor: '&lfloor;',
  rfloor: '&rfloor;',
  le: '&le;',
  ge: '&ge;',
  neq: '&ne;',
  approx: '&asymp;',
  infty: '&infin;',
  alpha: '&alpha;',
  beta: '&beta;',
  gamma: '&gamma;',
  lambda: '&lambda;',
  mu: '&mu;',
  sigma: '&sigma;',
  theta: '&theta;',
}

function normalizeMathInput(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*>\s?/, '').trim())
    .join('\n')
    .trim()
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function readGroup(source, startIndex) {
  if (source[startIndex] !== '{') {
    return { content: source[startIndex] || '', endIndex: startIndex + 1 }
  }

  let depth = 0
  for (let index = startIndex; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') depth -= 1

    if (depth === 0) {
      return {
        content: source.slice(startIndex + 1, index),
        endIndex: index + 1,
      }
    }
  }

  return { content: source.slice(startIndex + 1), endIndex: source.length }
}

function readScript(source, startIndex) {
  if (source[startIndex] === '{') {
    return readGroup(source, startIndex)
  }

  if (source[startIndex] === '\\') {
    const commandMatch = source.slice(startIndex + 1).match(/^[a-zA-Z]+/)
    if (commandMatch) {
      return {
        content: source.slice(startIndex, startIndex + commandMatch[0].length + 1),
        endIndex: startIndex + commandMatch[0].length + 1,
      }
    }
  }

  return { content: source[startIndex] || '', endIndex: startIndex + 1 }
}

function renderMathSegment(source) {
  let html = ''

  for (let index = 0; index < source.length; ) {
    const char = source[index]

    if (char === '\\') {
      const commandMatch = source.slice(index + 1).match(/^[a-zA-Z]+/)
      if (!commandMatch) {
        const nextChar = source[index + 1]
        if ('{}()[]|'.includes(nextChar)) {
          html += escapeHtml(nextChar)
          index += 2
          continue
        }
        if (nextChar === ',' || nextChar === ';' || nextChar === ':' || nextChar === ' ') {
          html += ' '
          index += 2
          continue
        }
        html += '\\'
        index += 1
        continue
      }

      const command = commandMatch[0]
      index += command.length + 1

      if (command === 'frac') {
        const numerator = readGroup(source, index)
        const denominator = readGroup(source, numerator.endIndex)
        html += `<span class="math-frac"><span class="math-num">${renderMathSegment(numerator.content)}</span><span class="math-den">${renderMathSegment(denominator.content)}</span></span>`
        index = denominator.endIndex
        continue
      }

      if (command === 'mathbf' || command === 'boldsymbol') {
        const group = readGroup(source, index)
        html += `<strong>${renderMathSegment(group.content)}</strong>`
        index = group.endIndex
        continue
      }

      if (command === 'mathcal') {
        const group = readGroup(source, index)
        html += `<span class="math-script">${renderMathSegment(group.content)}</span>`
        index = group.endIndex
        continue
      }

      if (command === 'text') {
        const group = readGroup(source, index)
        html += `<span class="math-text">${escapeHtml(group.content)}</span>`
        index = group.endIndex
        continue
      }

      if (command === 'left' || command === 'right') {
        continue
      }

      html += mathCommands[command] || escapeHtml(`\\${command}`)
      continue
    }

    if (char === '_' || char === '^') {
      const tag = char === '_' ? 'sub' : 'sup'
      const script = readScript(source, index + 1)
      html += `<${tag}>${renderMathSegment(script.content)}</${tag}>`
      index = script.endIndex
      continue
    }

    if (char === '{') {
      const group = readGroup(source, index)
      html += renderMathSegment(group.content)
      index = group.endIndex
      continue
    }

    if (char === '}') {
      index += 1
      continue
    }

    if (char === '&') {
      index += 1
      continue
    }

    html += escapeHtml(char)
    index += 1
  }

  return html
}

function renderMath(value) {
  const normalized = normalizeMathInput(value)
    .replace(/\\begin\{aligned\}/g, '')
    .replace(/\\end\{aligned\}/g, '')
    .replace(/\\\\/g, '\n')
    .replace(/\s*&\s*/g, '')

  const lines = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length > 1) {
    return lines.map((line) => `<div class="math-line">${renderMathSegment(line)}</div>`).join('')
  }

  return renderMathSegment(lines[0] || normalized)
}

function markdownWithMath(source) {
  const placeholders = []
  const stash = (html) => {
    const key = `@@MATH_${placeholders.length}@@`
    placeholders.push([key, html])
    return key
  }

  const protectedSource = source.replace(/```[\s\S]*?```/g, (match) => stash(match))
  const withQuotedDisplayMath = protectedSource.replace(
    /(^|\n)>\s*\$\$\s*\n([\s\S]+?)\n>\s*\$\$/g,
    (_, prefix, formula) => `${prefix}${stash(`<div class="math-block">${renderMath(formula)}</div>`)}`,
  )
  const withDisplayMath = withQuotedDisplayMath.replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) =>
    stash(`<div class="math-block">${renderMath(formula)}</div>`),
  )
  const withInlineMath = withDisplayMath.replace(
    /(^|[^\\$])\$([^\n$]+?)\$/g,
    (_, prefix, formula) => `${prefix}${stash(`<span class="math-inline">${renderMath(formula)}</span>`)}`,
  )

  return placeholders.reduce((acc, [key, html]) => acc.replaceAll(key, html), withInlineMath)
}

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
  const renderedBody = markdownWithMath(body)
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
    html: DOMPurify.sanitize(marked.parse(renderedBody), {
      ADD_ATTR: ['loading', 'referrerpolicy', 'target'],
    }),
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
