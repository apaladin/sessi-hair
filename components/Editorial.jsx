'use client';

import { useEffect, useRef, useState } from 'react';
import { COLLECTIONS, WALL_ART } from '../lib/data';
import TryOn from './TryOn';

const crop = (src, w, h) => src.replace(/w=\d+&h=\d+/, `w=${w}&h=${h}`);

const PILLARS = [
  { n: '01', t: 'Single-Donor Purity', d: 'Each piece comes from one donor, so the cuticle runs one way and the hair moves as one. No blending, no shortcuts.' },
  { n: '02', t: 'Double-Drawn Weight', d: 'Short strands are removed by hand until the piece carries full weight from root to tip. It photographs thick because it is.' },
  { n: '03', t: 'Silk-Protein Finish', d: 'Our finishing ritual seals each strand for a glass-like sheen that survives washing, heat and time.' },
  { n: '04', t: 'The 48-Hour Promise', d: 'Checked by hand, wrapped like a gift, and with you anywhere in the UK within two days of dispatch.' },
];

const JOURNAL = [
  { img: crop(WALL_ART[2], 700, 500), cat: 'THE ATELIER', title: 'Double-drawn, explained: why weight is the quiet tell of quality', time: '4 min read' },
  { img: crop(WALL_ART[1], 700, 500), cat: 'SHADE & LIGHT', title: 'A field guide to matching your shade in daylight, lamplight and photographs', time: '6 min read' },
  { img: crop(WALL_ART[0], 700, 500), cat: 'RITUALS', title: 'The Sunday ritual: fifteen unhurried minutes that double the life of your set', time: '3 min read' },
];

const FAQ = [
  { q: 'How do I choose my shade?', a: 'Start with The Mirror — upload a photo and try every collection shade in seconds. If you want a human eye, our concierge matches from two photos taken in daylight, usually within a few hours.' },
  { q: 'Is the hair really single-donor?', a: 'Yes. Every Pure Donor piece is traceable to a single donor, and every collection is cuticle-intact and aligned. We publish the sourcing story on each product page because we think you should ask.' },
  { q: 'How long do the pieces last?', a: 'With the care ritual, twelve to eighteen months of regular wear is typical — often longer for clip-ins worn occasionally.' },
  { q: 'What if the shade is not right when it arrives?', a: 'Unworn pieces exchange freely within 30 days. The tissue seal stays intact until you are sure — that is what it is for.' },
  { q: 'Do you ship outside the UK?', a: 'UK delivery is complimentary and takes 48 hours. International delivery is available on request while we are in our first season.' },
];

const CARE = [
  { t: 'Wash gently, weekly at most', d: 'Lukewarm water, sulphate-free wash, downward strokes only.' },
  { t: 'Mist with silk protein', d: 'A light pass before styling keeps the finish sealed and the shine glassy.' },
  { t: 'Rest it in its box', d: 'The collection box is not just packaging — flat storage is why sets last years, not months.' },
];

