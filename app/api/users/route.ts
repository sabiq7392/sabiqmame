import { NextResponse } from 'next/server'
import { createModel, BaseModel } from '@/database/jsonDB'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Define User model
interface User extends BaseModel {
  name: string
  email: string
  age?: number
  active?: boolean
}

// Create model instance
const UserModel = createModel<User>('users')

// GET - Get all users or filter by query
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const email = searchParams.get('email')

    let users: User[]

    if (active !== null) {
      users = await UserModel.find({ active: active === 'true' } as Partial<User>)
    } else if (email) {
      users = await UserModel.find({ email } as Partial<User>)
    } else {
      users = await UserModel.all()
    }

    return NextResponse.json({ users, count: users.length })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email: body.email } as Partial<User>)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    const user = await UserModel.add({
      name: body.name,
      email: body.email,
      age: body.age,
      active: body.active !== undefined ? body.active : true,
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user', message: error.message },
      { status: 500 }
    )
  }
}

