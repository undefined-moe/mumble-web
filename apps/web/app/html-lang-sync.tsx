'use client'

import { useEffect } from 'react'
import { useLocaleStore } from '../src/i18n'

const langMap: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN',
}

export function HtmlLangSync() {
  const locale = useLocaleStore((s) => s.locale)

  useEffect(() => {
    document.documentElement.lang = langMap[locale] ?? locale
  }, [locale])

  return null
}
