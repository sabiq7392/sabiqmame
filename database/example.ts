/**
 * Contoh penggunaan JsonDB ORM
 * 
 * File ini adalah contoh penggunaan, tidak akan dijalankan
 */

import { createModel, BaseModel } from './jsonDB'

// 1. Define your model interface
interface User extends BaseModel {
  name: string
  email: string
  age: number
  active: boolean
}

interface Post extends BaseModel {
  title: string
  content: string
  userId: string
  published: boolean
}

// 2. Create model instances
const UserModel = createModel<User>('users')
const PostModel = createModel<Post>('posts')

// 3. Contoh penggunaan CRUD operations

async function examples() {
  // ===== CREATE (Add) =====
  const newUser = await UserModel.add({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    active: true
  })
  console.log('Created user:', newUser)
  // Output: { id: '...', name: 'John Doe', email: 'john@example.com', age: 30, active: true, createdAt: '...', updatedAt: '...' }

  // ===== READ (Find) =====

  // Find all users
  const allUsers = await UserModel.all()
  console.log('All users:', allUsers)

  // Find by query object
  const activeUsers = await UserModel.find({ active: true })
  console.log('Active users:', activeUsers)

  // Find with function predicate
  const youngUsers = await UserModel.find((user) => user.age < 25)
  console.log('Young users:', youngUsers)

  // Find one
  const user = await UserModel.findOne({ email: 'john@example.com' })
  console.log('Found user:', user)

  // Find by ID
  const userById = await UserModel.findById(newUser.id)
  console.log('User by ID:', userById)

  // ===== UPDATE =====

  // Update by query
  const updated = await UserModel.update(
    { email: 'john@example.com' },
    { age: 31, active: false }
  )
  console.log('Updated users:', updated)

  // Update by ID
  const updatedById = await UserModel.updateById(newUser.id, {
    name: 'John Updated'
  })
  console.log('Updated by ID:', updatedById)

  // ===== DELETE =====

  // Delete by query
  const deletedCount = await UserModel.delete({ active: false })
  console.log('Deleted count:', deletedCount)

  // Delete by ID
  const deleted = await UserModel.deleteById(newUser.id)
  console.log('Deleted:', deleted)

  // ===== COUNT =====
  const totalUsers = await UserModel.count()
  console.log('Total users:', totalUsers)

  const activeCount = await UserModel.count({ active: true })
  console.log('Active users count:', activeCount)

  // ===== CLEAR =====
  // await UserModel.clear() // Hapus semua data (hati-hati!)
}

// Contoh penggunaan di API Route (Next.js)
/*
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { createModel } from '@/database/jsonDB'

interface User extends BaseModel {
  name: string
  email: string
}

const UserModel = createModel<User>('users')

export async function GET() {
  const users = await UserModel.all()
  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await UserModel.add({
    name: body.name,
    email: body.email
  })
  return NextResponse.json({ user }, { status: 201 })
}

// app/api/users/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await UserModel.findById(params.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json({ user })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const user = await UserModel.updateById(params.id, body)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json({ user })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const deleted = await UserModel.deleteById(params.id)
  if (!deleted) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json({ message: 'User deleted' })
}
*/

