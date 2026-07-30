import { Bubble, BubbleContent } from "../ui/bubble";
import type { ChatMessage } from "./types";

function ChatBubble({ role, text }: ChatMessage) {
  const align = role === "user" ? "end" : "start";
  const variant = role === "user" ? "default" : "muted";
  return (
    <Bubble align={align} variant={variant}>
      <BubbleContent>{text}</BubbleContent>
    </Bubble>
  );
}

export default ChatBubble;
