import { useEffect } from 'react'
import { useSpring, useTransform, motion, useMotionValue } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

export function AnimatedCounter({ value, duration = 1.2 }: AnimatedCounterProps) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  const display = useTransform(springValue, (latest) => formatNumber(Math.round(latest)))

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  return <motion.span>{display}</motion.span>
}
