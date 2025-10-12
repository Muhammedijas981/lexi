interface MessageBubbleProps {
  message: string;
  role: "user" | "assistant";
  timestamp?: Date;
}

export default function MessageBubble({
  message,
  role,
  timestamp,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          role === "user"
            ? "bg-primary-500 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p
            className={`text-xs mt-2 ${
              role === "user" ? "text-white/70" : "text-gray-500"
            }`}
          >
            {timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}
