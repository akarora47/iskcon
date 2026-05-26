'use client';
import { useState, useCallback, useEffect } from 'react';

// ── Toast Component ────────────────────────────────────────────
function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration || 3500);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onRemove]);

  const colors = {
    success: { bg: '#0f2d1a', border: '#22c55e', icon: '✅', text: '#4ade80' },
    error:   { bg: '#2d0f0f', border: '#ef4444', icon: '❌', text: '#f87171' },
    warning: { bg: '#2d1f0f', border: '#f59e0b', icon: '⚠️', text: '#fbbf24' },
    info:    { bg: '#0f1a2d', border: '#3b82f6', icon: 'ℹ️', text: '#60a5fa' },
  };
  const c = colors[toast.type] || colors.success;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '.75rem',
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: '.875rem', padding: '1rem 1.25rem',
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      animation: 'slideIn .25s ease',
      minWidth: '280px', maxWidth: '380px',
    }}>
      <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>{c.icon}</span>
      <div style={{ flex: 1 }}>
        {toast.title && <p style={{ color: c.text, fontWeight: 700, fontSize: '.88rem', margin: '0 0 .2rem' }}>{toast.title}</p>}
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.82rem', margin: 0, lineHeight: 1.5 }}>{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.35)', cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1, flexShrink: 0 }}>✕</button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }`}</style>
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '.6rem',
      }}>
        {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={onRemove} />)}
      </div>
    </>
  );
}

// ── useToast hook ──────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'success', title = '', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title, duration }]);
  }, []);

  const success = useCallback((message, title = '') => toast(message, 'success', title), [toast]);
  const error   = useCallback((message, title = '') => toast(message, 'error',   title), [toast]);
  const warning = useCallback((message, title = '') => toast(message, 'warning', title), [toast]);
  const info    = useCallback((message, title = '') => toast(message, 'info',    title), [toast]);

  return { toasts, remove, success, error, warning, info };
}
