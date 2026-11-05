"use client";

import { useMemo, useRef, useState } from "react";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";
import { DEMO_EXAMPLE, MIX_MONTHS, OMEGA3, type Nutrient } from "@/content/supplement-mix/catalog";
import {
  applyClears,
  DEMO_CTX,
  derive,
  missingInGroup,
  parseAmount,
  Q,
  recommend,
  toggleMulti,
  toMg,
  visibleQuestions,
  type Answers,
  type FormulaItem,
  type IntakeRow,
  type Question,
} from "@/lib/supplement-mix/engine";

type Step = "intro" | "demo" | "consent" | "questions" | "result" | "editor" | "cart" | "order";
type Row = { key: string; input: string };

const ctx = DEMO_CTX;
const unitLabel = (u: "mg" | "ug") => (u === "ug" ? "µg" : "mg");
/** groups after consent, in questionnaire order */
const GROUPS = Q.groups.filter((g) => g.id !== "start");

/**
 * Personalised mix, phase 1: the complete flow as a demo in the browser. Answers live in memory only
 * (no URL, storage, analytics, Shopify or Riise); cart, payment and handover to Riise are simulated.
 */
export function MixFlow({ nutrients, live }: { nutrients: Nutrient[]; live: boolean }) {
  const nutrient = (key: string) => nutrients.find((n) => n.key === key);
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [groupIndex, setGroupIndex] = useState(0);
  const [showMissing, setShowMissing] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [fromSuggestion, setFromSuggestion] = useState(false);
  const [edited, setEdited] = useState(false);
  const [omega3, setOmega3] = useState(false);
  const [orderState, setOrderState] = useState(0);
  // reference that ties the mix and its Omega-3 line together (new per mix)
  const [mixRef, setMixRef] = useState("MIX-DEMO");
  const topRef = useRef<HTMLDivElement>(null);

  const go = (s: Step) => {
    setStep(s);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // functional update, so quick successive taps (multi-select) build on the latest answers
  const set = (id: string, value: Answers[string] | ((prev: Answers[string]) => Answers[string])) =>
    setAnswers((a) => applyClears({ ...a, [id]: typeof value === "function" ? value(a[id]) : value }, ctx));

  const { flags, excludedTags } = useMemo(() => derive(answers, ctx), [answers]);
  const omega3Excluded = OMEGA3.tags.some((t) => excludedTags.includes(t));
  const group = GROUPS[groupIndex];
  const groupQuestions = visibleQuestions(answers, ctx).filter((q) => q.group === group?.id);
  const missing = group ? missingInGroup(group.id, answers, ctx) : [];
  const result = useMemo(() => recommend(answers, ctx, DEMO_EXAMPLE, omega3Excluded), [answers, omega3Excluded]);

  // formula from the editor rows: canonical mg strings, errors per row
  const formula = rows.map((r) => {
    const n = nutrient(r.key)!;
    const amount = parseAmount(r.input);
    return { n, input: r.input, amount, mg: amount ? toMg(amount, n.unit) : null };
  });
  const formulaValid = formula.length > 0 && formula.every((f) => f.mg);

  function startEditor(items: FormulaItem[], suggested: boolean) {
    setRows(items.map((i) => ({ key: i.nutrientKey, input: i.amount.replace(".", ",") })));
    setFromSuggestion(suggested);
    setEdited(false);
    setOmega3(suggested && !omega3Excluded);
    setMixRef(`MIX-DEMO-${Date.now().toString(36).toUpperCase()}`);
    go("editor");
  }


  const cartAttributes = [
    { key: "_db_formula_mg", value: JSON.stringify(formula.filter((f) => f.mg).map((f) => ({ ingredientId: f.n.key, quantity: f.mg }))) },
    { key: "_db_catalog_version", value: "DEMO-ONLY" },
    { key: "_db_mix_ref", value: mixRef },
  ];

  return (
    <div ref={topRef} className="scroll-mt-24">
      <p className="mb-6 rounded-2xl bg-okker/50 px-4 py-3 text-sm leading-snug text-moss">
        <strong>Demo:</strong> Ablauf zum Ausprobieren. Antworten bleiben nur in diesem Browserfenster und werden nirgends gespeichert oder
        übertragen. Es gibt noch kein fachliches Regelwerk, keine Preise und keine echte Bestellung.
      </p>

      {step === "intro" && (
        <section className="max-w-2xl">
          <h1 className="h1 text-balance">{Q.intro.title}</h1>
          <p className="mt-4 text-lg text-ink-muted">{Q.intro.body}</p>
          <p className="mt-2 text-sm text-ink-muted">
            {Q.intro.durationLabel} · {Q.intro.guestCheckoutLabel}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => go("demo")}>
              {Q.intro.primaryAction}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => startEditor([], false)}>
              {Q.intro.secondaryAction}
            </button>
          </div>
          <p className="mt-6 text-sm text-ink-muted">{Q.intro.proposalAvailability}</p>
        </section>
      )}

      {step === "demo" && (
        <section className="max-w-2xl rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
          <h2 className="h3">{Q.demoDataNotice.title}</h2>
          <p className="mt-2 text-ink-muted">{Q.demoDataNotice.body}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => go("consent")}>
              {Q.demoDataNotice.action}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => go("intro")}>
              Zurück
            </button>
          </div>
        </section>
      )}

      {step === "consent" && <Consent onAccept={() => { setAnswers({ health_data_consent: "accept" }); setGroupIndex(0); setShowMissing(false); go("questions"); }} onDecline={() => { setAnswers({}); startEditor([], false); }} />}

      {step === "questions" && group && (
        <section className="max-w-2xl">
          <Progress index={groupIndex} />
          <h2 className="h3 mt-6">{group.title}</h2>
          <div className="mt-5 grid gap-6">
            {groupQuestions.map((q) => (
              <QuestionField key={q.id} nutrients={nutrients} q={q} value={answers[q.id]} onChange={(v) => set(q.id, v)} invalid={showMissing && missing.includes(q.id)} />
            ))}
          </div>
          {showMissing && missing.length > 0 && (
            <p className="mt-4 text-sm font-medium text-[#b42318]" role="alert">
              Bitte beantworte die markierten Fragen.
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-line/70 pt-6">
            <button type="button" className="btn btn-secondary" onClick={() => (groupIndex === 0 ? go("consent") : (setGroupIndex((i) => i - 1), setShowMissing(false)))}>
              Zurück
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (missing.length) return setShowMissing(true);
                setShowMissing(false);
                if (groupIndex < GROUPS.length - 1) {
                  setGroupIndex((i) => i + 1);
                  topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else go("result");
              }}
            >
              {groupIndex < GROUPS.length - 1 ? "Weiter" : "Ergebnis anzeigen"}
            </button>
          </div>
        </section>
      )}

      {step === "result" && (
        <section className="max-w-2xl">
          <Progress index={GROUPS.length} />
          {result.status === "ready" ? (
            <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
              <p className="inline-block rounded-full bg-okker px-3 py-1 text-xs font-semibold text-moss">{result.label}</p>
              <h2 className="h3 mt-3">Beispielmix</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Die Demo zeigt unabhängig von deinen Angaben dasselbe Beispiel. Ein echter Vorschlag braucht ein fachlich festgelegtes Regelwerk.
              </p>
              <ul className="mt-4 divide-y divide-line/70">
                {result.items.map((i) => (
                  <li key={i.nutrientKey} className="flex justify-between py-2">
                    <span>
                      {nutrient(i.nutrientKey)?.label} <span className="text-sm text-ink-muted">({nutrient(i.nutrientKey)?.form})</span>
                    </span>
                    <span className="tabular-nums">
                      {i.amount} {unitLabel(i.unit)} pro Tag
                    </span>
                  </li>
                ))}
                {result.omega3 && (
                  <li className="flex justify-between py-2">
                    <span>{OMEGA3.label}</span>
                    <span className="text-sm text-ink-muted">separates Produkt</span>
                  </li>
                )}
              </ul>
              {omega3Excluded && <p className="mt-3 text-sm text-ink-muted">Omega-3 ist wegen deiner Angaben (Fischallergie oder vegetarisch/vegan) ausgeschlossen.</p>}
              {(answers.product_preference === "vegan" || answers.product_preference === "vegetarian") && (
                <p className="mt-2 text-sm text-ink-muted">
                  Ob die übrigen Zutaten {answers.product_preference === "vegan" ? "vegan" : "vegetarisch"} sind, ist noch nicht durch Herstellerangaben bestätigt.
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary" onClick={() => startEditor(result.items, true)}>
                  Rezeptur anpassen und weiter
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
              <h2 className="h3">{result.message}</h2>
              <p className="mt-2 text-ink-muted">
                {result.status === "not_supported"
                  ? "Für einige deiner Angaben (z. B. Schwangerschaft, Medikamente, Erkrankungen, bereits eingenommene Präparate oder Alter unter 18) gibt es noch keine fachlichen Regeln. Wir schlagen deshalb keine Mengen vor."
                  : "Einige Angaben sind unbekannt oder unvollständig. Ohne sie schlagen wir keine Mengen vor und setzen auch keine Standardmenge ein."}
              </p>
              <p className="mt-2 text-xs text-ink-muted">Status: {result.status} · {result.flags.join(", ")}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => { setGroupIndex(0); go("questions"); }}>
                  Angaben ändern
                </button>
                <button type="button" className="btn btn-primary" onClick={() => startEditor([], false)}>
                  Selbst zusammenstellen
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {step === "editor" && (
        <section className="max-w-2xl">
          <h2 className="h3">{fromSuggestion && !edited ? "Dein Beispielmix" : fromSuggestion ? "Deine angepasste Rezeptur" : "Selbst zusammenstellen"}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Tagesmengen pro Nährstoff, Laufzeit {MIX_MONTHS} Monate. Grenzen, Schrittweiten und Preise folgen mit den Produktregeln; bis dahin wird nur das Zahlenformat geprüft.
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {live ? `Zutaten: aktueller Riise-Katalog (${nutrients.length} für B2B verfügbare Zutaten).` : "Zutaten: Ersatzliste aus dem Briefing (Riise-Katalog gerade nicht erreichbar)."}
          </p>
          <ul className="mt-5 grid gap-3">
            {formula.map((f, idx) => (
              <li key={f.n.key} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{f.n.label}</p>
                    <p className="text-sm text-ink-muted">{f.n.form}</p>
                  </div>
                  <button type="button" onClick={() => { setRows((r) => r.filter((_, i) => i !== idx)); setEdited(true); }} aria-label={`${f.n.label} entfernen`} className="text-ink-muted hover:text-ink">
                    <CloseIcon width={14} height={14} />
                  </button>
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-ink-muted">Menge pro Tag</span>
                  <input
                    inputMode="decimal"
                    value={f.input}
                    onChange={(e) => { const v = e.target.value; setRows((r) => r.map((x, i) => (i === idx ? { ...x, input: v } : x))); setEdited(true); }}
                    className={`h-10 w-28 rounded-xl border bg-white px-3 tabular-nums focus:outline-none focus:ring-2 focus:ring-turquoise/60 ${f.amount ? "border-line" : "border-[#b42318]"}`}
                    aria-invalid={!f.amount}
                  />
                  <span>{unitLabel(f.n.unit)}</span>
                </label>
                {!f.amount && <p className="mt-1 text-sm text-[#b42318]">Bitte eine Zahl größer als 0 eingeben, z. B. 20 oder 0,5.</p>}
                {f.mg && <p className="mt-1 text-xs text-ink-muted">An Riise: {f.mg} mg (ID {f.n.key})</p>}
              </li>
            ))}
          </ul>
          <AddNutrient nutrients={nutrients} used={rows.map((r) => r.key)} onAdd={(n) => { setRows((r) => [...r, { key: n.key, input: "" }]); setEdited(true); }} />
          <label className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 ${omega3Excluded ? "border-line bg-surface opacity-60" : "border-line bg-white"}`}>
            <input type="checkbox" checked={omega3 && !omega3Excluded} disabled={omega3Excluded} onChange={(e) => setOmega3(e.target.checked)} className="mt-1 accent-[var(--color-green)]" />
            <span>
              <span className="font-semibold">{OMEGA3.label}</span> <span className="text-sm text-ink-muted">· {OMEGA3.months} Monate, eigenes Produkt</span>
              {omega3Excluded && <span className="block text-sm text-ink-muted">Wegen deiner Angaben ausgeschlossen.</span>}
            </span>
          </label>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-6">
            <span className="text-sm text-ink-muted">Preis: noch nicht festgelegt</span>
            <button type="button" className="btn btn-primary" disabled={!formulaValid} onClick={() => go("cart")}>
              In den Warenkorb (Simulation)
            </button>
          </div>
        </section>
      )}

      {step === "cart" && (
        <section className="max-w-2xl">
          <h2 className="h3">Warenkorb (Simulation)</h2>
          <p className="mt-1 text-sm text-ink-muted">So kämen die Positionen in den bestehenden Shopify-Warenkorb, neben Tests und anderen Produkten. Nichts wird tatsächlich hinzugefügt.</p>
          <ul className="mt-4 grid gap-3">
            <li className="rounded-2xl border border-line bg-white p-4">
              <p className="font-semibold">Dein Vitamin-Mix · {MIX_MONTHS} Monate · 1 Packung</p>
              <ul className="mt-2 text-sm text-ink-muted">
                {formula.map((f) => (
                  <li key={f.n.key}>
                    {f.n.label}: {f.amount?.replace(".", ",")} {unitLabel(f.n.unit)} pro Tag
                  </li>
                ))}
              </ul>
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-ink-muted">Technische Positionsattribute (für Riise, ohne Gesundheitsangaben)</summary>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-surface p-3">{JSON.stringify(cartAttributes, null, 2)}</pre>
              </details>
            </li>
            {omega3 && !omega3Excluded && (
              <li className="rounded-2xl border border-line bg-white p-4">
                <p className="font-semibold">{OMEGA3.label} · {OMEGA3.months} Monate</p>
                <p className="text-xs text-ink-muted">_db_mix_ref: {mixRef}</p>
              </li>
            )}
          </ul>
          <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-line/70 pt-6">
            <button type="button" className="btn btn-secondary" onClick={() => go("editor")}>
              Rezeptur ändern
            </button>
            <button type="button" className="btn btn-primary" onClick={() => { setOrderState(0); go("order"); }}>
              Zahlung simulieren
            </button>
          </div>
        </section>
      )}

      {step === "order" && (
        <OrderSimulation state={orderState} onNext={() => setOrderState((s) => Math.min(s + 1, ORDER_STATES.length - 1))} formula={formula.map((f) => ({ ingredientId: f.n.key, quantity: f.mg! }))} omega3={omega3 && !omega3Excluded} mixRef={mixRef} onRestart={() => { setAnswers({}); setRows([]); go("intro"); }} />
      )}

      {/* flags of the current answers, for the demo review */}
      {(step === "questions" || step === "result") && flags.length > 0 && <p className="mt-6 text-xs text-ink-muted">Demo-Hinweise: {flags.join(", ")}</p>}
    </div>
  );
}

function Progress({ index }: { index: number }) {
  return (
    <div>
      <p className="text-sm text-ink-muted">{index < GROUPS.length ? `Schritt ${index + 1} von ${GROUPS.length}` : "Ergebnis"}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lind/60" aria-hidden>
        <div className="h-full rounded-full bg-green transition-all" style={{ width: `${Math.round((Math.min(index, GROUPS.length) / GROUPS.length) * 100)}%` }} />
      </div>
    </div>
  );
}

function Consent({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  const q = Q.questions.find((x) => x.id === "health_data_consent")!;
  const [accept, decline] = q.options!;
  return (
    <section className="max-w-2xl rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card">
      <h2 className="h3">{q.label}</h2>
      <p className="mt-2 text-ink-muted">{q.description}</p>
      <ul className="mt-3 list-disc pl-5 text-sm text-ink-muted">
        <li>Zweck: nur für deinen Rezepturvorschlag, keine Werbung</li>
        <li>Deine Antworten gehen nicht an Shopify, Riise oder Analyse-Dienste</li>
        <li>Speicherdauer, Empfänger und Widerruf werden vor dem Start ergänzt (Entwurf)</li>
      </ul>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={onAccept}>
          {accept.label}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onDecline}>
          {decline.label}
        </button>
      </div>
    </section>
  );
}

function QuestionField({
  nutrients,
  q,
  value,
  onChange,
  invalid,
}: {
  nutrients: Nutrient[];
  q: Question;
  value: Answers[string];
  onChange: (v: Answers[string] | ((prev: Answers[string]) => Answers[string])) => void;
  invalid: boolean;
}) {
  const legend = (
    <legend className="font-semibold">
      {q.label}
      {!q.required && <span className="ml-1.5 text-sm font-normal text-ink-muted">(optional)</span>}
    </legend>
  );
  const pill = (on: boolean) => `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${on ? "border-green bg-green text-white" : "border-line bg-white hover:border-ink"}`;

  if (q.type === "ingredient_intake_repeater") return <IntakeRepeater nutrients={nutrients} q={q} rows={(value as IntakeRow[]) ?? []} onChange={onChange} legend={legend} />;
  return (
    <fieldset className={`rounded-2xl ${invalid ? "ring-2 ring-[#b42318] ring-offset-4" : ""}`}>
      {legend}
      {q.description && <p className="mt-1 text-sm text-ink-muted">{q.description}</p>}
      {q.type === "multi" && q.maxSelected && <p className="mt-1 text-sm text-ink-muted">Bis zu {q.maxSelected} auswählen.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {q.options!.map((o) => {
          const on = q.type === "multi" ? ((value as string[]) ?? []).includes(o.value) : value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role={q.type === "multi" ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => onChange(q.type === "multi" ? (prev) => toggleMulti(q, (prev as string[]) ?? [], o.value) : o.value)}
              className={pill(on)}
            >
              {on && q.type === "multi" && <CheckIcon width={14} height={14} className="-ml-1 mr-1 inline" />}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function IntakeRepeater({ nutrients, q, rows, onChange, legend }: { nutrients: Nutrient[]; q: Question; rows: IntakeRow[]; onChange: (v: IntakeRow[]) => void; legend: React.ReactNode }) {
  const [nutrientField, statusField] = q.fields!;
  const update = (i: number, patch: Partial<IntakeRow>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const field = "h-10 rounded-xl border border-line bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/60";
  return (
    <fieldset>
      {legend}
      {q.description && <p className="mt-1 text-sm text-ink-muted">{q.description}</p>}
      <ul className="mt-3 grid gap-3">
        {rows.map((r, i) => (
          <li key={i} className="grid gap-2 rounded-2xl border border-line bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <select value={r.ingredientKey ?? ""} onChange={(e) => update(i, { ingredientKey: e.target.value })} className={field} aria-label={nutrientField.label}>
                <option value="">{nutrientField.label} wählen</option>
                {nutrients.map((n) => (
                  <option key={n.key} value={n.key}>
                    {n.label}
                  </option>
                ))}
                {nutrientField.specialOptions?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label="Zeile entfernen" className="text-ink-muted hover:text-ink">
                <CloseIcon width={14} height={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusField.options!.map((o) => (
                <button key={o.value} type="button" onClick={() => update(i, { amountStatus: o.value })} className={`rounded-full border px-3 py-1.5 text-sm ${r.amountStatus === o.value ? "border-green bg-green text-white" : "border-line bg-white"}`}>
                  {o.label}
                </button>
              ))}
            </div>
            {r.amountStatus === "known" && (
              <div className="flex items-center gap-2">
                <input inputMode="decimal" value={r.dailyAmount ?? ""} onChange={(e) => update(i, { dailyAmount: e.target.value })} placeholder="Menge" className={`${field} w-28`} aria-label="Menge pro Tag" />
                <select value={r.unit ?? ""} onChange={(e) => update(i, { unit: e.target.value })} className={field} aria-label="Einheit">
                  <option value="">Einheit</option>
                  <option value="mg">mg</option>
                  <option value="ug">µg</option>
                </select>
                {r.dailyAmount && !parseAmount(r.dailyAmount) && <span className="text-sm text-[#b42318]">ungültige Zahl</span>}
              </div>
            )}
          </li>
        ))}
      </ul>
      {rows.length < (q.maxRows ?? 20) && (
        <button type="button" onClick={() => onChange([...rows, {}])} className="btn btn-secondary btn-sm mt-3">
          + Nährstoff hinzufügen
        </button>
      )}
    </fieldset>
  );
}

function AddNutrient({ nutrients, used, onAdd }: { nutrients: Nutrient[]; used: string[]; onAdd: (n: Nutrient) => void }) {
  const free = nutrients.filter((n) => !used.includes(n.key));
  // only one form per nutrient (e.g. folic acid or L-5-MTHF)
  const usedGroups = new Set(nutrients.filter((n) => used.includes(n.key) && n.group).map((n) => n.group));
  if (!free.length) return null;
  return (
    <div className="mt-4">
      <p className="text-sm font-medium">Nährstoff hinzufügen</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {free.map((n) => (
          <button key={n.key} type="button" disabled={!!n.group && usedGroups.has(n.group)} title={n.form} onClick={() => onAdd(n)} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink disabled:cursor-not-allowed disabled:opacity-50">
            + {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const ORDER_STATES = [
  { key: "paid", label: "Bestellung bezahlt", text: "Shopify meldet die Zahlung (Webhook orders/paid, Signatur geprüft)." },
  { key: "validated", label: "Rezeptur geprüft", text: "Rezeptur, Regelversion und Preiszuordnung serverseitig erneut geprüft." },
  { key: "accepted", label: "An Riise übergeben", text: "Auftrag bei Riise angelegt (POST /external-order, Antwort 201)." },
  { key: "ready_to_dispatch", label: "Produziert und etikettiert", text: "Riise meldet die fertige Sendung." },
  { key: "dispatched", label: "An DHL übergeben", text: "Tracking wird der Mix-Position in Shopify zugeordnet." },
  { key: "transit", label: "Unterwegs", text: "Sendungsverfolgung aktiv." },
  { key: "delivered", label: "Zugestellt", text: "Abgeschlossen." },
];

function OrderSimulation({ state, onNext, formula, omega3, mixRef, onRestart }: { state: number; onNext: () => void; formula: { ingredientId: string; quantity: string }[]; omega3: boolean; mixRef: string; onRestart: () => void }) {
  // structure from the briefing (section 11) with its fictitious customer; never sent anywhere
  const payload = {
    customer: { fullName: "Mara Beispiel", email: "mara@example.com", address: "Beispielstraße 1", city: "Beispielstadt", country: "Germany", zipCode: "12345", phoneNumber: "AUS_SHOPIFY_CHECKOUT", sourceCompanyName: "CONFIGURED_PARTNER_NAME" },
    order: { orderId: `SHOP-ORDER-${mixRef}`, orderMonths: MIX_MONTHS, ingredients: formula, ...(omega3 ? { omega3: OMEGA3.months } : {}), preparationDate: "VEREINBARTER_PRODUKTIONSBEGINN" },
  };
  return (
    <section className="max-w-2xl">
      <h2 className="h3">Bestellung (Simulation)</h2>
      <p className="mt-1 text-sm text-ink-muted">So würde der Auftrag nach der Zahlung verarbeitet. Es wird nichts an Shopify oder Riise gesendet.</p>
      <ol className="mt-5 grid gap-2">
        {ORDER_STATES.map((s, i) => (
          <li key={s.key} className={`flex gap-3 rounded-2xl border p-3 ${i <= state ? "border-green/50 bg-lind/30" : "border-line bg-white opacity-60"}`}>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${i <= state ? "bg-green text-white" : "bg-surface text-ink-muted"}`}>
              {i <= state ? <CheckIcon width={12} height={12} /> : i + 1}
            </span>
            <span>
              <span className="block font-medium">{s.label}</span>
              <span className="block text-sm text-ink-muted">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <details className="mt-4 text-xs">
        <summary className="cursor-pointer text-ink-muted">Auftragsdaten an Riise (Struktur, Beispielkunde aus dem Briefing)</summary>
        <pre className="mt-2 overflow-x-auto rounded-xl bg-surface p-3">{JSON.stringify(payload, null, 2)}</pre>
      </details>
      <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-line/70 pt-6">
        <button type="button" className="btn btn-secondary" onClick={onRestart}>
          Neu starten
        </button>
        {state < ORDER_STATES.length - 1 && (
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Nächster Status
          </button>
        )}
      </div>
    </section>
  );
}

