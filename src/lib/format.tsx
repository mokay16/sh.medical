import React from 'react'

/** Render *italic* and **bold** markers from CMS text as <em> and <strong>. */
export function Inline({ text }: { text?: string | null }) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

/** Paragraphs and "- " bulleted lists from a CMS textarea. */
export function RichText({ text }: { text?: string | null }) {
  if (!text) return null
  const blocks: React.ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={blocks.length}>
          {list.map((li, i) => (
            <li key={i}>
              <Inline text={li} />
            </li>
          ))}
        </ul>,
      )
      list = []
    }
  }
  for (const line of text.split('\n')) {
    if (line.startsWith('- ')) list.push(line.slice(2))
    else if (line.trim()) {
      flush()
      blocks.push(
        <p key={blocks.length}>
          <Inline text={line} />
        </p>,
      )
    }
  }
  flush()
  return <>{blocks}</>
}

/** Bracketed notes like [to confirm] are placeholders for SH Medical to supply; mark them so they stand out. */
export function hasPlaceholder(text?: string | null) {
  return !!text && /\[[^\]]+\]/.test(text)
}
