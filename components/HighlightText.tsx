import React from "react";

export function HighlightText({
  text,
  highlight,
  className = "",
}: {
  text: string;
  highlight?: string;
  className?: string;
}) {
  if (!highlight || highlight.trim() === "") {
    return <span className={className}>{text}</span>;
  }

  // Create a regex to split the text by the highlight term (case-insensitive)
  // We escape the highlight term to avoid regex errors if it contains special characters
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="text-solaire font-bold bg-solaire/10 rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
