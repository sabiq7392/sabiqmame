'use client'

import { useState, useEffect } from 'react'
import { Spin, Image } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface MyGalleryProps {
  id: number
  url: string
}

const limit = 50;

type GalleryType = 'random' | 'works'

export function MyGallery() {
  const [galleryType, setGalleryType] = useState<GalleryType>('random')
  const [images, setImages] = useState<MyGalleryProps[]>([])
  const [allImages, setAllImages] = useState<string[]>([])
  const [displayedCount, setDisplayedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchInitialImages()
  }, [galleryType])

  const fetchInitialImages = async () => {
    setLoading(true)
    try {
      const folder = galleryType === 'works' ? 'works' : 'random'
      const response = await fetch(`/api/gallery?folder=${folder}`)
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images')
      }

      const data = await response.json()
      const imageUrls = data.images || []
      setAllImages(imageUrls)

      // Display first 12 images initially
      const initialCount = Math.min(limit, imageUrls.length)
      const initialImages = imageUrls.slice(0, initialCount).map((url: string, index: number) => ({
        id: index + 1,
        url,
      }))

      setImages(initialImages)
      setDisplayedCount(initialCount)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreImages = async () => {
    setLoadingMore(true)
    try {
      // Load next 12 images
      const nextCount = Math.min(displayedCount + 12, allImages.length)
      const newImages = allImages.slice(displayedCount, nextCount).map((url: string, index: number) => ({
        id: displayedCount + index + 1,
        url,
      }))

      setImages((prevImages) => [...prevImages, ...newImages])
      setDisplayedCount(nextCount)
    } catch (error) {
      console.error('Error loading more images:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Gallery
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Collection of my beautiful random images
        </p>
      </div>

      {/* Pill Button Toggle */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-full p-1 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-white/20">
          <button
            onClick={() => setGalleryType('random')}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${galleryType === 'random'
              ? 'bg-primary-blue text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            Random
          </button>
          <button
            onClick={() => setGalleryType('works')}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${galleryType === 'works'
              ? 'bg-primary-blue text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            Works
          </button>
        </div>
      </div>

      {/* Mobile-style Masonry Gallery */}
      <div
        className="columns-2 md:columns-3 lg:columns-4"
        style={{
          columnGap: '0.5rem',
          columnFill: 'balance'
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg mb-2 break-inside-avoid"
          >
            <Image
              src={image.url}
              alt={`Gallery image ${image.id}`}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              fallback="/me/logo.svg"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                verticalAlign: 'bottom'
              }}
              preview={{
                mask: (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </span>
                  </div>
                ),
              }}
              loading="lazy"
              rootClassName="!block"
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayedCount < allImages.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMoreImages}
            disabled={loadingMore}
            className="px-6 py-3 rounded-xl bg-primary-blue/20 hover:bg-primary-blue/30 dark:bg-primary-blue/30 dark:hover:bg-primary-blue/40 text-primary-blue-light dark:text-primary-blue-light font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <LoadingOutlined spin /> Loading...
              </span>
            ) : (
              `Load More Images (${allImages.length - displayedCount} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  )
}

