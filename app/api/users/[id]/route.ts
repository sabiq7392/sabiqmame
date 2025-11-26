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

// GET - Get user by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await UserModel.findById(params.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user', message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update user by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check if user exists
    const existingUser = await UserModel.findById(params.id)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If email is being updated, check for duplicates
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await UserModel.findOne({ email: body.email } as Partial<User>)
      if (emailExists) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
    }

    const user = await UserModel.updateById(params.id, {
      name: body.name,
      email: body.email,
      age: body.age,
      active: body.active,
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete user by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await UserModel.deleteById(params.id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user', message: error.message },
      { status: 500 }
    )
  }
}

