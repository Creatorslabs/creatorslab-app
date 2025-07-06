"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step2_PlatformEngagement({
  formData,
  socialPlatforms,
  engagementOptions,
  handleInputChange,
  handleEngagementToggle,
}: any) {
  const selectedPlatform = formData.platform;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          Choose the social platform and engagement types
        </p>
      </div>

      {/* Platform Select */}
      <div className="space-y-2">
        <Label className="text-gray-300 text-sm">Social Platform</Label>
        <Select
          value={selectedPlatform}
          onValueChange={(value) => {
            handleInputChange("platform", value);
            handleInputChange("type", []);
          }}
        >
          <SelectTrigger className="bg-card-box border-border text-foreground">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent className="bg-card-box border-border">
            {socialPlatforms.map((platform: any) => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Selected Platform Badge */}
        <AnimatePresence>
          {selectedPlatform && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <Badge
                variant="secondary"
                className="bg-purple-600 text-foreground mt-2"
              >
                {
                  socialPlatforms.find((p: any) => p.value === selectedPlatform)
                    ?.label
                }
                <button
                  onClick={() => handleInputChange("platform", "")}
                  className="ml-2 hover:bg-purple-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Engagement Type Section */}
      <AnimatePresence>
        {selectedPlatform && (
          <motion.div
            key="engagement-section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <Label className="text-gray-300 text-sm">Engagement Type</Label>
            <div className="space-y-3">
              {engagementOptions?.[selectedPlatform]?.map(
                (engagement: string) => (
                  <div key={engagement} className="flex items-center space-x-3">
                    <Checkbox
                      id={engagement}
                      checked={formData.type.includes(engagement)}
                      onCheckedChange={() => handleEngagementToggle(engagement)}
                      className="border-border data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label
                      htmlFor={engagement}
                      className="text-gray-300 text-sm"
                    >
                      {engagement}
                    </Label>
                  </div>
                )
              )}
            </div>

            {/* Selected Engagement Badges */}
            <AnimatePresence>
              {formData.type.length > 0 && (
                <motion.div
                  key="selected-engagements"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  {formData.type.map((engagement: string) => (
                    <Badge
                      key={engagement}
                      className="bg-purple-600 text-foreground"
                    >
                      {engagement}
                      <button
                        onClick={() => handleEngagementToggle(engagement)}
                        className="ml-2 hover:bg-purple-700 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
