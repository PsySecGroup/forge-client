import { fireEvent } from '@testing-library/dom'

/**
 * 
 */
export async function click (query: string) {
    const clickable = document.querySelector(query)

    if (clickable) {
      await fireEvent.click(clickable)
    } else {
      throw new Error(`"${query}" not found`)
    }
}

/**
 * 
 */

export async function type (query: string, text: string) {
  const inputElement = document.querySelector(query)

  if (inputElement) {
    await fireEvent.input(inputElement, { target: { value: text } })
  } else {
    throw new Error(`"${query}" not found`)
  }
}

/**
 * 
 */
export async function typeEnter (query: string) {
  const inputElement = document.querySelector(query)

  if (inputElement) {
    await fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter", charCode: 13 })
  } else {
    throw new Error(`"${query}" not found`)
  }
}

/**
 * 
 */
export const drawDOM = () => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

/**
 * 
 */
export const clearDOM = () => {
  const root = document.getElementById('root')
  if (root) {
    document.body.removeChild(root)
  }
}