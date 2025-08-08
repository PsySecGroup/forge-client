import { fireEvent } from '@testing-library/dom'

/**
 * Simulates a click event on the element matching the given query selector.
 * 
 * @param {string} query - A CSS selector string to find the clickable element.
 * @throws Will throw an error if no element matches the query.
 * 
 * @example
 * await click('#submit-button')
 */
export async function click(query: string) {
  const clickable = document.querySelector(query)

  if (clickable) {
    await fireEvent.click(clickable)
  } else {
    throw new Error(`"${query}" not found`)
  }
}

/**
 * Simulates typing text into an input element found by the given query selector.
 * 
 * @param {string} query - A CSS selector string to find the input element.
 * @param {string} text - The text to type into the input field.
 * @throws Will throw an error if no element matches the query.
 * 
 * @example
 * await type('#username', 'john_doe')
 */
export async function type(query: string, text: string) {
  const inputElement = document.querySelector(query)

  if (inputElement) {
    await fireEvent.input(inputElement, { target: { value: text } })
  } else {
    throw new Error(`"${query}" not found`)
  }
}

/**
 * Simulates pressing the Enter key on an input element found by the given query selector.
 * 
 * @param {string} query - A CSS selector string to find the input element.
 * @throws Will throw an error if no element matches the query.
 * 
 * @example
 * await typeEnter('#search-input')
 */
export async function typeEnter(query: string) {
  const inputElement = document.querySelector(query)

  if (inputElement) {
    await fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter", charCode: 13 })
  } else {
    throw new Error(`"${query}" not found`)
  }
}

/**
 * Creates and appends a <div id="root"> element to the document body.
 * Useful for setting up a container in test environments.
 * 
 * @example
 * drawDOM()
 */
export const drawDOM = () => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

/**
 * Removes the <div id="root"> element from the document body if it exists.
 * Useful for cleaning up after tests.
 * 
 * @example
 * clearDOM()
 */
export const clearDOM = () => {
  const root = document.getElementById('root')
  if (root) {
    document.body.removeChild(root)
  }
}
