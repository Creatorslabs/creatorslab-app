"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-dark.css";

export default function Step4_DetailsContent({
  formData,
  handleInputChange,
}: any) {
  const [selectedDate, setSelectedDate] = useState(
    formData.expiration ? new Date(formData.expiration) : null
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    handleInputChange("expiration", date ? date.toISOString() : "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          Add the final details for your task
        </p>
      </div>

      {/* Custom Dark DatePicker */}
      <div className="space-y-2">
        <Label htmlFor="expiration" className="text-gray-300 text-sm">
          Expiration Date
        </Label>

        <div className="flex items-center gap-3">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select expiration date"
            className="w-full bg-card-box text-foreground border-border border px-3 py-2 rounded-md focus:outline-none"
            calendarClassName="dark-datepicker"
            id="expiration"
            minDate={new Date()}
          />
          {selectedDate && (
            <button
              type="button"
              onClick={() => handleDateChange(null)}
              className="text-sm text-red-400 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Task Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-gray-300 text-sm">
          Task Category
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger className="bg-card-box border-border text-foreground">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-card-box text-foreground">
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="content">Content Creation</SelectItem>
            <SelectItem value="referral">Referral Task</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300 text-sm">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Add any final task instructions or requirements..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="bg-card-box border-border text-foreground min-h-[100px] focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </motion.div>
  );
}
