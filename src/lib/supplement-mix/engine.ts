/**
 * Personalised supplement mix (Riise), phase 1: demo run in the browser only.
 * Implements the declarative parts of questionnaire.de.json (render conditions, branch and risk
 * rules, exclusive options, quantity normalisation) and the recommendation contract's statuses.
 * There is no active product or recommendation rulebook yet (product-rules.template.json is
 * inactive), so no dose is ever computed here: the demo shows the briefing's labelled example mix.
 */
import questionnaire from "@/content/supplement-mix/questionnaire.de.json";

export type IntakeRow = { ingredientKey?: string; amountStatus?: string; dailyAmount?: string; unit?: string };
export type AnswerValue = string | string[] | IntakeRow[];
export type Answers = Record<string, AnswerValue | undefined>;

type Cond = {
  operator: string;
  field?: string;
  value?: string;
  values?: string[];
  conditions?: Cond[];
  bindingKey?: string;
  recordWhen?: Cond;
};
type Effect = { type: string; code?: string; tag?: string; reasonCode?: string; questionId?: string; except?: string[]; target?: string };
type Rule = { id: string; when: Cond; effects: Effect[] };

export type Option = { value: string; label: string };
export type Question = {
  id: string;
  group: string;
  type: "consent" | "single" | "multi" | "ingredient_intake_repeater";
  label: string;
  required?: boolean;
  description?: string;
  options?: Option[];
  maxSelected?: number;
  minSelected?: number;
  exclusiveOptions?: string[];
  renderWhen?: Cond;
  maxRows?: number;
  fields?: { id: string; label: string; options?: Option[]; specialOptions?: Option[] }[];
};

export const Q = questionnaire as unknown as {
  questionnaireVersion: string;
  intro: Record<string, string>;
  demoDataNotice: { title: string; body: string; action: string; demoSuggestionLabel: string };
  groups: { id: string; title: string }[];
  questions: Question[];
  questionPolicy: { questionOrder: string[]; unknownValues: string[] };
  branchAndRiskRules: Rule[];
  recommendationEngineContract: { failureUi: Record<string, string> };
};

/** Context: no rulebook is active; in the demo the optional, rule-bound questions are shown so the flow can be tried */
export type Ctx = { demo: boolean; boundRules: Set<string> };
export const DEMO_CTX: Ctx = { demo: true, boundRules: new Set() };

const isEmpty = (v: AnswerValue | undefined) => v === undefined || v === "" || (Array.isArray(v) && v.length === 0);

export function evalCond(c: Cond, a: Answers, ctx: Ctx): boolean {
  const v = c.field ? a[c.field] : undefined;
  switch (c.operator) {
    case "eq":
      return v === c.value;
    case "in":
      return typeof v === "string" && (c.values ?? []).includes(v);
    case "includes":
      return Array.isArray(v) && (v as string[]).includes(c.value!);
    case "includes_any":
      return Array.isArray(v) && (v as string[]).some((x) => (c.values ?? []).includes(x));
    case "is_missing":
      return isEmpty(v);
    case "is_empty":
      return isEmpty(v);
    case "all":
      return (c.conditions ?? []).every((x) => evalCond(x, a, ctx));
    case "any":
      return (c.conditions ?? []).some((x) => evalCond(x, a, ctx));
    case "any_record":
      return Array.isArray(v) && (v as IntakeRow[]).some((row) => evalCond(c.recordWhen!, row as Answers, ctx));
    case "rule_binding_exists":
      // live: only questions a published rule uses; demo: shown so the whole flow can be tried
      return ctx.demo || ctx.boundRules.has(c.bindingKey ?? "");
    default:
      return false;
  }
}

/** Questions in order that apply to the current answers (consent excluded) */
export function visibleQuestions(a: Answers, ctx: Ctx): Question[] {
  return Q.questionPolicy.questionOrder
    .map((id) => Q.questions.find((q) => q.id === id)!)
    .filter((q) => q && q.type !== "consent" && (!q.renderWhen || evalCond(q.renderWhen, a, ctx)));
}

/** Clears answers that rules (or hidden questions) make obsolete; run after every change */
export function applyClears(a: Answers, ctx: Ctx): Answers {
  const next = { ...a };
  for (const r of Q.branchAndRiskRules) {
    if (!evalCond(r.when, next, ctx)) continue;
    for (const e of r.effects) {
      if (e.type === "clear_answer" && e.questionId) delete next[e.questionId];
      if (e.type === "clear_answers") for (const k of Object.keys(next)) if (!(e.except ?? []).includes(k)) delete next[k];
    }
  }
  const visible = new Set(visibleQuestions(next, ctx).map((q) => q.id));
  for (const k of Object.keys(next)) if (k !== "health_data_consent" && !visible.has(k)) delete next[k];
  return next;
}

