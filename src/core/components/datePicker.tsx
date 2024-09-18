import type { Style, Class } from '../types/index'
import useTheme from '@suid/material/styles/useTheme'
import { mergeStyle } from '../utils/style'
import { enUS } from 'date-fns/locale'
import { createSignal, onCleanup } from 'solid-js'
import { 
  format,
  parse,
  parseISO,
  isSameDay,
  isValid,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns'

import styles from './css/datePicker.module.css'

type Props = {
  value: string
  onChange: (value: string) => void
  minDate?: Date
  maxDate?: Date
  locale?: Locale
  style?: Style
  classes?: Class
  dayButtonClasses?: Class
  activeClasses?: Class
  datepickerCalendarClasses?: Class
  datepickerHeaderClasses?: Class
  navButtonClasses?: Class
  datepickerBodyClasses?: Class
  dayNamesClasses?: Class
  monthDaysClasses?: Class
  datepickerInputClasses?: Class
}

const daysOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa']

/**
 * 
 */
export default function DatePicker (props: Props = {}) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.datepicker,
    {
      background: theme.palette.primary.background,
      color: theme.palette.primary.text
    }
  )

  const { classes: dayButtonClasses } = mergeStyle({
      classes: props.dayButtonClasses
    }, 
    styles.dayButton
  )

  const { classes: activeClasses } = mergeStyle({
      classes: props.activeClasses
    }, 
    styles.active
  )

  const { classes: datepickerCalendarClasses } = mergeStyle({
      classes: props.datepickerCalendarClasses
    }, 
    styles.datepickerCalendar
  )

  const { classes: datepickerHeaderClasses } = mergeStyle({
      classes: props.datepickerHeaderClasses
    }, 
    styles.datepickerHeader
  )

  const { classes: navButtonClasses } = mergeStyle({
      classes: props.navButtonClasses
    }, 
    styles.navButton
  )

  const { classes: datepickerBodyClasses } = mergeStyle({
      classes: props.datepickerBodyClasses
    }, 
    styles.datepickerBody
  )

  const { classes: dayNamesClasses } = mergeStyle({
      classes: props.dayNamesClasses
    }, 
    styles.dayNames
  )

  const { classes: monthDaysClasses } = mergeStyle({
      classes: props.monthDaysClasses
    }, 
    styles.monthDays
  )

  const { classes: datepickerInputClasses } = mergeStyle({
      classes: props.datepickerInputClasses
    }, 
    styles.datepickerInput
  )

  // State
  const minDate = props.minDate ?? new Date(1900, 0, 1)
  const maxDate = props.maxDate ?? new Date(2100, 11, 31)

  const [isOpen, setIsOpen] = createSignal(false)
  const [selectedDate, setSelectedDate] = createSignal<Date | null>(null)
  const [inputValue, setInputValue] = createSignal(props.value)
  const [currentMonth, setCurrentMonth] = createSignal(new Date())

  onCleanup(() => {
    setIsOpen(false)
    setSelectedDate(null)
    setInputValue(props.value)
    setCurrentMonth(new Date())
  })
  
  /**
   * 
   */
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd', { locale: props.locale && enUS })

  /**
   * 
   */
  const handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    setInputValue(value)
    const parsedDate = parse(value, 'yyyy-MM-dd', new Date())

    if (isValid(parsedDate)) {
      if (parsedDate >= minDate && parsedDate <= maxDate) {
        setSelectedDate(parsedDate)
        props.onChange(formatDate(parsedDate))
      }
    }
  }

  /**
   * 
   */
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setInputValue(formatDate(date))
    props.onChange(formatDate(date))
    setIsOpen(false)
  }

  /**
   * 
   */
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth(), 1) : addMonths(currentMonth(), 1))
  }

  /**
   * 
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  onCleanup(() => window.removeEventListener('keydown', handleKeyDown))

  // Rendering

  /**
   * 
   */
  const renderDays = (value) => {
    const isoDate = parseISO(value ?? '0000-01-01')
    const monthStart = startOfMonth(currentMonth())
    const monthEnd = endOfMonth(currentMonth())
    const start = startOfWeek(monthStart)
    const end = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start, end })

    return days.map((day) => (
      <button
        classList={{
          [dayButtonClasses]: true,
          [activeClasses]: isSameDay(isoDate, day)
        }}
        disabled={day < minDate || day > maxDate}
        onClick={() => handleDateClick(day)}
        style={{
          color: theme.palette.primary.contrastText, 
          background: isSameDay(isoDate, day)
            ? theme.palette.success.main
            : theme.palette.primary.main
        }}
      >
        {day.getDate()}
      </button>
    ))
  }

  /**
   * 
   */
  const renderCalendar = () => {
    return (
      <div
        class={datepickerCalendarClasses}
          style={{
            background: theme.palette.primary.dark, 
            color: theme.palette.primary.contrastText
          }}

      >
        <div
          class={datepickerHeaderClasses}
        >
          <button
            class={navButtonClasses}
            onClick={() => navigateMonth('prev')}
            style={{
              color: theme.palette.primary.contrastText
            }}
          >◀</button>
          <span

          >{format(currentMonth(), 'MMMM yyyy', { locale: props.locale })}</span>
          <button
            class={navButtonClasses}
            onClick={() => navigateMonth('next')}
            style={{
              color: theme.palette.primary.contrastText
            }}
          >▶</button>
        </div>
        <div
          class={datepickerBodyClasses}
        >
          <div
            class={dayNamesClasses}
          >
            {daysOfWeek.map((day) => (
              <div class={dayNamesClasses}>{day}</div>
            ))}
          </div>
          <div
            class={monthDaysClasses}
          >
            {renderDays(inputValue())}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      class={classes}
      style={style}
    >
      <input
        class={datepickerInputClasses}
        type='text'
        value={inputValue() || ''}
        onInput={handleInput}
        onFocus={() => setIsOpen(true)}
        placeholder='YYYY-MM-DD'
      />
      {isOpen() && renderCalendar()}
    </div>
  )
}