'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { COLLECTIONS, TRYON_SAMPLES } from '../lib/data';

const CW = 480, CH = 600;

function mulberry(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Draw hair the way a handmade piece sits on a real head: strands rise from a
   soft side-parting on the crown, hug the sides of the face, then fall and
   flare. Three passes — seated shadow, dense base, fine highlights — so the
   piece looks anchored to the uploaded photo rather than pasted on. */
function drawHair(g, cx, cy, size, length, top, bottom) {
  const rnd = mulberry(42);
  const rx = 92 * size;                       // head half-width
  const crownY = cy - rx * 0.72;              // top of head
  const jawY = cy + rx * 0.62;
  const L = 330 * length * size;              // fall below the jaw
  const part = -0.22 + rnd() * 0.44;          // parting offset, -1..1 across crown

  const hi = bottom.map(v => Math.min(255, v * 1.55 + 40));
  const mid = bottom;
  const lo = top.map(v => Math.max(0, v * 0.55));

  const strandPath = (emit) => {
    // start on the crown arc
    const a = Math.PI * (0.1 + rnd() * 0.8);          // across the top
    const sx = cx + Math.cos(a) * rx * 0.98;
    const sy = crownY + (1 - Math.sin(a)) * rx * 0.55;
    // strands flow away from the parting, like combed hair
    const side = Math.cos(a) >= part * 0.9 ? 1 : -1;
    const hug = rx * (1.02 + rnd() * 0.22);           // hugs the cheek
    const flare = rx * (0.55 + rnd() * 0.85);         // flares past the jaw
    const tipX = cx + side * (rx * 0.45 + flare * (0.4 + rnd() * 0.6));
    const tipY = jawY + L * (0.72 + rnd() * 0.45);
    emit(
      sx, sy,
      cx + side * hug, cy - rx * 0.05 + rnd() * rx * 0.3,   // cheek control
      cx + side * (hug * 1.02 + rnd() * 14), jawY + L * 0.4, // fall control
      tipX, tipY
    );
  };

  g.save();
  g.lineCap = 'round';

  // pass 1 — seated shadow so the piece belongs to the photo
  g.save();
  if ('filter' in g) g.filter = 'blur(5px)';
  g.strokeStyle = 'rgba(20,12,6,0.16)';
  for (let i = 0; i < 55; i++) {
    strandPath((x0, y0, c1x, c1y, c2x, c2y, tx, ty) => {
      g.lineWidth = 5 + rnd() * 6;
      g.beginPath();
      g.moveTo(x0, y0 + 4);
      g.bezierCurveTo(c1x + 5, c1y + 6, c2x + 5, c2y + 6, tx + 4, ty + 5);
      g.stroke();
    });
  }
  g.restore();

  // pass 2 — dense base coat
  for (let i = 0; i < 170; i++) {
    strandPath((x0, y0, c1x, c1y, c2x, c2y, tx, ty) => {
      const grad = g.createLinearGradient(x0, y0, tx, ty);
      const cA = rnd() > 0.35 ? mid : lo;
      const cB = rnd() > 0.55 ? mid : lo;
      grad.addColorStop(0, `rgba(${cA.map(Math.round).join(',')},${0.55 + rnd() * 0.35})`);
      grad.addColorStop(1, `rgba(${cB.map(Math.round).join(',')},${0.3 + rnd() * 0.3})`);
      g.strokeStyle = grad;
      g.lineWidth = 1.6 + rnd() * 2.6;
      g.beginPath();
      g.moveTo(x0, y0);
      g.bezierCurveTo(c1x, c1y, c2x, c2y, tx, ty);
      g.stroke();
    });
  }

  // pass 3 — fine catch-light strands
  for (let i = 0; i < 60; i++) {
    strandPath((x0, y0, c1x, c1y, c2x, c2y, tx, ty) => {
      const grad = g.createLinearGradient(x0, y0, tx, ty);
      grad.addColorStop(0, `rgba(${hi.map(Math.round).join(',')},${0.35 + rnd() * 0.3})`);
      grad.addColorStop(1, `rgba(${hi.map(Math.round).join(',')},0.08)`);
      g.strokeStyle = grad;
      g.lineWidth = 0.8 + rnd() * 1.1;
      g.beginPath();
      g.moveTo(x0, y0);
      g.bezierCurveTo(c1x, c1y, c2x, c2y, tx, ty);
      g.stroke();
    });
  }

  // a few loose face-framing wisps
  for (let i = 0; i < 10; i++) {
    const side = i % 2 ? 1 : -1;
    const x0 = cx + side * rx * (0.5 + rnd() * 0.3);
    const y0 = crownY + rx * (0.25 + rnd() * 0.2);
    g.strokeStyle = `rgba(${mid.map(Math.round).join(',')},${0.35 + rnd() * 0.25})`;
    g.lineWidth = 1 + rnd();
    g.beginPath();
    g.moveTo(x0, y0);
    g.bezierCurveTo(
      x0 + side * 8, y0 + rx * 0.8,
      cx + side * rx * (0.75 + rnd() * 0.2), cy + rx * 0.8,
      cx + side * rx * (0.6 + rnd() * 0.3), jawY + L * 0.35 * (0.6 + rnd() * 0.5)
    );
    g.stroke();
  }

  g.restore();
}

export default function TryOn({ initialCollection = 0, onClose }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const dragRef = useRef(null);
  const fileRef = useRef(null);

  const [shade, setShade] = useState(initialCollection);
  const [size, setSize] = useState(1.0);
  const [length, setLength] = useState(1.0);
  const [anchor, setAnchor] = useState({ x: CW / 2, y: 205 });
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showHair, setShowHair] = useState(true);
  const [loading, setLoading] = useState(false);

  const col = COLLECTIONS[shade];

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext('2d');
    // backdrop
    const bg = g.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, '#f6f0e4');
    bg.addColorStop(1, '#e7dbc4');
    g.fillStyle = bg;
    g.fillRect(0, 0, CW, CH);

    const img = imgRef.current;
    if (img) {
      const s = Math.max(CW / img.width, CH / img.height);
      const w = img.width * s, h = img.height * s;
      g.drawImage(img, (CW - w) / 2, (CH - h) / 2, w, h);
    } else {
      g.fillStyle = '#b0a48d';
      g.font = '20px Georgia, serif';
      g.textAlign = 'center';
      g.fillText('Upload a photo, or choose a model below', CW / 2, CH / 2 - 10);
      g.font = 'italic 15px Georgia, serif';
      g.fillText('Your photo never leaves this device.', CW / 2, CH / 2 + 20);
    }
    if (img && showHair) {
      drawHair(g, anchor.x, anchor.y, size, length, col.top, col.bottom);
    }
  }, [anchor, size, length, col, showHair]);

  useEffect(() => { render(); }, [render, hasPhoto]);

  const loadUrl = (url, cross) => {
    setLoading(true);
    const img = new Image();
    if (cross) img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setHasPhoto(true);
      setLoading(false);
      setAnchor({ x: CW / 2, y: 205 });
    };
    img.onerror = () => setLoading(false);
    img.src = url;
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => loadUrl(reader.result, false);
    reader.readAsDataURL(f);
  };

  const onPointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    dragRef.current = { sx: e.clientX, sy: e.clientY, ax: anchor.x, ay: anchor.y, k: CW / rect.width };
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    setAnchor({
      x: d.ax + (e.clientX - d.sx) * d.k,
      y: d.ay + (e.clientY - d.sy) * d.k,
    });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const download = () => {
    try {
      const a = document.createElement('a');
      a.download = `sessi-${col.key}-look.png`;
      a.href = canvasRef.current.toDataURL('image/png');
      a.click();
    } catch {
      /* tainted canvas — ignore in demo */
    }
  };

  return (
    <div id="tryon-overlay" onClick={(e) => { if (e.target.id === 'tryon-overlay') onClose(); }}>
      <div id="tryon">
        <button className="t-close" aria-label="Close" onClick={onClose}>&times;</button>
        <div className="t-label">THE MIRROR</div>
        <h2 className="t-title">Try It On</h2>
        <p className="t-sub">
          See yourself in the {col.name} collection.
          Drag on the photo to position the hair.
        </p>

        <div className="t-body">
          <div className="t-mirror">
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
            {loading && <div className="t-loading">Preparing…</div>}
          </div>

          <div className="t-controls">
            <div className="t-group">
              <div className="t-caption">YOUR PHOTO</div>
              <button className="t-btn" onClick={() => fileRef.current?.click()}>
                UPLOAD A PHOTO
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
              <div className="t-samples">
                {TRYON_SAMPLES.map((src) => (
                  <img
                    key={src}
                    src={src.replace('w=560&h=700', 'w=120&h=150')}
                    alt="Sample model"
                    onClick={() => loadUrl(src, true)}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ))}
              </div>
            </div>

            <div className="t-group">
              <div className="t-caption">COLLECTION</div>
              <div className="t-shades">
                {COLLECTIONS.map((c, i) => (
                  <button
                    key={c.key}
                    className={`t-shade ${i === shade ? 'sel' : ''}`}
                    style={{ background: c.shades[1] }}
                    title={c.name}
                    onClick={() => setShade(i)}
                  />
                ))}
              </div>
              <div className="t-shadename">{col.name}</div>
            </div>

            <div className="t-group">
              <div className="t-caption">LENGTH</div>
              <input type="range" min="0.6" max="1.4" step="0.01" value={length}
                onChange={(e) => setLength(+e.target.value)} />
              <div className="t-caption" style={{ marginTop: 12 }}>VOLUME</div>
              <input type="range" min="0.7" max="1.5" step="0.01" value={size}
                onChange={(e) => setSize(+e.target.value)} />
            </div>

            <div className="t-group t-actions">
              <button className="t-btn ghost" onClick={() => setShowHair(!showHair)}>
                {showHair ? 'VIEW WITHOUT' : 'VIEW WITH HAIR'}
              </button>
              <button className="t-btn" onClick={download} disabled={!hasPhoto}>
                SAVE MY LOOK
              </button>
            </div>

            <p className="t-note">
              Concept demo — the production version uses AI face mapping for a
              photo-real fit. Your photo is processed on your device only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
