import style from './index.module.css'
import {
  createSignal,
  createMemo,
  createEffect,
  For,
  Show,
  type JSX,
  type Accessor,
  type Setter
} from 'solid-js'

export interface TableColumn<T> {
  header: string
  accessor: keyof T | ((row: T) => string | number)
  onHeaderClick?: () => void
  sortable?: boolean
  render?: (row: T) => JSX.Element
}

export interface BulkAction<T> {
  label: string
  onClick: (rows: T[], setSelectedRows:  Setter<Set<number>>) => void
}

export interface TableProps<T> {
  data: Accessor<T[]>
  columns: TableColumn<T>[]
  rowActions?: (row: T) => JSX.Element
  bulkActions?: Record<string, BulkAction<T>>
  searchCallback?: (text: string) => T[]
  flagFilters?: { label: string; accessor: keyof T }[]
  pageSize?: number
  emptyState?: JSX.Element
}

function Table<T extends object>(props: TableProps<T>) {
  const {
    data,
    columns,
    rowActions,
    bulkActions,
    searchCallback,
    flagFilters,
    pageSize = 10,
    emptyState
  } = props
  const [searchText, setSearchText] = createSignal('')
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = createSignal(0)
  const [sortColumn, setSortColumn] = createSignal<keyof T | null>(null)
  const [sortAsc, setSortAsc] = createSignal(true)
  const [flags, setFlags] = createSignal<Record<string, boolean>>({})

  const getValue = (
    row: T,
    accessor: keyof T | ((row: T) => string | number)
  ) => (typeof accessor === 'function' ? accessor(row) : row[accessor])

  const filteredData = createMemo(() => {
    let base = [...data()]

    if (searchText()) {
      base = searchCallback
        ? searchCallback(searchText())
        : base.filter(row =>
            Object.values(row)
              .join(' ')
              .toLowerCase()
              .includes(searchText().toLowerCase())
          )
    }

    for (const key in flags()) {
      if (flags()[key]) {
        base = base.filter(row => !!row[key as keyof T])
      }
    }

    if (sortColumn()) {
      const column = sortColumn()!
      base.sort((a, b) => {
        const aVal = getValue(a, column)
        const bVal = getValue(b, column)
        return sortAsc()
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      })
    }

    return base
  })

  const totalPages = createMemo(() =>
    Math.ceil(filteredData().length / pageSize)
  )

  const paginatedData = createMemo(() => {
    const start = currentPage() * pageSize
    return filteredData().slice(start, start + pageSize)
  })

  const toggleRowSelection = (index: number) => {
    const newSet = new Set(selectedRows())
    newSet.has(index) ? newSet.delete(index) : newSet.add(index)
    setSelectedRows(newSet)
  }

  createEffect(() => {
    console.log(data)
    setCurrentPage(0)
  })

  return (
    <div>
      {/* Search and Filters */}
      <div class={style['tableControls']}>
        <input
          type="text"
          placeholder="Search..."
          onInput={e => setSearchText(e.currentTarget.value)}
          class={style['searchInput']}
        />
        <Show when={flagFilters}>
          <For each={flagFilters}>
            {flag => (
              <label class={style['filterCheckbox']}>
                <input
                  type="checkbox"
                  checked={flags()[flag.accessor as string] || false}
                  onChange={e =>
                    setFlags(f => ({
                      ...f,
                      [flag.accessor]: e.currentTarget.checked
                    }))
                  }
                />
                {flag.label}
              </label>
            )}
          </For>
        </Show>

        <Show when={bulkActions && selectedRows().size > 0}>
          <div class={style['bulkActions']}>
            <For each={Object.entries(bulkActions!)}>
              {([_, action]) => (
                <button
                  class={style['bulkActionButton']}
                  onClick={() => {
                    const selected = Array.from(selectedRows()).map(
                      i => filteredData()[i]
                    ) as T[]
                    action.onClick(selected, setSelectedRows)
                  }}
                >
                  {action.label}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Table */}
      <Show
        when={filteredData().length > 0}
        fallback={emptyState ?? <div>No data available.</div>}
      >
        <div class={style['tableWrapper']}>
          <table class={style['table']}>
            <thead>
              <tr class={style['headerRow']}>
                <th class={style['checkboxColumn']}></th>
                <For each={columns}>
                  {col => (
                    <th
                      class={`${style['headerCell']} ${
                        col.sortable ? style['sortable'] : ''
                      }`}
                      onClick={() => {
                        if (col.onHeaderClick) {
                          col.onHeaderClick()
                        } else if (
                          col.sortable &&
                          typeof col.accessor === 'string'
                        ) {
                          const accessor = col.accessor
                          if (sortColumn() === accessor) {
                            setSortAsc(!sortAsc())
                          } else {
                            setSortColumn(accessor as any)
                            setSortAsc(true)
                          }
                        }
                      }}
                    >
                      {col.header}
                      {col.sortable && sortColumn() === col.accessor && (
                        <span>{sortAsc() ? ' ▲' : ' ▼'}</span>
                      )}
                    </th>
                  )}
                </For>
                <Show when={rowActions}>
                  <th class={style['actionHeader']}>Actions</th>
                </Show>
              </tr>
            </thead>
            <tbody>
              <For each={paginatedData()}>
                {(row, index) => {
                  const globalIndex = currentPage() * pageSize + index()
                  const isSelected = selectedRows().has(globalIndex)
                  return (
                    <tr
                      classList={{
                        [style['row'] as string]: true,
                        [style['altRow'] as string]: index() % 2 !== 0,
                        [style['selectedRow'] as string]: isSelected
                      }}
                    >
                      <td class={style['checkboxCell']}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(globalIndex)}
                        />
                      </td>
                      <For each={columns}>
                        {col => (
                          <td class={style['cell']}>
                            {col.render
                              ? col.render(row)
                              : String(getValue(row, col.accessor) ?? '')}
                          </td>
                        )}
                      </For>
                      <Show when={rowActions}>
                        <td class={style['cell']}>{rowActions!(row)}</td>
                      </Show>
                    </tr>
                  )
                }}
              </For>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div class={style['pagination']}>
          <button
            class={style['pageButton']}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
            disabled={currentPage() === 0}
          >
            Previous
          </button>
          <span>
            Page {currentPage() + 1} of {totalPages()}
          </span>
          <button
            class={style['pageButton']}
            onClick={() =>
              setCurrentPage(p => Math.min(p + 1, totalPages() - 1))
            }
            disabled={currentPage() + 1 >= totalPages()}
          >
            Next
          </button>
        </div>
      </Show>
    </div>
  )
}

export default Table
