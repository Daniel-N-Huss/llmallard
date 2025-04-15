'use client'

import { useState } from 'react';
import styles from './styles/index.module.css'; // Create this CSS module file

const LLMallard = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const newUserInput = userInput;
    setChatHistory(prevHistory => [...prevHistory, { type: 'user', content: newUserInput }]);
    setUserInput('');

    setTimeout(() => {
      // Generate a random duck response
      const duckResponses = [
        'Quack!',
        'Quack quack!',
        'Quack?  Are you sure?',
        'Quack! That\'s a fine question.',
        'Quack... I ponder.',
        'Quack.  My thoughts are murky.'
      ];
      const randomIndex = Math.floor(Math.random() * duckResponses.length);
      const randomResponse = duckResponses[randomIndex];

      setChatHistory(prevHistory => [...prevHistory, { type: 'bot', content: randomResponse }]);
      setIsLoading(false);
    }, 150000);
  };

  return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>LLMallard</h1>
          <p>The surprisingly helpful rubber duck.</p>
        </header>

        <main className={styles.main}>
          <div className={styles.chatContainer}>
            <div className={styles.conversation}>
              {chatHistory.map((message, index) => (
                  <div key={index} className={message.type === 'user' ? styles.message.userMessage : styles.message.botMessage}>
                    {message.content}
                  </div>
              ))}
            </div>
          </div>
        </main>

        <div className={styles.bottomBar}>
          <div className={styles.userBox}>
            <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Ask me a question..."
                  className={styles.inputField}
              />
              <button type="submit" className={styles.sendButton}>
                Send
              </button>
            </form>
          </div>
        </div>

        {isLoading && (
            <div className={`${styles.thinkingIconContainer} active`}>
              <div className={styles.spinner}>
                <div className="dot1"></div>
                <div className="dot2"></div>
                <div className="dot3"></div>
                <div className="dot4"></div>
                <div className="dot5"></div>
              </div>
            </div>
        )}
      </div>
  );
};

export default LLMallard;