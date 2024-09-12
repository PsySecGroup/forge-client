import useTheme from '@suid/material/styles/useTheme'
import styles from './css/table.module.css'
import { createSignal, createMemo } from 'solid-js'

type Row = Array<Array<string | number | null>>

type TableProps = {
  headers: string[]
  rows: Row
  onSort?: (columnIndex: number, ascending: boolean) => Row
  onSearch?: (searchTerm: string) => Row
  onNext?: () => Row
  onPrev?: () => Row
  rowsPerPage?: number
}

export default function Table (props: TableProps) {
  const theme = useTheme()

  // Internal state for sorting, searching, and pagination
  const [sortConfig, setSortConfig] = createSignal({ column: -1, ascending: true })
  const [searchTerm, setSearchTerm] = createSignal('')
  const [currentPage, setCurrentPage] = createSignal(1)

  // Sorting functionality
  const sortedRows = createMemo(() => {
    const { column, ascending } = sortConfig()
    if (props.onSort) {
      return props.onSort(column, ascending)
    }

    if (column === -1) {
      return props.rows
    }

    const sorted = [...props.rows].sort((a, b) => {
      const valA = a[column] ?? ''
      const valB = b[column] ?? ''

      if (valA < valB) {
        return ascending
          ? -1
          : 1
      }

      if (valA > valB) {
        return ascending
          ? 1
          : -1
      }

      return 0
    })

    return sorted
  })

  // Search functionality
  const filteredRows = createMemo(() => {
    if (props.onSearch) {
      return props.onSearch(searchTerm())
    }

    if (!searchTerm()) {
      return sortedRows()
    }

    return sortedRows().filter(row =>
      row.some(cell =>
        String(cell).toLowerCase().includes(searchTerm().toLowerCase())
      )
    )
  })

  // Pagination (assume 10 rows per page)
  const rowsPerPage = props.rowsPerPage ?? 10

  const paginatedRows = createMemo(() => {
    const start = (currentPage() - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredRows().slice(start, end)
  })

  // Handlers
  const handleSort = (columnIndex: number) => {
    const { column, ascending } = sortConfig()
    const isSameColumn = column === columnIndex

    setSortConfig({
      column: columnIndex,
      ascending: isSameColumn
        ? !ascending
        : true 
      })
  }

  const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement
    setSearchTerm(target.value)
  }

  const handleNext = () => {
    if (props.onNext) {
      props.onNext()
    } else {
      setCurrentPage(current => current + 1)
    }
  }

  const handlePrev = () => {
    if (props.onPrev) {
      props.onPrev()
    } else {
      setCurrentPage(current => Math.max(1, current - 1))
    }
  }

  return (
    <div>
      {props.onSearch && (
        <input
          type="text"
          class={styles.searchBar}
          placeholder="Search..."
          value={searchTerm()}
          onInput={handleSearch}
        />
      )}
      <table class={styles.table}>
        <thead class={styles.thead}>
          <tr>
            {props.headers.map((header, index) => (
              <th
                class={styles.th}
                style={{ color: theme.palette.primary.main }}
              >
                <span>{header}</span>
                {props.onSort && (
                  <button
                    onClick={() => handleSort(index)}
                    class={styles.sortButton}
                  >
                    {sortConfig().column === index
                      ? sortConfig().ascending ? '▲' : '▼'
                      : '⇅'}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody class={styles.tbody}>
          {paginatedRows().length === 0 ? (
            <tr>
              <td
                class={styles.td}
                colspan={props.headers.length}
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedRows().map((row, rowIndex) => (
              <tr key={rowIndex} class={styles.tr}>
                {props.headers.map((_, colIndex) => (
                  <td class={styles.td}>
                    {
                      row[colIndex] !== undefined && row[colIndex] !== null
                        ? row[colIndex]
                        : ''
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {(props.onNext || props.onPrev) && (
        <div class={styles.pagination}>
          <button
            onClick={handlePrev}
            disabled={currentPage() === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={paginatedRows().length < rowsPerPage}
          >Next</button>
        </div>
      )}
    </div>
  )
}
