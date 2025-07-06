import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export function TaskModalFooter({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onSubmit,
  canProceed,
}: {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
}) {
  return (
    <div className="flex justify-between pt-4 border-t border-border">
      <Button
        variant="outline"
        onClick={currentStep === 1 ? onPrev : onPrev}
        className="border-border text-gray-300 hover:bg-card-box"
      >
        {currentStep === 1 ? (
          "Cancel"
        ) : (
          <>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </>
        )}
      </Button>

      <Button
        onClick={currentStep === totalSteps ? onSubmit : onNext}
        disabled={!canProceed}
        className="bg-purple-600 hover:bg-purple-700 text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentStep === totalSteps ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Create Task
          </>
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}
