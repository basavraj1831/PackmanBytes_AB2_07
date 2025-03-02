import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaUser, FaQuestion } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CHATBOT_INITIAL_MESSAGE = "Hello! 👋 I'm your Blood Donation Assistant. I can help you with information about blood groups, donation eligibility, and more. What would you like to know?";

const QUICK_REPLIES = [
    "What are the blood types?",
    "Am I eligible to donate?",
    "How to prepare for donation?",
    "What are the benefits?",
    "Common myths about donation",
    "Emergency donation guidelines"
];

// Typing Effect Component
const TypingEffect = ({ content, isComplete, onComplete }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    
    // Typing effect
    useEffect(() => {
        if (!isComplete && content) {
            const timer = setTimeout(() => {
                if (currentIndex < content.length) {
                    // Increase speed by adding more characters at once
                    const charsToAdd = 3; // Add 3 characters at a time
                    const nextIndex = Math.min(currentIndex + charsToAdd, content.length);
                    setDisplayedContent(content.slice(0, nextIndex));
                    setCurrentIndex(nextIndex);
                } else {
                    onComplete();
                }
            }, 15); // Reduced from 30ms to 15ms for faster typing
            
            return () => clearTimeout(timer);
        }
    }, [currentIndex, content, isComplete, onComplete]);

    // Blinking cursor effect
    useEffect(() => {
        if (!isComplete) {
            const cursorTimer = setInterval(() => {
                setShowCursor(prev => !prev);
            }, 400);
            return () => clearInterval(cursorTimer);
        }
    }, [isComplete]);

    // Handle HTML content
    if (content.includes('<')) {
        return (
            <div className="message-content">
                <div 
                    dangerouslySetInnerHTML={{ 
                        __html: isComplete ? content : displayedContent 
                    }}
                    style={{ display: 'inline' }}
                />
                {!isComplete && showCursor && <span className="typing-cursor">|</span>}
            </div>
        );
    }

    return (
        <span>
            {isComplete ? content : displayedContent}
            {!isComplete && showCursor && <span className="typing-cursor">|</span>}
        </span>
    );
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', content: CHATBOT_INITIAL_MESSAGE, isComplete: true }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessageComplete = (index) => {
        setMessages(prev => prev.map((msg, i) => 
            i === index ? { ...msg, isComplete: true } : msg
        ));
    };

    const handleQuickReply = (reply) => {
        handleSendMessage(null, reply);
    };

    const handleSendMessage = async (e, quickReply = null) => {
        if (e) e.preventDefault();
        const messageToSend = quickReply || inputMessage;
        if (!messageToSend.trim()) return;

        setError(null);
        const userMessage = { type: 'user', content: messageToSend, isComplete: true };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageToSend }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = 'An error occurred while processing your request.';
                if (data.error === 'Authentication error with AI service') {
                    errorMessage = 'The chatbot service is currently unavailable. Please try again later.';
                } else if (data.error === 'Content safety error') {
                    errorMessage = 'Your message was flagged by our safety filters. Please rephrase your question.';
                } else if (data.details) {
                    errorMessage = data.details;
                }
                throw new Error(errorMessage);
            }
            
            if (!data.response) {
                throw new Error('No response received from the chatbot.');
            }
            
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: data.response,
                isComplete: false
            }]);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: 'I apologize, but I encountered an error. Please try asking your question again.',
                isComplete: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Test connection on mount
    useEffect(() => {
        const testConnection = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/chat');
                if (!response.ok) {
                    throw new Error('Failed to connect to chatbot service');
                }
                const data = await response.json();
                console.log('Chatbot service status:', data.message);
            } catch (error) {
                console.error('Chatbot service error:', error);
                setError('Unable to connect to chatbot service. Please try again later.');
            }
        };

        testConnection();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: isOpen ? 0 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <FaRobot className="text-2xl" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="absolute bottom-0 right-0 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <FaRobot className="text-xl" />
                                </motion.div>
                                <h3 className="font-semibold">Blood Donation Assistant</h3>
                            </div>
                            <motion.button 
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-red-200 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes />
                            </motion.button>
                        </motion.div>

                        {/* Quick Replies */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-3 border-b border-gray-100 bg-gray-50"
                        >
                            <div className="flex flex-wrap gap-2">
                                {QUICK_REPLIES.map((reply, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleQuickReply(reply)}
                                        className="text-xs bg-white text-red-600 px-3 py-1.5 rounded-full border border-red-200 hover:bg-red-50 transition-colors shadow-sm hover:shadow-md"
                                        disabled={isLoading}
                                    >
                                        {reply}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Messages */}
                        <motion.div 
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                message.type === 'user' ? 'bg-red-100' : 'bg-gray-100'
                                            }`}
                                        >
                                            {message.type === 'user' ? (
                                                <FaUser className="text-red-600" />
                                            ) : (
                                                <FaRobot className="text-gray-600" />
                                            )}
                                        </motion.div>
                                        <motion.div 
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className={`rounded-lg p-3 ${
                                                message.type === 'user' 
                                                    ? 'bg-red-600 text-white' 
                                                    : 'bg-gray-100 text-gray-800'
                                            } message-container`}
                                        >
                                            <TypingEffect 
                                                content={message.content}
                                                isComplete={message.isComplete}
                                                onComplete={() => handleMessageComplete(index)}
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-100 rounded-lg p-3 flex gap-2">
                                        <motion.div
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity }}
                                            className="w-2 h-2 bg-gray-400 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                            className="w-2 h-2 bg-gray-400 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                            className="w-2 h-2 bg-gray-400 rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            )}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </motion.div>

                        {/* Input Form */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            onSubmit={handleSendMessage}
                            className="p-4 border-t"
                        >
                            <div className="flex gap-2">
                                <motion.input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-red-600"
                                    disabled={isLoading}
                                    whileFocus={{ scale: 1.01 }}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaPaperPlane />
                                </motion.button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add styles for message formatting */}
            <style jsx>{`
                .message-container {
                    line-height: 1.5;
                }
                .message-content {
                    white-space: pre-wrap;
                }
                .message-content strong {
                    color: #DC2626;
                    font-weight: 600;
                }
                .message-content br {
                    margin-bottom: 0.5rem;
                }
                .message-container.bg-red-600 .message-content strong {
                    color: white;
                }
                .typing-cursor {
                    display: inline-block;
                    margin-left: 1px;
                    font-weight: normal;
                    animation: blink 1s step-end infinite;
                }
                @keyframes blink {
                    from, to { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Chatbot; 