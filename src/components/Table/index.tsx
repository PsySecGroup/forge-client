import style from './index.module.css'
import {
  createSignal,
  createMemo,
  createEffect,
  For,
  Show,
  type JSX,
  type Accessor,
  batch,
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
  onClick: (rows: T[]) => void
  clearAfter?: boolean
}

export type Flag<T> = {
  label: string
  accessor: keyof T
  value: string
}

export interface TableProps<T> {
  data: Accessor<T[]>
  columns: TableColumn<T>[]
  rowActions?: (row: T) => JSX.Element
  bulkActions?: Record<string, BulkAction<T>>
  searchCallback?: (text: string) => T[]
  flagFilters?: Flag<T>[]
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
  const [selectedRows, setSelectedRows] = createSignal<T[]>([])
  const [currentPage, setCurrentPage] = createSignal(0)
  const [sortColumn, setSortColumn] = createSignal<keyof T | null>(null)
  const [sortAsc, setSortAsc] = createSignal(true)
  const [flags, setFlags] = createSignal<Record<string, Flag<T> | undefined>>({})

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

    const flagLabels = Object.keys(flags())

    if (flagLabels.length > 0) {
      const matches: typeof base = []

      for (const flagLabel of flagLabels) {
        const flag = flags()[flagLabel]

        if (flag) {
          base.forEach(row => {
            const rowMatches = row[flag.accessor as keyof T] === flag.value
            const isRowUnique = matches.indexOf(row) === -1

            if (rowMatches && isRowUnique) {
              matches.push(row)
            }
          })
        }
      }

      base = matches
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

  const toggleRowSelection = (row: T) => {
    const toggled = [...selectedRows()]

    const index = toggled.indexOf(row)

    index === -1
      ? toggled.push(row)
      : delete toggled[index]

    setSelectedRows(toggled)
  }

  createEffect(() => {
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
                  checked={flags()[flag.label as string] !== undefined || false}
                  onChange={(e) => {
                    const newFlags = {
                      ...flags()
                    }

                    if (e.currentTarget.checked) {
                      newFlags[flag.label] = flag
                    } else {
                      delete newFlags[flag.label]
                    }

                    setFlags(newFlags)
                  }}
                />
                {flag.label}
              </label>
            )}
          </For>
        </Show>

        <Show when={bulkActions && selectedRows().length > 0}>
          <div class={style['bulkActions']}>
            <For each={Object.entries(bulkActions!)}>
              {([_, action]) => (
                <button
                  class={style['bulkActionButton']}
                  onClick={() => {
                    batch(() => {
                      action.onClick(selectedRows())

                      if (action.clearAfter === true) {
                        setSelectedRows([])
                      }
                    })
                  }}
                >
                  {action.label}
                </button>
              )}
            </For>
          </div>
        </Show>
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
                  const isSelected = selectedRows().indexOf(row) > -1

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
                          onChange={() => toggleRowSelection(row)}
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
      </Show>
    </div>
  )
}

export default Table
