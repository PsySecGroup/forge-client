import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { createSignal, createMemo } from 'solid-js'

import styles from './css/table.module.css'

type Row = Array<Array<string | number | null>>

type TableProps = {
  headers: string[]
  rows: Row
  onSort?: (columnIndex: number, ascending: boolean) => Row
  onSearch?: (searchTerm: string) => Row
  onNext?: () => Row
  onPrev?: () => Row
  rowsPerPage?: number
  style?: Style
  classes?: Class
  searchBarClasses?: Class
  theadClasses?: Class
  thClasses?: Class
  sortButtonClasses?: Class
  tbodyClasses?: Class
  tdClasses?: Class
  trClasses?: Class
  tdClasses?: Class
  paginationClasses?: Class
}

export default function Table (props: TableProps) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.listContainer,
    {
      background: theme.palette.primary.background,
      color: theme.palette.primary.text
    }
  )

  const { classes: searchBarClasses  } = mergeStyle({
      classes: props.searchBarClasses
    }, 
    styles.searchBar
  )

  const { classes: theadClasses  } = mergeStyle({
      classes: props.theadClasses
    }, 
    styles.thead
  )

  const { classes: thClasses  } = mergeStyle({
      classes: props.thClasses
    }, 
    styles.th
  )

  const { classes: sortButtonClasses  } = mergeStyle({
      classes: props.sortButtonClasses
    }, 
    styles.sortButton
  )

  const { classes: tbodyClasses  } = mergeStyle({
      classes: props.tbodyClasses
    }, 
    styles.tbody
  )

  const { classes: tdClasses  } = mergeStyle({
      classes: props.tdClasses
    }, 
    styles.td
  )

  const { classes: trClasses  } = mergeStyle({
      classes: props.trClasses
    }, 
    styles.tr
  )

  const { classes: paginationClasses  } = mergeStyle({
      classes: props.paginationClasses
    }, 
    styles.pagination
  )


  // States
  const [sortConfig, setSortConfig] = createSignal({ column: -1, ascending: true })
  const [searchTerm, setSearchTerm] = createSignal('')
  const [currentPage, setCurrentPage] = createSignal(1)

  const rowsPerPage = props.rowsPerPage ?? 10

  /**
   * Sorting functionality
   */
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

  /**
   * Search functionality
   */
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

  /**
   *
   */
  const paginatedRows = createMemo(() => {
    const start = (currentPage() - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredRows().slice(start, end)
  })

  /**
   *
   */
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

  /**
   *
   */
  const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement
    setSearchTerm(target.value)
  }

  /**
   *
   */
  const handleNext = () => {
    if (props.onNext) {
      props.onNext()
    } else {
      setCurrentPage(current => current + 1)
    }
  }

  /**
   *
   */
  const handlePrev = () => {
    if (props.onPrev) {
      props.onPrev()
    } else {
      setCurrentPage(current => Math.max(1, current - 1))
    }
  }

  // Rendering
  return (
    <div class={styles.container}>
      {props.onSearch && (
        <input
          type="text"
          class={searchBarClasses}
          placeholder="Search..."
          value={searchTerm()}
          onInput={handleSearch}
        />
      )}
      <table
        class={classes}
        style={styles}
      >
        <thead class={theadClasses}>
          <tr>
            {props.headers.map((header, index) => (
              <th
                class={thClasses}
                style={{ color: theme.palette.primary.main }}
              >
                <span>{header}</span>
                {props.onSort && (
                  <button
                    onClick={() => handleSort(index)}
                    class={sortButtonClasses}
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
        <tbody class={tbodyClasses}>
          {paginatedRows().length === 0 ? (
            <tr>
              <td
                class={tdClasses}
                colspan={props.headers.length}
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedRows().map((row, rowIndex) => (
              <tr key={rowIndex} class={trClasses}>
                {props.headers.map((_, colIndex) => (
                  <td class={tdClasses}>
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
        <div class={paginationClasses}>
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
