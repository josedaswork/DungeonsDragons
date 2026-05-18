import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const SheetContext = React.createContext({ open: false, onOpenChange: () => {} })

function Sheet({ open, onOpenChange, children }) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(SheetContext)
  if (asChild) {
    return React.cloneElement(children, { ...props, ref, onClick: () => onOpenChange(true) })
  }
  return <button ref={ref} onClick={() => onOpenChange(true)} {...props}>{children}</button>
})
SheetTrigger.displayName = "SheetTrigger"

function SheetContent({ side = "right", className, children }) {
  const { open, onOpenChange } = React.useContext(SheetContext)
  if (!open) return null

  const sideClasses = {
    left: "inset-y-0 left-0 data-[state=open]:slide-in-from-left",
    right: "inset-y-0 right-0 data-[state=open]:slide-in-from-right",
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0" onClick={() => onOpenChange(false)} />
      <div
        data-state="open"
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out animate-in duration-300",
          sideClasses[side],
          className
        )}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}

function SheetHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
}

function SheetTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }
