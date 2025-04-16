'use client'

import { useState, useRef, useEffect } from 'react';
import styles from './styles/index.module.css';
import { Typewriter } from 'nextjs-simple-typewriter';

// --- Configuration for Proportional Delay ---
const BASE_DELAY_MS = 500;       // Minimum thinking time
const DELAY_PER_CHAR_MS = 30;   // Extra ms per character of user input
const MAX_DELAY_MS = 15000;      // Maximum thinking time

const LLMallard = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', content: 'Quack! Ask me anything.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [mostRecentBotMessage, setMostRecentBotMessage] = useState(null);
  const scrollableContainerRef = useRef(null);
  const inputRef = useRef(null); // <-- Add ref for the input field

  // Effect to scroll to bottom
  useEffect(() => {
    if (scrollableContainerRef.current) {
      setTimeout(() => {
        scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
      }, 50);
    }
  }, [chatHistory, mostRecentBotMessage]);

  // --- Automatically focus input when component mounts (optional) ---
  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedInput = userInput.trim(); // Use trimmed input for logic
    if (!trimmedInput) return;

    setIsLoading(true);
    const newUserMessage = { type: 'user', content: trimmedInput }; // Use trimmed input here too
    setChatHistory(prevHistory => [...prevHistory, newUserMessage]);
    setUserInput(''); // Clear input field visually
    setMostRecentBotMessage('');

    // --- Calculate dynamic delay ---
    const calculatedDelay = BASE_DELAY_MS + trimmedInput.length * DELAY_PER_CHAR_MS;
    const dynamicDelay = Math.min(calculatedDelay, MAX_DELAY_MS); // Ensure delay doesn't exceed max

    // --- Simulate API call/bot thinking with dynamic delay ---
    setTimeout(() => {
      const duckResponses = [
        'Quack!',
        'Quack quack!',
        'Quack? Are you sure?',
        'Quack! That\'s a fine question.',
        'Quack... I ponder.',
        'Quack. My thoughts are murky.'
      ];
      const randomIndex = Math.floor(Math.random() * duckResponses.length);
      const randomResponse = duckResponses[randomIndex];

      setMostRecentBotMessage(randomResponse);
      setIsLoading(false); // Stop loading

      // --- Focus the input field AFTER loading stops ---
      inputRef.current?.focus(); // Optional chaining just in case

    }, dynamicDelay); // <-- Use the calculated dynamic delay
  };

  const handleBotMessageTyped = (messageContent) => {
    setChatHistory(prevHistory => [...prevHistory, { type: 'bot', content: messageContent }]);
    setMostRecentBotMessage(null);
    // Optional: You could also re-focus the input *after* typing is done,
    // but focusing when loading finishes is usually preferred.
    // inputRef.current?.focus();
  };

  const pickChatStyle = (message) => {
    return message.type === 'user' ? styles.userMessage : styles.botMessage;
  };

  return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>LLMallard</h1>
          <p>The surprisingly helpful rubber duck.</p>
        </header>

        <main className={styles.main} ref={scrollableContainerRef}>
          <div className={styles.conversation}>
            {chatHistory.map((message, index) => (
                <div key={index} className={`${styles.messageBubble} ${pickChatStyle(message)}`}>
                  {message.content}
                </div>
            ))}

            {isLoading && (
                <div className={`${styles.messageBubble} ${styles.botMessage}`}>
                  <div className={styles.thinkingIconContainer}/>
                </div>
            )}

            {!isLoading && mostRecentBotMessage && (
                <div className={`${styles.messageBubble} ${styles.botMessage}`}>
                  <Typewriter
                      words={[mostRecentBotMessage]}
                      loop={1}
                      cursor={false}
                      typeSpeed={50}
                      delaySpeed={1000}
                      onLoopDone={() => handleBotMessageTyped(mostRecentBotMessage)}
                  />
                </div>
            )}
          </div>
        </main>

        <footer className={styles.bottomBar}>
          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <input
                ref={inputRef} // <-- Attach the ref here
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Ask me a question..."
                className={styles.inputField}
                disabled={isLoading}
            />
            <button type="submit" className={styles.sendButton} disabled={isLoading}>
              Send
            </button>
          </form>
        </footer>
      </div>
  );
};

export default LLMallard;