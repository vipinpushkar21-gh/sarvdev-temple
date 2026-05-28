import { Fragment, type ReactNode } from 'react'
import { splitTextParagraphs } from '@/lib/text-formatting'

export function renderTextParagraphs(text: unknown, paragraphClassName = ''): ReactNode {
  return splitTextParagraphs(text).map((lines, paragraphIndex) => (
    <p key={paragraphIndex} className={paragraphClassName}>
      {lines.map((line, lineIndex) => (
        <Fragment key={`${paragraphIndex}-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </p>
  ))
}
