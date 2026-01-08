"use client"

import { useEffect, useRef } from "react"
import { VitalSignWaveformProps } from "@/types/vital-signs"

export function VitalSignWaveform({ type, color }: VitalSignWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Set canvas size
    canvas.style.width = "100%"
    canvas.style.height = "100%"

    let animationId: number
    let offset = 0

    const colors = {
      green: "#22c55e",
      white: "#ffffff",
      yellow: "#eab308",
    }

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = colors[color]
      ctx.lineWidth = 2
      ctx.beginPath()

      const centerY = height / 2
      const amplitude = height * 0.3

      for (let x = 0; x < width; x++) {
        let y = centerY

        switch (type) {
          case "ecg":
            // ECG-like pattern with sharp peaks
            const ecgX = (x + offset) % 80
            if (ecgX < 10) {
              y = centerY + amplitude * Math.sin((ecgX / 10) * Math.PI * 4)
            } else if (ecgX < 15) {
              y = centerY - amplitude * 1.5
            } else if (ecgX < 20) {
              y = centerY + amplitude * 0.8
            } else {
              y = centerY + amplitude * 0.1 * Math.sin((x + offset) * 0.1)
            }
            break

          case "pulse":
            // Pulse oximetry wave
            y = centerY + amplitude * Math.sin((x + offset) * 0.15)
            break

          case "pressure":
            // Blood pressure wave
            y =
              centerY + amplitude * 0.7 * Math.sin((x + offset) * 0.08) + amplitude * 0.3 * Math.sin((x + offset) * 0.2)
            break

          case "temperature":
            // Gentle temperature variation
            y = centerY + amplitude * 0.4 * Math.sin((x + offset) * 0.05)
            break
        }

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      offset += 2
      animationId = requestAnimationFrame(drawWaveform)
    }

    drawWaveform()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [type, color])

  return <canvas ref={canvasRef} width={128} height={64} className="w-full h-full" />
}
