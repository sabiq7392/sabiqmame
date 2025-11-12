'use client'

import { useState, useEffect } from 'react'
import { Spin, Image } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface RandomImageGalleryProps {
  id: number
  url: string
  width: number
  height: number
}

export function RandomImageGallery() {
  const [images, setImages] = useState<RandomImageGalleryProps[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchInitialImages()
  }, [])

  const fetchInitialImages = async () => {
    setLoading(true)
    try {
      // Using Picsum Photos API - random images
      const imagePromises = Array.from({ length: 20 }, (_, i) => {
        const id = Math.floor(Math.random() * 1000) + 1
        const width = 300 + Math.floor(Math.random() * 200) // Random width between 300-500
        const height = 400 + Math.floor(Math.random() * 300) // Random height between 400-700
        return {
          id: id + i,
          url: `https://picsum.photos/id/${id}/${width}/${height}`,
          width,
          height,
        }
      })

      const fetchedImages = await Promise.all(imagePromises)
      setImages(fetchedImages)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreImages = async () => {
    setLoadingMore(true)
    try {
      // Using Picsum Photos API - random images
      const imagePromises = Array.from({ length: 20 }, (_, i) => {
        const id = Math.floor(Math.random() * 1000) + 1
        const width = 300 + Math.floor(Math.random() * 200) // Random width between 300-500
        const height = 400 + Math.floor(Math.random() * 300) // Random height between 400-700
        // Generate unique ID by combining timestamp with index
        const uniqueId = Date.now() + i
        return {
          id: uniqueId,
          url: `https://picsum.photos/id/${id}/${width}/${height}`,
          width,
          height,
        }
      })

      const fetchedImages = await Promise.all(imagePromises)
      setImages((prevImages) => [...prevImages, ...fetchedImages])
    } catch (error) {
      console.error('Error fetching more images:', error)
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
          Random Images
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Collection of beautiful random images
        </p>
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
            'Load More Images'
          )}
        </button>
      </div>
    </div>
  )
}

