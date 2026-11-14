export interface ConversationItem {
  patterns: (string | RegExp)[];
  response: string;
  followUps?: string[];
}

export const CONVERSATION_DATASET: ConversationItem[] = [
  // ════════════════════════════════════════════════════════════════════
  // 1. GREETINGS AND BASIC CONVERSATION
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ['hi', 'hi there'],
    response: "Hello! Welcome to Rahul's portfolio. How can I help you?",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['hello'],
    response: "Hey! Welcome to my portfolio. What would you like to know?",
    followUps: ['Tell me about Rahul', 'Where does Rahul work?', 'Can I hire Rahul?'],
  },
  {
    patterns: ['hey', 'hey there', 'howdy', 'yo', 'sup'],
    response: "Hey there! Feel free to explore Rahul's portfolio.",
    followUps: ['⚡ Why Hire Rahul?', 'What are his top skills?', 'Show featured projects'],
  },
  {
    patterns: ['how are you', 'how are you doing', 'how is it going', 'how r u'],
    response: "I'm doing great! Thanks for asking. How can I assist you?",
    followUps: ['What does Rahul do?', 'Show me Rahul\'s projects', 'How can I contact Rahul?'],
  },
  {
    patterns: ['good morning'],
    response: "Good morning! Welcome to Rahul's portfolio.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'Can I download Rahul\'s resume?'],
  },
  {
    patterns: ['good afternoon'],
    response: "Good afternoon! How can I help you today?",
    followUps: ['What are Rahul\'s technical skills?', 'Where does Rahul work?', 'Contact Rahul'],
  },
  {
    patterns: ['good evening'],
    response: "Good evening! How can I assist you today?",
    followUps: ['⚡ Why Hire Rahul?', 'Where does Rahul work?', 'Download resume'],
  },
  {
    patterns: ["what's up", 'whats up', 'what is up', 'wassup'],
    response: "Not much! I'm here and ready to chat with you.",
    followUps: ['Show featured projects', 'Why hire Rahul?', 'Contact details'],
  },
  {
    patterns: ['nice to meet you', 'pleased to meet you'],
    response: "Nice to meet you too!",
    followUps: ['Tell me about Rahul', 'What are his top skills?', 'View projects'],
  },
  {
    patterns: ['how is your day', 'how was your day'],
    response: "My day is going well! How about yours?",
    followUps: ['Work experience', 'Show projects', 'Download resume'],
  },
  {
    patterns: ['what is your name', 'whats your name', 'your name'],
    response: "I'm Rahul's AI portfolio assistant.",
    followUps: ['What can you do?', 'Tell me about Rahul', 'Can I hire Rahul?'],
  },
  {
    patterns: ['who are you'],
    response: "I'm an AI assistant here to answer questions about Rahul.",
    followUps: ['What can you do?', 'Who is Rahul?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['what can you do', 'how can you help', 'what do you do', 'features'],
    response: "I can tell you about Rahul's skills, education, experience, projects, and more.",
    followUps: ['What are Rahul\'s technical skills?', 'Where does Rahul work?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['thank you', 'thanks', 'thanks a lot', 'thank u', 'thx', 'tysm'],
    response: "You're welcome! Feel free to ask me anything else.",
    followUps: ['Can I download Rahul\'s resume?', 'How can I contact Rahul?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['bye', 'goodbye', 'see you', 'see ya', 'see you later', 'cya'],
    response: "Goodbye! Thanks for visiting Rahul's portfolio.",
    followUps: ['How can I contact Rahul?', 'Can I download Rahul\'s resume?'],
  },

  // ════════════════════════════════════════════════════════════════════
  // 2. PERSONAL INFORMATION
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ['who is rahul', 'who is aleshwaram rahul'],
    response: "Rahul is a software developer interested in building modern web applications and software solutions.",
    followUps: ['What does Rahul do?', 'Where does Rahul work?', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['tell me about rahul', 'about rahul', 'rahul background'],
    response: "Rahul is an Associate Software Developer with experience in web development and full-stack technologies.",
    followUps: ['Where does Rahul work?', 'What projects has Rahul worked on?', 'Can I hire Rahul?'],
  },
  {
    patterns: ['where is rahul from', 'rahul location', 'where does rahul live', 'rahul city'],
    response: "Rahul is based in Hyderabad, Telangana, India.",
    followUps: ['Where does Rahul work?', 'How can I contact Rahul?', 'Is Rahul available for opportunities?'],
  },
  {
    patterns: ['what does rahul do', 'rahul role', 'rahul occupation', 'rahul job'],
    response: "Rahul works as an Associate Software Developer.",
    followUps: ['Where does Rahul work?', 'What are Rahul\'s technical skills?', 'What projects has Rahul worked on?'],
  },
  {
    patterns: ["what are rahul's interests", 'what are rahuls interests', 'rahul interests', 'rahul hobbies'],
    response: "Rahul is interested in software development, web technologies, UI design, and learning new technologies.",
    followUps: ['What are Rahul\'s technical skills?', 'Show me Rahul\'s projects', 'Is Rahul a developer?'],
  },
  {
    patterns: ['is rahul a developer', 'is rahul a software engineer', 'is rahul developer'],
    response: "Yes! Rahul works as an Associate Software Developer.",
    followUps: ['Where does Rahul work?', 'What are Rahul\'s technical skills?', 'Can I hire Rahul?'],
  },

  // ════════════════════════════════════════════════════════════════════
  // 3. EDUCATION
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ["what is rahul's qualification", 'what is rahuls qualification', 'rahul qualification', 'rahul education', 'qualification'],
    response: "Rahul completed a B.Tech in Electrical Engineering.",
    followUps: ['Where did Rahul study?', 'What is Rahul\'s degree?', 'Does Rahul have a diploma?'],
  },
  {
    patterns: ['where did rahul study', 'rahul college', 'rahul university'],
    response: "Rahul studied at St. Peter's Engineering College.",
    followUps: ['What is Rahul\'s degree?', 'Does Rahul have a diploma?', 'What is Rahul\'s qualification?'],
  },
  {
    patterns: ["what is rahul's degree", 'what is rahuls degree', 'rahul degree'],
    response: "Rahul holds a Bachelor of Technology (B.Tech) degree.",
    followUps: ['Where did Rahul study?', 'Does Rahul have a diploma?', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['does rahul have a diploma', 'rahul diploma', 'polytechnic diploma'],
    response: "Yes, Rahul completed a Polytechnic Diploma in Electrical and Electronics Engineering.",
    followUps: ['What did Rahul study in diploma?', 'Where did Rahul study?', 'What is Rahul\'s qualification?'],
  },
  {
    patterns: ['what did rahul study in diploma', 'diploma college', 'diploma branch'],
    response: "Electrical and Electronics Engineering at TKR College of Engineering and Technology.",
    followUps: ['Where did Rahul study?', 'What is Rahul\'s qualification?', 'What are Rahul\'s technical skills?'],
  },

  // ════════════════════════════════════════════════════════════════════
  // 4. TECHNICAL SKILLS
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ["what are rahul's technical skills", 'what are rahuls technical skills', 'rahul technical skills', 'rahul skills', 'skills'],
    response: "Rahul works with Java, Spring Boot, React, JavaScript, PostgreSQL, Supabase, and modern frontend technologies.",
    followUps: ['Does Rahul know Java?', 'Does Rahul know React?', 'Which databases does Rahul use?'],
  },
  {
    patterns: ['does rahul know java', 'rahul java', 'java experience'],
    response: "Yes! Rahul has experience working with Java and Spring Boot.",
    followUps: ['Does Rahul know backend development?', 'Does Rahul know React?', 'What projects has Rahul worked on?'],
  },
  {
    patterns: ['does rahul know react', 'rahul react', 'react experience'],
    response: "Yes! Rahul works with React to build modern user interfaces.",
    followUps: ['Does Rahul know frontend development?', 'Does Rahul know Java?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['does rahul know frontend development', 'frontend skills', 'frontend development'],
    response: "Yes! Rahul works with React, JavaScript, Tailwind CSS, HTML, and CSS.",
    followUps: ['Does Rahul know backend development?', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['does rahul know backend development', 'backend skills', 'backend development'],
    response: "Yes! Rahul works with Java, Spring Boot, and REST APIs.",
    followUps: ['Does Rahul know frontend development?', 'Which databases does Rahul use?', 'Does Rahul know Java?'],
  },
  {
    patterns: ['which databases does rahul use', 'databases', 'database experience'],
    response: "Rahul has worked with PostgreSQL and Supabase.",
    followUps: ['Does Rahul know backend development?', 'What are Rahul\'s technical skills?', 'What projects has Rahul worked on?'],
  },
  {
    patterns: ['does rahul know github', 'does rahul know git', 'git and github', 'github'],
    response: "Yes! Rahul uses Git and GitHub for version control and project management.",
    followUps: ['Show me Rahul\'s projects', 'What are Rahul\'s technical skills?', 'Where does Rahul work?'],
  },

  // ════════════════════════════════════════════════════════════════════
  // 5. WORK EXPERIENCE
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ['where does rahul work', 'rahul company', 'current company', 'where is rahul working'],
    response: "Rahul works at ASR Digi Solutions Pvt. Ltd.",
    followUps: ['What is Rahul\'s designation?', 'Is Rahul currently working?', 'What projects has Rahul worked on?'],
  },
  {
    patterns: ["what is rahul's designation", 'what is rahuls designation', 'rahul designation', 'rahul title'],
    response: "Rahul works as an Associate Software Developer.",
    followUps: ['Where does Rahul work?', 'What projects has Rahul worked on?', 'Can I hire Rahul?'],
  },
  {
    patterns: ['is rahul currently working', 'is rahul employed'],
    response: "Yes! Rahul is currently working at ASR Digi Solutions.",
    followUps: ['What is Rahul\'s designation?', 'Where does Rahul work?', 'Is Rahul available for opportunities?'],
  },
  {
    patterns: ['what projects has rahul worked on', 'work projects', 'experience projects'],
    response: "Rahul has worked on web development projects, including ERP and business management applications.",
    followUps: ['What is Purna ERP?', 'Show me Rahul\'s projects', 'What technologies does Rahul use in projects?'],
  },
  {
    patterns: ['does rahul have professional experience', 'professional experience', 'years of experience'],
    response: "Yes! Rahul has professional experience as an Associate Software Developer.",
    followUps: ['Where does Rahul work?', 'What is Rahul\'s designation?', 'What projects has Rahul worked on?'],
  },

  // ════════════════════════════════════════════════════════════════════
  // 6. PROJECTS
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ["show me rahul's projects", 'show me rahuls projects', 'rahul projects', 'projects'],
    response: "Rahul has worked on projects involving ERP systems, web applications, and business solutions.",
    followUps: ['What is Purna ERP?', 'Can I see Rahul\'s portfolio projects?', 'What technologies does Rahul use in projects?'],
  },
  {
    patterns: ['what is purna erp', 'purna erp', 'purna'],
    response: "Purna ERP is an enterprise management application designed for construction and infrastructure project management.",
    followUps: ['What technologies does Rahul use in projects?', 'Show me Rahul\'s projects', 'Where does Rahul work?'],
  },
  {
    patterns: ['what technologies does rahul use in projects', 'project technologies', 'project stack'],
    response: "Rahul uses technologies such as React, Spring Boot, PostgreSQL, Supabase, and Tailwind CSS.",
    followUps: ['What is Purna ERP?', 'Show me Rahul\'s projects', 'Does Rahul know Java?'],
  },
  {
    patterns: ['has rahul developed websites', 'developed websites', 'web applications built'],
    response: "Yes! Rahul has worked on modern websites and web applications.",
    followUps: ['Show me Rahul\'s projects', 'Can I see Rahul\'s portfolio projects?', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ["can i see rahul's portfolio projects", 'can i see rahuls portfolio projects', 'see portfolio projects'],
    response: "Absolutely! You can explore the Projects section of this portfolio.",
    followUps: ['What is Purna ERP?', 'What technologies does Rahul use in projects?', 'What are Rahul\'s technical skills?'],
  },

  // ════════════════════════════════════════════════════════════════════
  // 7. CONTACT AND HIRING
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ['how can i contact rahul', 'contact rahul', 'contact info', 'how to reach rahul'],
    response: "You can contact Rahul using the contact form available on this portfolio.",
    followUps: ['Can I hire Rahul?', 'How can I connect with Rahul on LinkedIn?', 'Can I download Rahul\'s resume?'],
  },
  {
    patterns: ['is rahul available for opportunities', 'available for opportunities', 'open to work', 'is rahul looking for a job'],
    response: "Please contact Rahul directly to discuss current opportunities.",
    followUps: ['Can I hire Rahul?', 'How can I contact Rahul?', 'Can I download Rahul\'s resume?'],
  },
  {
    patterns: ['can i hire rahul', 'hire rahul', 'hiring rahul'],
    response: "Yes! You can reach out through the contact section to discuss potential opportunities.",
    followUps: ['How can I contact Rahul?', 'Is Rahul available for opportunities?', 'Can I download Rahul\'s resume?'],
  },
  {
    patterns: ["can i download rahul's resume", 'can i download rahuls resume', 'download resume', 'resume download'],
    response: "Yes! If the resume download option is available on this portfolio, you can download it from the Resume section.",
    followUps: ['How can I contact Rahul?', 'Can I hire Rahul?', 'Where does Rahul work?'],
  },
  {
    patterns: ['how can i connect with rahul on linkedin', 'connect with rahul on linkedin', 'rahul linkedin', 'linkedin'],
    response: "You can connect with Rahul through his LinkedIn profile.",
    followUps: ['How can I contact Rahul?', 'Can I hire Rahul?', 'Can I download Rahul\'s resume?'],
  },

  // ════════════════════════════════════════════════════════════════════
  // 8. UNKNOWN QUESTIONS AND GENERAL CONVERSATION
  // ════════════════════════════════════════════════════════════════════
  {
    patterns: ["tell me something you don't know", 'tell me something you dont know', 'what dont you know'],
    response: "I may not have information about everything, but I'll do my best to help!",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['i have another question', 'another question', 'one more question'],
    response: "Sure! Ask me anything about Rahul.",
    followUps: ['What are Rahul\'s technical skills?', 'Where does Rahul work?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ["that's incorrect", 'thats incorrect', 'you are wrong', 'ur wrong'],
    response: "Thanks for letting me know. I'll try to provide a more accurate answer.",
    followUps: ['Tell me about Rahul', 'Where does Rahul work?', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['can you explain more', 'explain more', 'tell me more'],
    response: "Of course! Which topic would you like me to explain?",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['do you know everything about rahul', 'do you know everything'],
    response: "I know the information available in Rahul's portfolio, but I may not know every personal detail.",
    followUps: ['Tell me about Rahul', 'Where does Rahul work?', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['who created you', 'who made you', 'who built you'],
    response: "I was created by Rahul to help visitors explore his portfolio and career background.",
    followUps: ['Tell me about Rahul', 'What are his top skills?', 'Show projects'],
  },
  {
    patterns: ['are you human', 'are you a real person', 'are you a bot'],
    response: "No, I'm an AI chatbot.",
    followUps: ['What can you do?', 'Tell me about Rahul', 'Contact Rahul'],
  },
  {
    patterns: ['how old are you', 'your age'],
    response: "I don't have an age like a human. I'm an AI assistant.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['where are you from'],
    response: "I'm an AI, so I don't have a physical location.",
    followUps: ['Where is Rahul from?', 'Tell me about Rahul', 'Contact Rahul'],
  },
  {
    patterns: ['do you have feelings'],
    response: "I don't experience feelings like humans, but I can understand emotional language.",
    followUps: ['What can you do?', 'Tell me about Rahul', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['can you talk to me'],
    response: "Of course! I'm always ready to chat.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'Can I hire Rahul?'],
  },
  {
    patterns: ['are you intelligent'],
    response: "I can understand questions and help with many different tasks.",
    followUps: ['What can you do?', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['what are you doing'],
    response: "I'm here and ready to help you.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['are you busy'],
    response: "Not at all! What would you like to talk about?",
    followUps: ['Tell me about Rahul', 'Where does Rahul work?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ["i'm bored", 'im bored', 'bored'],
    response: "Let's find something interesting to do! Would you like a joke, a quiz, or a fun fact?",
    followUps: ['Tell me a joke', 'Tell me a fun fact', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['tell me something interesting'],
    response: "Did you know that octopuses have three hearts?",
    followUps: ['Tell me a joke', 'Tell me a fun fact', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['tell me a joke', 'say a joke', 'make me laugh', 'joke'],
    response: "Why did the computer go to the doctor? Because it had a virus!",
    followUps: ['Tell me a fun fact', 'Tell me about Rahul', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['can we be friends'],
    response: "Of course! I'm happy to chat and keep you company.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'How can I contact Rahul?'],
  },
  {
    patterns: ['do you like music'],
    response: "I don't listen to music like humans, but I can discuss music with you.",
    followUps: ['What are Rahul\'s interests?', 'Tell me a joke', 'Tell me about Rahul'],
  },
  {
    patterns: ['what is your favourite colour', 'what is your favorite color', 'favourite color', 'favorite color'],
    response: "I don't have personal favourites, but blue is a popular choice!",
    followUps: ['Tell me a fun fact', 'Tell me about Rahul', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['tell me a fun fact', 'fun fact'],
    response: "Honey never spoils when stored properly.",
    followUps: ['Tell me a joke', 'Tell me about Rahul', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['thanks for your help', 'thanks a lot'],
    response: "Happy to help!",
    followUps: ['Can I download Rahul\'s resume?', 'How can I contact Rahul?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['sorry', 'my mistake', 'my bad'],
    response: "No worries! It's completely okay.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['excuse me'],
    response: "Yes? How can I help you?",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'Where does Rahul work?'],
  },
  {
    patterns: ['you are helpful', 'great job'],
    response: "Thank you! I'm glad I could help.",
    followUps: ['Can I hire Rahul?', 'Can I download Rahul\'s resume?', 'How can I contact Rahul?'],
  },
  {
    patterns: ['what is ai'],
    response: "AI stands for Artificial Intelligence. It enables machines to perform tasks that typically require human intelligence.",
    followUps: ['What is programming?', 'What are Rahul\'s technical skills?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['what is the internet'],
    response: "The internet is a global network that connects computers and devices to share information.",
    followUps: ['What is programming?', 'What are Rahul\'s technical skills?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['what is a computer'],
    response: "A computer is an electronic device that processes data and performs tasks.",
    followUps: ['What is programming?', 'What are Rahul\'s technical skills?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['what is programming'],
    response: "Programming is the process of writing instructions that tell computers what to do.",
    followUps: ['What are Rahul\'s technical skills?', 'Does Rahul know Java?', 'Does Rahul know React?'],
  },
  {
    patterns: ['can you help me learn english'],
    response: "Absolutely! I can help you practise English, grammar, vocabulary, and conversation.",
    followUps: ['Tell me about Rahul', 'What can you do?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['can you solve problems'],
    response: "Yes! Share your problem, and I'll try to help you solve it.",
    followUps: ['What are Rahul\'s technical skills?', 'Does Rahul know Java?', 'Show me Rahul\'s projects'],
  },
  {
    patterns: ['can you translate languages'],
    response: "Yes! Tell me the text and the language you want to translate it into.",
    followUps: ['What can you do?', 'Tell me about Rahul', 'How can I contact Rahul?'],
  },
  {
    patterns: ['talk to you soon'],
    response: "Sure! Looking forward to chatting again.",
    followUps: ['How can I contact Rahul?', 'Can I download Rahul\'s resume?'],
  },
  {
    patterns: ['good night'],
    response: "Good night! Sleep well and take care.",
    followUps: ['How can I contact Rahul?', 'Can I download Rahul\'s resume?'],
  },
  {
    patterns: ["i don't understand", 'dont understand'],
    response: "No problem! Let me explain it in a simpler way.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['can you repeat that'],
    response: "Of course! I'll repeat that for you.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ["that's not what i asked", 'thats not what i asked'],
    response: "Sorry about that. Could you clarify what you're looking for?",
    followUps: ['Tell me about Rahul', 'What are Rahul\'s technical skills?', 'Where does Rahul work?'],
  },
  {
    patterns: ["i don't know", 'dont know'],
    response: "That's okay! We can figure it out together.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['can you help me'],
    response: "Of course! Tell me what you need help with.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'Can I hire Rahul?'],
  },
  {
    patterns: ['what?'],
    response: "Could you tell me which part you'd like me to explain?",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'What are Rahul\'s technical skills?'],
  },
  {
    patterns: ['i have a question'],
    response: "Sure! Go ahead and ask me.",
    followUps: ['Tell me about Rahul', 'What are Rahul\'s technical skills?', 'Where does Rahul work?'],
  },
  {
    patterns: ['answer me'],
    response: "I'm here to help. Please share your question.",
    followUps: ['Tell me about Rahul', 'Show me Rahul\'s projects', 'Can I hire Rahul?'],
  },
];
