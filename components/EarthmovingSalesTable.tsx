'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  ALLOWED_DEMO_COUNTRIES,
  COUNTRY_FILTER_GROUPS,
  DEMO_ROWS,
  EARTHMOVING_OEMS,
  EQUIPMENT_CATEGORIES,
  type CountryFilterOption,
  type EarthmovingOem,
  type EquipmentCategory,
  type QuarterId,
  type SalesDemoRow,
  groupMonthsByQuarter,
  monthName,
  QUARTER_MONTHS,
  rowMatchesCountryFilter,
} from '@/lib/earthmoving-sales-demo'

const YEARS = [2025, 2026] as const

type MonthFilter = 'all' | number

function toggleInSet<T extends string>(set: Set<T>, value: T, checked: boolean): Set<T> {
  const next = new Set(set)
  if (checked) next.add(value)
  else next.delete(value)
  return next
}

function visibleMonths(year: number, quarter: QuarterId, month: MonthFilter): number[] {
  let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  if (quarter !== 'all') {
    months = [...QUARTER_MONTHS[quarter]]
  }
  if (month !== 'all') {
    months = months.includes(month) ? [month] : months
  }
  return months
}

function filterRows(
  rows: SalesDemoRow[],
  categories: Set<EquipmentCategory>,
  oems: Set<EarthmovingOem>,
): SalesDemoRow[] {
  return rows.filter(
    (r) => (categories.size === 0 || categories.has(r.category)) && (oems.size === 0 || oems.has(r.oem)),
  )
}

/** rowspan for OEM column; null = this row continues under previous OEM cell */
function oemRowSpan(rows: SalesDemoRow[], index: number): number | null {
  if (index > 0 && rows[index - 1].oem === rows[index].oem) return null
  let span = 1
  for (let i = index + 1; i < rows.length; i++) {
    if (rows[i].oem === rows[index].oem) span++
    else break
  }
  return span
}

const selectClassName =
  'min-h-11 min-w-[8.5rem] rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20'

const countrySelectClassName = `${selectClassName} min-w-[12rem] max-w-[20rem] sm:min-w-[14rem]`

