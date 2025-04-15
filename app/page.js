'use client'

import { useState } from 'react';
import styles from './styles/index.module.css'; // Create this CSS module file

const LLMallard = () => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(''); // Clear the previous response

    // Simulate "thinking" time
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

      setResponse(randomResponse);
      setIsLoading(false);
    }, 1500); // 1.5 seconds "thinking" time
  };

  return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 >LLMallard</h1>
          <p>The surprisingly helpful rubber duck.</p>
        </header>

        <main className={styles.main}>
          <div className={styles.chatContainer}>
            <div className={styles.conversation}>
              {/* Display User Input */}
              {userInput && <div className={styles.message.userMessage}>{userInput}</div>}

              {/* Display Responses */}
              {response ? (
                  <div className={styles.message.botMessage}>{isLoading ? '...' : response}</div>
              ) : (
                  isLoading && <div className={styles.message.botMessage}>...</div>
              )}
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
      </div>
  );
};

export default LLMallard;