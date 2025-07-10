import './alertEditor.module.css'

export function AlertEditorPage () {
  return (<div class="alert-form">
  <h2>Create New Alert</h2>
  <form id="createAlertForm">
    <label for="alertName">Alert Name</label>
    <input type="text" id="alertName" name="alertName" placeholder="E.g. Minter Offline Alert" required />

    <label for="alertType">Alert Type / Event</label>
    <select id="alertType" name="alertType" required>
      <option value="" disabled selected>Select event</option>
      <option value="new_minter">New Minter Added</option>
      <option value="minter_unresponsive">Minter Unresponsive</option>
      <option value="minter_powered_down">Minter Powered Down</option>
      <option value="credits_minted">Credits Minted Threshold</option>
      <option value="firmware_update">Firmware Update Status</option>
    </select>

    <label for="threshold" id="thresholdLabel" style="display:none;">Threshold (for credits minted)</label>
    <input type="number" id="threshold" name="threshold" min="1" placeholder="Enter threshold" style="display:none;" />

    <label>Delivery Channels</label>
    <div class="checkbox-group">
      <label><input type="checkbox" name="channels" value="sms" /> SMS</label>
      <label><input type="checkbox" name="channels" value="email" /> Email</label>
      <label><input type="checkbox" name="channels" value="push" /> Push Notification</label>
    </div>

    <label for="recipients">Recipients (comma separated phone numbers or emails)</label>
    <input type="text" id="recipients" name="recipients" placeholder="+1234567890, user@example.com" required />

    <label for="customMessage">Custom Message (optional)</label>
    <textarea id="customMessage" name="customMessage" rows="3" placeholder="Add a custom message for the alert"></textarea>

    <div class="form-actions">
      <button type="submit">Create Alert</button>
      <button type="reset">Cancel</button>
    </div>
  </form>
</div>)
}