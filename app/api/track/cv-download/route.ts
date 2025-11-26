import { NextRequest, NextResponse } from 'next/server'
import { createModel, BaseModel } from '@/database/jsonDB'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Define CV Download Tracking model
interface CVDownloadTracking extends BaseModel {
  ip: string
  userAgent: string
  country: string | null
  datetime: string
}

// Create model instance
const CVDownloadTrackingModel = createModel<CVDownloadTracking>('cv-download-tracking')

// Helper function to get IP address from request
function getIpAddress(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to connection remote address (might not work in all environments)
  return request.ip || 'unknown'
}

// Helper function to get country from headers (if available)
function getCountry(request: NextRequest): string | null {
  // Try Cloudflare header
  const cfCountry = request.headers.get('cf-ipcountry')
  if (cfCountry && cfCountry !== 'XX') {
    return cfCountry
  }

  // Try other common headers
  const country = request.headers.get('x-country-code') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cloudfront-viewer-country')

  return country || null
}

// POST - Track CV download
export async function POST(request: NextRequest) {
  try {
    const ip = getIpAddress(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const country = getCountry(request)
    const datetime = new Date().toISOString()

    const tracking = await CVDownloadTrackingModel.add({
      ip,
      userAgent,
      country,
      datetime,
    })

    return NextResponse.json({
      success: true,
      tracking
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error tracking CV download:', error)
    return NextResponse.json(
      { error: 'Failed to track download', message: error.message },
      { status: 500 }
    )
  }
}

// GET - Get all tracking records (optional, for admin purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')

    let trackings = await CVDownloadTrackingModel.all()

    // Sort by datetime descending (newest first)
    trackings.sort((a, b) => {
      const dateA = new Date(a.datetime).getTime()
      const dateB = new Date(b.datetime).getTime()
      return dateB - dateA
    })

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        trackings = trackings.slice(0, limitNum)
      }
    }

    return NextResponse.json({
      trackings,
      count: trackings.length,
      total: trackings.length
    })
  } catch (error: any) {
    console.error('Error fetching CV download tracking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking data', message: error.message },
      { status: 500 }
    )
  }
}

