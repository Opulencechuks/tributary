import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SplitView } from "../lib/tributary";
import CreateSplit from "./CreateSplit";
import PaySplit from "./PaySplit";
import EscrowCard from "./EscrowCard";
import ManageSplit from "./ManageSplit";

const TABS = ["Create", "Pay", "Escrow", "Manage"] as const;
type Tab = (typeof TABS)[number];

export default function ActionPanel({
  wallet,
  splits,
  onChanged,
}: {
  wallet: string | null;
  splits: SplitView[];
  onChanged: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Create");

  const controlsSomething = splits.some((s) => s.controller === wallet);
  const tabs = TABS.filter((t) => t !== "Manage" || controlsSomething);
  const active = tabs.includes(tab) ? tab : "Create";

  return (
    <div className="panel">
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={active === t}
            className={active === t ? "tab active" : "tab"}
            onClick={() => setTab(t)}
          >
            {t}
            {active === t && (
              <motion.span
                className="tab-line"
                layoutId="tab-line"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {active === "Create" && (
            <CreateSplit wallet={wallet} onCreated={onChanged} />
          )}
          {active === "Pay" && (
            <PaySplit wallet={wallet} splits={splits} onPaid={onChanged} />
          )}
          {active === "Escrow" && <EscrowCard wallet={wallet} splits={splits} />}
          {active === "Manage" && (
            <ManageSplit wallet={wallet} splits={splits} onChanged={onChanged} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
