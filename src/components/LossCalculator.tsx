import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** Average weeks in a month. Same constant the internal assessment tool uses. */
const WEEKS_PER_MONTH = 4.33

function NumberField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-medium text-heading">{label}</span>
      {hint && <span className="text-[12.5px] text-body leading-snug">{hint}</span>}
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="mt-0.5 h-12 px-4 rounded-xl bg-surface-default border border-outline-default text-heading text-[16px] tabular-nums outline-none transition-colors focus:border-[#E8630A] focus-visible:ring-2 focus-visible:ring-[#E8630A]/30"
      />
    </label>
  )
}

export default function LossCalculator({ onRequest }: { onRequest: () => void }) {
  const { t, i18n } = useTranslation()

  const [events, setEvents] = useState('')
  const [avgValue, setAvgValue] = useState('')
  const [hoursWeek, setHoursWeek] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')

  const num = (v: string) => {
    const parsed = Number.parseFloat(v)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }

  const monthly = num(events) * num(avgValue) + num(hoursWeek) * WEEKS_PER_MONTH * num(hourlyRate)
  const locale = i18n.language.startsWith('ro') ? 'ro-RO' : 'en-GB'
  const money = (n: number) =>
    `${Math.round(n).toLocaleString(locale)} ${i18n.language.startsWith('ro') ? 'lei' : 'RON'}`

  return (
    <div className="rounded-3xl border border-outline-default bg-surface-card overflow-hidden">
      <div className="grid grid-cols-2 max-lg:grid-cols-1">
        {/* Inputs */}
        <div className="p-10 max-sm:p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-body">
              {t('calculator.group_revenue')}
            </h3>
            <NumberField
              label={t('calculator.events_label')}
              hint={t('calculator.events_hint')}
              value={events}
              onChange={setEvents}
            />
            <NumberField label={t('calculator.avg_label')} value={avgValue} onChange={setAvgValue} />
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-outline-default">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-body">
              {t('calculator.group_time')}
            </h3>
            <NumberField
              label={t('calculator.hours_label')}
              hint={t('calculator.hours_hint')}
              value={hoursWeek}
              onChange={setHoursWeek}
            />
            <NumberField
              label={t('calculator.rate_label')}
              value={hourlyRate}
              onChange={setHourlyRate}
            />
          </div>
        </div>

        {/* Result */}
        <div className="p-10 max-sm:p-6 bg-[#000814] flex flex-col justify-center gap-6 max-lg:border-t lg:border-l border-[#003566]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
              {t('calculator.result_month')}
            </p>
            {monthly > 0 ? (
              <>
                <p className="text-[52px] max-sm:text-[36px] font-bold tracking-tight bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] bg-clip-text text-transparent leading-none mt-2 tabular-nums">
                  {money(monthly)}
                </p>
                <p className="text-[15px] text-white/60 mt-3 tabular-nums">
                  {t('calculator.result_year')}: {money(monthly * 12)}
                </p>
              </>
            ) : (
              <p className="text-[20px] text-white/30 mt-3 leading-snug">{t('calculator.empty')}</p>
            )}
          </div>

          <p className="text-[13px] text-white/50 leading-relaxed border-t border-[#003566] pt-5">
            {t('calculator.disclaimer')}
          </p>

          <button
            onClick={onRequest}
            className="font-semibold inline-flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#E8630A] to-[#FF8C2A] text-[#000814] hover:from-[#D05A09] hover:to-[#E87020] py-3 px-7 h-[50px] rounded-xl transition-all shadow-lg shadow-[#E8630A]/25 hover:shadow-[#E8630A]/40 hover:-translate-y-0.5 group text-[15px] w-max max-sm:w-full"
          >
            {t('calculator.cta')}
            <ArrowRight size={17} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
