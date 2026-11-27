import { useEffect, useState } from 'react'

// Returns the time left until `targetDate`, updated every second.
export function useCountdown(targetDate) {
  const target = new Date(targetDate).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const secondsLeft = Math.max(0, Math.floor((target - now) / 1000))

  return {
    days: Math.floor(secondsLeft / 86400),
    hours: Math.floor((secondsLeft % 86400) / 3600),
    minutes: Math.floor((secondsLeft % 3600) / 60),
    seconds: secondsLeft % 60,
    finished: secondsLeft === 0,
  }
}
