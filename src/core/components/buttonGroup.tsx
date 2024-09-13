import useTheme from '@suid/material/styles/useTheme'
import styles from './css/buttonGroup.module.css'

type ButtonGroupProps = {
  buttons: string[] | JSX.Element[]
  activeIndex: number
  onButtonClick?: (index: number) => void
}

export default function ButtonGroup (props: ButtonGroupProps) {
  const theme = useTheme()

  const handleButtonClick = (index: number) => {
    if (props.onButtonClick) {
      props.onButtonClick(index)
    }
  }

  return (
    <div class={styles.buttonGroup}>
      {props.buttons.map((button, index) => (
        <button
          class={`${styles.button} ${index === props.activeIndex ? styles.active : ''}`}
          onClick={() => handleButtonClick(index)}
        >
          {button}
        </button>
      ))}
    </div>
  )
}
