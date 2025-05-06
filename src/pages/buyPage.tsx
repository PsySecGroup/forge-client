import { createSignal, type Setter } from 'solid-js'
import Table from '../components/Table'

export type Purchase =  {
  id: number
  buyerName: string
  credits: number
  amount: number
  status: string
}

export function BuyPage() {
  const [purchaseOrders, setPurchaseOrders] = createSignal([
    { id: 1, buyerName: 'Alice', credits: 100, amount: 250, status: 'Completed' },
    { id: 2, buyerName: 'Bob', credits: 200, amount: 450, status: 'Pending' },
    { id: 3, buyerName: 'Charlie', credits: 50, amount: 125, status: 'Completed' },
    { id: 4, buyerName: 'Diana', credits: 75, amount: 200, status: 'Cancelled' },
    { id: 5, buyerName: 'Eve', credits: 150, amount: 375, status: 'Pending' },
  ])

  const handleViewOrder = (order: Purchase) => {
    alert(`Viewing Order for ${order.buyerName}`)
  }

  const handleDeleteOrders = (orders: Purchase[], setSelectedRows: Setter<Set<number>>) => {
    // Update the purchase orders by removing the selected ones
    setPurchaseOrders((prevOrders) => prevOrders.filter(
      order => !orders.some(selected => selected.id === order.id)
    ))
    setSelectedRows(new Set([]))
  }

  const handleExportOrders = (orders: Purchase[]) => {
    console.log('Exporting orders:', orders)
    // Add export logic here (e.g., generate CSV)
  }

  return (
    <div style={{ padding: '1.5em '}}>
      <h1>Buy Carbon Credits</h1>
      <Table
        data={purchaseOrders}
        columns={[
          { header: 'Buyer Name', accessor: 'buyerName', sortable: true },
          { header: 'Farads', accessor: 'credits', sortable: true },
          { header: 'Amount ($)', accessor: 'amount', sortable: true },
          { header: 'Status', accessor: 'status', sortable: true },
        ]}
        rowActions={(row) => (
          <button onClick={() => handleViewOrder(row)}>
            View Order
          </button>
        )}
        flagFilters={[
          { label: 'Completed Orders', accessor: 'status', value: 'Completed' },
          { label: 'Pending Orders', accessor: 'status', value: 'Pending' },
        ]}
        bulkActions={{
          delete: {
            label: 'Delete Orders',
            onClick: (rows, setSelectedRows) => handleDeleteOrders(rows, setSelectedRows),
          },
          export: {
            label: 'Export Orders',
            onClick: (rows) => handleExportOrders(rows),
          },
        }}
        pageSize={3}
      />
    </div>
  )
}
