import { motion } from "motion/react";
import {
  EXPLORER,
  recipientLabel,
  SplitView,
} from "../lib/tributary";

export default function SplitList({
  splits,
  loading,
  mine,
  onOpenSplit,
}: {
  splits: SplitView[];
  loading: boolean;
  mine: Set<string>;
  onOpenSplit: (id: string) => void;
}) {
  if (loading) return <p className="note">Loading splits…</p>;
  if (splits.length === 0) {
    return (
      <div className="empty">
        <p>No splits on this contract yet.</p>
        <p className="note">
          Connect Freighter on testnet, open the Create tab and register the
          first one. Testnet XLM is free from friendbot, so it costs nothing to
          try.
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2>Recent splits</h2>
      <div className="splits">
        {splits.map((s, index) => {
          const key = String(s.id);
          return (
            <motion.div
              className="split"
              key={key}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
              whileHover={{ y: -2 }}
              role="button"
              tabIndex={0}
              aria-label={`Open split #${key}`}
              onClick={() => onOpenSplit(key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenSplit(key);
                }
              }}
            >
              <div className="split-head">
                <span className="split-id">#{key}</span>
                <span className="split-meta">
                  {mine.has(key) && <span className="badge own">yours</span>}{" "}
                  <span className="badge">
                    {s.controller ? "mutable" : "locked"}
                  </span>{" "}
                  <span className="badge">open</span>
                </span>
              </div>
              <ul>
                {s.recipients.map((r, i) => (
                  <li key={i}>
                    {r.tag === "Account" ? (
                      <a
                        href={`${EXPLORER}/account/${r.values[0]}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {recipientLabel(r)}
                      </a>
                    ) : (
                      <span className="nested">{recipientLabel(r)}</span>
                    )}
                    <span>
                      {(s.shares[i] / 100).toFixed(2).replace(/\.?0+$/, "")}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="note">
                Open this split to see balances, copy a link, pay it or manage
                it.
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
