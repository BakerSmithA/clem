import React from 'react';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Messages/>
      <div className='FieldContainer'>
        <Field/>
      </div>
      <div className='Spacer'/>
    </div>
  );
}

function Messages() {
  return (
    <div className='Messages'>
    </div>
  );
}

function Field() {
  return (
    <div className='FieldForm'>
      <input type="text" className='TextField'/>
      <div className='SendButton'/>
    </div>
  );
}

export default App;
