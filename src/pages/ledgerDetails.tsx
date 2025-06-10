import './css/ledgerDetails.module.css'

export function LedgerDetailsPage () {
  return (<div class="credit-card">
  <h2>Credit: #CREDIT_ID</h2>

  <div class="credit-meta">
    <p><strong>Timestamp:</strong> 2025-05-25 14:32 UTC</p>
    <p><strong>Amount:</strong> 100 kWh (carbon offset)</p>
    <p><strong>Status:</strong> Verified</p>
    <p><strong>Registered By:</strong> Minter #MINTER_ID</p>
  </div>

  <div class="credit-documents">
    <h3>Uploaded Documents</h3>
    <ul>
      <li><a href="/credits/CREDIT_ID/audit-report.pdf" target="_blank">audit-report.pdf</a></li>
      <li><a href="/credits/CREDIT_ID/validator-signoff.png" target="_blank">validator-signoff.png</a></li>
    </ul>
  </div>

  <div class="credit-notes">
    <h3>Notes</h3>
    <p><em>2025-05-25:</em> Verified by third-party validator; audit passed with no anomalies.</p>
    <ul>
      <li><strong>2025-05-25:</strong> Verified by third-party validator; audit passed with no anomalies.</li>
      <li><strong>2025-05-20:</strong> Awaiting validator review.</li>
    </ul>
  </div>
</div>)
}