function FilterCheckList<T extends string>(props: {
  title: string
  options: readonly T[]
  selected: Set<T>
  onChange: (next: Set<T>) => void
}) {
  const { title, options, selected, onChange } = props
  const allSelected = selected.size === options.length
  const noneSelected = selected.size === 0

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-900/[0.04]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-slate-600">{title}</h3>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onChange(new Set(options))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onChange(new Set())}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        {noneSelected ? 'Showing all items' : allSelected ? 'All items selected' : `${selected.size} of ${options.length} selected`}
      </p>
      <ul className="max-h-[min(22rem,calc(100vh-14rem))] space-y-0.5 overflow-y-auto pr-2 text-[15px] leading-snug sidebar-scroll">
        {options.map((opt) => (
          <li key={opt}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-slate-50">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500/30"
                checked={selected.has(opt)}
                onChange={(e) => onChange(toggleInSet(selected, opt, e.target.checked))}
              />
              <span className="text-slate-800">{opt}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function EarthmovingSalesTable() {
  const [categorySel, setCategorySel] = useState<Set<EquipmentCategory>>(new Set())
  const [oemSel, setOemSel] = useState<Set<EarthmovingOem>>(new Set())
  const [year, setYear] = useState<(typeof YEARS)[number]>(2025)
  const [quarter, setQuarter] = useState<QuarterId>('all')
  const [month, setMonth] = useState<MonthFilter>('all')
  const [countryFilter, setCountryFilter] = useState<CountryFilterOption | 'all'>('all')

  useEffect(() => {
    if (month === 'all' || quarter === 'all') return
    const allowed = QUARTER_MONTHS[quarter]
    if (!allowed.includes(month as number)) {
      setMonth('all')
    }
  }, [quarter, month])

  const months = useMemo(() => visibleMonths(year, quarter, month), [year, quarter, month])
  const headerGroups = useMemo(() => groupMonthsByQuarter(months), [months])
  const rows = useMemo(() => {
    return filterRows(DEMO_ROWS, categorySel, oemSel)
      .filter((r) => ALLOWED_DEMO_COUNTRIES.has(r.country))
      .filter((r) => rowMatchesCountryFilter(r, countryFilter))
  }, [categorySel, oemSel, countryFilter])

  const monthOptions = useMemo(() => {
    const base = quarter === 'all' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [...QUARTER_MONTHS[quarter]]
    return base
  }, [quarter])

  const tdBase = 'border-b border-slate-200 px-4 py-3.5 align-top text-[15px] text-slate-800'
  const tdMuted = `${tdBase} text-slate-600`
  /* High z-index + opaque backgrounds: low z + semi-transparent headers lets tbody paint over thead in WebKit/Blink. */
  const thStickyTop1 =
    'sticky top-0 z-[60] border-b border-slate-200 bg-slate-50 shadow-[0_1px_0_0_rgb(226_232_240)]'
  const thStickyTop2 =
    'sticky top-[4.25rem] z-[50] border-b border-slate-200 bg-slate-100 shadow-[0_1px_0_0_rgb(226_232_240)]'
  const thStickyMonth = `${thStickyTop2} !bg-teal-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_0_0_rgb(226_232_240)]`

  return (
    <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 space-y-5 lg:w-[20rem] xl:w-[22rem]">
        <FilterCheckList
          title="Equipment category coverage"
          options={EQUIPMENT_CATEGORIES}
          selected={categorySel}
          onChange={setCategorySel}
        />
        <FilterCheckList
          title="Earthmoving Equipment OEMs"
          options={EARTHMOVING_OEMS}
          selected={oemSel}
          onChange={setOemSel}
        />
      </aside>

      <section className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-900/[0.04] sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-1 flex-wrap gap-4">
            <div className="flex min-w-[140px] flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="sales-year">
                Year
              </label>
              <select
                id="sales-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value) as (typeof YEARS)[number])}
                className={selectClassName}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex min-w-[160px] flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="sales-quarter">
                Quarter
              </label>
              <select
                id="sales-quarter"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as QuarterId)}
                className={selectClassName}
              >
                <option value="all">All quarters</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
            <div className="flex min-w-[160px] flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="sales-month">
                Month
              </label>
              <select
                id="sales-month"
                value={month === 'all' ? 'all' : String(month)}
                onChange={(e) => {
                  const v = e.target.value
                  setMonth(v === 'all' ? 'all' : Number(v))
                }}
                className={selectClassName}
              >
                <option value="all">All months</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {monthName(m)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex min-w-[12rem] max-w-full flex-col gap-2 sm:min-w-[14rem]">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="sales-country">
                Country
              </label>
              <select
                id="sales-country"
                value={countryFilter}
                onChange={(e) =>
                  setCountryFilter(e.target.value === 'all' ? 'all' : (e.target.value as CountryFilterOption))
                }
                className={countrySelectClassName}
              >
                <option value="all">All countries</option>
                {COUNTRY_FILTER_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto sm:pb-1">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {rows.length} row{rows.length === 1 ? '' : 's'}
            </span>
            <span className="hidden text-xs text-slate-500 sm:inline">demo units sold</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="rounded-full border border-sky-200/80 bg-gradient-to-b from-sky-50 to-sky-100/90 px-10 py-2.5 font-mono text-sm font-semibold tracking-tight text-slate-900 shadow-sm">
            Year — {year}
          </div>
        </div>

        {year === 2026 && (
          <div
            role="alert"
            aria-live="polite"
            className="flex gap-4 rounded-xl border border-amber-400/90 bg-amber-50 px-4 py-4 shadow-md ring-1 ring-amber-900/10 sm:items-start sm:gap-4 sm:px-5 sm:py-5"
          >
            <div className="mt-0.5 shrink-0 text-amber-600" aria-hidden>
              <AlertTriangle className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Alert</p>
              <div className="space-y-2 text-sm font-semibold leading-relaxed text-amber-950 sm:text-[15px]">
                <p>
                  Please note: As of today, 2026 data can be provided only for Quarter 1 (January, February, and March).
                </p>
                <p>
                  The remaining 2026 data for Quarter 2, Quarter 3, and Quarter 4 will be provided after the end of the
                  respective quarters.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-900/[0.05]">
          <div className="isolate max-h-[min(70vh,calc(100vh-12rem))] overflow-auto">
            <table className="min-w-[72rem] w-full border-collapse text-left">
              <thead className="[&_th]:align-middle">
                <tr>
                  <th
                    colSpan={7}
                    className={`${thStickyTop1} px-5 py-4 text-left text-base font-semibold tracking-tight text-slate-800`}
                  >
                    Earthmoving OEM sales records (quantity)
                  </th>
                  {headerGroups.map((g) => (
                    <th
                      key={g.quarter}
                      colSpan={g.months.length}
                      className={`${thStickyTop1} !bg-teal-700 px-4 py-4 text-center text-sm font-semibold leading-snug text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`}
                    >
                      <span className="hidden lg:inline">Quarter {g.quarter} — Sales in units (quantity sold)</span>
                      <span className="lg:hidden">Q{g.quarter}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {['OEM', 'Equipment type', 'Model', 'Class', 'Country', 'Region', 'City'].map((h) => (
                    <th
                      key={h}
                      className={`${thStickyTop2} min-w-[7.5rem] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-600 first:pl-5`}
                    >
                      {h}
                    </th>
                  ))}
                  {months.map((m) => (
                    <th
                      key={m}
                      className={`${thStickyMonth} min-w-[4.5rem] px-3 py-3.5 text-center text-xs font-semibold text-white`}
                    >
                      {monthName(m)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="relative z-0 bg-white">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7 + months.length}
                      className="px-5 py-16 text-center text-[15px] text-slate-500"
                    >
                      No rows match the selected filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => {
                    const span = oemRowSpan(rows, idx)
                    const rowBg = idx % 2 === 1 ? 'bg-slate-50/85' : 'bg-white'
                    return (
                      <tr key={`${row.oem}-${row.model}-${row.city}-${row.equipmentType}-${idx}`}>
                        {span !== null && (
                          <td
                            rowSpan={span}
                            className={`${tdBase} border-r border-slate-200 bg-slate-100/90 align-middle font-semibold text-slate-900 first:pl-5`}
                          >
                            {row.oem}
                          </td>
                        )}
                        <td className={`${tdBase} max-w-[11rem] ${rowBg}`}>{row.equipmentType}</td>
                        <td className={`${tdBase} ${rowBg}`}>{row.model}</td>
                        <td className={`${tdMuted} max-w-[10rem] ${rowBg}`}>{row.tonnageClass}</td>
                        <td className={`${tdBase} ${rowBg}`}>{row.country}</td>
                        <td className={`${tdBase} ${rowBg}`}>{row.region}</td>
                        <td className={`${tdBase} border-r border-slate-200 ${rowBg}`}>{row.city}</td>
                        {months.map((m) => {
                          const v = row.units[year]?.[m] ?? 0
                          const display = v === 0 ? '—' : String(v)
                          return (
                            <td
                              key={m}
                              className={`${tdBase} border-l border-slate-100/90 ${rowBg} text-center font-mono text-[15px] tabular-nums text-slate-900`}
                            >
                              {display}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Note: All figures in this view are demo data for layout and filtering only, consistent with the deliverable
          workbook structure.
        </p>
      </section>
    </div>
  )
}
