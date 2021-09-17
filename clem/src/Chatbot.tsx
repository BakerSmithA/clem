
export interface ChatMessage {
  /** If undefined, message is loading */
  text?: string | undefined
  fromUser: boolean
}

export interface Chatbot {
  /**
   * @return new chat history
   */
  respond: (prompt: string, onMessage: (history: ChatMessage[]) => void) => void
}

export class MockChatbot implements Chatbot {
  private messages: ChatMessage[] = [];

  respond(prompt: string, onMessage: (history: ChatMessage[]) => void) {
    const addMessage = (m: ChatMessage, loading: boolean) => {
      this.messages = [
        ...this.messages.filter((c) => c.text !== undefined),
        m
      ];
      onMessage(this.messages);
    }

    addMessage({ text: prompt, fromUser: true }, false);
    setTimeout(() => {
      addMessage({ fromUser: false }, true);
    }, 400);
    setTimeout(() => {
      addMessage({ text: 'Response', fromUser: false }, false);
    }, 1400)
  }
}