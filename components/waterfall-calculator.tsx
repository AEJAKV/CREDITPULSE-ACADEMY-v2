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

const MAX_JOBS = 8;

/**
 * Sunny-month waterfall: (income − baseline) is the surplus, and every dollar of it gets a job.
 * item.amount = income received, item.detail = "baseline;Job:amount,Job:amount,…" (up to 8 jobs).
 */
export function WaterfallCalculator({
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
  const parse = (detail?: string) => {
    const [baseline = '', rest = ''] = (detail ?? '').split(';');
    const jobs = rest
      .split(',')
      .filter(Boolean)
      .slice(0, MAX_JOBS)
      .map((entry) => {
        const [name = '', amount = ''] = entry.split(':');
        return { name, amount };
      });
    return { baseline, jobs };
  };
  const first = items[0];
  const start = parse(first?.detail);
  const [income, setIncome] = useState(first?.amount ?? '');
  const [baseline, setBaseline] = useState(start.baseline);
  const [jobs, setJobs] = useState(start.jobs);
  const id = useId();

  const money = (value: string) => (value === '' ? NaN : Number(value));
  const incomeValue = money(income);
  const baselineValue = money(baseline);
  const ready =
    Number.isFinite(incomeValue) && Number.isFinite(baselineValue) && incomeValue >= 0 && baselineValue >= 0;
  const gap = ready ? incomeValue - baselineValue : 0;
  const sunny = ready && gap > 0;
  const storm = ready && gap < 0;
  const assigned = jobs.reduce((sum, job) => {
    const n = Number(job.amount);
    return sum + (Number.isFinite(n) && n > 0 ? n : 0);
  }, 0);
  const left = Math.round((gap - assigned) * 100) / 100;
  const setJob = (i: number, value: string) =>
    setJobs((prev) => prev.map((job, j) => (j === i ? { ...job, amount: value } : job)));
  const share = (job: { amount: string }) => {
    const n = Number(job.amount);
    return sunny && Number.isFinite(n) && n > 0 ? Math.min(100, (n / gap) * 100) : 0;
  };

  return (
    <div
      className="score-frame util-frame conv-frame loan-frame waterfall-frame"
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
        <div className="waterfall-top">
          <div className="util-field">
            <label className="score-number-label" htmlFor={`${id}-income`}>
              INCOME RECEIVED THIS MONTH
            </label>
            <div className="conv-money">
              <span aria-hidden="true">$</span>
              <input
                id={`${id}-income`}
                className="score-number-input"
                type="number"
                inputMode="decimal"
                min="0"
                max="100000000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>
          </div>
          <div className="util-field">
            <label className="score-number-label" htmlFor={`${id}-baseline`}>
              YOUR BASELINE
            </label>
            <div className="conv-money">
              <span aria-hidden="true">$</span>
              <input
                id={`${id}-baseline`}
                className="score-number-input"
                type="number"
                inputMode="decimal"
                min="0"
                max="100000000"
                value={baseline}
                onChange={(e) => setBaseline(e.target.value)}
              />
            </div>
          </div>
        </div>
        {sunny && (
          <div className="waterfall-jobs" role="group" aria-label="Jobs for the surplus">
            {jobs.map((job, i) => (
              <div className="waterfall-job" key={i}>
                <label htmlFor={`${id}-job-${i}`}>
                  <span aria-hidden="true">{i + 1}</span>
                  {job.name || `Job ${i + 1}`}
                </label>
                <div className="conv-money">
                  <span aria-hidden="true">$</span>
                  <input
                    id={`${id}-job-${i}`}
                    className="score-number-input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100000000"
                    value={job.amount}
                    onChange={(e) => setJob(i, e.target.value)}
                  />
                </div>
                <i aria-hidden="true">
                  <b style={{ width: `${share(job)}%` }} />
                </i>
              </div>
            ))}
          </div>
        )}
        <div className="score-live-result conv-result" aria-live="polite">
          <CircleDollarSign aria-hidden="true" />
          <div>
            <strong>
              {!ready
                ? 'Enter the income you received and your baseline.'
                : storm
                  ? `Income is ${cad(-gap)} below your baseline. This is a storm month.`
                  : !sunny
                    ? 'Income matches your baseline. There is no surplus to assign.'
                    : left === 0
                      ? `Every dollar of the ${cad(gap)} surplus has a job.`
                      : left > 0
                        ? `${cad(left)} of the ${cad(gap)} surplus still has no job.`
                        : `You have assigned ${cad(-left)} more than the ${cad(gap)} surplus.`}
            </strong>
            {ready && (
              <p>
                {storm
                  ? 'Cover essentials first, move the gap from your income buffer, and pause lower priorities before you reach for credit.'
                  : !sunny
                    ? 'Send the baseline to the household and keep the account balance where it is.'
                    : left === 0
                      ? 'Assign it before you spend it, and the account balance stops posing as permission.'
                      : left > 0
                        ? 'Give it a job before you spend it. Unassigned money drifts toward the weekend trip.'
                        : 'Trim a job, or recheck the income and baseline.'}
              </p>
            )}
          </div>
        </div>
        {sunny && (
          <div className="conv-split">
            <div>
              <span>Surplus above baseline</span>
              <strong>{cad(gap)}</strong>
            </div>
            <div>
              <span>Assigned</span>
              <strong>{cad(assigned)}</strong>
            </div>
            <div className={left === 0 ? undefined : 'is-flag'}>
              <span>Unassigned</span>
              <strong>{cad(left)}</strong>
            </div>
          </div>
        )}
        <p className="conv-note">
          Tax and remittance amounts depend on your situation. Use the figure you confirmed from CRA guidance or a
          qualified adviser, not a guess.
        </p>
        {items.length > 0 && (
          <div className="conv-examples">
            <span>TRY AN EXAMPLE</span>
            <div>
              {items.map((item) => {
                const target = parse(item.detail);
                const active =
                  income === (item.amount ?? '') &&
                  baseline === target.baseline &&
                  jobs.length === target.jobs.length &&
                  jobs.every((job, i) => job.name === target.jobs[i].name && job.amount === target.jobs[i].amount);
                return (
                  <button
                    type="button"
                    key={item.title}
                    aria-pressed={active}
                    onClick={() => {
                      setIncome(item.amount ?? '');
                      setBaseline(target.baseline);
                      setJobs(target.jobs);
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
