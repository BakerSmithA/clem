import React from 'react';
import './App.css';
import { ChatMessage, Chatbot } from './Chatbot';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface AppProps {
  chatbot: Chatbot
}

interface AppState {
  messages: ChatMessage[]
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { messages: [] };
  }

  componentDidMount() {
    this.props.chatbot.initialMessage((hist) => {
      this.setState({messages: hist})
    });
  }

  render() {
    return (
      <div className='App'>
        <Title/>
        <Messages 
          messages={this.state.messages}
        />
        <div className='FieldContainer'>
          <Field
            onSubmit={(t) => 
              this.props.chatbot.respond(t, (hist) => {
                this.setState({messages: hist})
              })
            }
          />
        </div>
        <div className='Spacer'/>
      </div>
    );
  }
}

function Title() {
  return (
    <div className='TitleContainer'>
      <div className='Title'>
        Clem 🌍
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
    this.ref.current?.scrollIntoView({behavior: 'smooth'});
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
