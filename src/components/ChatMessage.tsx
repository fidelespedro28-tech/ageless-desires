import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  senderImage?: string;
}

const ChatMessage = ({
  content,
  isUser,
  timestamp,
  isAudio = false,
  audioDuration,
  senderImage,
}: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-2 mb-4 animate-fade-in-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && senderImage && (
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          <img src={senderImage} alt="Sender" className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm"
        )}
      >
        {isAudio ? (
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              ▶️
            </button>
            <div className="flex-1">
              <div className="h-1 w-24 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-white/70 rounded-full" />
              </div>
            </div>
            <span className="text-xs opacity-70">{audioDuration}</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{content}</p>
        )}
        
        <p
          className={cn(
            "text-xs mt-1",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
