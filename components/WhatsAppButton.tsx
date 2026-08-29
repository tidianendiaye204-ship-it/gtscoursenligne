import { WHATSAPP_GROUPE_URL } from "@/lib/data";

export default function WhatsAppButton({
  label = "Rejoindre le groupe WhatsApp",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={WHATSAPP_GROUPE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex items-center gap-2 bg-solaire text-encre font-body font-semibold px-6 py-3 rounded-sm hover:bg-white transition-colors " +
        className
      }
    >
      {label}
    </a>
  );
}
