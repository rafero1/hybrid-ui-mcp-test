import { Bubble, BubbleContent } from "../ui/bubble";
import { Spinner } from "../ui/spinner";

function ChatBubbleThinking() {
  return (
    <Bubble align="start" variant="muted">
      <BubbleContent>
        <Spinner />
      </BubbleContent>
    </Bubble>
  );
}

export default ChatBubbleThinking;
