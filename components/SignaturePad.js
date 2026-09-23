'use client';

import { useEffect, useRef, useState } from 'react';

// A signature you draw with a finger or a mouse.
//
// Canvas rather than a library: it is a few dozen lines, and a dependency
// that ships its own event handling is a dependency that breaks on the next
// browser that changes how pointer events coalesce.
//
// Pointer events rather than separate mouse and touch handlers, so a stylus,
// a finger and a mouse all take the same path -- and touch-action: none in
// the CSS, without which a phone scrolls the page instead of drawing.

export default function SignaturePad({ value, onChange, label }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Back the canvas at device resolution, or a signature drawn on a phone
    // comes out as a blurry approximation of itself.
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#ffffff';
  }, []);

  const positionOf = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event) => {
    event.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = positionOf(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawing.current = true;
    canvasRef.current.setPointerCapture?.(event.pointerId);
  };

  const move = (event) => {
    if (!drawing.current) return;
    event.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = positionOf(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setHasInk(true);
    // Stored as a PNG data URL, which travels with the rest of the
    // submission rather than needing somewhere to upload a file to.
    onChange(canvasRef.current.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange('');
  };

  return (
    <div className="field signature-field">
      <span className="signature-label">
        {label}
        <span className="field-required"> *</span>
      </span>
      <canvas
        ref={canvasRef}
        className="signature-canvas"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
        aria-label={label}
        role="img"
      />
      <div className="signature-actions">
        <p className="form-note">{hasInk ? 'Signed.' : 'Sign above with your finger or mouse.'}</p>
        <button type="button" className="signature-clear" onClick={clear} disabled={!hasInk}>
          Clear
        </button>
      </div>
    </div>
  );
}
