'use client';

import { useMemo, useState } from 'react';
import { COLLECTIONS } from '../lib/data';

/* The Catalogue — a lookbook view of every piece in the house. */
export default function Catalog({ onClose, onVisit, onTryOn, onAdd }) {
  const [tab, setTab] = useState('all');

  const items = useMemo(() => {
    const list = [];
    COLLECTIONS.forEach((c, ci) => {
      c.products.forEach((p, pi) => {
        list.push({
          c, ci, p,
          img: c.models[pi % c.models.length].replace('w=900&h=1300', 'w=640&h=800'),
        });
      });
    });
    return tab === 'all' ? list : list.filter((it) => it.c.key === tab);
  }, [tab]);

  return (
    <div id="catalog-overlay" onClick={(e) => { if (e.target.id === 'catalog-overlay') onClose(); }}>
      <div id="catalog">
        <button className="cat-close" aria-label="Close" onClick={onClose}>&times;</button>

        <header className="cat-head">
          <div className="cat-label">S E S S I &nbsp; H A I R</div>
          <h2 className="cat-title">The Catalogue</h2>
          <p className="cat-sub">
            Twenty-five pieces across five collections — every one traceable, every one handmade.
          </p>
          <nav className="cat-tabs">
            <button className={tab === 'all' ? 'sel' : ''} onClick={() => setTab('all')}>
              All Pieces
            </button>
            {COLLECTIONS.map((c) => (
              <button
                key={c.key}
                className={tab === c.key ? 'sel' : ''}
                onClick={() => setTab(c.key)}
              >
                {c.name}
              </button>
            ))}
          </nav>
        </header>

        <div className="cat-grid">
          {items.map((it, i) => (
            <article className="cat-card" key={`${it.c.key}-${it.p.n}`}
              style={{ animationDelay: `${Math.min(i, 11) * 55}ms` }}>
              <div className="cat-imgwrap" onClick={() => onVisit(it.ci)}>
                <img src={it.img} alt={`${it.c.name} — ${it.p.n}`} loading="lazy"
                  onError={(e) => { e.currentTarget.style.opacity = 0.15; }} />
                <span className="cat-hover">VIEW IN BOUTIQUE</span>
              </div>
              <div className="cat-colname">{it.c.name}</div>
              <div className="cat-prodname">{it.p.n}</div>
              <div className="cat-row">
                <span className="cat-price">{it.p.p}</span>
                <span className="cat-stars">★ {it.c.rating}</span>
              </div>
              <div className="cat-actions">
                <button onClick={() => onTryOn(it.ci)}>TRY ON</button>
                <button className="dark" onClick={() => onAdd(it.c, it.p)}>ADD TO BAG</button>
              </div>
            </article>
          ))}
        </div>

        <footer className="cat-foot">
          {items.length} {items.length === 1 ? 'piece' : 'pieces'} · complimentary UK delivery in 48 hours
        </footer>
      </div>
    </div>
  );
}
