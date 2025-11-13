'use client'

import { useState, useEffect } from 'react'
import { Typography, Input, Button, Space, Divider } from 'antd'
import { HeartOutlined, HeartFilled, SearchOutlined, StarOutlined, ReloadOutlined, FireOutlined } from '@ant-design/icons'
import { message } from 'antd'

const { Title, Text } = Typography

// Color conversion utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null
}

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

// Generate color palette based on type
const generatePalette = (baseColor: string, type: string): string[] => {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return []

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const colors: string[] = [baseColor]

  switch (type) {
    case 'monochromatic':
      for (let i = 1; i <= 3; i++) {
        const newL = Math.max(10, Math.min(90, hsl.l + (i % 2 === 0 ? -15 * i : 15 * i)))
        const newRgb = hslToRgb(hsl.h, hsl.s, newL)
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      break
    case 'analogous':
      for (let i = 1; i <= 3; i++) {
        const newH = (hsl.h + 30 * i) % 360
        const newRgb = hslToRgb(newH, hsl.s, hsl.l)
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      break
    case 'complementary':
      const compH = (hsl.h + 180) % 360
      const compRgb = hslToRgb(compH, hsl.s, hsl.l)
      colors.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b))
      // Add variations
      const compRgb2 = hslToRgb(compH, Math.max(0, hsl.s - 20), Math.min(100, hsl.l + 10))
      colors.push(rgbToHex(compRgb2.r, compRgb2.g, compRgb2.b))
      const compRgb3 = hslToRgb(compH, Math.max(0, hsl.s - 20), Math.max(0, hsl.l - 10))
      colors.push(rgbToHex(compRgb3.r, compRgb3.g, compRgb3.b))
      break
    case 'triadic':
      for (let i = 1; i <= 2; i++) {
        const newH = (hsl.h + 120 * i) % 360
        const newRgb = hslToRgb(newH, hsl.s, hsl.l)
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      // Add one more variation
      const newH2 = (hsl.h + 120) % 360
      const newRgb2 = hslToRgb(newH2, Math.max(0, hsl.s - 15), Math.min(100, hsl.l + 15))
      colors.push(rgbToHex(newRgb2.r, newRgb2.g, newRgb2.b))
      break
    case 'pastel':
      for (let i = 1; i <= 3; i++) {
        const newH = (hsl.h + 60 * i) % 360
        const newRgb = hslToRgb(newH, Math.max(20, hsl.s - 30), Math.min(85, hsl.l + 20))
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      break
    case 'vintage':
      for (let i = 1; i <= 3; i++) {
        const newH = (hsl.h + 45 * i) % 360
        const newRgb = hslToRgb(newH, Math.max(30, hsl.s - 20), Math.max(30, hsl.l - 20))
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      break
    case 'neon':
      for (let i = 1; i <= 3; i++) {
        const newH = (hsl.h + 90 * i) % 360
        const newRgb = hslToRgb(newH, 100, 50)
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      break
    case 'warm':
      for (let i = 1; i <= 3; i++) {
        const newH = (hsl.h + 15 * i) % 60 // Keep in warm range (0-60)
        const newRgb = hslToRgb(newH, hsl.s, hsl.l)
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      break
    case 'cold':
      for (let i = 1; i <= 3; i++) {
        const newH = 180 + ((hsl.h + 30 * i) % 60) // Keep in cold range (180-240)
        const newRgb = hslToRgb(newH, hsl.s, hsl.l)
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
      break
    default:
      // Random harmonious colors
      for (let i = 1; i <= 3; i++) {
        const newH = (hsl.h + 60 * i) % 360
        const newRgb = hslToRgb(newH, hsl.s, hsl.l)
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      }
  }

  return colors.slice(0, 4) // Ensure exactly 4 colors
}

// Generate random color
const randomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

interface Palette {
  id: string
  colors: string[]
  likes: number
  createdAt: Date
  category?: string
}

export default function ColorsTools() {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [filteredPalettes, setFilteredPalettes] = useState<Palette[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('new')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [likedPalettes, setLikedPalettes] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  const colorCategories = [
    'Pastel',
    'Vintage',
    'Retro',
    'Neon',
    'Gold',
    'Light',
    'Dark',
    'Warm',
    'Cold',
    'Summer',
    'Fall',
    'Winter',
    'Spring',
    'Happy',
  ]

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    setMounted(true)
    try {
      const savedLikes = localStorage.getItem('color-palettes-likes')
      if (savedLikes) {
        setLikedPalettes(new Set(JSON.parse(savedLikes)))
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
  }, [])

  // Generate initial palettes
  useEffect(() => {
    if (!mounted) return

    const generatePalettes = () => {
      const newPalettes: Palette[] = []
      const baseColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80',
        '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C', '#F39C12',
      ]

      const allCategories = ['monochromatic', 'analogous', 'complementary', 'triadic', 'pastel', 'vintage', 'neon', 'warm', 'cold']

      for (let i = 0; i < 50; i++) {
        const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)]
        const category = allCategories[Math.floor(Math.random() * allCategories.length)]
        const colors = generatePalette(baseColor, category)

        newPalettes.push({
          id: `palette-${i}`,
          colors,
          likes: Math.floor(Math.random() * 1000) + 10,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
          category: colorCategories[Math.floor(Math.random() * colorCategories.length)],
        })
      }

      // Sort by date (newest first)
      newPalettes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      setPalettes(newPalettes)
      setFilteredPalettes(newPalettes)
    }

    generatePalettes()
  }, [mounted])

  // Filter palettes
  useEffect(() => {
    let filtered = [...palettes]

    // Filter by category
    if (selectedCategory === 'popular') {
      filtered.sort((a, b) => b.likes - a.likes)
    } else if (selectedCategory === 'random') {
      filtered = [...filtered].sort(() => Math.random() - 0.5)
    } else if (selectedCategory === 'collection') {
      filtered = filtered.filter((p) => likedPalettes.has(p.id))
    } else {
      // New - already sorted by date
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter((palette) => {
        const colorsStr = palette.colors.join(' ').toLowerCase()
        const categoryStr = (palette.category || '').toLowerCase()
        return colorsStr.includes(searchQuery.toLowerCase()) || categoryStr.includes(searchQuery.toLowerCase())
      })
    }

    setFilteredPalettes(filtered)
  }, [selectedCategory, searchQuery, palettes, likedPalettes])

  const handleLike = (paletteId: string) => {
    const newLiked = new Set(likedPalettes)
    if (newLiked.has(paletteId)) {
      newLiked.delete(paletteId)
    } else {
      newLiked.add(paletteId)
    }
    setLikedPalettes(newLiked)
    try {
      localStorage.setItem('color-palettes-likes', JSON.stringify(Array.from(newLiked)))
    } catch (e) {
      console.error('Failed to save likes:', e)
    }
  }

  const handleCopyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      message.success(`Color ${color} copied!`)
    } catch (e) {
      message.error('Failed to copy color')
    }
  }

  const handleCopyPalette = async (colors: string[]) => {
    try {
      await navigator.clipboard.writeText(colors.join(', '))
      message.success('Palette copied!')
    } catch (e) {
      message.error('Failed to copy palette')
    }
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return '1 week ago'
    if (diffDays < 21) return '2 weeks ago'
    return `${Math.floor(diffDays / 7)} weeks ago`
  }

  const generateRandomPalette = () => {
    const baseColor = randomColor()
    const category = ['monochromatic', 'analogous', 'complementary', 'triadic', 'pastel', 'vintage', 'neon'][
      Math.floor(Math.random() * 7)
    ]
    const colors = generatePalette(baseColor, category)

    const newPalette: Palette = {
      id: `palette-${Date.now()}`,
      colors,
      likes: 0,
      createdAt: new Date(),
      category: colorCategories[Math.floor(Math.random() * colorCategories.length)],
    }

    setPalettes([newPalette, ...palettes])
    setSelectedCategory('new')
  }

  return (
    <div className="min-h-screen bg-white glass-strong rounded-2xl">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex">
          <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 px-4 py-6">
            <div className="space-y-1">
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-2 block">
                Categories
              </Text>
              {colorCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSearchQuery(cat.toLowerCase())
                    setSelectedCategory('new')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleCopyPalette(palette.colors)}
                >
                  {/* Color Swatches */}
                  <div className="flex h-32">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 hover:scale-105 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyColor(color)
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredPalettes.length === 0 && (
              <div className="text-center py-12">
                <Text className="text-gray-400 dark:text-gray-500">No palettes found</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
