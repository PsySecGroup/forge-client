import { type KeyDownEvent } from '../types/common'
import { batch, createSignal, type JSX } from 'solid-js'
import { Box } from '@suid/material'
import { useStoreContext } from '../state'
import { fetch } from '../utils/fetch'
import { type SearchResult } from '../types/searchResult'
import { type ProgressEvent, type PreparedGraph } from '../utils/graph'
import GraphWorker from '../utils/graphWorker.ts?worker'

import styles from './css/searchQuery.module.css'

const worker = new GraphWorker()

export default function SearchQuery (): JSX.Element {
  const { updateFocusedSpace, getFocusedSpace, sendGraphMessage, getFocusedSpaceIndex, sources, values, setValues } = useStoreContext()
  const [searching, setSearching] = createSignal<boolean>(false)

  /**
   *
   */
  const updateQuery = async (e: KeyDownEvent): Promise<void> => {
    updateFocusedSpace({
      query: e.currentTarget.value
    })

    if (e.key === 'Enter') {
      await performSearch()
    }
  }

  /**
   *
   */
  const performSearch = async (): Promise<void> => {
    setSearching(true)

    const space = getFocusedSpace()

    const collections = space.documentStores.length === 0
      ? ['*']
      : space.documentStores.map(id => {
        const source = sources.find(source => source.id === id)

        if (source === undefined) {
          return undefined
        } else {
          return source.name
        }
      })

    const results = await fetch('get', '/search', {
      query: space.query ?? '',
      collections: collections.join(','),
      sort: space.sort,
      sortDir: space.sortDir,
      range: space.range,
      count: space.count,
      position: space.position,
      threshold: space.coverage / 100
    }) as SearchResult[]

    worker.onmessage = (event: MessageEvent<PreparedGraph | ProgressEvent>): void => {
      // Process the results of the worker

      if (event.data.type === 'progress') {
        console.log(event.data.progress)
        setValues({
          searchProgress: event.data.progress
        })
        return
      }

      // Updating the graph
      batch(() => {
        const { tablets, lemmas, graph } = event.data as PreparedGraph

        updateFocusedSpace({
          tablets: {
            tablets,
            lemmas
          }
        })

        sendGraphMessage({
          spaceId: getFocusedSpaceIndex(),
          action: 'populate',
          nodes: graph.nodes,
          links: graph.links
        })

        setSearching(false)
      })
    }

    // Tell the worker to get started
    worker.postMessage({
      query: space.query,
      graphDepth: space.graphDepth,
      clustering: space.clustering,
      results
    })
  }

  return (
    <Box
      class={`${styles.searchQuery} ${searching()
        ? styles.searchQueryBackground
        : ''
      }`}
    >
      <span class={styles.searchQueryInputContainer}>
        <input
          name="query"
          class={styles.searchQueryInput}
          onKeyDown={(e) => { void updateQuery(e) }}
          disabled={searching()}
        ></input>
        <div
          class={styles.progressBar}
          style={{
            width: values.searchProgress.toString() + '%'
          }}
        ></div>
      </span>
      <span
        onClick={() => { void performSearch() }}
        class={`${styles.searchQueryIcon} ${searching()
          ? styles.loader
          : ''
        }`}
      >
        🔍
      </span>
    </Box>
  )
}
