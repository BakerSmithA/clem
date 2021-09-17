import key from './key.txt';
import promptHeader from './promptHeader.txt';

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
  private url = 'https://api.openai.com/v1/engines/davinci/completions';;
  private delayed = new Delayed(new History());

  initialMessage(onMessage: (history: ChatMessage[]) => void) {
    onMessage([
      ...this.delayed.history.messages, 
      {
        text: 'Hi, I\'m Clem, how can I help?', 
        fromUser: false
      }
    ]);
  }

  async respond(prompt: string, onMessage: (history: ChatMessage[]) => void) {
    const addMessage = this.delayed.messageCallback(onMessage);
    await addMessage({ text: prompt, fromUser: true });
    const hs = this.delayed.history.messages;

    await addMessage({ fromUser: false }, { delayMs: 400 });
    const resp = await this.gpt3(hs);
    await addMessage({ text: resp, fromUser: false });
  }

  private async gpt3(hs: ChatMessage[]): Promise<string> {
    const prompt = this.formattedHistory(hs);
    const key = await this.openAiKey();
    const header = await this.promptHeader();
    const fullPrompt = `${header}\n${prompt}`;
    const resp = await fetch(this.url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ 
        prompt: fullPrompt,
        max_tokens: 128,
        temperature: 0.8,
        stop: '---',
      })
    });
    const json = await resp.json();
    const text: string = json['choices'][0]['text'];
    const splits = text.split('---');
    return splits[splits.length-1].replace('Clem:', '');
  }

  private async openAiKey(): Promise<string> {
    const r = await fetch(key);
    return r.text();
  }

  private async promptHeader(): Promise<string> {
    const r = await fetch(promptHeader);
    return r.text();
  }

  private formattedHistory(messages: ChatMessage[]): string {
    return messages.flatMap((m) => [
      `${m.fromUser ? 'You': 'AI'}: ${m.text}`,
      ...(m.fromUser! ? ['\n'] : ['\n---\n'])
    ]).join('');
  }
}