const BESTSELLERS = [
  [0, 0], [0, 4], [1, 1], [2, 0], [2, 3], [3, 1], [4, 0], [4, 3],
].map(([ci, pi]) => ({ c: COLLECTIONS[ci], ci, p: COLLECTIONS[ci].products[pi], pi }));

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

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const allReviews = COLLECTIONS.flatMap((c) =>
    c.reviews.slice(0, 1).map((r) => ({ ...r, cname: c.name }))
  );

  const mosaic = [
    { src: crop(COLLECTIONS[0].models[0], 800, 1000), cls: 'tall' },
    { src: crop(WALL_ART[0], 800, 560), cls: 'wide' },
    { src: crop(COLLECTIONS[2].models[1], 500, 500), cls: '' },
    { src: crop(COLLECTIONS[3].models[0], 500, 500), cls: '' },
    { src: crop(WALL_ART[1], 800, 1000), cls: 'tall' },
    { src: crop(COLLECTIONS[4].models[0], 800, 560), cls: 'wide' },
    { src: crop(COLLECTIONS[1].models[2], 500, 500), cls: '' },
    { src: crop(WALL_ART[4], 500, 500), cls: '' },
  ];

  const instaStrip = [
    COLLECTIONS[0].models[1], COLLECTIONS[1].models[0], COLLECTIONS[2].models[0],
    COLLECTIONS[3].models[1], COLLECTIONS[4].models[1], WALL_ART[5],
  ].map((s) => crop(s, 400, 400));

  return (
    <div className="edi">
      <header className="e-head">
        <nav className="e-nav">
          <a href="#story">Story</a>
          <a href="#collections">Collections</a>
          <a href="#lookbook">Lookbook</a>
          <a href="#journal">Journal</a>
          <a href="#faq">FAQ</a>
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

      {/* story / manifesto */}
      <section id="story" className="e-story rv">
        <div className="e-kicker center">THE SESSI STORY</div>
        <h2 className="e-manifesto">
          Crafted, <em>not</em> manufactured.
        </h2>
        <p className="e-story-text">
          Sessi Hair began with a simple refusal: that hair — the most personal
          thing a woman wears — should be sold like a commodity. So we built a
          house instead of a shop. One donor per piece. Hands, not machines.
          Packaging you keep. And a promise stitched into the name of every
          collection: that luxury belongs on every crown.
        </p>
      </section>

      {/* difference pillars */}
      <section className="e-pillars rv">
        {PILLARS.map((p) => (
          <div className="e-pillar" key={p.n}>
            <div className="e-pillar-num">{p.n}</div>
            <h3>{p.t}</h3>
            <p>{p.d}</p>
          </div>
        ))}
      </section>

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

      {/* lookbook mosaic */}
      <section id="lookbook" className="e-lookbook rv">
        <div className="e-kicker center">THE LOOKBOOK</div>
        <h2 className="e-section-title">Season One</h2>
        <div className="e-mosaic">
          {mosaic.map((m, i) => (
            <figure className={m.cls} key={i}>
              <img src={m.src} alt="Sessi Hair lookbook" loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      {/* bestsellers */}
      <section className="e-best rv">
        <div className="e-kicker center">MOST LOVED</div>
        <h2 className="e-section-title">The pieces that started it</h2>
        <div className="e-best-grid">
          {BESTSELLERS.map(({ c, ci, p, pi }) => (
            <article className="e-best-card" key={`${c.key}-${p.n}`}>
              <div className="e-best-img" onClick={() => setTryOn(ci)}>
                <img src={crop(c.models[pi % c.models.length], 520, 650)} alt={p.n} loading="lazy" />
                <span>✦ TRY IT ON</span>
              </div>
              <div className="e-best-col">{c.name}</div>
              <div className="e-best-name">{p.n}</div>
              <div className="e-best-row">
                <em>{p.p}</em>
                <button onClick={() => add(c, p)}>ADD TO BAG</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* unboxing ritual */}
      <section className="e-ritual rv">
        <div className="e-ritual-text">
          <div className="e-kicker gold">THE ARRIVAL</div>
          <h2>The unboxing is part of the piece</h2>
          <p>
            A collection box you will keep, inside a kraft shipping box, under a
            hang tag with your shade written by hand. The ribbon comes off slowly
            on purpose.
          </p>
          <ol className="e-steps">
            <li><strong>Sourced</strong><span>Single-donor, fully traceable</span></li>
            <li><strong>Crafted</strong><span>Double-drawn by hand, cuticle intact</span></li>
            <li><strong>Checked</strong><span>Every set inspected before it is wrapped</span></li>
            <li><strong>Yours</strong><span>With you in 48 hours, gift-ready</span></li>
          </ol>
        </div>
        <div className="e-ritual-img">
          <img src={crop(WALL_ART[3], 800, 1000)} alt="The Sessi arrival" loading="lazy" />
        </div>
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

      {/* journal */}
      <section id="journal" className="e-journal rv">
        <div className="e-kicker center">THE JOURNAL</div>
        <h2 className="e-section-title">Notes from the house</h2>
        <div className="e-journal-grid">
          {JOURNAL.map((j) => (
            <article className="e-journal-card" key={j.title}
              onClick={() => notify('The Journal opens with the full site — concept demo')}>
              <img src={j.img} alt="" loading="lazy" />
              <div className="e-journal-cat">{j.cat}</div>
              <h3>{j.title}</h3>
              <span className="e-journal-time">{j.time}</span>
            </article>
          ))}
        </div>
      </section>

      {/* care + faq */}
      <section id="faq" className="e-carefaq rv">
        <div className="e-care">
          <div className="e-kicker">THE CARE RITUAL</div>
          <h2>Fifteen minutes on a Sunday</h2>
          {CARE.map((c, i) => (
            <div className="e-care-step" key={c.t}>
              <span className="e-care-num">0{i + 1}</span>
              <div>
                <strong>{c.t}</strong>
                <p>{c.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="e-faq">
          <div className="e-kicker">QUESTIONS, ANSWERED</div>
          <h2>Before you ask</h2>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
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

      {/* newsletter */}
      <section className="e-list rv">
        <div className="e-kicker center">THE SESSI LIST</div>
        <h2 className="e-section-title">First to every collection</h2>
        <p className="e-list-sub">One considered letter a month. Early access to new shades. No noise.</p>
        <form className="e-list-form" onSubmit={(e) => { e.preventDefault(); notify('Welcome to the list — concept demo, nothing was sent'); e.target.reset(); }}>
          <input type="email" required placeholder="Your email address" aria-label="Email address" />
          <button type="submit" className="e-btn dark">JOIN</button>
        </form>
      </section>

      {/* gallery strip */}
      <section className="e-insta rv">
        {instaStrip.map((src, i) => (
          <img key={i} src={src} alt="Sessi Hair gallery" loading="lazy" />
        ))}
        <div className="e-insta-tag">@sessihair</div>
      </section>

      {/* footer */}
      <footer className="e-foot">
        <div className="e-brand">S E S S I &nbsp; H A I R</div>
        <p className="e-foot-tag">“Luxury for Every Crown.”</p>
        <nav>
          <a href="#collections">Collections</a>
          <a href="#lookbook">Lookbook</a>
          <a href="#journal">Journal</a>
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
