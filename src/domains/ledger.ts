/**
 * 
 */
export enum LedgerEventType {
  ADD_CREDIT,
  REMOVE_CREDIT,
  CLAIM_CREDIT,
  NOTE
}

/**
 * 
 */
export enum LedgerEventStatus {
  VALID,
  INVALID
}

/**
 * 
 */
export type LedgerEvent =  {
  id: number
  mintedBy: number
  mintedAt: number
  amount: number
  status: LedgerEventStatus,
  notes: string[],
  type: LedgerEventType 
}

/**
 * 
 */
export const getLedgerEventTypeName = (event: LedgerEvent) => {
  switch(event.type) {
    case LedgerEventType.ADD_CREDIT:
      return 'Added Credit'
    case LedgerEventType.REMOVE_CREDIT:
      return 'Removed Credit'
    case LedgerEventType.NOTE:
      return 'Added Note'
    case LedgerEventType.CLAIM_CREDIT:
      return 'Claimed Credit'
  }
}

/**
 * 
 */
export const getLedgerEventStatusName = (event: LedgerEvent) => {
  switch(event.status) {
    case LedgerEventStatus.VALID:
      return 'Valid'
    case LedgerEventStatus.INVALID:
      return 'Invalid'
  }
}

/**
 * 
 */
export const getLedgerEventNoteCount = (event: LedgerEvent) => event.notes?.length ?? 0

/**
 * 
 */
export const getLedgerEventMintedAt = (event: LedgerEvent) => new Date(event.mintedAt).toLocaleDateString('en-US')

/**
 * 
 */
export const getLedgerEventMintedAtFull = (event: LedgerEvent) => new Date(event.mintedAt).toLocaleString('en-US', { hour12: true })

/**
 * 
 */
export const getLedgerUploadedDocuments = (event: LedgerEvent) => event.notes.filter(str => str.startsWith('https://'))

/**
 * 
 */
export const getLedgerNotes = (event: LedgerEvent) => event.notes.filter(str => !str.startsWith('https://'))
