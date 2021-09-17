import React, { useState } from 'react';
import './App.css';
import { ChatMessage, Chatbot } from './Chatbot';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface AppProps {
  chatbot: Chatbot
}

function App({chatbot}: AppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  return (
    <div className='App'>
      <Title/>
      <Messages 
        messages={messages}
      />
      <div className='FieldContainer'>
        <Field
          onSubmit={(t) => 
            chatbot.respond(t, (hist) => {
              setMessages(hist);
            })
          }
        />
      </div>
      <div className='Spacer'/>
    </div>
  );
}

function Title() {
  return (
    <div className='TitleContainer'>
      <div className='Title'>
        Clem 😊
      </div>
      <div className='Subtitle'>
        Climate Chatbot
      </div>
    </div>
  );
}

interface MessagesProps {
  messages: ChatMessage[]
}

class Messages extends React.Component<MessagesProps, {}> {
  private ref = React.createRef<HTMLDivElement>();

  componentDidUpdate() {
    this.ref.current?.scrollIntoView();
  }

  render() {
    return (
      <div className='Messages'>
        {this.props.messages.map((m) => <Message key={m.text} text={m.text} fromUser={m.fromUser} />)}
        <div ref={this.ref}/>
      </div>
    );
  }
}

function Message({text, fromUser}: ChatMessage) {
  return (
    <div className={`Message ${fromUser ? 'UserMessage' : 'RespondentMessage'}`}>
      {
        text !== undefined
          ? text 
          : <LoadingMessage/>
      }
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className='LoadingMessage'>
      <ReactLoading type={'bubbles'} color={'black'} height={'25px'} width={'25px'} />
    </div>
  );
}

interface FieldProps {
  onSubmit: (text: string) => void
}

function Field({onSubmit}: FieldProps) {
  const ref = React.createRef<HTMLInputElement>();
  return (
    <div className='FieldForm'>
      <input type="text" ref={ref} className='TextField'/>
      <div 
        className='SendButton' 
        onClick={() => {
          onSubmit(ref.current!.value);
          ref.current!.value = '';
        }}>
        <FontAwesomeIcon icon={faArrowRight} />
      </div>
    </div>
  );
}

export default App;
