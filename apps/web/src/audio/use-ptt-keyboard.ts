'use client'

import { useEffect, useRef } from 'react'
import { useGatewayStore } from '../state/gateway-store'
import type { VoiceEngine } from './voice-engine'
import type { RefObject } from 'react'

export function formatKeyLabel(key: string): string {
  if (key === ' ') return 'Space'
  if (key.length === 1) return key.toUpperCase()
  return key
}

/**
 * Global keydown/keyup listener that drives PTT when voice mode is 'ptt'.
 *
 * - Activates on keydown (non-repeat) of the configured pttKey.
 * - Deactivates on keyup.
 * - Skips events originating from text inputs / textareas / contentEditable
 *   so users can still type normally.
 */
export function usePttKeyboard(voiceRef: RefObject<VoiceEngine | null>) {
  const pttKey = useGatewayStore((s) => s.pttKey)
  const voiceMode = useGatewayStore((s) => s.voiceMode)

  const activeRef = useRef(false)

  useEffect(() => {
    if (voiceMode !== 'ptt') return

    const isTextInput = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
      if (target.isContentEditable) return true
      return false
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key !== pttKey) return
      if (isTextInput(e.target)) return

      // Prevent Space from scrolling the page, etc.
      e.preventDefault()
      if (!activeRef.current) {
        activeRef.current = true
        voiceRef.current?.setPttActive(true)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== pttKey) return

      if (activeRef.current) {
        activeRef.current = false
        voiceRef.current?.setPttActive(false)
      }
    }

    const onBlur = () => {
      if (activeRef.current) {
        activeRef.current = false
        voiceRef.current?.setPttActive(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)

      if (activeRef.current) {
        activeRef.current = false
        voiceRef.current?.setPttActive(false)
      }
    }
  }, [pttKey, voiceMode, voiceRef])
}
