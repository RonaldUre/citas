import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  showCloseButton?: boolean
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
}: BaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-2">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}

        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}