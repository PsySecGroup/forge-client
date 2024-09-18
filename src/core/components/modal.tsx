import { type ParentProps, type JSX, createEffect, batch } from 'solid-js'

import styles from './css/modal.module.css'
import { useStoreContext } from '../../core'
import { type ClickEvent } from '../../core/types'

type Props = {
  close?: () => void
}

export default function Modal (props: ParentProps<Props> = {}): JSX.Element {
  const { values, setValues } = useStoreContext()

  /**
   *
   * @param e
   */
  const containClick = (e: ClickEvent): void => {
    e.stopPropagation()
  }

  /**
   *
   * @param e
   */
  const closeModal = (e: ClickEvent): void => {
    e.stopPropagation()

    if (props.close) {
      props.close()
    }
  }

  createEffect(async () => {
    if (values.closeEverything) {
      batch(() => {
        props.close()
        setValues({
          closeEverything: false
        })
      })
    }
  })

  return (
    <div
      class={styles.modalBackground}
      onClick={closeModal}
      >
      <div
        class={styles.modalContent}
        onClick={containClick}
      >
          {props.children}
      </div>
    </div>
  )
}
