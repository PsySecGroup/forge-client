import './css/creditEditor.module.css'

export function CreditEditorPage () {
  return (<div class="credit-form">
  <h2>Edit Credit</h2>
  <form id="editCreditForm" enctype="multipart/form-data">
    <label for="creditId">Credit ID</label>
    <input type="text" id="creditId" name="creditId" readonly value="CREDIT_ID" />

    <label for="amount">Amount (kWh)</label>
    <input type="number" id="amount" name="amount" value="100" min="0" step="0.01" />

    <label for="status">Status</label>
    <select id="status" name="status">
      <option value="pending">Pending</option>
      <option value="verified" selected>Verified</option>
      <option value="rejected">Rejected</option>
    </select>

    <label for="documents">Upload Supporting Documents</label>
    <input type="file" id="documents" name="documents[]" multiple accept=".pdf,.jpg,.jpeg,.png,.docx" />

    <label for="notes">Notes</label>
    <textarea id="notes" name="notes" rows="4" placeholder="Add notes about this credit...">Verified by third-party validator.</textarea>

    <div class="form-actions">
      <button type="submit">Save Changes</button>
      <button type="reset">Cancel</button>
    </div>
  </form>
</div>)
}