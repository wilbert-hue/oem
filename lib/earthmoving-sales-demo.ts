export const EQUIPMENT_CATEGORIES = [
  'Excavators',
  'Wheel Loaders',
  'Backhoe Loaders',
  'Bulldozers / Dozers',
  'Motor Graders',
  'Dump Trucks',
  'Compactors / Rollers',
  'Scrapers',
  'Trenchers',
  'Pipe Layers',
] as const

export const EARTHMOVING_OEMS = [
  'Caterpillar',
  'Komatsu',
  'Volvo Construction Equipment',
  'Hitachi Construction Machinery',
  'Liebherr',
  'SANY',
  'XCMG',
  'JCB',
  'Zoomlion',
  'Kobelco Construction Machinery',
  'HD Hyundai Construction Equipment',
  'CASE Construction Equipment',
  'Bobcat',
  'BOMAG',
  'Shantui',
  'HİDROMEK',
  'Bell Equipment',
  'Wacker Neuson',
  'Ammann Group',
] as const

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number]
export type EarthmovingOem = (typeof EARTHMOVING_OEMS)[number]

export type QuarterId = 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4'

/** GCC members: used in demo data and under the “GCC” group in the country filter. */
export const GCC_FILTER_COUNTRIES = [
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
] as const

/** Other Middle East markets: under the “Middle East Countries” group in the filter. */
export const MIDDLE_EAST_FILTER_COUNTRIES = [
  'Turkey',
  'Israel',
  'Egypt',
  'Iran',
  'Iraq',
  'Other Middle East Countries',
] as const

/** Hierarchical groups for the country dropdown (`<optgroup>` labels + options). */
export const COUNTRY_FILTER_GROUPS = [
  { label: 'GCC', countries: GCC_FILTER_COUNTRIES },
  { label: 'Middle East Countries', countries: MIDDLE_EAST_FILTER_COUNTRIES },
] as const

/** Flat union of every country that may appear in the table or filter. */
export const ALL_FILTER_COUNTRIES = [...GCC_FILTER_COUNTRIES, ...MIDDLE_EAST_FILTER_COUNTRIES] as const

export type CountryFilterOption = (typeof ALL_FILTER_COUNTRIES)[number]

export const ALLOWED_DEMO_COUNTRIES: ReadonlySet<string> = new Set(ALL_FILTER_COUNTRIES)

export type SalesDemoRow = {
  oem: EarthmovingOem
  equipmentType: string
  category: EquipmentCategory
  model: string
  tonnageClass: string
  country: string
  region: string
  city: string
  /** year → month (1–12) → units sold */
  units: Record<number, Record<number, number>>
}

export function rowMatchesCountryFilter(
  row: SalesDemoRow,
  filter: CountryFilterOption | 'all',
): boolean {
  if (filter === 'all') return true
  return row.country === filter
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function monthName(m: number): string {
  return MONTH_NAMES[m - 1] ?? ''
}

export const QUARTER_MONTHS: Record<Exclude<QuarterId, 'all'>, readonly number[]> = {
  Q1: [1, 2, 3],
  Q2: [4, 5, 6],
  Q3: [7, 8, 9],
  Q4: [10, 11, 12],
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i)
  return Math.abs(h)
}

const GEO = [
  { country: 'Saudi Arabia', region: 'GCC', city: 'Jeddah' },
  { country: 'Saudi Arabia', region: 'GCC', city: 'Riyadh' },
  { country: 'United Arab Emirates', region: 'GCC', city: 'Dubai' },
  { country: 'United Arab Emirates', region: 'GCC', city: 'Abu Dhabi' },
  { country: 'Qatar', region: 'GCC', city: 'Doha' },
  { country: 'Kuwait', region: 'GCC', city: 'Kuwait City' },
  { country: 'Oman', region: 'GCC', city: 'Muscat' },
  { country: 'Bahrain', region: 'GCC', city: 'Manama' },
  { country: 'Turkey', region: 'Middle East', city: 'Istanbul' },
  { country: 'Israel', region: 'Middle East', city: 'Tel Aviv' },
  { country: 'Egypt', region: 'Middle East', city: 'Cairo' },
  { country: 'Iran', region: 'Middle East', city: 'Tehran' },
  { country: 'Iraq', region: 'Middle East', city: 'Baghdad' },
  { country: 'Other Middle East Countries', region: 'Middle East', city: 'Regional hub' },
] as const satisfies ReadonlyArray<{ country: CountryFilterOption; region: string; city: string }>

