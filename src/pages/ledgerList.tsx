// import style from './css/ledgerList.module.css'
import { createSignal } from 'solid-js'
import Table from '../components/Table'
import {
  type LedgerEvent, 
  getLedgerEventMintedAt, 
  getLedgerEventNoteCount,
  getLedgerEventStatusName,
  getLedgerEventTypeName,
  LedgerEventStatus,
  LedgerEventType
} from '../domains/ledger'
import { NavButton } from '../components/NavButton'


export function LedgerListPage() {
  // TODO temporary list, remove later
  const [ledgerEvents, setLedgerEvents] = createSignal<LedgerEvent[]>([
    { id: 1, notes: [], mintedBy: 1, mintedAt: 1749575116593, amount: 250, status: LedgerEventStatus.VALID, type: LedgerEventType.ADD_CREDIT },
    { id: 2, notes: ['test'], mintedBy: 1, mintedAt: 1749474126593, amount: 100, status: LedgerEventStatus.VALID, type: LedgerEventType.REMOVE_CREDIT },
    { id: 3, notes: [], mintedBy: 1, mintedAt: 1749373126593, amount: 125, status: LedgerEventStatus.INVALID, type: LedgerEventType.CLAIM_CREDIT },
    { id: 4, notes: [], mintedBy: 1, mintedAt: 1749272126593, amount: 0, status: LedgerEventStatus.VALID, type: LedgerEventType.NOTE },
    { id: 5, notes: [], mintedBy: 1, mintedAt: 1749171126593, amount: 375, status: LedgerEventStatus.VALID, type: LedgerEventType.ADD_CREDIT },
  ])

  const handleDelete = (events: LedgerEvent[]) => {
    setLedgerEvents((prev) => prev.filter(
      event => !events.some(selected => selected.id === event.id)
    ))
  }

  const handleExport = (orders: LedgerEvent[]) => {
    console.log('Exporting orders:', orders)
    // Add export logic here (e.g., generate CSV)
  }

  return (
    <div style={{ padding: '1.5em '}}>
      <h1>Ledger Events</h1>
      <Table
        data={ledgerEvents}
        columns={[
          { header: 'ID', accessor: 'id', sortable: true },
          { header: 'Amount', accessor: 'amount', sortable: true },
          { header: 'Minted By', accessor: 'mintedBy', sortable: true }, // @TODO nav to the specific minter details
          { header: 'Minted At', accessor: getLedgerEventMintedAt, sortable: true },
          { header: 'Notes', accessor: getLedgerEventNoteCount, sortable: true },
          { header: 'Type', accessor: getLedgerEventTypeName, sortable: true },
          { header: 'Status', accessor: getLedgerEventStatusName, sortable: true },
        ]}
        rowActions={(row) => (
          <NavButton location={'ledger-event-' + row.id}>
            View Event
          </NavButton>
        )}
        flagFilters={[
          { label: 'Added Credits', accessor: 'type', value: LedgerEventType.ADD_CREDIT },
          { label: 'Claimed Credits', accessor: 'type', value: LedgerEventType.CLAIM_CREDIT },
          { label: 'Removed Credits', accessor: 'type', value: LedgerEventType.REMOVE_CREDIT },
          { label: 'Notes', accessor: 'type', value: LedgerEventType.NOTE },
        ]}
        bulkActions={{
          delete: {
            label: 'Delete Orders',
            onClick: handleDelete,
            clearAfter: true
          },
          export: {
            label: 'Export Orders',
            onClick: handleExport,
          },
        }}
        pageSize={3}
      />
    </div>
  )
}
