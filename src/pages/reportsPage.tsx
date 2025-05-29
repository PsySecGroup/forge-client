export function ReportsPage () {
  return (<div class="report-request-form">
  <h2>Request Report</h2>
  <form id="reportRequestForm">
    <label for="reportType">Report Type</label>
    <select id="reportType" name="reportType" required>
      <option value="" disabled selected>Select report type</option>
      <optgroup label="Minters">
        <option value="usage_summary">Usage Summary</option>
        <option value="uptime_availability">Uptime & Availability</option>
        <option value="firmware_versions">Firmware & Software Versions</option>
        <option value="network_activity">Network Activity</option>
        <option value="security_events">Tamper & Security Events</option>
      </optgroup>
      <optgroup label="Credits">
        <option value="credits_minted">Credits Minted</option>
        <option value="credits_expiration">Credits Expiration</option>
        <option value="credits_status">Credits Status</option>
        <option value="credits_transactions">Credits Transactions</option>
        <option value="carbon_offset_impact">Carbon Offset Impact</option>
      </optgroup>
      <optgroup label="Alerts">
        <option value="alerts_summary">Alerts Summary</option>
        <option value="alerts_response">Alerts Response</option>
        <option value="delivery_performance">Delivery Channel Performance</option>
      </optgroup>
      <optgroup label="Audit & Compliance">
        <option value="document_validation">Document Validation</option>
        <option value="user_activity">User Activity</option>
        <option value="data_integrity">Data Integrity & Security</option>
      </optgroup>
      <optgroup label="Operational">
        <option value="group_performance">Group or Region Performance</option>
        <option value="financial_offset_claims">Financial / Offset Claims</option>
        <option value="system_health">System Health & Capacity</option>
      </optgroup>
    </select>

    <label for="dateFrom">From Date</label>
    <input type="date" id="dateFrom" name="dateFrom" required />

    <label for="dateTo">To Date</label>
    <input type="date" id="dateTo" name="dateTo" required />

    <label for="filterMinter">Filter by Minter (optional)</label>
    <input type="text" id="filterMinter" name="filterMinter" placeholder="Minter ID or name" />

    <label for="filterCredit">Filter by Credit (optional)</label>
    <input type="text" id="filterCredit" name="filterCredit" placeholder="Credit ID" />

    <label for="filterRegion">Filter by Region / Tag (optional)</label>
    <input type="text" id="filterRegion" name="filterRegion" placeholder="Region or tag" />

    <label for="outputFormat">Output Format</label>
    <select id="outputFormat" name="outputFormat" required>
      <option value="pdf">PDF</option>
      <option value="csv">CSV</option>
      <option value="xlsx">Excel</option>
    </select>

    <label for="scheduleReport">
      <input type="checkbox" id="scheduleReport" name="scheduleReport" />
      Schedule Recurring Report
    </label>

    <div id="recurrenceOptions" style="display:none;">
      <label for="recurrenceFrequency">Recurrence Frequency</label>
      <select id="recurrenceFrequency" name="recurrenceFrequency">
        <option value="daily">Daily</option>
        <option value="weekly" selected>Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <label for="recurrenceEndDate">End Recurrence (optional)</label>
      <input type="date" id="recurrenceEndDate" name="recurrenceEndDate" />
    </div>

    <div class="form-actions">
      <button type="submit">Request Report</button>
      <button type="reset">Reset</button>
    </div>
  </form>
</div>)
}