import Button from '../common/Button'
import Modal from '../common/Modal'

// Asks before deleting something.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={busy}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
