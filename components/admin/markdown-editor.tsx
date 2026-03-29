'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  bold, italic, strikethrough, hr, divider,
  title1, title2, title3,
  link, quote, image,
  unorderedListCommand, orderedListCommand, checkedListCommand,
  fullscreen,
} from '@uiw/react-md-editor/commands'

// Load the editor only client-side (it uses browser APIs)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-lg border border-border bg-muted animate-pulse" />
  ),
})

interface MarkdownEditorProps {
  value: string
  onChange: (val: string) => void
  minHeight?: number
}

export function MarkdownEditor({ value, onChange, minHeight = 400 }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write')

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Toolbar tabs */}
      <div className="flex items-center gap-1 border-b border-border bg-muted/50 px-3 py-2">
        <button
          type="button"
          onClick={() => setMode('write')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            mode === 'write'
              ? 'bg-background text-foreground shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <PenLine className="w-3.5 h-3.5" />
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            mode === 'preview'
              ? 'bg-background text-foreground shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <span className="ml-auto text-xs text-muted-foreground">Markdown supported</span>
      </div>

      {/* Editor */}
      {mode === 'write' ? (
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || '')}
            height={minHeight}
            preview="edit"
            hideToolbar={false}
            style={{ borderRadius: 0, border: 'none' }}
            commands={[
              bold, italic, strikethrough, hr, divider,
              title1, title2, title3, divider,
              link, quote, image, divider,
              unorderedListCommand, orderedListCommand, checkedListCommand,
            ]}
            extraCommands={[fullscreen]}
          />
        </div>
      ) : (
        /* Preview */
        <div
          className="prose prose-lg max-w-none p-6 bg-background min-h-[200px] prose-headings:font-serif prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          style={{ minHeight }}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">Nothing to preview yet. Start writing in the editor.</p>
          )}
        </div>
      )}
    </div>
  )
}
