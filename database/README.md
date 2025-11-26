# JsonDB - Simple JSON-based ORM

ORM sederhana untuk menyimpan data di JSON file tanpa perlu database server.

## Instalasi

Tidak perlu instalasi tambahan, sudah menggunakan Node.js built-in `fs` module.

## Penggunaan Dasar

### 1. Define Model Interface

```typescript
import { BaseModel } from '@/database/jsonDB'

interface User extends BaseModel {
  name: string
  email: string
  age?: number
  active?: boolean
}
```

### 2. Create Model Instance

```typescript
import { createModel } from '@/database/jsonDB'

const UserModel = createModel<User>('users')
```

### 3. CRUD Operations

#### CREATE (Add)
```typescript
const user = await UserModel.add({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  active: true
})
// Auto-generates: id, createdAt, updatedAt
```

#### READ (Find)
```typescript
// Find all
const allUsers = await UserModel.all()

// Find by query object
const activeUsers = await UserModel.find({ active: true })

// Find with function predicate
const youngUsers = await UserModel.find((user) => user.age < 25)

// Find one
const user = await UserModel.findOne({ email: 'john@example.com' })

// Find by ID
const user = await UserModel.findById('user-id-123')
```

#### UPDATE
```typescript
// Update by query
const updated = await UserModel.update(
  { email: 'john@example.com' },
  { age: 31, active: false }
)

// Update by ID
const updated = await UserModel.updateById('user-id-123', {
  name: 'John Updated'
})
```

#### DELETE
```typescript
// Delete by query
const deletedCount = await UserModel.delete({ active: false })

// Delete by ID
const deleted = await UserModel.deleteById('user-id-123')
```

#### COUNT
```typescript
const totalUsers = await UserModel.count()
const activeCount = await UserModel.count({ active: true })
```

#### CLEAR
```typescript
await UserModel.clear() // Hapus semua data
```

## Penggunaan di API Route (Next.js)

### Contoh: app/api/users/route.ts

```typescript
import { NextResponse } from 'next/server'
import { createModel, BaseModel } from '@/database/jsonDB'

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
```

### Contoh: app/api/users/[id]/route.ts

```typescript
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
```

## Lokasi File Database

File JSON disimpan di: `database/db/{modelName}.db.json`

Contoh:
- `database/db/users.db.json`
- `database/db/posts.db.json`
- `database/db/products.db.json`

## Auto-Generated Fields

Setiap record otomatis memiliki:
- `id`: Unique ID (auto-generated)
- `createdAt`: Timestamp saat record dibuat
- `updatedAt`: Timestamp saat record di-update

## Catatan

- File database akan dibuat otomatis saat pertama kali digunakan
- Data disimpan dalam format JSON yang readable
- Tidak cocok untuk aplikasi dengan traffic tinggi (gunakan database proper)
- Cocok untuk prototyping, development, atau aplikasi kecil

