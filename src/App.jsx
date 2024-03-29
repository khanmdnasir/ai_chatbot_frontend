// src/App.js
import { useState } from 'react'

let socket = new WebSocket(
  "ws://15.207.109.35:8000/ws/chat/"
)

const App = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (inputMessage.trim() === '') return;
    // Send the message to the Django backend through WebSocket
    const message = {
      role: "user",
      content: inputMessage,
      stream: false
    };
    setMessages((prevMessages) => [...prevMessages, message]);
    setInputMessage('');
    socket.send(JSON.stringify({ "message": inputMessage}))
    
  };

  
  socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.stream === 'start') {
    setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: '', stream: true }]);
  } else if (message.stream && message.message !== null) {
    setMessages((prevMessages) => prevMessages.map(msg => {
      if (msg.stream) {
        return { ...msg, content: msg.content + message.message };
      }
      return msg;
    }));
  } else {
    setMessages((prevMessages) => prevMessages.map(msg => {
      if (msg.stream) {
        return { ...msg, stream: false };
      }
      return msg;
    }));
  }
  
  
};
  
  
  
  socket.onopen = () => {
    setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "how can i help you?", stream: false }]);
  };
  return (
    <div className="main-div">
     <div className="container">
       <div className="mesgs">
          <div className="msg_history">
            {messages.map((msg, index) => (
                msg.role == 'assistant' ? 
                  (<div className="incoming_msg" key={index}>
                    <div className="incoming_msg_img"> <img src="https://www.cio.com/wp-content/uploads/2023/08/chatbot_ai_machine-learning_emerging-tech-100778305-orig.jpg?quality=50&strip=all" alt="TechBot" /> </div>
                    <div className="received_msg">
                      <div className="received_withd_msg">
                      <p>{msg.content}</p>
                      <span className="time_date">{new Date().toLocaleString()}</span></div>
                    </div>
                  </div>)
                :
                  (<div className="outgoing_msg" key={index}>
                  <div className="sent_msg">
                    <p>{msg.content}</p>
                    <span className="time_date">{new Date().toLocaleTimeString()}</span> </div>
                </div>)
              
            
            ))}
              
              
              
            </div>
            <div className="type_msg">
            <div className="input_msg_write">
              <form onSubmit={(e)=>handleSendMessage(e)}>
                <input type="text" className="write_msg" placeholder="Type a message" onChange={handleInputChange} value={inputMessage}/>
                <button className="msg_send_btn" type="submit"><i className="fa fa-paper-plane-o" aria-hidden="true" /></button>
              </form>
              </div>
            </div>
          </div>
        
      </div>
      
    </div>
    
  );
}

export default App;
