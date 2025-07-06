export const RenderReview = ({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) => (
  <div className="flex items-start space-x-3">
    <span className="text-gray-400 text-sm w-24">{label}:</span>
    <span className={`text-foreground text-sm ${multiline ? "max-w-md" : ""}`}>
      {value}
    </span>
  </div>
);
