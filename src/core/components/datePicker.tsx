import { enUS } from 'date-fns/locale'
import { createSignal, onCleanup } from 'solid-js';
import { format, parse, parseISO , isSameDay, isValid, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import useTheme from '@suid/material/styles/useTheme'
import styles from './css/datePicker.module.css'

const daysOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa']

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  minDate?: Date
  maxDate?: Date
  locale?: Locale
};

export default function DatePicker (props: DatePickerProps) {
  const theme = useTheme()
  const [isOpen, setIsOpen] = createSignal(false)
  const [selectedDate, setSelectedDate] = createSignal<Date | null>(null)
  const [inputValue, setInputValue] = createSignal(props.value)
  const [currentMonth, setCurrentMonth] = createSignal(new Date())

  const minDate = props.minDate ?? new Date(1900, 0, 1)
  const maxDate = props.maxDate ?? new Date(2100, 11, 31)

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd', { locale: props.locale && enUS })

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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setInputValue(formatDate(date))
    props.onChange(formatDate(date))
    setIsOpen(false)
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth(), 1) : addMonths(currentMonth(), 1))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

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
          [styles.dayButton]: true,
          [styles.active]: isSameDay(isoDate, day)
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

  const renderCalendar = () => {
    return (
      <div
        class={styles.datepickerCalendar}
          style={{
            background: theme.palette.primary.dark, 
            color: theme.palette.primary.contrastText
          }}

      >
        <div
          class={styles.datepickerHeader}
        >
          <button
            class={styles.navButton}
            onClick={() => navigateMonth('prev')}
            style={{
              color: theme.palette.primary.contrastText
            }}
          >◀</button>
          <span

          >{format(currentMonth(), 'MMMM yyyy', { locale: props.locale })}</span>
          <button
            class={styles.navButton}
            onClick={() => navigateMonth('next')}
            style={{
              color: theme.palette.primary.contrastText
            }}
          >▶</button>
        </div>
        <div
          class={styles.datepickerBody}
        >
          <div
            class={styles.dayNames}
          >
            {daysOfWeek.map((day) => (
              <div class={styles.dayName}>{day}</div>
            ))}
          </div>
          <div
            class={styles.monthDays}
          >
            {renderDays(inputValue())}
          </div>
        </div>
      </div>
    );
  };

  onCleanup(() => window.removeEventListener('keydown', handleKeyDown));

  return (
    <div class={styles.datepicker}>
      <input
        class={styles.datepickerInput}
        type='text'
        value={inputValue() || ''}
        onInput={handleInput}
        onFocus={() => setIsOpen(true)}
        placeholder='YYYY-MM-DD'
      />
      {isOpen() && renderCalendar()}
    </div>
  );
};