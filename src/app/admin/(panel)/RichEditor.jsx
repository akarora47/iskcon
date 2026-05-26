'use client';
import dynamic from 'next/dynamic';

const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then(m => m.Editor),
  { ssr: false, loading: () => (
    <div style={{ height: '220px', background: '#1a0d00', border: '1px solid rgba(237,104,0,.25)', borderRadius: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.85rem' }}>Loading editor…</span>
    </div>
  )}
);

const TINYMCE_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'no-api-key';

export default function RichEditor({ value, onChange, height = 240 }) {
  return (
    <div style={{ borderRadius: '.5rem', overflow: 'hidden', border: '1px solid rgba(237,104,0,.25)' }}>
      <Editor
        apiKey={TINYMCE_KEY}
        value={value || ''}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          skin: 'oxide-dark',
          content_css: 'dark',
          plugins: ['advlist', 'autolink', 'lists', 'link', 'charmap', 'searchreplace', 'wordcount'],
          toolbar: 'blocks | undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | removeformat',
          content_style: 'body { font-family: system-ui,sans-serif; font-size: 14px; color: #f0e6d0; background: #1a0d00; padding: 10px; }',
          statusbar: false,
          branding: false,
        }}
      />
    </div>
  );
}
