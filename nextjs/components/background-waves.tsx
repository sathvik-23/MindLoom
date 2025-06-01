'use client'

import { useEffect, useRef } from 'react'

export function BackgroundWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const waves = [
      { amplitude: 50, frequency: 0.01, speed: 0.01, opacity: 0.1 },
      { amplitude: 30, frequency: 0.02, speed: 0.02, opacity: 0.1 },
      { amplitude: 20, frequency: 0.03, speed: 0.015, opacity: 0.1 },
    ]

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave, index) => {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let x = 0; x <= canvas.width; x++) {
          const y = canvas.height / 2 + 
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.5
          
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, `rgba(99, 102, 241, ${wave.opacity})`)
        gradient.addColorStop(1, `rgba(139, 92, 246, ${wave.opacity})`)
        
        ctx.fillStyle = gradient
        ctx.fill()
      })

      time++
      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{ filter: 'blur(40px)' }}
    />
  )
}