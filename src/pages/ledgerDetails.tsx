import './css/ledgerDetails.module.css'
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



type Props = {
  id: LedgerEvent['id']
}

export function LedgerDetailsPage ({ id }: Props) {
  const event: LedgerEvent = {
    id,
    notes: [],
    mintedBy: 1,
    mintedAt: 1749575116593,
    amount: 250,
    status: LedgerEventStatus.VALID,
    type: LedgerEventType.ADD_CREDIT
  }

  return (<div class="credit-card">
  <h2>Credit: #{event.id}</h2>

  <div class="credit-meta">
    <p><strong>Amount:</strong> {event.amount}</p>
    <p><strong>Status:</strong> {getLedgerEventStatusName(event)}</p>
    <p><strong>Type:</strong> {getLedgerEventTypeName(event)}</p>
    <p><strong>Minted At:</strong> {getLedgerEventMintedAtFull(event)} </p>
    <p><strong>Minted By:</strong> Minter #{event.mintedBy}</p>
  </div>

  <div class="credit-documents">
    <h3>Uploaded Documents</h3>
    <ul>
    <For each={getLedgerUploadedDocuments(event)}>
      {(url) => (<li><a href="url" target="_blank">{url}</a></li>)}
    </For>
    </ul>
  </div>

  <div class="credit-notes">
    <h3>Notes</h3>
    <ul>
      <For each={getLedgerNotes(event)}>
        {(note) => (<li>{note}</li>)}
      </For>
    </ul>
  </div>
</div>)
}