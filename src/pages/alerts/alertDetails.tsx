import './alertDetails.module.css'

type Props = {
  id: number
}

export function AlertDetailsPage ({ id }: Props) {
  return (<div class="alert-details">
  <h2>Alert Details</h2>
  <div class="alert-info">
    <div class="info-item">
      <strong>Alert Name:</strong> Minter Unresponsive
    </div>
    <div class="info-item">
      <strong>Type:</strong> Minter Unresponsive
    </div>
    <div class="info-item">
      <strong>Threshold:</strong> N/A
    </div>
    <div class="info-item">
      <strong>Channels:</strong> SMS, Email
    </div>
    <div class="info-item">
      <strong>Recipients:</strong> +1234567890, admin@example.com
    </div>
    <div class="info-item">
      <strong>Custom Message:</strong>
      <p>The minter has not responded for 15 minutes.</p>
    </div>
  </div>
</div>)
}