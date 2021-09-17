
export interface ChatMessage {
  /** If undefined, message is loading */
  text?: string | undefined
  fromUser: boolean
}

type OnMessage = (history: ChatMessage[]) => void;

export interface Chatbot {
  /**
   * Initial messages the chatbot should say.
   */
  initialMessage(onMessage: OnMessage): void;

  /**
   * @return new chat history
   */
  respond(prompt: string, onMessage: OnMessage): void;
}

class History {
  public messages: ChatMessage[] = [];

  addMessage(m: ChatMessage) {
    this.messages = [
      ...this.messages.filter((c) => c.text !== undefined),
      m
    ];
  }

  messageCallback(onMessage: OnMessage): (m: ChatMessage) => void {
    return (m) => {
      this.addMessage(m);
      onMessage(this.messages);
    }
  }
}

class Delayed {
  constructor(public history: History) {
  }

  async addDelayedMessage(m: ChatMessage, d?: {delayMs: number}): Promise<void> {
    return new Promise((acc, _rej) => {
      setTimeout(() => {
        this.history.addMessage(m);
        acc();
      }, d?.delayMs ?? 0);
    });
  }

  messageCallback(onMessage: OnMessage): (m: ChatMessage, d?: {delayMs: number}) => Promise<void> {
    return async (m, d) => {
      await this.addDelayedMessage({fromUser: m.fromUser}, d);
      onMessage(this.history.messages);
      await this.addDelayedMessage(m, d);
      onMessage(this.history.messages);
    };
  }
}

export class MockChatbot implements Chatbot {
  private delayed = new Delayed(new History());

  initialMessage(onMessage: (history: ChatMessage[]) => void) {
    const addMessage = this.delayed.messageCallback(onMessage);
    addMessage({text: 'Hi, I\'m Clem, how can I help?', fromUser: false}, {delayMs: 500});
  }

  respond(prompt: string, onMessage: (history: ChatMessage[]) => void) {
    const addMessage = this.delayed.messageCallback(onMessage);
    addMessage({ text: prompt, fromUser: true });
    addMessage({ fromUser: false }, { delayMs: 400 });
    addMessage({ text: 'Response', fromUser: false }, { delayMs: 1400 });
  }
}

export class Gpt3Chatbot implements Chatbot {
  private delayed = new Delayed(new History());

  initialMessage(onMessage: (history: ChatMessage[]) => void) {
    const addMessage = this.delayed.messageCallback(onMessage);
    addMessage({text: 'Hi, I\'m Clem, how can I help?', fromUser: false}, {delayMs: 500});
  }

  respond(prompt: string, onMessage: (history: ChatMessage[]) => void) {
    const addMessage = this.delayed.messageCallback(onMessage);
    addMessage({ text: prompt, fromUser: true });
    addMessage({ fromUser: false }, { delayMs: 400 });
    addMessage({ text: 'Response', fromUser: false }, { delayMs: 1400 });
  }
}