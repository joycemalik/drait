import "./docs.css";
import { InkTick } from "@/components/InkMarks";
import InkIcon, { type InkIconName } from "@/components/InkIcons";

/** Long-form page: a header, a sticky contents rail, and numbered sections. */
export function DocPage({
  eyebrow,
  title,
  lede,
  meta,
  toc,
  art,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: React.ReactNode;
  meta?: React.ReactNode;
  toc: readonly (readonly [string, string])[];
  art?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="doc">
      <header className={art ? "doc-head doc-head--art" : "doc-head"}>
        <div>
          <p className="section-label">{eyebrow}</p>
          <h1 className="font-display doc-title">{title}</h1>
          <div className="doc-lede">{lede}</div>
          {meta && <div className="doc-meta">{meta}</div>}
        </div>
        {art && <div className="doc-art">{art}</div>}
      </header>

      <div className="doc-body">
        <nav className="doc-toc" aria-label="On this page">
          <p className="section-label">On this page</p>
          <ol>
            {toc.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span className="doc-toc-n">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="doc-content">{children}</div>
      </div>
    </article>
  );
}

export function DocSection({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="doc-section">
      <div className="doc-section-head">
        <span className="doc-n font-display">{String(n).padStart(2, "0")}</span>
        <h2 className="font-display">{title}</h2>
      </div>
      <div className="wobble-rule" />
      <div className="doc-section-body">{children}</div>
    </section>
  );
}

/** A few short points with hand-drawn icons, in a loose two-column flow. */
export function Points({ items }: { items: { icon: InkIconName; title: string; text: React.ReactNode }[] }) {
  return (
    <ul className="doc-points">
      {items.map((it) => (
        <li key={it.title}>
          <span className="doc-point-icon">
            <InkIcon name={it.icon} size={22} />
          </span>
          <div>
            <p className="doc-point-title">{it.title}</p>
            <p className="doc-point-text">{it.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Who-can-do-what grid with ticks. */
export function Matrix({ cols, rows }: { cols: string[]; rows: [string, boolean[]][] }) {
  return (
    <div className="doc-matrix-wrap">
      <table className="doc-matrix">
        <thead>
          <tr>
            <th />
            {cols.map((c) => (
              <th key={c} scope="col" className="font-display">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, cells]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {cells.map((on, i) => (
                <td key={i} aria-label={on ? "Yes" : "No"}>
                  {on ? (
                    <span className="doc-yes">
                      <InkTick size={15} />
                    </span>
                  ) : (
                    <span className="doc-no" aria-hidden>
                      <svg width="14" height="6" viewBox="0 0 14 6">
                        <path d="M1 3.4c3-.9 8-.7 12-.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="doc-steps">
      {items.map((it, i) => (
        <li key={i}>
          <span className="doc-step-n font-display">{i + 1}</span>
          <div>{it}</div>
        </li>
      ))}
    </ol>
  );
}
