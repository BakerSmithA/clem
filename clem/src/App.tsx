import React, { useState } from 'react';
import './App.css';
import { ChatMessage, Chatbot } from './Chatbot';

interface AppProps {
  chatbot: Chatbot
}

function App({chatbot}: AppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  return (
    <div className='App'>
      <Messages 
        messages={messages}
      />
      <div className='FieldContainer'>
        <Field
          onSubmit={(t) => 
            chatbot.respond(t, (hist) => setMessages(hist))
          }
        />
      </div>
      <div className='Spacer'/>
    </div>
  );
}

interface MessagesProps {
  messages: ChatMessage[]
}

function Messages({messages}: MessagesProps) {
  return (
    <div className='Messages'>
      {messages.map((m) => <Message key={m.text} text={m.text} fromUser={m.fromUser} />)}
    </div>
  );
}

function Message({text, fromUser}: ChatMessage) {
  return (
    <div className={`Message ${fromUser ? 'UserMessage' : 'RespondentMessage'}`}>
      {text}
    </div>
  );
}

interface FieldProps {
  onSubmit: (text: string) => void
}

function Field({onSubmit}: FieldProps) {
  const textInput = React.createRef<HTMLInputElement>();
  return (
    <div className='FieldForm'>
      <input type="text" ref={textInput} className='TextField'/>
      <div 
        className='SendButton' 
        onClick={() => onSubmit(textInput.current!.value)}
      />
    </div>
  );
}

export default App;
