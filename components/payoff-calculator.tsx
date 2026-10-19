'use client';

import { useId, useState } from 'react';
import { Calculator, CircleDollarSign } from 'lucide-react';

const cad = (value: number) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

type PayoffDebt = { balance: number; rate: number; pay: number };
type PayoffResult = { months: number; interest: number; clears: number[]; done: boolean };
const PAYOFF_MAX_MONTHS = 600;

/**
 * Month-by-month payoff model, the same rules as the Canadian Debt Payoff Tool workbook: interest is
 * the opening balance × rate ÷ 12, every required payment is made, then the rest of a fixed monthly
 * budget (required payments + extra) goes down the priority order. A cleared debt's payment stays in
 * the budget, so it rolls to the next target.
 */
export function payoffPlan(debts: PayoffDebt[], extra: number, order: number[]): PayoffResult {
  const bal = debts.map((d) => d.balance);
  const clears = debts.map(() => 0);
  const budget = debts.reduce((sum, d) => sum + d.pay, 0) + extra;
  let months = 0;
  let interest = 0;
  while (bal.some((b) => b > 0.005) && months < PAYOFF_MAX_MONTHS) {
    months += 1;
    let pool = budget;
    debts.forEach((d, i) => {
      if (bal[i] > 0.005) {
        const monthly = (bal[i] * d.rate) / 1200;
        bal[i] += monthly;
        interest += monthly;
      }
    });
    debts.forEach((d, i) => {
      if (bal[i] > 0.005) {
        const pay = Math.min(d.pay, bal[i]);
        bal[i] -= pay;
        pool -= pay;
      }
    });
    for (const i of order) {
      if (pool > 0 && bal[i] > 0.005) {
        const pay = Math.min(pool, bal[i]);
        bal[i] -= pay;
        pool -= pay;
      }
    }
    bal.forEach((b, i) => {
      if (b <= 0.005 && !clears[i]) clears[i] = months;
    });
  }
  return { months, interest, clears, done: !bal.some((b) => b > 0.005) };
}

