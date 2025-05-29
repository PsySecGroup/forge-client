import './css/minterEditor.module.css'

export function MinterEditorPage () {
  return (<div class="minter-form">
  <h2>Edit Minter</h2>
  <form id="editMinterForm" enctype="multipart/form-data">
    <label for="minterId">Minter ID</label>
    <input type="text" id="minterId" name="minterId" readonly value="MINTER_ID" />

    <label for="status">Status</label>
    <select id="status" name="status">
      <option value="active">Active</option>
      <option value="paused">Paused</option>
      <option value="offline">Offline</option>
    </select>

    <label for="threshold">Credit Threshold (kWh)</label>
    <input type="number" id="threshold" name="threshold" value="100" min="0" />

    <label for="softwareVersion">Software Version</label>
    <input type="text" id="softwareVersion" name="softwareVersion" value="v2.3.4" />

    <label for="owner">Owner</label>
    <input type="text" id="owner" name="owner" value="0x1234...abcd" />

    <label for="tags">Tags (comma separated)</label>
    <input type="text" id="tags" name="tags" value="solar,rural" />

    <label for="documents">Upload Documents (PDF, JPG, PNG)</label>
    <input type="file" id="documents" name="documents[]" multiple accept=".pdf,.jpg,.jpeg,.png,.docx" />

    <label for="notes">Notes</label>
    <textarea id="notes" name="notes" rows="4" placeholder="Add notes about this minter...">Recent firmware patch deployed in remote region.</textarea>

    <div class="form-actions">
      <button type="submit">Save Changes</button>
      <button type="reset">Cancel</button>
    </div>
  </form>
</div>)
}