import './dashboard.module.css'

export function DashboardPage () {
  return (<div class="dashboard-selector">
  <h3>Dashboard Sections</h3>
  <form id="dashboardSelectorForm">
    <label><input type="checkbox" name="dashboardSection" value="summaryCards" checked /> Summary Cards / KPIs</label>
    <label><input type="checkbox" name="dashboardSection" value="realTimeMonitoring" checked /> Real-Time Monitoring</label>
    <label><input type="checkbox" name="dashboardSection" value="trendsAnalytics" checked /> Trends & Analytics</label>
    <label><input type="checkbox" name="dashboardSection" value="alertsPanel" checked /> Alerts & Notifications Panel</label>
    <label><input type="checkbox" name="dashboardSection" value="deviceHealth" checked /> Device & Software Health</label>
    <label><input type="checkbox" name="dashboardSection" value="creditsOverview" checked /> Credits & Financial Overview</label>
    <label><input type="checkbox" name="dashboardSection" value="userActivityFeed" checked /> User & Activity Feed</label>
    <label><input type="checkbox" name="dashboardSection" value="reportsQuickActions" checked /> Reports & Quick Actions</label>
    <label><input type="checkbox" name="dashboardSection" value="systemHealth" checked /> System Health & Capacity</label>
  </form>
</div>)
}