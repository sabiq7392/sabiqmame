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

// GET - Get total download count
export async function GET(request: NextRequest) {
  try {
    const count = await CVDownloadTrackingModel.count()

    return NextResponse.json({
      count,
      success: true
    })
  } catch (error: any) {
    console.error('Error fetching CV download count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch count', message: error.message, count: 0 },
      { status: 500 }
    )
  }
}

