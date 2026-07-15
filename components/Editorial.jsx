'use client';

import { useEffect, useRef, useState } from 'react';
import { COLLECTIONS, WALL_ART } from '../lib/data';
import TryOn from './TryOn';

/* The editorial view — the boutique, the quiet way. One long scroll,
   no 3D, everything resting on typography, photography and whitespace. */
export default function Editorial() {
  const [tryOn, setTryOn] = useState(null);
  const [bag, setBag] = useState(0);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const add = (c, p) => {
    setBag((b) => b + 1);
    notify(`${p.n} (${c.name}) added to your bag — concept demo`);
  };

  /* soft scroll-reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const allReviews = COLLECTIONS.flatMap((c) =>
    c.reviews.slice(0, 1).map((r) => ({ ...r, cname: c.name }))
  );

  return (
    <div className="edi">
      <header className="e-head">
        <nav className="e-nav">
          <a href="#collections">Collections</a>
          <a href="#words">Client Words</a>
        </nav>
        <div className="e-brand">S E S S I &nbsp; H A I R</div>
        <div className="e-right">
          <button className="e-mirrorlink" onClick={() => setTryOn(0)}>✦ The Mirror</button>
          <a className="e-boutiquelink" href="/">3D Boutique</a>
          <span className="e-bag">BAG ({bag})</span>
        </div>
      </header>

      {/* hero */}
      <section className="e-hero">
        <div className="e-hero-text rv">
          <div className="e-kicker">A NEW BRITISH HOUSE OF HAIR</div>
          <h1>Luxury for<br />Every Crown</h1>
          <p className="e-hero-sub">
            Single-donor hair, handmade pieces, and the quiet confidence
            of a fashion house. Five collections. No compromises.
          </p>
          <div className="e-hero-cta">
            <a className="e-btn dark" href="#collections">DISCOVER THE COLLECTIONS</a>
            <button className="e-btn" onClick={() => setTryOn(0)}>TRY IT ON</button>
          </div>
        </div>
        <div className="e-hero-img rv">
          <img src={WALL_ART[0]} alt="Sessi Hair editorial" />
        </div>
      </section>

      <div className="e-band">
        <span>SINGLE-DONOR</span><i>◆</i><span>FULLY TRACEABLE</span><i>◆</i>
        <span>HANDMADE</span><i>◆</i><span>WITH YOU IN 48H</span>
      </div>

      {/* collections */}
      <section id="collections">
        {COLLECTIONS.map((c, ci) => (
          <article className={`e-col rv ${ci % 2 ? 'flip' : ''}`} key={c.key}>
            <div className="e-col-img">
              <img src={c.models[0]} alt={c.name} loading="lazy" />
              <img className="e-col-img2" src={c.models[1]} alt="" loading="lazy" />
            </div>
            <div className="e-col-text">
              <div className="e-kicker">{c.label}</div>
              <h2>{c.name}</h2>
              <p className="e-tagline">{c.tagline}</p>
              <p className="e-desc">{c.desc}</p>
              <div className="e-shades">
                {c.shades.map((hex) => <i key={hex} style={{ background: hex }} />)}
              </div>
              <ul className="e-products">
                {c.products.slice(0, 3).map((p) => (
                  <li key={p.n}>
                    <span>{p.n}</span>
                    <em>{p.p}</em>
                    <button onClick={() => add(c, p)}>ADD</button>
                  </li>
                ))}
              </ul>
              <div className="e-col-cta">
                <button className="e-btn" onClick={() => setTryOn(ci)}>✦ TRY IT ON</button>
                <span className="e-rating">★ {c.rating} · {c.count} reviews</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* reviews */}
      <section id="words" className="e-words rv">
        <div className="e-kicker center">CLIENT WORDS</div>
        <h2 className="e-words-title">Worn, loved, reviewed</h2>
        <div className="e-words-grid">
          {allReviews.map((r) => (
            <figure className="e-review" key={r.name}>
              <img src={r.img} alt={r.name}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
              <blockquote>“{r.text}”</blockquote>
              <figcaption>
                <strong>{r.name}</strong> · {r.where}
                <span className="e-stars">{'★'.repeat(r.stars)}</span>
                <span className="e-rev-col">{r.cname}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* mirror cta */}
      <section className="e-mirror rv">
        <div className="e-kicker gold">THE MIRROR</div>
        <h2>Will it suit <em>me</em>?</h2>
        <p>
          Upload a photo and see yourself in every collection — shade, length
          and volume adjusted live. Your photo never leaves your device.
        </p>
        <button className="e-btn light" onClick={() => setTryOn(0)}>TRY IT ON NOW</button>
      </section>

      {/* footer */}
      <footer className="e-foot">
        <div className="e-brand">S E S S I &nbsp; H A I R</div>
        <p className="e-foot-tag">“Luxury for Every Crown.”</p>
        <nav>
          <a href="#collections">Collections</a>
          <a href="/">The 3D Boutique</a>
          <button className="e-linklike" onClick={() => setTryOn(0)}>The Mirror</button>
        </nav>
        <p className="e-foot-note">Concept demo for Sessi Hair · not a live store</p>
      </footer>

      <div id="toast" className={toast ? '' : 'hidden'}>{toast}</div>

      {tryOn !== null && (
        <TryOn initialCollection={tryOn} onClose={() => setTryOn(null)} />
      )}
    </div>
  );
}
