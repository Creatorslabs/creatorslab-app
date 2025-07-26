"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Step1_BasicInfo from "./steps/Step1_BasicInfo";
import Step2_PlatformEngagement from "./steps/Step2_PlatformEngagement";
import Step3_RewardsTarget from "./steps/Step3_RewardsTarget";
import Step4_DetailsContent from "./steps/Step4_DetailsContent";
import Step5_ReviewConfirm from "./steps/Step5_ReviewConfirm";
import { validateStep } from "./validateStep";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import { GetRewardPoints } from "@/lib/helpers/getRewardPoint";
import { useUserBalances } from "@/hooks/useUserBalances";

export type TaskData = {
  _id?: string;
  title: string;
  type: string[];
  platform: string;
  image: string;
  description: string;
  category: string;
  target: string;
  rewardPoints: number;
  maxParticipants: number;
  expiration?: string;
};

interface MultiStepTaskModalProps {
  task?: TaskData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MultiStepTaskModal({
  task,
  isOpen,
  onClose,
}: MultiStepTaskModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TaskData>({
    title: "",
    type: [],
    image: "",
    platform: "",
    description: "",
    category: "",
    target: "",
    rewardPoints: 0,
    maxParticipants: 0,
    expiration: "",
  });
  const [engagementOptions, setEngagementOptions] = useState<
    Record<string, string[]>
  >({});
  const [socialPlatforms, setSocialPlatforms] = useState<
    { value: string; label: string }[]
  >([]);
  const { balances } = useUserBalances();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await fetch("/api/creator/engagement-options");
        const data = await res.json();
        setEngagementOptions(data.data.engagementOptions);
        setSocialPlatforms(data.data.socialPlatforms);
      } catch (err) {
        logger.error(err);
      }
    };
    fetchPlatforms();
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else {
      setFormData({
        title: "",
        type: [],
        image: "",
        platform: "",
        description: "",
        target: "",
        category: "",
        rewardPoints: 0,
        maxParticipants: 0,
        expiration: "",
      });
    }
  }, [task, isOpen]);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;
  const stepTitles = [
    "Basic Information",
    "Platform & Engagement",
    "Rewards & Target",
    "Details & Content",
    "Review & Confirm",
  ];

  const handleInputChange = (field: keyof TaskData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEngagementToggle = (engagement: string) => {
    const reward = GetRewardPoints(engagement);

    setFormData((prev) => {
      const isActive = prev.type.includes(engagement);
      const updatedType = isActive
        ? prev.type.filter((e) => e !== engagement)
        : [...prev.type, engagement];

      const updatedPoints = isActive
        ? prev.rewardPoints - reward
        : prev.rewardPoints + reward;

      return {
        ...prev,
        type: updatedType,
        rewardPoints: updatedPoints < 0 ? 0 : updatedPoints,
      };
    });
  };

  const nextStep = () => {
    if (validateStep(currentStep, formData) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  async function deleteImageFromBlob(formData: any) {
    if (!formData.image) return;

    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formData.image }),
      });

      if (!res.ok) {
        logger.error("Failed to delete image from Blob");
      } else {
        logger.log("Image deleted successfully");
      }
    } catch (err) {
      logger.error("Error deleting image:", err);
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/creator/submit-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: errorData.message || "Task submission failed",
          variant: "destructive",
        });
        return;
      }
      await res.json();

      toast({
        title: "Task submitted successfully",
      });

      await handleClose(true);
    } catch (err) {
      logger.error("Submission error:", err);
      toast({
        title: "Something went wrong while submitting the task.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = async (wasSubmitted: boolean = false) => {
    if (!wasSubmitted) {
      await deleteImageFromBlob(formData);
    }

    setCurrentStep(1);
    setFormData({
      title: "",
      type: [],
      platform: "",
      description: "",
      target: "",
      rewardPoints: 0,
      maxParticipants: 0,
      category: "",
      expiration: "",
      image: "",
    });
    setImagePreview(null);
    onClose();
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      handleInputChange,
      imagePreview,
      socialPlatforms,
      engagementOptions,
      handleEngagementToggle,
      setImagePreview,
      deleteImageFromBlob,
    };

    const stepComponents = {
      1: <Step1_BasicInfo {...stepProps} />,
      2: <Step2_PlatformEngagement {...stepProps} />,
      3: <Step3_RewardsTarget {...stepProps} />,
      4: <Step4_DetailsContent {...stepProps} />,
      5: (
        <Step5_ReviewConfirm
          formData={formData}
          imagePreview={imagePreview}
          socialPlatforms={socialPlatforms}
        />
      ),
    };

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          {stepComponents[currentStep as keyof typeof stepComponents]}
        </motion.div>
      </AnimatePresence>
    );
  };

  const handleCancel = () => {
    handleClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card-box border-border text-foreground max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {stepTitles[currentStep - 1]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="py-4">{renderStep()}</div>

        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleCancel : prevStep}
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
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={
              !validateStep(currentStep, formData) ||
              (currentStep === 3 &&
                formData.rewardPoints * formData.maxParticipants >
                  parseFloat(balances.cls))
            }
            className="bg-purple-600 hover:bg-purple-700 text-foreground disabled:opacity-50"
          >
            {currentStep === totalSteps ? (
              isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" /> Create Task
                </>
              )
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
