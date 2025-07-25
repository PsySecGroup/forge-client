import { type ParentProps, type JSX, createContext } from 'solid-js'
import { defineActions } from '../../core/state/actions'
import { StoreProvider } from '../../core/state/provider'
import { createStore, produce } from 'solid-js/store'

export type UploadStatus = 'queued' | 'uploading' | 'success' | 'error'

export type UploadFile = {
  id: string
  file: File
  name: string
  size: number
  type: string
  hash: string
  status: UploadStatus
  progress: number // 0-100
  error?: string
}

export type FileUploadConfig = {
  multiple: boolean
  allowedExtensions: string[]
  maxFileSize: number
  dragDropEnabled: boolean
}

export type FileUploadState = {
  files: UploadFile[]
  errors: string[]
  config: FileUploadConfig
  isUploading: boolean
}

const definition: FileUploadState = {
  files: [],
  errors: [],
  config: {
    multiple: true,
    allowedExtensions: [],
    maxFileSize: Infinity,
    dragDropEnabled: true
  },
  isUploading: false,
}

export const store = createStore(definition)
const [state, setState] = store
type SetState = typeof setState

export const FileUploadContext = createContext(store)
export const FileUploadStore = store

export const getFileUploadActions = defineActions(store, (set: SetState) => ({
  clearErrors: () => set('errors', []),

  addError: (message: string) => set('errors', (errors) => [...errors, message]),

  removeFile: (id: string) => set('files', (files) => files.filter(f => f.id !== id)),

  updateFile: (id: string, update: Partial<Omit<UploadFile, 'id' | 'file' | 'hash'>>) => {
    const index = state.files.findIndex(f => f.id === id)
    if (index === -1) return
    set('files', index, (old) => ({ ...old, ...update }))
  },

  addFiles: (newFiles: UploadFile[]) => set('files', (files) => [...files, ...newFiles]),

  setUploading: (uploading: boolean) => set('isUploading', uploading),

  setConfig: (config: Partial<FileUploadConfig>) => set('config', (old) => ({ ...old, ...config })),

  setFiles(files: UploadFile[]) {
      setState('files', files)
    },

    // Retry a failed upload by resetting its status and progress
    retryUpload(id: string) {
      setState(
        produce((state) => {
          const file = state.files.find(f => f.id === id)
          if (file && file.status === 'error') {
            file.status = 'queued'
            file.progress = 0
            file.error = ''
          }
        })
      )
    },
}))

export function FileUploadProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={FileUploadContext}
      store={FileUploadStore}
    >
      {children}
    </StoreProvider>
  )
}
