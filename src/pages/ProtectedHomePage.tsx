import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { BookOpen, Clock, LogOut, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BrandWordmark } from '../components/ui/auth-primitives'
import { useAuthStore } from '../store/authStore'

const CONTINUE_ITEMS = [
  {
    id: 'cw-1',
    title: 'Solo Leveling: Arise from the Shadow',
    meta: 'Episode 14 · 18:42 remaining',
    badge: '1080p SUB',
    progress: 78,
    kind: 'anime' as const,
  },
  {
    id: 'cw-2',
    title: 'Frieren: Beyond Journey’s End',
    meta: 'Episode 26 · 09:15 remaining',
    badge: '1080p DUB',
    progress: 62,
    kind: 'anime' as const,
  },
  {
    id: 'cw-3',
    title: 'Omniscient Reader’s Viewpoint',
    meta: 'Chapter 218 · Vertical Webtoon',
    badge: 'MANGA',
    progress: 90,
    kind: 'manga' as const,
  },
  {
    id: 'cw-4',
    title: 'Jujutsu Kaisen: Shibuya Incident',
    meta: 'Episode 44 · 14:20 remaining',
    badge: '1080p SUB',
    progress: 40,
    kind: 'anime' as const,
  },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'WN'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ProtectedHomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const displayName = user?.fullName || 'Anime Explorer'
  const firstName = displayName.split(/\s+/)[0] || displayName

  const handleSignOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#020509] text-[#EEF6FA]">
      {/* Sticky Protected Hub Navbar */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#1B2938] bg-[#020509]/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
          <div className="flex items-center gap-8">
            <BrandWordmark />
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-[#EEF6FA]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#67E8F9]" />
                Home
              </span>
              <span className="text-[#8FA3B3]">Browse</span>
              <span className="text-[#8FA3B3]">Manga</span>
              <span className="text-[#8FA3B3]">Watchlist</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-full border border-[#1B2938] bg-[#0F1823] px-3 py-1.5">
              <AvatarPrimitive.Root className="flex h-6 w-6 items-center justify-center rounded-full border border-[#67E8F9]/50 bg-[#0A1017] text-[11px] font-bold text-[#67E8F9]">
                <AvatarPrimitive.Fallback>{getInitials(displayName)}</AvatarPrimitive.Fallback>
              </AvatarPrimitive.Root>
              <span className="max-w-[140px] truncate text-xs font-semibold text-[#EEF6FA]">
                {displayName}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="auth-transition inline-flex h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-[12px] border border-[#1B2938] bg-[#0A1017] px-3.5 text-xs font-semibold text-[#EEF6FA] hover:border-[#F43F5E]/50 hover:bg-[#0F1823] hover:text-[#FFF1F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
            >
              <LogOut className="h-3.5 w-3.5 text-[#8FA3B3]" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-5 py-8 sm:px-8 sm:py-12">
        {/* Seasonal Spotlight Banner */}
        <section
          className="relative overflow-hidden rounded-2xl border border-[#1B2938] bg-[#0A1017] p-6 sm:p-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.16) 0%, rgba(10, 16, 23, 0.92) 60%)',
          }}
        >
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/30 bg-[#0F1823] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#67E8F9]">
              SEASONAL SPOTLIGHT · EPISODE 14 READY
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#EEF6FA]">
              Welcome back, <span className="font-serif-accent text-[#67E8F9]">{firstName}</span>.
            </h1>

            <p className="text-sm leading-relaxed text-[#8FA3B3]">
              Your watchlist and manga chapter bookmarks are synced across sessions ({user?.email}).
              Pick up your active simulcast below or jump into the latest vertical webtoon chapter.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                className="auth-transition cta-glow inline-flex h-[44px] cursor-pointer items-center gap-2 rounded-[12px] bg-[#FFFFFF] px-5 text-xs sm:text-sm font-extrabold text-[#02060B] hover:bg-[#EEF6FA]"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <span>Resume Episode 14</span>
              </button>
              <button
                type="button"
                className="auth-transition inline-flex h-[44px] cursor-pointer items-center gap-2 rounded-[12px] border border-[#1B2938] bg-[#0F1823] px-4 text-xs sm:text-sm font-semibold text-[#EEF6FA] hover:border-[#38BDF8]/40"
              >
                <BookOpen className="h-4 w-4 text-[#67E8F9]" aria-hidden="true" />
                <span>Read Chapter 218</span>
              </button>
            </div>
          </div>
        </section>

        {/* Continue Watching & Reading Rail */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#67E8F9]" aria-hidden="true" />
              <h2 className="text-lg font-bold tracking-tight text-[#EEF6FA]">
                Continue Watching &amp; Reading
              </h2>
            </div>
            <span className="text-xs font-medium text-[#8FA3B3]">Synced automatically</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTINUE_ITEMS.map((item) => (
              <article
                key={item.id}
                className="auth-transition group flex flex-col justify-between rounded-[12px] border border-[#1B2938] bg-[#0A1017] p-4 hover:border-[#38BDF8]/40 hover:bg-[#0F1823]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#67E8F9]/25 bg-[#0F1823] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#67E8F9]">
                      {item.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8FA3B3]">
                      {item.progress}%
                    </span>
                  </div>
                  <h3 className="line-clamp-1 text-sm font-bold text-[#EEF6FA] group-hover:text-[#67E8F9]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8FA3B3]">{item.meta}</p>
                </div>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#020509]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#67E8F9]"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