const TEMPLATES: Array<{
  equipmentType: string
  category: EquipmentCategory
  models: string[]
  tonnage: string[]
}> = [
  {
    equipmentType: 'Tracked Excavator',
    category: 'Excavators',
    models: ['349', '350', '320GX', '336'],
    tonnage: ['36–45 Tonne', '45.1–50.0 Tonne', '18.1–21.0 Tonne'],
  },
  {
    equipmentType: 'Wheel Loader',
    category: 'Wheel Loaders',
    models: ['980M', '972M', 'L260H'],
    tonnage: ['Large', 'Medium', 'Compact'],
  },
  {
    equipmentType: 'Backhoe Loader',
    category: 'Backhoe Loaders',
    models: ['434', '3CX', 'B95'],
    tonnage: ['Standard', 'HT'],
  },
  {
    equipmentType: 'Crawler Dozer',
    category: 'Bulldozers / Dozers',
    models: ['D6', 'D8', 'PR 776'],
    tonnage: ['Medium', 'Large'],
  },
  {
    equipmentType: 'Motor Grader',
    category: 'Motor Graders',
    models: ['140', '16', '836 AWD'],
    tonnage: ['Class A', 'Class B'],
  },
  {
    equipmentType: 'Rigid Dump Truck',
    category: 'Dump Trucks',
    models: ['775G', '730C', 'HD785'],
    tonnage: ['51–75 Tonne', '30–40 Tonne'],
  },
  {
    equipmentType: 'Soil Compactor',
    category: 'Compactors / Rollers',
    models: ['CS78B', 'CA2500'],
    tonnage: ['12–14 Tonne'],
  },
  {
    equipmentType: 'Elevating Scraper',
    category: 'Scrapers',
    models: ['637K'],
    tonnage: ['Open bowl'],
  },
  {
    equipmentType: 'Chain Trencher',
    category: 'Trenchers',
    models: ['T655'],
    tonnage: ['Heavy duty'],
  },
  {
    equipmentType: 'Pipe Layer',
    category: 'Pipe Layers',
    models: ['PL61', '561N'],
    tonnage: ['56–75 Tonne'],
  },
]

function unitsForKey(seed: number, year: number, month: number): number {
  const h = hashStr(`${seed}|${year}|${month}`)
  if (h % 17 === 0) return 0
  return (h % 4) + 1
}

function buildUnitsMatrix(seed: number): Record<number, Record<number, number>> {
  const out: Record<number, Record<number, number>> = {}
  for (const year of [2025, 2026]) {
    out[year] = {}
    for (let m = 1; m <= 12; m++) {
      out[year][m] = unitsForKey(seed, year, m)
    }
  }
  return out
}

export function buildEarthmovingSalesDemoRows(): SalesDemoRow[] {
  const rows: SalesDemoRow[] = []
  let lineId = 0

  for (const oem of EARTHMOVING_OEMS) {
    const count = 2 + (hashStr(oem) % 3)
    for (let i = 0; i < count; i++) {
      const tmpl = TEMPLATES[(hashStr(`${oem}-${i}`) + i) % TEMPLATES.length]
      const g = GEO[hashStr(`${oem}-${lineId}`) % GEO.length]
      const model = tmpl.models[hashStr(`${oem}-m${lineId}`) % tmpl.models.length]
      const tonnageClass = tmpl.tonnage[hashStr(`${oem}-t${lineId}`) % tmpl.tonnage.length]
      rows.push({
        oem,
        equipmentType: tmpl.equipmentType,
        category: tmpl.category,
        model,
        tonnageClass,
        country: g.country,
        region: g.region,
        city: g.city,
        units: buildUnitsMatrix(++lineId),
      })
    }
  }
  return rows
}

export function groupMonthsByQuarter(months: number[]): { quarter: 1 | 2 | 3 | 4; months: number[] }[] {
  const quarterOf = (m: number) => Math.ceil(m / 3) as 1 | 2 | 3 | 4
  const groups: { quarter: 1 | 2 | 3 | 4; months: number[] }[] = []
  for (const m of months) {
    const q = quarterOf(m)
    const last = groups[groups.length - 1]
    if (last && last.quarter === q) last.months.push(m)
    else groups.push({ quarter: q, months: [m] })
  }
  return groups
}

export const DEMO_ROWS: SalesDemoRow[] = buildEarthmovingSalesDemoRows()
