"use client";

import { PartyPopper, Sparkles, Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xp: number;
}

export function SuccessDialog({ open, onOpenChange, xp }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="bg-success/10 text-success border-success/30 mb-2 flex size-12 items-center justify-center rounded-full border">
            <PartyPopper className="size-6" />
          </div>
          <DialogTitle>Challenge complete!</DialogTitle>
          <DialogDescription>
            All requirements passed. Your solution ran safely in the sandbox.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 rounded-md border border-dashed p-4">
          <Star className="text-warning size-5 fill-current" />
          <span className="text-foreground text-2xl font-bold">{xp}</span>
          <span className="text-muted-foreground text-sm">XP earned</span>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)}>
            <Sparkles /> Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
