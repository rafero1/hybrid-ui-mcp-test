import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { TaskProgress } from "@/types/progress";
import MCPClient from "@/features/mcp/MCPClient";
import type { ChatMessage } from "./types";
import ChatBubble from "./ChatBubble";
import ChatBubbleThinking from "./ChatBubbleThinking";
import { toast } from "../ui/toast";
import type { TextResponseContent } from "@/features/mcp/types";

const MaxCharLength = 280;

function AiChatCard() {
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const [userText, setUserText] = useState("");
  const usedCharacters = userText.length;

  const handleInput = (event: React.InputEvent<HTMLTextAreaElement>) => {
    const inputText = event.currentTarget.value;
    const textareaLength = inputText.length;
    if (textareaLength > MaxCharLength) {
      return;
    }
    setUserText(inputText);
  };

  const [aiProgress, setAiProgress] = useState<TaskProgress>(
    TaskProgress.NotStarted,
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! Try chatting, asking for tools or calling a registered tool.",
    },
  ]);

  const handleSend = async () => {
    function finish(action?: () => void) {
      const delay = setTimeout(() => {
        action?.();
      }, 200);
      return () => {
        clearTimeout(delay);
      };
    }

    if (!userText || aiProgress === TaskProgress.Started) {
      return;
    }

    setAiProgress(TaskProgress.Started);

    // sanitize user input...
    const sanitizedInput = userText;

    const newMessage: ChatMessage = { role: "user", text: sanitizedInput };

    setChatMessages(old => [...old, newMessage]);

    // Send...
    let response: TextResponseContent[];

    const cachedUserText = userText;
    setUserText("");

    try {
      response = await MCPClient.getInstance().processQuery(newMessage.text);
    } catch (error) {
      setChatMessages(old => [...old.slice(0, -1)]);
      toast.add({
        type: "error",
        title: "Error",
        description: "Error sending message: " + error,
        priority: "high",
      });
      return finish(() => {
        setAiProgress(TaskProgress.Done);
        setUserText(cachedUserText);
      });
    }

    return finish(() => {
      setAiProgress(TaskProgress.Done);
      setChatMessages(old => [
        ...old,
        ...response.map(
          item => ({ role: "assistant", text: item.text }) as ChatMessage,
        ),
      ]);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      sendButtonRef.current?.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Chat Test</h2>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-2 py-12">
          {chatMessages.map((message, i) => {
            return (
              <ChatBubble key={i} role={message.role} text={message.text} />
            );
          })}
          {aiProgress === TaskProgress.Started && <ChatBubbleThinking />}
        </div>
        <div>
          <InputGroup>
            <InputGroupTextarea
              id="block-end-textarea"
              placeholder="Chat..."
              value={userText}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              maxLength={MaxCharLength}
              className="max-w-xl"
            />
            <InputGroupAddon align="block-end">
              <InputGroupText>
                {usedCharacters}/{MaxCharLength}
              </InputGroupText>
              <InputGroupButton
                variant="default"
                size="sm"
                className="ml-auto"
                onClick={handleSend}
                disabled={userText.length === 0}
                ref={sendButtonRef}
              >
                {userText.length === 0 ? "Type to send" : "Send"} <SendIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export default AiChatCard;
