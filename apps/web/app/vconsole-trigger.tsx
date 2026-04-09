'use client'

import { useRef, useCallback } from 'react'

const CLICK_COUNT = 5
const CLICK_TIMEOUT = 2000 // ms between clicks
const TRIGGER_SIZE = 48 // px, bottom-left corner area

export function VConsoleTrigger() {
  const clickCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activatedRef = useRef(false)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (activatedRef.current) return

    const { clientX, clientY } = e
    const { innerHeight } = window

    // Only respond to clicks in the bottom-left corner
    if (clientX > TRIGGER_SIZE || clientY < innerHeight - TRIGGER_SIZE) return

    clickCountRef.current++

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, CLICK_TIMEOUT)

    if (clickCountRef.current >= CLICK_COUNT) {
      activatedRef.current = true
      clickCountRef.current = 0
      if (timerRef.current) clearTimeout(timerRef.current)

      import('vconsole').then(({ default: VConsole }) => {
        new VConsole()
      })
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[99999] pointer-events-none"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="absolute bottom-0 left-0 pointer-events-auto"
        style={{ width: TRIGGER_SIZE, height: TRIGGER_SIZE }}
        onClick={handleClick}
      />
    </div>
  )
}
