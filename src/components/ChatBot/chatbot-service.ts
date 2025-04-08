import { useChatStore } from "@/store/chatbot-store";

/**
 * Sends a message to the chatbot API and updates the chat store with the response
 * @param message The message to send to the chatbot
 * @param sessionId The user's session ID (usually hubspotOwnerId)
 * @returns Promise resolving to the chatbot's response
 */
export const sendChatbotMessage = async (
  message: string,
  sessionId?: string
): Promise<string> => {
  const { addMessage, setIsLoading } = useChatStore.getState();

  addMessage({ text: message, isUser: true });
  setIsLoading(true);

  try {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatInput: message,
        sessionId,
      }),
    });

    const data = await response.json();
    const chatResponse =
      data[0].output || "Sorry, there was an error processing your request.";

    addMessage({
      text: chatResponse,
      isUser: false,
    });

    return chatResponse;
  } catch (error) {
    const errorMessage = "Sorry, there was an error connecting to the server.";

    addMessage({
      text: errorMessage,
      isUser: false,
    });

    return errorMessage;
  } finally {
    setIsLoading(false);
  }
};