/** Risk flags and product exclusions derived from the current answers (rebuilt on every change) */
export function derive(a: Answers, ctx: Ctx): { flags: string[]; excludedTags: string[] } {
  const flags = new Set<string>();
  const excludedTags = new Set<string>();
  for (const r of Q.branchAndRiskRules) {
    if (!evalCond(r.when, a, ctx)) continue;
    for (const e of r.effects) {
      if (e.type === "add_risk_flag" && e.code) flags.add(e.code);
      if (e.type === "exclude_product_by_confirmed_catalog_tag" && e.tag) excludedTags.add(e.tag);
    }
  }
  return { flags: [...flags], excludedTags: [...excludedTags] };
}

/** Exclusive options clear the others; another option clears the exclusive ones */
export function toggleMulti(q: Question, current: string[], value: string): string[] {
  const exclusive = new Set(q.exclusiveOptions ?? []);
  if (current.includes(value)) return current.filter((v) => v !== value);
  if (exclusive.has(value)) return [value];
  const next = current.filter((v) => !exclusive.has(v));
  if (q.maxSelected && next.length >= q.maxSelected) return next;
  return [...next, value];
}

/** Required answers missing in one group (consent handled separately) */
export function missingInGroup(group: string, a: Answers, ctx: Ctx): string[] {
  return visibleQuestions(a, ctx)
    .filter((q) => q.group === group && q.required)
    .filter((q) => (q.type === "multi" ? !Array.isArray(a[q.id]) || (a[q.id] as string[]).length < (q.minSelected ?? 1) : isEmpty(a[q.id])))
    .map((q) => q.id);
}

/* ------------------------------------------------------------------ */
/* Quantities: decimal strings only, canonical unit mg                  */
/* ------------------------------------------------------------------ */

const DECIMAL = /^(?:0|[1-9][0-9]*)(?:[.,][0-9]+)?$/;

/** "20" / "0,5" → "20" / "0.5"; null for anything else (exponent, sign, thousands separators, NaN, 0) */
export function parseAmount(input: string): string | null {
  const s = input.trim();
  if (!DECIMAL.test(s)) return null;
  const n = s.replace(",", ".");
  const trimmed = n.includes(".") ? n.replace(/0+$/, "").replace(/\.$/, "") : n;
  return /[1-9]/.test(trimmed) ? trimmed : null;
}

/** Moves the decimal point by `shift` places (negative = divide by 10^n) without floating point */
function shiftDecimal(value: string, shift: number): string {
  const [int, frac = ""] = value.split(".");
  let digits = int + frac;
  let point = int.length + shift;
  if (point <= 0) {
    digits = "0".repeat(1 - point) + digits;
    point = 1;
  }
  if (point > digits.length) digits = digits + "0".repeat(point - digits.length);
  const int2 = digits.slice(0, point).replace(/^0+(?=\d)/, "");
  const frac2 = digits.slice(point).replace(/0+$/, "");
  return frac2 ? `${int2}.${frac2}` : int2;
}

/** canonical mg string from a display amount: 20 µg → "0.02", 200 mg → "200" */
export const toMg = (amount: string, unit: "mg" | "ug") => (unit === "ug" ? shiftDecimal(amount, -3) : amount);
/** display amount from canonical mg: "0.02" → "20" (µg) */
export const fromMg = (mg: string, unit: "mg" | "ug") => (unit === "ug" ? shiftDecimal(mg, 3) : mg);

/* ------------------------------------------------------------------ */
/* Recommendation (contract statuses)                                  */
/* ------------------------------------------------------------------ */

export type FormulaItem = { nutrientKey: string; amount: string; unit: "mg" | "ug" };
export type Recommendation =
  | { status: "ready"; mode: "demo"; items: FormulaItem[]; omega3: boolean; label: string }
  | { status: "insufficient_data" | "not_supported" | "rule_configuration_missing"; message: string; flags: string[] };

/** profiles an active rulebook would have to cover explicitly; without one: not_supported */
const NEEDS_COVERAGE = ["profile_under_18", "pregnancy_reported", "breastfeeding_reported", "pregnancy_planning_reported", "regular_medication_reported", "condition_reported", "current_supplements_reported"];
/** missing information: insufficient_data */
const NEEDS_DATA = [
  "age_unknown",
  "medication_information_unknown",
  "condition_information_unknown",
  "pregnancy_information_unknown",
  "current_supplement_intake_unknown",
  "supplemental_intake_incomplete",
  "allergen_coverage_incomplete",
];

export function recommend(a: Answers, ctx: Ctx, demoExample: FormulaItem[], omega3Excluded: boolean): Recommendation {
  const { flags } = derive(a, ctx);
  const ui = Q.recommendationEngineContract.failureUi;
  if (!ctx.demo) return { status: "rule_configuration_missing", message: ui.rule_configuration_missing, flags };
  const unsupported = flags.filter((f) => NEEDS_COVERAGE.includes(f));
  if (unsupported.length) return { status: "not_supported", message: ui.not_supported, flags: unsupported };
  const missing = flags.filter((f) => NEEDS_DATA.includes(f));
  if (missing.length) return { status: "insufficient_data", message: ui.insufficient_data, flags: missing };
  // demo only: the briefing's example structure, explicitly labelled, independent of the answers
  return { status: "ready", mode: "demo", items: demoExample, omega3: !omega3Excluded, label: Q.demoDataNotice.demoSuggestionLabel };
}
