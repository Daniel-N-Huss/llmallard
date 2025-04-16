'use client'

import { useState, useRef, useEffect } from 'react';
import styles from './styles/index.module.css'; // Ensure this path is correct
import { Typewriter } from 'nextjs-simple-typewriter'; // Corrected import path

const LLMallard = () => {
  const [userInput, setUserInput] = useState('');
  // Start with an initial bot message if desired
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', content: 'Quack! Ask me anything.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [mostRecentBotMessage, setMostRecentBotMessage] = useState(null); // Keep track of the message being typed
  const scrollableContainerRef = useRef(null); // Renamed ref for clarity

  // Effect to scroll to bottom
  useEffect(() => {
    if (scrollableContainerRef.current) {
      // Added a slight delay to ensure content (like Typewriter) has rendered
      setTimeout(() => {
        scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
      }, 50); // Small delay might be needed, adjust if necessary
    }
    // Depend on both chatHistory and the completion of the bot message
  }, [chatHistory, mostRecentBotMessage]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return; // Prevent sending empty messages

    setIsLoading(true);
    const newUserMessage = { type: 'user', content: userInput };
    // Add user message immediately
    setChatHistory(prevHistory => [...prevHistory, newUserMessage]);
    setUserInput('');
    setMostRecentBotMessage(''); // Clear any previous bot message being typed

    // Simulate API call/bot thinking
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

      // Set the message content to be typed out
      setMostRecentBotMessage(randomResponse);
      setIsLoading(false);
    }, 2000); // Adjusted delay for demo
  };

  // Function to add the bot message to history *after* typing is done
  const handleBotMessageTyped = (messageContent) => {
    setChatHistory(prevHistory => [...prevHistory, { type: 'bot', content: messageContent }]);
    setMostRecentBotMessage(null); // Clear the message being typed state
  };

  // Determine message alignment class
  const pickChatStyle = (message) => {
    return message.type === 'user' ? styles.userMessage : styles.botMessage;
  };

  return (
      // Main container uses flex column layout
      <div className={styles.container}>
        {/* Header is fixed */}
        <header className={styles.header}>
          <h1>LLMallard</h1>
          <p>The surprisingly helpful rubber duck.</p>
        </header>

        {/* Main content area grows and scrolls */}
        <main className={styles.main} ref={scrollableContainerRef}>
          {/* Conversation container holds messages */}
          <div className={styles.conversation}>
            {chatHistory.map((message, index) => (
                <div key={index} className={`${styles.messageBubble} ${pickChatStyle(message)}`}>
                  {message.content}
                </div>
            ))}

            {/* Render the thinking icon */}
            {isLoading && (
                <div className={`${styles.messageBubble} ${styles.botMessage}`}>
                  <div className={styles.thinkingIconContainer}/>
                </div>
            )}

            {/* Render the Typewriter effect for the latest bot message */}
            {!isLoading && mostRecentBotMessage && (
                <div className={`${styles.messageBubble} ${styles.botMessage}`}>
                  <Typewriter
                      words={[mostRecentBotMessage]}
                      loop={1}
                      cursor={false}
                      typeSpeed={50}
                      delaySpeed={1000}
                      // When typing is done, add the message to history
                      onLoopDone={() => handleBotMessageTyped(mostRecentBotMessage)}
                      // Alternatively, if onLoopDone isn't suitable, use onTypingEnd or similar if available
                      // Or manage state differently (e.g., set a 'typingComplete' flag)
                  />
                </div>
            )}
          </div>
        </main>

        {/* Footer (input bar) is fixed */}
        <footer className={styles.bottomBar}>
          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Ask me a question..."
                className={styles.inputField}
                disabled={isLoading} // Disable input while loading
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