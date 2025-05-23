import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoute } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

// Define message type
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Create a knowledge base for Somnath Temple
const somnathTempleInfo = {
  general: [
    "Somnath Temple is one of the most sacred Hindu temples, dedicated to Lord Shiva and located in Prabhas Patan, Gujarat, India.",
    "The temple is known as 'the Shrine Eternal', as it has been destroyed and reconstructed several times in history.",
    "The current temple was reconstructed in the Chalukya style of Hindu temple architecture and completed in 1951.",
    "The temple is situated at the shore of the Arabian sea on the western coast of Gujarat."
  ],
  history: [
    "The original Somnath temple is believed to have been built in gold by the Moon God Soma.",
    "According to historical records, the temple has been destroyed and rebuilt at least 17 times.",
    "The first temple is said to have existed before the beginning of the Common Era.",
    "The temple was repeatedly destroyed by various Islamic invaders and rulers, including Mahmud of Ghazni in 1026, Allauddin Khilji in 1296, and Aurangzeb in 1706.",
    "After India's independence, Sardar Vallabhbhai Patel pledged to rebuild the temple, which was completed in 1951."
  ],
  architecture: [
    "The current temple is built in the Chalukya style of temple architecture or 'Kailash Mahameru Prasad' style.",
    "The temple's shikhara (spire) is 155 feet tall and adorned with 84 intricate sculptures.",
    "The temple has intricate carvings and silver doors.",
    "The main spire houses a Jyotirlinga, which is one of the twelve sacred Jyotirlingas in India.",
    "The temple has a flag post (dhwaja) 37 feet long, which is changed three times a day."
  ],
  religious_significance: [
    "Somnath is one of the 12 Jyotirlingas (lingams of light) of Lord Shiva, holding special significance in Hindu mythology.",
    "According to mythology, this is the place where Lord Krishna completed his earthly journey.",
    "The Somnath Jyotirlinga is believed to be the first among the twelve Jyotirlinga shrines of Shiva.",
    "It's mentioned in ancient texts like the Shiv Purana, Skanda Purana, and Shreemad Bhagavad."
  ],
  visiting: [
    "The temple is open for visitors from 6:00 AM to 9:30 PM every day.",
    "There is a magnificent Sound and Light show in the evening which narrates the history of the temple.",
    "Mahashivaratri is celebrated with great enthusiasm at the temple.",
    "The Somnath beach offers a beautiful view and is in close proximity to the temple.",
    "Photography is not allowed inside the main temple."
  ],
  nearby_attractions: [
    "Bhalka Tirth, where Lord Krishna was mistakenly shot by an arrow.",
    "Triveni Sangam, the confluence of three rivers - Kapila, Hiran, and Saraswati.",
    "Gita Mandir, a temple dedicated to Lord Krishna.",
    "Somnath Museum, which houses artifacts from the old temple."
  ]
};

