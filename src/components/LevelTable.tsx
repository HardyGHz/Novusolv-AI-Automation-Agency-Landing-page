import { useTranslation } from 'react-i18next'

export type LevelRow = {
  /** i18n key prefix, e.g. "packages_page.dev_r1" */
  key: string
  /** rendered instead of the three level cells, for a row that is not per-level */
  span?: string
}

const LEVELS = ['start', 'business', 'privat'] as const

/**
 * Three-level comparison. A wide table reads best on desktop, but a 4-column
 * table on a phone is unusable, so mobile gets one card per level instead.
 */
export default function LevelTable({
  prefix,
  rows,
  prices,
}: {
  prefix: string
  rows: LevelRow[]
  prices: Record<(typeof LEVELS)[number], string>
}) {
  const { t } = useTranslation()

  const levelLabel = (level: string) => t(`packages_page.level_${level}`)

  return (
    <>
      {/* Desktop */}
      <div className="max-md:hidden overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-default">
              <th className="py-4 pr-6 w-[26%]" />
              {LEVELS.map((level) => (
                <th key={level} className="py-4 px-5 text-[17px] font-bold text-heading">
                  {levelLabel(level)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-outline-default/60 align-top">
                <th
                  scope="row"
                  className="py-4 pr-6 text-[14px] font-semibold text-body uppercase tracking-wider"
                >
                  {t(`${prefix}.${row.key}`)}
                </th>
                {LEVELS.map((level) => (
                  <td key={level} className="py-4 px-5 text-[15px] text-heading leading-snug">
                    {t(`${prefix}.${row.key}_${level}`)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="align-top">
              <th
                scope="row"
                className="py-5 pr-6 text-[14px] font-semibold text-body uppercase tracking-wider"
              >
                {t('packages_page.price_row')}
              </th>
              {LEVELS.map((level) => (
                <td
                  key={level}
                  className="py-5 px-5 text-[17px] font-bold text-[#E8630A] tabular-nums"
                >
                  {prices[level]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-5">
        {LEVELS.map((level) => (
          <div
            key={level}
            className="rounded-2xl border border-outline-default bg-surface-card p-6"
          >
            <div className="flex items-baseline justify-between gap-4 pb-4 mb-4 border-b border-outline-default">
              <h4 className="text-[19px] font-bold text-heading">{levelLabel(level)}</h4>
              <span className="text-[16px] font-bold text-[#E8630A] tabular-nums">
                {prices[level]}
              </span>
            </div>
            <dl className="flex flex-col gap-3">
              {rows.map((row) => (
                <div key={row.key}>
                  <dt className="text-[12px] font-semibold text-body uppercase tracking-wider">
                    {t(`${prefix}.${row.key}`)}
                  </dt>
                  <dd className="text-[15px] text-heading leading-snug mt-0.5">
                    {t(`${prefix}.${row.key}_${level}`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  )
}
