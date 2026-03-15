'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import en from './en'
import zh from './zh'
import type { Translations } from './en'

export type Locale = 'en' | 'zh'

const locales: Record<Locale, Translations> = { en, zh }

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  zh: '\u4E2D\u6587',
}

export const localeList = Object.keys(locales) as Locale[]

type LocaleStore = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

function detectDefaultLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language?.toLowerCase() ?? ''
  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: detectDefaultLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'mumble-locale',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function useT(): Translations {
  const locale = useLocaleStore((s) => s.locale)
  return locales[locale]
}

export function format(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] != null ? String(params[key]) : `{${key}}`,
  )
}

export type { Translations }
