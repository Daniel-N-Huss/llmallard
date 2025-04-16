'use client'

import { useState, useRef, useEffect } from 'react';
import styles from './styles/index.module.css';
import { Typewriter } from 'nextjs-simple-typewriter';

// Configuration for Proportional Delay
const BASE_DELAY_MS = 500;
const DELAY_PER_CHAR_MS = 30;
const MAX_DELAY_MS = 15000;

const LLMallard = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', content: 'Quack! Ask me anything.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [mostRecentBotMessage, setMostRecentBotMessage] = useState(null);
  const scrollableContainerRef = useRef(null);
  const inputRef = useRef(null); // Ref now points to the textarea

  // --- Scroll Effect ---
  useEffect(() => {
    if (scrollableContainerRef.current) {
      // Scroll down when history changes OR when a new bot message appears
      // Adding a small delay can sometimes help ensure layout is stable before scrolling
      const timer = setTimeout(() => {
        if(scrollableContainerRef.current) { // Check ref again inside timeout
          scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
        }
      }, 50);
      return () => clearTimeout(timer); // Cleanup timer on unmount/re-run
    }
  }, [chatHistory, mostRecentBotMessage]); // Trigger scroll on these changes

  // --- Focus on Mount ---
  useEffect(() => {
    inputRef.current?.focus();
  }, [chatHistory, isLoading]);

  // --- Auto-Resize Logic (JS Fallback/Alternative for field-sizing) ---
  // This effect runs when userInput changes to adjust height manually
  // You might only need this if `field-sizing: content` isn't supported or sufficient
  // /*
  useEffect(() => {
    if (inputRef.current) {
      const el = inputRef.current;
      el.style.height = 'auto'; // Temporarily shrink to recalculate scrollHeight
      // Set height based on content scroll height, respecting CSS max-height
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [userInput]); // Re-run when input changes
  // */


  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    // Note: If NOT using field-sizing, JS height adjustment logic could go here
    // or stay in the dedicated useEffect above.
  };

  // --- Submit Handler ---
  const performSubmit = () => { // Extracted submit logic
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return; // Prevent submit if empty or loading

    setIsLoading(true);
    const newUserMessage = { type: 'user', content: trimmedInput };
    setChatHistory(prevHistory => [...prevHistory, newUserMessage]);
    setUserInput(''); // Clear input field
    setMostRecentBotMessage('');

    // Reset textarea height after submit if using JS method
    // This might be needed if you don't use field-sizing
    // /*
    if (inputRef.current) {
        inputRef.current.style.height = 'auto'; // Reset to minimum height
    }
    // */


    const calculatedDelay = BASE_DELAY_MS + trimmedInput.length * DELAY_PER_CHAR_MS;
    const dynamicDelay = Math.min(calculatedDelay, MAX_DELAY_MS);

    setTimeout(() => {
      // Ensure component hasn't unmounted if request is very long
      if (!inputRef.current) return;

      const duckResponses = [ 'Quack!', 'Quack quack!', 'Quack? Are you sure?', 'Quack! That\'s a fine question.', 'Quack... I ponder.', 'Quack. My thoughts are murky.' ];
      const randomIndex = Math.floor(Math.random() * duckResponses.length);
      const randomResponse = duckResponses[randomIndex];

      setMostRecentBotMessage(randomResponse);
      setIsLoading(false);
      inputRef.current?.focus();

    }, dynamicDelay);
  }

  // --- Enter Key Handler ---
  const handleKeyDown = (event) => {
    // Check if Enter is pressed WITHOUT the Shift key
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (newline)
      performSubmit(); // Call the extracted submit logic
    }
    // Pressing Enter + Shift will allow default behavior (new line)
  };


  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    performSubmit();
  };

  // --- Bot Message Typed Handler ---
  const handleBotMessageTyped = (messageContent) => {
    setChatHistory(prevHistory => [...prevHistory, { type: 'bot', content: messageContent }]);
    setMostRecentBotMessage(null);
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

        {/* Footer now adapts height */}
        <footer className={styles.bottomBar}>
          {/* Form element is still useful for semantics and Enter key submit fallback */}
          <form className={styles.inputForm} onSubmit={handleSubmit}>
          <textarea
              ref={inputRef} // Attach ref to textarea
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Add keydown listener
              placeholder="Ask me a question..."
              className={styles.inputField} // Use the same class name
              disabled={isLoading}
              rows={1} // Start with one row visually
              aria-label="Chat input" // Accessibility
          />
            <button
                type="submit" // Button type remains submit
                className={styles.sendButton}
                disabled={isLoading || !userInput.trim()} // Disable if loading or input empty
                aria-label="Send message" // Accessibility
            >
              Send
            </button>
          </form>
        </footer>
      </div>
  );
};

export default LLMallard;