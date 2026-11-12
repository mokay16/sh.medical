/**
 * In-network insurance, as listed on sh.health ("In Network Insurances") and in the ENT billing page's participating plans.
 * Details only restate what SH Medical publishes; anything else is "call to confirm".
 */
export type InsuranceKind = 'plan' | 'government' | 'group'

export type Insurer = {
  slug: string
  name: string
  kind: InsuranceKind
  logo?: { src: string; width: number; height: number }
  /** What we accept from this insurer, one line each. */
  details: string[]
  /** Extra words people may type when searching for this plan. */
  aliases?: string[]
}

export const BILLING_PHONE = '(888) 362-5443'

export const KINDS: { id: InsuranceKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'plan', label: 'Health plans' },
  { id: 'government', label: 'Medicare & TRICARE' },
  { id: 'group', label: 'Medical groups' },
]

const logo = (slug: string, width: number, height: number) => ({ src: `/images/insurance/${slug}.png`, width, height })
const HMO_GROUPS = 'HMO plans through the Brown & Toland and Hill Physicians medical groups'
const CONFIRM = 'In network. Call us to confirm your specific plan.'

export const INSURERS: Insurer[] = [
  { slug: 'aetna', name: 'Aetna', kind: 'plan', logo: logo('aetna', 451, 112), details: ['Aetna PPO', HMO_GROUPS] },
  {
    slug: 'anthem-blue-cross',
    name: 'Anthem Blue Cross',
    kind: 'plan',
    logo: logo('anthem-blue-cross', 268, 84),
    details: ['Anthem Blue Cross PPO', HMO_GROUPS],
    aliases: ['blue cross', 'anthem', 'bcbs'],
  },
  { slug: 'cigna', name: 'Cigna', kind: 'plan', logo: logo('cigna', 300, 112), details: ['Cigna / Great-West Healthcare PPO', HMO_GROUPS], aliases: ['great-west', 'great west'] },
  {
    slug: 'unitedhealthcare',
    name: 'UnitedHealthcare',
    kind: 'plan',
    logo: logo('unitedhealthcare', 303, 100),
    details: ['UnitedHealth (PacifiCare) PPO', HMO_GROUPS],
    aliases: ['united', 'uhc', 'pacificare', 'united healthcare', 'unitedhealth'],
  },
  { slug: 'umr', name: 'UMR', kind: 'plan', logo: logo('umr', 308, 163), details: [CONFIRM] },
  { slug: 'geha', name: 'GEHA', kind: 'plan', logo: logo('geha', 436, 114), details: [CONFIRM], aliases: ['government employees health association', 'federal'] },
  {
    slug: 'medicare',
    name: 'Medicare',
    kind: 'government',
    logo: logo('medicare', 278, 85),
    details: ['Medicare', 'Most Medicare supplement plans, such as AARP'],
    aliases: ['aarp', 'medigap', 'supplement'],
  },
  { slug: 'tricare', name: 'TRICARE', kind: 'government', logo: logo('tricare', 317, 159), details: [CONFIRM], aliases: ['military', 'veteran'] },
  {
    slug: 'brown-toland',
    name: 'Brown & Toland Physicians',
    kind: 'group',
    logo: logo('brown-toland', 254, 59),
    details: ['We’re preferred providers with this medical group', 'HMOs: Aetna, Blue Cross, Blue Shield, Cigna, HealthNet, UnitedHealth'],
    aliases: ['brown and toland', 'b&t', 'hmo'],
  },
  {
    slug: 'hill-physicians',
    name: 'Hill Physicians',
    kind: 'group',
    logo: logo('hill-physicians', 310, 162),
    details: ['We’re preferred providers with this medical group', 'HMOs: Aetna, Blue Cross, Blue Shield, Cigna, HealthNet, UnitedHealth'],
    aliases: ['hill', 'hmo'],
  },
  {
    slug: 'meritage',
    name: 'Meritage Medical Network',
    kind: 'group',
    logo: logo('meritage', 260, 73),
    details: ['We’re preferred providers with this medical group'],
    aliases: ['meritage'],
  },
  { slug: 'sutter-health', name: 'Sutter Health', kind: 'group', logo: logo('sutter-health', 472, 107), details: [CONFIRM], aliases: ['sutter'] },
  {
    slug: 'sutter-pamf',
    name: 'Sutter Health Palo Alto Medical Foundation',
    kind: 'group',
    logo: logo('sutter-pamf', 390, 129),
    details: [CONFIRM],
    aliases: ['pamf', 'palo alto medical foundation', 'sutter'],
  },
  // Accepted plans without a logo on sh.health
  { slug: 'blue-shield', name: 'Blue Shield', kind: 'plan', details: ['Blue Shield PPO', HMO_GROUPS], aliases: ['blue shield of california', 'bcbs'] },
  { slug: 'healthnet', name: 'HealthNet', kind: 'plan', details: ['HealthNet PPO', HMO_GROUPS], aliases: ['health net'] },
  { slug: 'sterling', name: 'Sterling Insurance', kind: 'plan', details: ['Sterling Insurance PPO'] },
]

/** Plans SH Medical says it does not take. */
export const NOT_ACCEPTED = [{ match: ['medi-cal', 'medi cal', 'medicaid', 'medical managed'], text: 'We don’t participate with Medi-Cal or its managed care plans.' }]
