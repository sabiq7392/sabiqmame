import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get folder parameter from query string
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || 'random'

    // Validate folder name to prevent directory traversal
    const validFolders = ['random', 'works']
    const safeFolder = validFolders.includes(folder) ? folder : 'random'

    const galleryPath = join(process.cwd(), 'public', 'gallery', safeFolder)
    const files = await readdir(galleryPath)

    // Filter only image files
    const imageFiles = files.filter(file =>
      /\.(webp|jpg|jpeg|png|gif|heic|heif)$/i.test(file)
    )

    // Sort files naturally (gallery-1.webp, gallery-2.webp, etc.)
    // For works folder, sort by filename
    const sortedFiles = imageFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0')
      const numB = parseInt(b.match(/\d+/)?.[0] || '0')
      if (numA !== 0 && numB !== 0) {
        return numA - numB
      }
      return a.localeCompare(b)
    })

    // Return file paths relative to public folder
    const imageUrls = sortedFiles.map(file => `/gallery/${safeFolder}/${file}`)

    return NextResponse.json({ images: imageUrls })
  } catch (error) {
    console.error('Error reading gallery folder:', error)
    return NextResponse.json(
      { error: 'Failed to read gallery folder' },
      { status: 500 }
    )
  }
}

