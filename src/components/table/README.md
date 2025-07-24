# 📊 @PsySecGroup/forge-table

A fully-featured, generic, and reactive data table component for SolidJS with sorting, filtering, pagination, bulk actions, and custom rendering.

---

## ⚡ Features

- Generic `Table` component accepting any data type  
- Search filtering with optional custom callback  
- Flag-based filtering with checkboxes  
- Sorting by any column (string key or custom accessor)  
- Pagination with customizable page size  
- Selectable rows with bulk action support  
- Custom column rendering and row action buttons  
- Empty state fallback UI  
- Fully reactive using SolidJS primitives  

---

## 📦 Installation

```bash
npm install @PsySecGroup/forge-table
```

Or with pnpm:

```bash
pnpm add @PsySecGroup/forge-table
```

---

## 🚀 Usage

### 1. Import and use `Table`

```tsx
import Table, { type TableColumn, type BulkAction, type Flag } from '@PsySecGroup/forge-table'

type User = {
  id: number
  name: string
  email: string
  role: string
}

const columns: TableColumn<User>[] = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Role',
    accessor: (row) => row.role.toUpperCase(),
    sortable: true,
  },
]

const bulkActions: Record<string, BulkAction<User>> = {
  delete: {
    label: 'Delete Selected',
    onClick: (rows) => console.log('Deleting rows', rows),
    clearAfter: true,
  },
}

const flagFilters: Flag<User>[] = [
  { label: 'Admin', accessor: 'role', value: 'admin' },
  { label: 'User', accessor: 'role', value: 'user' },
]

function App() {
  const [users, setUsers] = createSignal<User[]>([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
    // ...
  ])

  return (
    <Table
      data={users}
      columns={columns}
      bulkActions={bulkActions}
      flagFilters={flagFilters}
      pageSize={5}
      emptyState={<div>No users found.</div>}
    />
  )
}
```

---

## 📋 API Reference

### Types

```ts
interface TableColumn<T> {
  header: string
  accessor: keyof T | ((row: T) => string | number)
  onHeaderClick?: () => void
  sortable?: boolean
  render?: (row: T) => JSX.Element
}

interface BulkAction<T> {
  label: string
  onClick: (rows: T[]) => void
  clearAfter?: boolean
}

type Flag<T> = {
  label: string
  accessor: keyof T
  value: string | number
}
```

### Props

| Prop          | Type                                  | Description                                |
| ------------- | ------------------------------------ | ------------------------------------------ |
| `data`       | `Accessor<T[]>`                     | Reactive data array to display             |
| `columns`    | `TableColumn<T>[]`                  | Column definitions                         |
| `rowActions` | `(row: T) => JSX.Element` (optional) | Optional action buttons per row            |
| `bulkActions`| `Record<string, BulkAction<T>>` (optional) | Actions to perform on selected rows        |
| `searchCallback`| `(text: string) => T[]` (optional) | Custom search filter function               |
| `flagFilters`| `Flag<T>[]` (optional)              | Filter flags displayed as checkboxes       |
| `pageSize`   | `number` (optional, default 10)     | Number of rows per page                      |
| `emptyState` | `JSX.Element` (optional)            | UI to show when no data matches filters/search |

---

## 🎨 Styling

The component uses CSS modules. Override or customize styles by modifying or extending the following classes:

- `tableControls`  
- `searchInput`  
- `filterCheckbox`  
- `bulkActions`  
- `bulkActionButton`  
- `pagination`  
- `pageButton`  
- `tableWrapper`  
- `table`  
- `headerRow`  
- `headerCell`  
- `sortable`  
- `checkboxColumn`  
- `row`  
- `altRow`  
- `selectedRow`  
- `checkboxCell`  
- `cell`  
- `actionHeader`
