export function beep() {
  const audio = new Audio("/beep.mp3")
  audio.volume = 0.2
  audio.play().catch(() => {})
}