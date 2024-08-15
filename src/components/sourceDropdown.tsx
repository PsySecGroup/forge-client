import { For, Match, Switch, batch, createEffect, createSignal, type JSX } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from '../state'
import { find, pushUnique, splice } from '../utils/lists'
import { type Source } from '../types/source'

import styles from './css/sourceDropdown.module.css'
import { fetch } from '../utils/fetch'
import { type ClickEvent } from '../types/common'

export default function SourceDropdown (): JSX.Element {
  const { sources, setSources, updateFocusedSpace, getFocusedSpace, values, setValues } = useStoreContext()
  const [showSources, setShowSources] = createSignal<boolean>(false)

  createEffect(async () => {
    if (values.closeEverything) {
      batch(() => {
        setShowSources(false)
        setValues({
          closeEverything: false
        })
      })
    }

    // TODO change this if sources can be dynamically loaded and updated
    if (Object.keys(sources).length === 0) {
      const collections = await fetch('get', '/collections') as string[]
      const collectionNames = collections.map((name, id) => {
        // TODO return ID and creation date as well
        return {
          id,
          name,
          createdAt: new Date()
        }
      })

      setSources(collectionNames)
    }
  })

  const isChecked = (source: Source): boolean | undefined => {
    return getFocusedSpace()?.documentStores?.includes(source.id)
  }

  /**
   *
   */
  const onToggleSources = (e: ClickEvent): void => {
    e.stopPropagation() // Prevents closeEverything from firing
    setShowSources(!showSources())
  }

  /**
   *
   */
  const onCheck = (source: Source) => {
    return (e: ClickEvent) => {
      e.stopPropagation() // Prevents closeEverything from firing
      const list = getFocusedSpace().documentStores
      const position = list.indexOf(source.id)

      if (position > -1) {
        updateFocusedSpace({
          documentStores: splice(list, position)
        })
      } else {
        updateFocusedSpace({
          documentStores: pushUnique(list, source.id)
        })
      }
    }
  }

  return (
    <Box class={styles.dropdownContainer}>
      <div
        class={styles.dropdown}
        onClick={onToggleSources}
      >
        <span class={styles.dropdownSelection}>
          <Switch fallback={'Search all sources'}>
            <Match when={getFocusedSpace().documentStores.length > 0}>
              <For each={getFocusedSpace().documentStores}>{
                (sourceId) => (
                  <span>{find(sources, 'id', sourceId, 'name')}</span>
                )
              }</For>
            </Match>
          </Switch>
        </span>
        <span class={styles.dropdownIcon}>
          ⏷
        </span>
      </div>
      <div
        class={styles.dropdownOptions}
        style={{
          display: showSources()
            ? 'block'
            : 'none'
        }}
      >
        <div
          class={styles.dropdownOption}
        >
          <span
            class={styles.dropdownCreateNew}
            /*
              TODO create new source option
            */
          >
            Create new source... (Coming soon)
          </span>
        </div>
        <For each={sources}>
          {(source) => (
            <div
              class={styles.dropdownOption}
              onClick={onCheck(source)}
            >
              <span class={styles.dropdownOptionCheck}>
                <input
                  name={`source-${source.id}`}
                  type="checkbox"
                  value={source.id}
                  checked={isChecked(source)}
                />
              </span>
              <span class={styles.dropdownOptionValue}>
                {find(sources, 'id', source.id, 'name')}
              </span>
            </div>
          )}
        </For>
      </div>
    </Box>
  )
}