/** Snowball vs avalanche for up to four debts (item.detail = "name:balance:rate:payment" entries, item.amount = extra). */
export function PayoffCalculator({
  heading,
  intro,
  label,
  items,
}: {
  heading?: string;
  intro?: string;
  label?: string;
  items: { title: string; amount?: string; detail?: string }[];
}) {
  const parse = (detail?: string) =>
    [0, 1, 2, 3].map((i) => {
      const [name = '', balance = '', rate = '', pay = ''] = (detail?.split(',')[i] ?? '').split(':');
      return { name, balance, rate, pay };
    });
  const first = items[0];
  const [debts, setDebts] = useState(parse(first?.detail));
  const [extra, setExtra] = useState(first?.amount ?? '');
  const id = useId();
  const rows = debts.map((d, i) => {
    const balance = Number(d.balance),
      rate = Number(d.rate),
      pay = Number(d.pay);
    const ok =
      d.balance !== '' &&
      d.rate !== '' &&
      d.pay !== '' &&
      balance > 0 &&
      rate >= 0 &&
      pay > 0 &&
      Number.isFinite(rate);
    return { i, ok, balance, rate, pay };
  });
  const live = rows.filter((r) => r.ok);
  const extraValue = extra === '' ? 0 : Number(extra);
  const extraOk = Number.isFinite(extraValue) && extraValue >= 0;
  const name = (i: number) => debts[i].name || `Debt ${i + 1}`;
  const update = (i: number, key: 'balance' | 'rate' | 'pay', value: string) =>
    setDebts((prev) => prev.map((d, j) => (j === i ? { ...d, [key]: value } : d)));
  const models = debts.map((d) => ({
    balance: Number(d.balance),
    rate: Number(d.rate),
    pay: Number(d.pay),
  }));
  const ready = live.length >= 2 && extraOk;
  // Snowball: smallest balance first. Avalanche: highest rate first, smaller balance breaks a tie.
  const snowOrder = live.map((r) => r.i).sort((a, b) => models[a].balance - models[b].balance);
  const avaOrder = live
    .map((r) => r.i)
    .sort((a, b) => models[b].rate - models[a].rate || models[a].balance - models[b].balance);
  const plan = (order: number[]) => {
    const result = payoffPlan(
      live.map((r) => models[r.i]),
      extraValue,
      order.map((i) => live.findIndex((r) => r.i === i)),
    );
    const byDebt: Record<number, number> = {};
    live.forEach((r, k) => (byDebt[r.i] = result.clears[k]));
    return { ...result, byDebt };
  };
  const snow = ready ? plan(snowOrder) : undefined;
  const ava = ready ? plan(avaOrder) : undefined;
  const both = snow && ava && snow.done && ava.done ? { snow, ava } : undefined;
  const secondWin = (r: { byDebt: Record<number, number> }) =>
    Object.values(r.byDebt).sort((a, b) => a - b)[1];
  const months = (n: number) => `${n} month${n === 1 ? '' : 's'}`;
  const saving = both ? both.snow.interest - both.ava.interest : 0;
  const earlier = both ? secondWin(both.ava) - secondWin(both.snow) : 0;
  const finishGap = both ? both.snow.months - both.ava.months : 0;
  return (
    <div
      className="score-frame util-frame conv-frame loan-frame payoff-frame"
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <div className="score-explorer util-calculator">
        <div className="score-explorer-head">
          <div>
            <Calculator aria-hidden="true" />
            <div className="conv-title">
              {label && <span>{label}</span>}
              <h3 id={`${id}-title`}>{heading}</h3>
            </div>
          </div>
          <strong>LIVE</strong>
        </div>
        {intro && <p className="util-intro">{intro}</p>}
        <div className="util-field loan-borrowed">
          <label className="score-number-label" htmlFor={`${id}-extra`}>
            EXTRA EACH MONTH
          </label>
          <div className="conv-money">
            <span aria-hidden="true">$</span>
            <input
              id={`${id}-extra`}
              className="score-number-input"
              type="number"
              inputMode="decimal"
              min="0"
              max="1000000"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
            />
          </div>
        </div>
        <div className="loan-offers">
          {debts.map((d, i) => (
            <fieldset key={i}>
              <legend>{name(i).toUpperCase()}</legend>
              <div className="loan-field">
                <label htmlFor={`${id}-bal-${i}`}>Balance</label>
                <div className="conv-money">
                  <span aria-hidden="true">$</span>
                  <input
                    id={`${id}-bal-${i}`}
                    className="score-number-input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100000000"
                    value={d.balance}
                    onChange={(e) => update(i, 'balance', e.target.value)}
                  />
                </div>
              </div>
              <div className="loan-field">
                <label htmlFor={`${id}-rate-${i}`}>Annual rate (%)</label>
                <input
                  id={`${id}-rate-${i}`}
                  className="score-number-input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.01"
                  value={d.rate}
                  onChange={(e) => update(i, 'rate', e.target.value)}
                />
              </div>
              <div className="loan-field">
                <label htmlFor={`${id}-pay-${i}`}>Required payment</label>
                <div className="conv-money">
                  <span aria-hidden="true">$</span>
                  <input
                    id={`${id}-pay-${i}`}
                    className="score-number-input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="1000000"
                    value={d.pay}
                    onChange={(e) => update(i, 'pay', e.target.value)}
                  />
                </div>
              </div>
              <p aria-live="polite">
                {rows[i].ok && both ? (
                  <>
                    <span>
                      Snowball clears in month <b>{both.snow.byDebt[i]}</b>
                    </span>
                    <span>
                      Avalanche clears in month <b>{both.ava.byDebt[i]}</b>
                    </span>
                  </>
                ) : (
                  <span>{rows[i].ok ? '' : 'Leave blank to skip, or fill in all three.'}</span>
                )}
              </p>
            </fieldset>
          ))}
        </div>
        <div className="score-live-result conv-result" aria-live="polite">
          <CircleDollarSign aria-hidden="true" />
          <div>
            <strong>
              {!ready
                ? 'Enter at least two debts, each with a balance, a rate and a required payment.'
                : !both
                  ? 'These payments do not clear the debts within 50 years. Raise a payment or the extra amount.'
                  : saving > 0.5
                    ? `Avalanche costs about ${cad(Math.round(saving))} less interest.`
                    : saving < -0.5
                      ? `Snowball costs about ${cad(Math.round(-saving))} less interest.`
                      : 'Both routes cost about the same interest.'}
            </strong>
            {both && (
              <p>
                {earlier > 0
                  ? `Snowball clears the second debt ${months(earlier)} sooner.`
                  : earlier < 0
                    ? `Avalanche clears the second debt ${months(-earlier)} sooner.`
                    : 'Both routes clear the second debt in the same month.'}{' '}
                {finishGap > 0
                  ? `Avalanche finishes ${months(finishGap)} earlier.`
                  : finishGap < 0
                    ? `Snowball finishes ${months(-finishGap)} earlier.`
                    : 'Both finish in the same month.'}
              </p>
            )}
          </div>
        </div>
        {both && (
          <div className="conv-split">
            <div>
              <span>Snowball</span>
              <strong>{cad(Math.round(both.snow.interest))} interest</strong>
              <small>{months(both.snow.months)}</small>
            </div>
            <div>
              <span>Avalanche</span>
              <strong>{cad(Math.round(both.ava.interest))} interest</strong>
              <small>{months(both.ava.months)}</small>
            </div>
            <div className={saving < -0.5 ? 'is-flag' : undefined}>
              <span>Interest difference</span>
              <strong>{cad(Math.round(Math.abs(saving)))}</strong>
              <small>
                {saving < -0.5 ? 'Snowball is cheaper' : saving > 0.5 ? 'Avalanche is cheaper' : 'About equal'}
              </small>
            </div>
          </div>
        )}
        <p className="conv-note">
          A training model: interest is added monthly at the yearly rate ÷ 12, payments land at month-end, rates
          and payments stay fixed, and there are no new charges, fees or missed payments. Real statements will
          differ.
        </p>
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const target = parse(item.detail);
                const active =
                  extra === (item.amount ?? '') &&
                  debts.every(
                    (d, i) =>
                      d.name === target[i].name &&
                      d.balance === target[i].balance &&
                      d.rate === target[i].rate &&
                      d.pay === target[i].pay,
                  );
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setDebts(parse(item.detail));
                      setExtra(item.amount ?? '');
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
