import './css/minterDetails.module.css'

type Props = {
  id: number
}

export function MinterDetailsPage ({ id }: Props) {
  return (
<div class="minter-card">
  <h2>Minter: #MINTER_ID</h2>
  
  <div class="minter-meta">
    <p><strong>Status:</strong> Active</p>
    <p><strong>Location:</strong> Kenya, Grid Node 12</p>
    <p><strong>Owner:</strong> 0x1234...abcd</p>
    <p><strong>Uptime:</strong> 128 days</p>
    <p><strong>Software Version:</strong> v2.3.4</p>
    <p><strong>Threshold:</strong> 100 kWh per credit</p>
    <p><strong>Total Credits Minted:</strong> 42</p>
    <p><strong>Network:</strong> Cellular (LTE)</p>
    <p><strong>Last Credit Timestamp:</strong> 2025-05-25 14:32 UTC</p>
    <p><strong>Tags:</strong> 
      <span class="tag">solar</span> 
      <span class="tag">rural</span>
    </p>
  </div>

  <div class="minter-documents">
    <h3>Uploaded Documents</h3>
    <ul>
      <li><a href="/documents/minter123/manual.pdf" target="_blank">manual.pdf</a></li>
      <li><a href="/documents/minter123/maintenance.jpg" target="_blank">maintenance.jpg</a></li>
    </ul>
  </div>

  <div class="minter-notes">
    <h3>Notes</h3>
    <p><em>2025-05-25:</em> Recent firmware patch deployed in remote region.</p>
    <ul>
      <li><strong>2025-05-25:</strong> Recent firmware patch deployed in remote region.</li>
      <li><strong>2025-04-10:</strong> Power instability detected.</li>
    </ul>
  </div>

  <div class="minter-actions">
    <button>Pause</button>
    <button>Resume</button>
    <button>Update Firmware</button>
  </div>
</div>)
}