'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Max width class, e.g. 'max-w-lg' */
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] bg-charcoal border border-gold/15 rounded-sm shadow-warm-lg animate-fade-in-up flex flex-col overflow-hidden`}
      >
        {/* Decorative top gold border */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold via-brass to-gold" />
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-8 py-6 border-b border-gold/10">
            <h2 id="modal-title" className="font-display text-2xl text-ivory/90 tracking-wide">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-ivory/40 hover:text-gold transition-colors duration-300 p-2 -mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-8 py-8 overflow-y-auto flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
