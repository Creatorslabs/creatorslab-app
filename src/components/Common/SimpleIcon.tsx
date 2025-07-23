"use client";

import React from "react";
import * as icons from "simple-icons";

interface Props {
  platform: string; // e.g., 'twitter', 'discord'
  className?: string;
  color?: string;
  hasBackground?: boolean;
  backgroundColor?: string;
}

const PLATFORM_MAP: Record<string, string> = {
  twitter: "X",
};

export const SimpleIcon = ({
  platform,
  className = "w-5 h-5",
  color = "#ffffff",
  hasBackground = false,
  backgroundColor = "#000000",
}: Props) => {
  const mapped = PLATFORM_MAP[platform.toLowerCase()] || platform;
  const slug = `si${mapped.charAt(0).toUpperCase()}${mapped.slice(1)}`;

  const icon: icons.SimpleIcon | undefined = (icons as any)[slug];

  if (!icon) {
    console.warn(`Icon not found for platform: ${platform}`);
    return null;
  }

  const svg = icon.svg
    .replace(/<svg /, '<svg fill="currentColor" ')
    .replace(/fill="[^"]*"/g, 'fill="currentColor"');

  const content = (
    <span
      className={className}
      style={{ color }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );

  if (hasBackground) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-md p-1`}
        style={{ backgroundColor }}
      >
        {content}
      </div>
    );
  }

  return content;
};
