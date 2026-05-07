import Image from 'next/image'
import { AlertTriangle } from 'lucide-react'
import { EarthmovingSalesTable } from '@/components/EarthmovingSalesTable'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="container mx-auto flex flex-1 flex-col px-6 py-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="shrink-0">
            <Image
              src="/logo.png"
              alt="Coherent Market Insights Logo"
              width={150}
              height={60}
              className="h-auto w-auto max-w-[150px]"
              priority
            />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="text-center">
              <h1 className="mb-1 text-2xl font-bold text-black">Coherent Dashboard</h1>
              <h2 className="text-sm text-black">
                Earthmoving OEM's — Monthly &amp; Quarterly Sales Records (CMI)
              </h2>
            </div>
          </div>
        </header>

        <div
          role="alert"
          aria-live="polite"
          className="mb-6 flex gap-4 rounded-xl border border-amber-400/90 bg-amber-50 px-4 py-4 shadow-md ring-1 ring-amber-900/10 sm:items-start sm:gap-4 sm:px-5 sm:py-5"
        >
          <div className="mt-0.5 shrink-0 text-amber-600" aria-hidden>
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Note</p>
            <p className="text-sm font-semibold leading-relaxed text-amber-950 sm:text-[15px]">
              NOTE: All the data in the dashboard is demo data. No real world data is related to this.
            </p>
          </div>
        </div>

        <EarthmovingSalesTable />
      </div>
    </div>
  )
}
