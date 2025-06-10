import style from './css/ledgerDetails.module.css'
import { For } from 'solid-js'
import {
  type LedgerEvent,
  LedgerEventStatus,
  LedgerEventType,
  getLedgerEventMintedAtFull,
  getLedgerEventStatusName,
  getLedgerEventTypeName,
  getLedgerUploadedDocuments,
  getLedgerNotes
} from '../domains/ledger'
import { Icon } from '../components/Icon'

type Props = {
  id: LedgerEvent['id']
}

/**
 * 
 */
const getStatusClass = (event: LedgerEvent) => {
  switch (event.status) {
    case LedgerEventStatus.INVALID:
      return 'status-invalid'
    case LedgerEventStatus.VALID:
      return 'status-valid'
  }
}

/**
 * 
 */
const getTypeIcon = (event: LedgerEvent) => {
  switch (event.type) {
    case LedgerEventType.CLAIM_CREDIT:
      return <Icon name='pen-tool' />
    case LedgerEventType.ADD_CREDIT:
      return <Icon name='plus-circle' />
    case LedgerEventType.REMOVE_CREDIT:
      return <Icon name='x-circle' />
    case LedgerEventType.NOTE:
      return <Icon name='file-text' />
  }
}

/**
 * 
 */
const getTypeColor = (event: LedgerEvent) => {
  switch (event.type) {
    case LedgerEventType.CLAIM_CREDIT:
      return 'type-claim-credit'
    case LedgerEventType.ADD_CREDIT:
      return 'type-add-credit'
    case LedgerEventType.REMOVE_CREDIT:
      return 'type-remove-credit'
    case LedgerEventType.NOTE:
      return 'type-add-note'
  }
}

export function LedgerDetailsPage ({ id }: Props) {
  // TODO we are going to need a local store of last known events
  const event: LedgerEvent = {
    id,
    notes: [],
    mintedBy: 1,
    mintedAt: 1749575116593,
    amount: 250,
    status: LedgerEventStatus.VALID,
    type: LedgerEventType.ADD_CREDIT
  }

  return (<div>
    <div class={style["credit-card"]}>
      <h2>Credit: #{event.id}</h2>

      <div class={style["credit-meta"]}>
        <p>
          <strong>Amount:</strong>
          {event.amount}
        </p>
        <p>
          <strong>Status:</strong>
          <span class={style[getStatusClass(event)]}>{getLedgerEventStatusName(event)}</span>
        </p>
        <p>
          <strong>Type:</strong>
          <span
            class={`${style['details']} ${style[getTypeColor(event)]}`}
          >{getTypeIcon(event)} {getLedgerEventTypeName(event)}</span>
        </p>
        <p>
          <strong>Minted At:</strong>
          {getLedgerEventMintedAtFull(event)}
        </p>
        <p>
          <strong>Minted By:</strong>
          Minter #{event.mintedBy}
        </p>
      </div>

      <div class={style["credit-documents"]}>
        <h3>Uploaded Documents</h3>
        <ul>
        <For
          each={getLedgerUploadedDocuments(event)}
          fallback={<li class={style["no-dot"]}>No documents found</li>}
        >
          {(url) => (<li><a href="url" target="_blank">{url}</a></li>)}
        </For>
        </ul>
      </div>

      <div class={style["credit-notes"]}>
        <h3>Notes</h3>
        <ul>
          <For
            each={getLedgerNotes(event)}
            fallback={<li class={style["no-dot"]}>No notes found</li>}
          >
            {(note) => (<li>{note}</li>)}
          </For>
        </ul>
      </div>
    </div>
  </div>)
}