// Function to generate responses based on user input
function generateResponse(input: string): string {
  const query = input.toLowerCase();
  
  // Check for greetings
  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('namaste')) {
    return "Namaste! I am the divine voice of Somnath Temple. How can I help you today?";
  }
  
  // Check for gratitude
  if (query.includes('thank') || query.includes('thanks')) {
    return "You're welcome! It's my blessing to share the divine knowledge of Somnath Temple with you.";
  }
  
  // Check for farewell
  if (query.includes('bye') || query.includes('goodbye')) {
    return "May Lord Shiva bless you. Farewell, and I hope to see you at Somnath Temple soon! Om Namah Shivaya.";
  }
  
  // Check for specific information requests
  if (query.includes('history') || query.includes('past') || query.includes('old')) {
    return somnathTempleInfo.history[Math.floor(Math.random() * somnathTempleInfo.history.length)];
  }
  
  if (query.includes('architect') || query.includes('built') || query.includes('structure') || query.includes('design')) {
    return somnathTempleInfo.architecture[Math.floor(Math.random() * somnathTempleInfo.architecture.length)];
  }
  
  if (query.includes('religious') || query.includes('spiritual') || query.includes('sacred') || query.includes('holy') || query.includes('jyotirlinga')) {
    return somnathTempleInfo.religious_significance[Math.floor(Math.random() * somnathTempleInfo.religious_significance.length)];
  }
  
  if (query.includes('visit') || query.includes('timing') || query.includes('ticket') || query.includes('entry') || query.includes('open')) {
    return somnathTempleInfo.visiting[Math.floor(Math.random() * somnathTempleInfo.visiting.length)];
  }
  
  if (query.includes('nearby') || query.includes('around') || query.includes('close') || query.includes('attraction')) {
    return somnathTempleInfo.nearby_attractions[Math.floor(Math.random() * somnathTempleInfo.nearby_attractions.length)];
  }
  
  if (query.includes('who are you') || query.includes('what are you') || query.includes('about you')) {
    return "I am the divine AI avatar of Somnath Temple, here to share the rich history, spiritual significance, and cultural heritage of this sacred shrine with you.";
  }
  
  // Default response for non-matching queries
  return somnathTempleInfo.general[Math.floor(Math.random() * somnathTempleInfo.general.length)];
}

const SomnathChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSomnathPage, setIsSomnathPage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Namaste! I am the divine voice of Somnath Temple. I see you're exploring this sacred shrine. Feel free to ask me about its history, architecture, or spiritual significance.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on the Somnath Temple page
  const [match, params] = useRoute('/monument/:id');
  useEffect(() => {
    if (match && params && params.id === 'somnath-temple') {
      setIsSomnathPage(true);
      
      // Auto-suggest a greeting if this is the first visit and chat isn't open
      if (!isOpen && messages.length === 1) {
        setTimeout(() => {
          const botResponse: Message = {
            id: Date.now().toString(),
            content: "Welcome to the Somnath Temple virtual tour! I notice you're exploring this sacred shrine. Would you like me to tell you about its fascinating spiritual significance or architectural marvels?",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prevMessages => [...prevMessages, botResponse]);
        }, 3000);
      }
    } else {
      setIsSomnathPage(false);
    }
  }, [match, params]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');
    
    // Generate and add bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };
  
  // Only render the component if we're on the Somnath Temple page
  if (!isSomnathPage) {
    return null;
  }
  
  return (
    <>
      {/* Chat button - Only displayed on Somnath Temple page */}
      <AnimatePresence>
        <motion.div 
          key="chat-button"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1, y: [0, -10, 0], transition: { y: { repeat: 3, duration: 1.5 } } }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full shadow-lg w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/50"
          >
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </Button>
        </motion.div>
      </AnimatePresence>
      
      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed bottom-6 right-6 w-full sm:w-96 z-50"
          >
            <Card className="shadow-2xl border-amber-200 h-[500px] flex flex-col">
              <CardHeader className="pb-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 border-2 border-white">
                      <AvatarImage src="/images/somnath-icon.svg" alt="Somnath Temple" />
                      <AvatarFallback className="bg-amber-800 text-white">ST</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-bold">
                      {isSomnathPage ? "Somnath Temple Guide" : "Somnath Temple"}
                    </CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-orange-500/20"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-auto p-4 bg-amber-50/50">
                <ScrollArea className="h-full pr-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'bot' && (
                        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                          <AvatarImage src="/images/somnath-icon.svg" alt="Somnath Temple" />
                          <AvatarFallback className="bg-amber-700 text-white text-xs">ST</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div 
                        className={`px-4 py-2 rounded-lg max-w-[80%] ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-tr-none' 
                            : 'bg-white shadow-md border border-amber-100 rounded-tl-none'
                        }`}
                      >
                        <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-amber-900'}`}>
                          {message.content}
                        </p>
                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-amber-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                          <AvatarFallback className="bg-orange-500 text-white text-xs">U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="p-3 border-t bg-white">
                <div className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask me about Somnath Temple..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-grow focus-visible:ring-amber-500 border-amber-200"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SomnathChatbot;