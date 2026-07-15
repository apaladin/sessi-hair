'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { COLLECTIONS, STOPS } from '../lib/data';
import TryOn from './TryOn';
import Catalog from './Catalog';

export default function Boutique() {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const toastTimer = useRef(null);

  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [stop, setStop] = useState(0);
  const [bagItems, setBagItems] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [productOpen, setProductOpen] = useState(false);
  const [tryOn, setTryOn] = useState(null);        // collection index or null
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [variant, setVariant] = useState(0);

  const collection =
    STOPS[stop]?.collection !== undefined ? COLLECTIONS[STOPS[stop].collection] : null;

  /* mount the three.js scene */
  useEffect(() => {
    let api;
    let cancelled = false;
    (async () => {
      const { createScene } = await import('../lib/createScene');
      if (cancelled) return;
      api = createScene(canvasRef.current, {
        onStop: (i) => {
          setStop(i);
          setVariant(0);
          setProductOpen(STOPS[i].collection !== undefined);
        },
        onMirror: () => {
          setTryOn((t) => (t === null ? 0 : t));
        },
      });
      apiRef.current = api;
      setReady(true);

      const params = new URLSearchParams(window.location.search);
      if (params.has('autoplay')) {
        setEntered(true);
        setShowIntro(false);
        const sp = params.get('stop') || '0';
        if (sp !== 'entry') api.goTo(parseInt(sp, 10) || 0, true);
        if (params.has('tryon')) setTryOn(parseInt(params.get('tryon'), 10) || 0);
        if (params.has('catalog')) setCatalogOpen(true);
      }
    })();
    return () => {
      cancelled = true;
      api?.dispose();
      apiRef.current = null;
    };
  }, []);

  const goTo = useCallback((i) => apiRef.current?.goTo(i), []);

  /* keyboard */
  useEffect(() => {
    if (!entered) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(stop + 1);
      if (e.key === 'ArrowLeft') goTo(stop - 1);
      if (e.key === 'Escape') { setProductOpen(false); setTryOn(null); setCatalogOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entered, stop, goTo]);

  /* auto tour */
  useEffect(() => {
    if (!autoTour || !entered || tryOn !== null) return;
    const id = setInterval(() => goTo(stop + 1), 6500);
    return () => clearInterval(id);
  }, [autoTour, entered, stop, goTo, tryOn]);

  const enter = () => {
    setEntered(true);
    goTo(0);
  };

  const pushToBag = useCallback((c, p) => {
    setBagItems((items) => [...items, { n: p.n, p: p.p, cname: c.name }]);
    setToast(`${p.n} (${c.name}) added to your bag`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addToBag = () => {
    if (collection) pushToBag(collection, collection.products[variant]);
  };

  const bagTotal = bagItems.reduce((s, it) => s + (parseInt(it.p.replace(/\D/g, ''), 10) || 0), 0);

  return (
    <>
      <canvas id="scene" ref={canvasRef} />

      {/* entry screen */}
      {showIntro && (
      <div id="intro" className={entered ? 'hidden' : ''}>
        <div className="intro-inner">
          <div className="intro-brand anim a1">S E S S I &nbsp; H A I R</div>
          <h1 className="intro-title anim a2">The Boutique</h1>
          <p className="intro-tag anim a3">&ldquo;Luxury for Every Crown.&rdquo;</p>
          <p className="intro-sub anim a4">
            Step inside our virtual store — browse the collections
            <br />
            as if you were standing in a Mayfair boutique.
          </p>
          <button id="enter" className="anim a5" onClick={enter} disabled={!ready}>
            {ready ? 'ENTER THE BOUTIQUE' : 'PREPARING THE ROOM…'}
          </button>
          <p className="intro-hint anim a6">
            Drag to look around &nbsp;·&nbsp; Tap a display to approach
          </p>
        </div>
      </div>
      )}

      {/* chrome */}
      <header id="topbar" className={`ui ${entered ? '' : 'hidden'}`}>
        <div className="brand">S E S S I &nbsp; H A I R</div>
        <div className="topright">
          <button id="catalogbtn" onClick={() => setCatalogOpen(true)}>
            THE CATALOGUE
          </button>
          <button id="mirrorbtn" onClick={() => setTryOn(0)}>
            ✦ THE MIRROR
          </button>
          <button className="bag" onClick={() => setBagOpen(!bagOpen)}>
            BAG <span>({bagItems.length})</span>
          </button>
        </div>
      </header>

      {/* bag drawer */}
      <aside id="bagdrawer" className={bagOpen && entered ? '' : 'hidden'}>
        <div className="bd-head">YOUR BAG</div>
        {bagItems.length === 0 ? (
          <p className="bd-empty">Your bag is empty — the boutique awaits.</p>
        ) : (
          <>
            {bagItems.map((it, i) => (
              <div className="bd-row" key={i}>
                <div>
                  <div className="bd-name">{it.n}</div>
                  <div className="bd-col">{it.cname}</div>
                </div>
                <div className="bd-right">
                  <span className="bd-price">{it.p}</span>
                  <button
                    className="bd-remove"
                    aria-label="Remove"
                    onClick={() => setBagItems(bagItems.filter((_, j) => j !== i))}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
            <div className="bd-total">
              <span>TOTAL</span>
              <span>£{bagTotal}</span>
            </div>
            <button
              className="bd-checkout"
              onClick={() => {
                setToast('Concept demo — checkout is not connected');
                clearTimeout(toastTimer.current);
                toastTimer.current = setTimeout(() => setToast(null), 2600);
              }}
            >
              CHECKOUT
            </button>
          </>
        )}
        <div className="bd-note">Concept demo · no payment is taken</div>
      </aside>

      <div id="stopinfo" className={`ui ${entered ? '' : 'hidden'}`}>
        <div id="stoptitle">{STOPS[stop].title}</div>
        <div id="stopsub">{STOPS[stop].sub}</div>
      </div>

      <nav id="tournav" className={`ui ${entered ? '' : 'hidden'}`}>
        <button aria-label="Previous" onClick={() => goTo(stop - 1)}>
          &#8592;
        </button>
        <div id="stopmenu">
          {STOPS.map((s, i) => (
            <button
              key={i}
              className={`stoppill ${i === stop ? 'active' : ''}`}
              onClick={() => goTo(i)}
              title={COLLECTIONS[s.collection].tagline}
            >
              <img
                src={COLLECTIONS[s.collection].models[0].replace('w=900&h=1300', 'w=120&h=120')}
                alt=""
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
              />
              <span>{s.title}</span>
            </button>
          ))}
        </div>
        <button aria-label="Next" onClick={() => goTo(stop + 1)}>
          &#8594;
        </button>
        <button
          id="tourtoggle"
          className={autoTour ? 'on' : ''}
          title="Guided tour"
          onClick={() => setAutoTour(!autoTour)}
        >
          {autoTour ? '❚❚' : '▶'}
        </button>
      </nav>
      <div id="navhint" className={`ui ${entered && stop === 0 ? '' : 'hidden'}`}>
        Scroll or tap a collection below — drag to glance around
      </div>

      {/* product card */}
      <aside id="product" className={collection && productOpen && entered ? '' : 'hidden'}>
        {collection && (
          <>
            <button id="closeproduct" aria-label="Close" onClick={() => setProductOpen(false)}>
              &times;
            </button>
            <div className="p-label">{collection.label}</div>
            <h2>{collection.name}</h2>
            <p className="p-tagline">{collection.tagline}</p>
            <div className="p-price">{collection.price}</div>
            <p className="p-desc">{collection.desc}</p>
            <div className="p-look-label">THE LOOK</div>
            <div className="p-look">
              {collection.models.slice(0, 3).map((src) => (
                <img
                  key={src}
                  src={src.replace(/w=\d+&h=\d+/, 'w=400&h=520')}
                  alt={`Model wearing ${collection.name}`}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ))}
            </div>
            <div className="p-shades">
              {collection.shades.map((hex, i) => (
                <i key={hex} className={i === 1 ? 'sel' : ''} style={{ background: hex }} />
              ))}
            </div>
            <div className="p-products">
              {collection.products.map((pr, i) => (
                <button
                  key={pr.n}
                  className={`p-variant ${i === variant ? 'sel' : ''}`}
                  onClick={() => setVariant(i)}
                >
                  <span>{pr.n}</span>
                  <em>{pr.p}</em>
                </button>
              ))}
            </div>
            <button className="p-add" onClick={addToBag}>
              ADD TO BAG · {collection.products[variant].p}
            </button>
            <button
              className="p-tryon"
              onClick={() => setTryOn(STOPS[stop].collection)}
            >
              ✦ &nbsp;TRY IT ON — THE MIRROR
            </button>
            <div className="p-rev-head">
              <span className="p-rev-label">CLIENT WORDS</span>
              <span className="p-rev-score">
                ★ {collection.rating} · {collection.count} reviews
              </span>
            </div>
            {collection.reviews.map((r) => (
              <div className="p-review" key={r.name}>
                <img
                  src={r.img}
                  alt={r.name}
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                />
                <div>
                  <div className="p-rev-name">
                    {r.name} <i>{r.where}</i>
                    <span className="p-stars">
                      {'★'.repeat(r.stars)}
                      {'☆'.repeat(5 - r.stars)}
                    </span>
                  </div>
                  <p>{r.text}</p>
                </div>
              </div>
            ))}
            <div className="p-note">Ethically sourced · Double-drawn · With you in 48h</div>
          </>
        )}
      </aside>

      <div id="toast" className={toast ? '' : 'hidden'}>
        {toast}
      </div>

      {tryOn !== null && (
        <TryOn initialCollection={tryOn} onClose={() => setTryOn(null)} />
      )}

      {catalogOpen && (
        <Catalog
          onClose={() => setCatalogOpen(false)}
          onVisit={(ci) => { setCatalogOpen(false); goTo(ci); }}
          onTryOn={(ci) => { setCatalogOpen(false); setTryOn(ci); }}
          onAdd={pushToBag}
        />
      )}

      <div id="demofoot" className={`ui ${entered ? '' : 'hidden'}`}>
        Concept demo for Sessi Hair · not a live store
      </div>
    </>
  );
}
