import { Show, Switch, Match } from 'solid-js'
import style from './ledgerEditor.module.css'

type Props = {
  isNew: boolean
}

export function LedgerEditorPage ({ isNew = true }: Props) {
  return (
    <div>
      <div class={style['credit-form']}>
        <Switch>
          <Match when={isNew === true}>
            <h2>Create Ledger Event</h2>
          </Match>
          <Match when={isNew === false}>
            <h2>Edit Ledger Event</h2>
          </Match>
        </Switch>
        
        <form
          id="ledgerEventForm"
          enctype="multipart/form-data"
        >
          <Show when={isNew === false}>
            <label for="creditId">Credit ID</label>
            <input 
              type="text"
              id="creditId"
              name="creditId"
              readonly
              disabled
              value="CREDIT_ID"
            />
          </Show>

          <label for="amount">Amount (kWh)</label>
          <input type="number" id="amount" name="amount" value="100" min="0" step="0.01" />
          <br /><br />

          <label for="status">Status</label>
          <select id="status" name="status">
            <option value="valid" selected>Valid</option>
            <option value="invalid">Invalud</option>
          </select>
          <br /><br />

          <label for="type">Type</label>
          <select id="type" name="type">
            <option value="add-credits" selected>Adding Credits</option>
            <option value="remove-credits" selected>Removing Credits</option>
            <option value="claim-credits" selected>Claiming Credits</option>
            <option value="add-note" selected>Adding Note</option>
          </select>
          <br /><br />

          <label for="documents">Upload Supporting Documents</label>
          <input
            type="file"
            id="documents"
            name="documents[]"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.docx"
          />
          <br /><br />

          <label for="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            placeholder="Add notes about this ledger event..."></textarea>
          <br /><br />

          <div class={style['form-actions']}>
            <button type="submit">Save Changes</button>
            <button type="reset">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}