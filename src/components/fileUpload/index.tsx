import { createSignal, For, Show, onCleanup } from 'solid-js'
import { useContext } from 'solid-js'
import { FileUploadContext, getFileUploadActions, type UploadFile } from './store'
import { nanoid } from 'nanoid'

// Helper: calculate SHA-256 hash for file as hex string
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Inline worker source simulating upload progress & errors
const workerSrc = `
self.onmessage = async (e) => {
  const { file, id } = e.data
  const total = file.size
  let uploaded = 0
  const chunkSize = total / 20
  const delay = ms => new Promise(res => setTimeout(res, ms))

  try {
    for(let i = 0; i <= 20; i++) {
      await delay(200)
      uploaded = Math.min(total, uploaded + chunkSize)
      const progress = Math.floor((uploaded / total) * 100)
      self.postMessage({ id, progress })
    }
    if (Math.random() < 0.1) throw new Error('Server rejected the file')
    self.postMessage({ id, done: true })
  } catch (err) {
    self.postMessage({ id, error: err.message || 'Upload failed' })
  }
}
`

export function FileUploadComponent() {
  const [state] = useContext(FileUploadContext)
  const {
    clearErrors,
    addError,
    addFiles,
    retryUpload,
    setFiles,
    setUploading,
    removeFile,
    updateFile
  } = getFileUploadActions()

  // Local UI-only signals
  const [dragActive, setDragActive] = createSignal(false)

  let worker: Worker | null = null

  onCleanup(() => worker?.terminate())

  function createWorker() {
    const blob = new Blob([workerSrc], { type: 'application/javascript' })
    return new Worker(URL.createObjectURL(blob))
  }

  async function handleFiles(files: FileList | File[]) {
    clearErrors()

    if (!files || files.length === 0) {
      addError('No files selected')
      return
    }

    const newFiles: UploadFile[] = []
    const errors: string[] = []

    for (const file of Array.from(files)) {
      // Validate extension
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (
        state.config.allowedExtensions.length > 0 &&
        !state.config.allowedExtensions.includes(ext)
      ) {
        errors.push(`File type not supported: ${file.name}`)
        continue
      }
      // Validate size
      if (file.size > state.config.maxFileSize) {
        errors.push(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
        continue
      }

      const hash = await hashFile(file)
      const duplicate = state.files.find(f => f.hash === hash)
      if (duplicate) {
        errors.push(`File already scheduled: ${file.name}`)
        continue
      }

      newFiles.push({
        id: nanoid(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        hash,
        status: 'queued',
        progress: 0,
      })
    }

    if (newFiles.length > 0) {
      if (!state.config.multiple && newFiles[0]) {
        setFiles([newFiles[0]])
      } else {
        addFiles(newFiles)
      }
    }

    errors.forEach(addError)
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    if (state.config.dragDropEnabled) setDragActive(true)
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault()
    setDragActive(false)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragActive(false)
    if (!state.config.dragDropEnabled) return
    if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files)
  }

  function onFileInputChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (input.files) {
      handleFiles(input.files)
      input.value = ''
    }
  }

  function startUpload() {
    if (state.isUploading) return
    if (state.files.length === 0) {
      addError('No files to upload')
      return
    }

    setUploading(true)
    worker = createWorker()

    worker.onmessage = (e) => {
      const { id, progress, done, error } = e.data
      if (progress !== undefined) {
        updateFile(id, { progress, status: 'uploading' })
      }
      if (done) {
        updateFile(id, { progress: 100, status: 'success' })
        if (state.files.every(f => ['success', 'error'].includes(f.status))) {
          setUploading(false)
          worker?.terminate()
          worker = null
        }
      }
      if (error) {
        updateFile(id, { status: 'error', error })
        setUploading(false)
        worker?.terminate()
        worker = null
      }
    }

    for (const file of state.files.filter(f => f.status === 'queued')) {
      worker.postMessage({ file: file.file, id: file.id })
    }
  }

  return (
    <>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          border: dragActive() ? '2px dashed #3eba6f' : '2px dashed #aaa',
          padding: '1rem',
          'border-radius': '6px',
          'margin-bottom': '1rem',
          'background-color': dragActive() ? '#e6ffe6' : '#fafafa',
          'text-align': 'center',
          cursor: state.config.dragDropEnabled ? 'pointer' : 'default',
        }}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple={state.config.multiple}
          accept={
            state.config.allowedExtensions.length > 0
              ? state.config.allowedExtensions.map(ext => '.' + ext).join(',')
              : undefined
          }
          onChange={onFileInputChange}
          style={{ display: 'none' }}
        />
        <label for="file-upload-input" style={{ cursor: 'pointer' }}>
          {state.config.dragDropEnabled
            ? 'Drag & drop files here or click to select files'
            : 'Click to select files'}
        </label>
      </div>

      <div style={{ 'margin-bottom': '1rem' }}>
        <button
          onClick={startUpload}
          disabled={state.isUploading || state.files.length === 0}
          class="pure-button pure-button-primary"
        >
          Upload
        </button>
      </div>

      <Show when={state.errors.length > 0}>
        <div style={{ color: 'red', 'margin-bottom': '1rem' }}>
          <For each={state.errors}>{(err) => <div>{err}</div>}</For>
        </div>
      </Show>

      <div>
        <For each={state.files}>
          {(file) => (
            <div
              style={{
                border: '1px solid #ccc',
                padding: '0.5rem',
                'margin-bottom': '0.5rem',
                'border-radius': '4px',
              }}
            >
              <div>
                <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
              </div>
              <div>Status: {file.status}</div>
              <Show when={file.status === 'uploading' || file.status === 'success' || file.status === 'error'}>
                <progress value={file.progress} max="100" style={{ width: '100%' }}></progress>
              </Show>
              <Show when={file.error}>
                <div style={{ color: 'red' }}>{file.error}</div>
              </Show>
              <Show when={file.status === 'queued'}>
                <button onClick={() => removeFile(file.id)} class="pure-button pure-button-secondary">
                  Remove
                </button>
              </Show>
              <Show when={file.status === 'error'}>
                <button onClick={() => retryUpload(file.id)} class="pure-button pure-button-error" style={{ 'margin-left': '0.5rem' }}>
                  Retry
                </button>
              </Show>
            </div>
          )}
        </For>
      </div>
    </>
  )
}
