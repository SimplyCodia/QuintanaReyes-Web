'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const TOOLBAR = [
  [{ header: [2, 3, false] }],
  ['bold', 'italic', 'underline'],
  ['link', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['clean'],
];

interface QuillInstance {
  root: HTMLElement;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
  clipboard: { dangerouslyPasteHTML: (html: string) => void };
}

export function QuillEditor({ value, onChange, placeholder, minHeight = 260 }: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    let destroyed = false;

    import('quill').then((mod) => {
      if (destroyed || !containerRef.current) return;

      const Quill = mod.default as unknown as new (
        container: HTMLElement,
        options: object,
      ) => QuillInstance;

      const quill = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: placeholder ?? '',
        modules: { toolbar: TOOLBAR },
      });

      quillRef.current = quill;

      if (initialValueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(initialValueRef.current);
      }

      const handler = () => {
        onChangeRef.current(quill.root.innerHTML);
      };

      quill.on('text-change', handler);

      (containerRef.current as HTMLDivElement & { _quillHandler?: () => void })._quillHandler = handler;
    });

    return () => {
      destroyed = true;
      if (quillRef.current && containerRef.current) {
        const handler = (containerRef.current as HTMLDivElement & { _quillHandler?: () => void })._quillHandler;
        if (handler) quillRef.current.off('text-change', handler);
      }
      quillRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        border: '1px solid #E6E6E6',
        borderRadius: 1,
        overflow: 'hidden',
        '& .ql-toolbar.ql-snow': {
          border: 'none',
          borderBottom: '1px solid #E6E6E6',
          bgcolor: '#FAFAF7',
        },
        '& .ql-container.ql-snow': {
          border: 'none',
        },
        '& .ql-editor': {
          minHeight: `${minHeight}px`,
          maxHeight: 480,
          overflowY: 'auto',
        },
      }}
    >
      <div ref={containerRef} />
    </Box>
  );
}
