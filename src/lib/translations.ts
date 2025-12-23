export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Landing Page
    landing: {
      title: "Communitiful",
      subtitle: "For every companion who waits — you're not alone",
      feature1Title: "Anonymous and Private",
      feature1Desc: "No personal info required",
      feature2Title: "Connect with Others",
      feature2Desc: "Share experiences safely",
      feature3Title: "Calming Resources",
      feature3Desc: "Relaxation tools included",
      companionMode: "Companion Mode",
      hospitalMode: "Hospital Mode",
      getStarted: "Get Started",
      whatIsThis: "What is this?",
      privacyTerms: "Privacy & Terms",
      tagline: "Designed for calm, connection, and compassionate waiting.",
      visitWebsite: "Visit our website",
      visitWebsiteDesc: "Learn more about our mission and impact",
    },
    
    // Chat Page
    chat: {
      welcomeMessage: "Welcome to the waiting room chat!",
      welcomeSubtext: "Share your thoughts and connect with others.",
      placeholder: "Share with fellow companions...",
      disclaimer: "This chat is for emotional sharing and companionship, not medical advice. In emergencies, please contact hospital staff.",
      online: "online",
      typing: "is typing...",
      typingMultiple: "companions are typing...",
      checking: "Checking...",
      userJoined: "joined the chat",
      userLeft: "left the chat",
      companion: "companion",
      companions: "companions",
    },
    
    // Settings Page
    settings: {
      title: "Settings",
      accessibility: "Accessibility",
      largerText: "Larger Text",
      largerTextDesc: "Increase text size for better readability",
      reduceMotion: "Reduce Motion",
      reduceMotionDesc: "Minimize animations and transitions",
      language: "Language",
      information: "Information",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      aboutCompanions: "About Communitiful",
      leaveRoom: "Leave Room",
      leaveRoomDesc: "Leaving will end your current session. You'll need to verify your location and go through setup again to rejoin.",
      leaveChatRoom: "Leave Chat Room",
      version: "Communitiful v1.0.0",
      feedbackTitle: "How was your chat experience?",
      feedbackDesc: "Your feedback helps us make this space calmer and kinder.",
      feedbackPlaceholder: "Anything we could improve? (optional)",
      cancel: "Cancel",
      submitExit: "Submit & Exit",
      thankYou: "Thank you for your feedback!",
      redirecting: "Taking you back to the landing page…",
    },
    
    // Disclaimer Page
    disclaimer: {
      step: "Step 2",
      title: "Important Information",
      welcome: "Welcome, Friend",
      welcomeDesc: "We're glad you're here. This space is created for companions like you.\nShare your journey and connect with others in similar situations.",
      anonymousSafe: "Anonymous & Safe",
      anonymousSafeDesc: "No personal information is shared. All messages are moderated for safety.",
      supportiveSpace: "Supportive Space",
      supportiveSpaceDesc: "Share your waiting experience and offer emotional support to others.",
      experienceOnly: "Experience Only",
      experienceOnlyDesc: "Focus on sharing experiences, not medical advice or personal details.",
      beRespectful: "Be Respectful",
      beRespectfulDesc: "Keep conversations supportive and kind",
      shareWaiting: "Share Waiting",
      shareWaitingDesc: "Talk about your waiting experience",
      noMedicalAdvice: "No Medical Advice",
      noMedicalAdviceDesc: "Don't give or ask for medical advice",
      acceptText: "I understand this is for sharing experiences only, not medical advice.",
      continue: "Continue",
    },
    
    // Relaxation Page
    relaxation: {
      title: "Relaxation Corner",
      breathingExercise: "Breathing Exercise",
      breatheIn: "Breathe in slowly...",
      hold: "Hold your breath...",
      breatheOut: "Breathe out gently...",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      totalTime: "Total time:",
      completionMessage: "Great job! You've completed a full minute of breathing.",
      returnToChat: "Return to Chat",
      grounding: "Grounding",
      gratitude: "Gratitude",
      memoryMatch: "Memory Match",
      colorFocus: "Color Focus",
      selectGame: "Choose an activity",
      newPrompt: "New Prompt",
      matchFound: "Match found!",
      gameComplete: "Game complete! 🎉",
      playAgain: "Play Again",
      groundingTitle: "Grounding 5-4-3-2-1",
      groundingDesc: "Tap to count. Progress resets after 1.",
      currentTarget: "Current target",
      count: "Count",
      tap: "Tap",
      findPairs: "Find all pairs. Matched:",
      resetGame: "Reset",
      allPairsFound: "🎉 Nicely done! All pairs found.",
      gratitudeMoment: "Gratitude Moment",
      gazeSoftly: "Gaze softly at the color. Tap to shift hues.",
      phase: "phase",
      gratitudePrompt1: "Name one person you're grateful for today.",
      gratitudePrompt2: "Recall a small kindness you noticed recently.",
      gratitudePrompt3: "What's one thing in this room that brings comfort?",
      gratitudePrompt4: "Think of a strength you've shown this week.",
    },
    
    // Avatar Display
    avatarDisplay: {
      step: "Step 3",
      title: "Your Anonymous Identity",
      subtitle: "This is how you'll appear to others in the chat",
      info: "Your avatar and nickname have been randomly assigned to protect your privacy. These cannot be changed once you enter the chat.",
      enterChat: "Enter Chat Room",
      anonymousUser: "Anonymous User",
    },
    
    // Location Scan
    locationScan: {
      accessCheck: "Access Check",
      verifying: "Verifying On-site Presence",
      limitedAccess: "Access is limited to companions inside partner hospital premises.",
      scanning: "Scanning location…",
      passed: "Location check passed",
      withinPremises: "You're within hospital premises.",
      continue: "Continue",
      privacyNote: "We never store your precise location. This one-time check is used only for access.",
      poweredBy: "Powered by",
    },
    
    // Companion Auth
    companionAuth: {
      step: "Step 1",
      title: "Companion Verification",
      enterNumber: "Enter Your Registered Number",
      privacyNote: "We only use this to confirm your hospital registration. No marketing calls, ever.",
      mobileNumber: "Mobile Number",
      anonymousNote: "Messages stay anonymous. Only verified companions can join.",
      continue: "Continue",
      checking: "Checking...",
      errorInvalid: "Please enter a valid 10-digit phone number",
      errorServer: "Error contacting server. Please try again.",
      errorNotFound: "No registration found for this number. Please contact hospital staff to register.",
    },
    
    // OTP Auth
    otpAuth: {
      title: "Verification",
      enterPhone: "Enter Your Phone Number",
      verifyNote: "We verify to prevent outsiders. No account is created.",
      sendCode: "Send Code",
      sending: "Sending...",
      enterCode: "Enter Verification Code",
      codeSent: "Code sent to",
      forTesting: "For testing, use:",
      resendCode: "Resend Code",
      resendIn: "Resend in",
      changePhone: "Change Phone Number",
      invalidCode: "Invalid code. Please try again.",
      errorPhone: "Please enter a valid 10-digit phone number",
    },
    
    // What Is This
    whatIsThis: {
      title: "A gentle, anonymous space for every caregiver waiting outside a ward.",
      description: "When you tap \"What is this?\", we want you to feel the calm you deserve. Everything inside the app is designed to keep conversations private, compassionate, and grounded in the reality of hospital waiting rooms.",
      feature1Title: "Anonymous Sanctuary",
      feature1Desc: "Every nickname and avatar is randomized, keeping your identity private while you share feelings openly.",
      feature2Title: "Supportive Companions",
      feature2Desc: "A moderated chat where every message is screened for warmth, empathy, and hospital-waiting relevance.",
      feature3Title: "Calming Rituals",
      feature3Desc: "In-app breathing guides and grounding prompts help you stay steady while you wait.",
      moderationNote: "Moderated by real-time AI safety checks, geo-fenced to your hospital, and crafted with empathy-first design.",
      enterSpace: "Enter Companion Space",
      back: "Back",
    },
    
    // Privacy Terms
    privacyTerms: {
      title: "Privacy & Terms",
      heading: "Minimal data. Maximum care. Built for calming wait times.",
      description: "We collect only what is needed to keep the chat safe, relevant, and anchored to your hospital visit. Every element — from avatars to location checks — is opt-in, short-lived, and transparent.",
      card1Title: "No Personal IDs",
      card1Body: "Nicknames and avatars are randomly assigned. We never display or store personal identifiers.",
      card2Title: "Purposeful Location",
      card2Body: "Location is used one time to confirm you are within the hospital radius and is then discarded.",
      card3Title: "Gentle Conduct",
      card3Body: "All messages must stay supportive and on-topic. Moderation blocks spam, advice, or harmful content.",
      note1: "We never share data with advertisers or third parties.",
      note2: "All conversations are moderated for safety and relevance.",
      note3: "For emergencies or medical advice, please reach hospital staff immediately.",
      back: "Back",
    },
    
    // About Companions
    aboutCompanions: {
      about: "About",
      title: "Why Companions Anonymous Exists",
      description: "Hospitals care for patients. We care for the people who wait — quietly, anxiously, and often alone. This project is our promise to offer company, calm, and community inside every waiting hall.",
      pillar1Title: "Human-first Design",
      pillar1Body: "Created for caregivers spending long hours in hospital waiting areas. Every feature starts with empathy.",
      pillar2Title: "Safety & Privacy",
      pillar2Body: "Anonymous identities, live moderation, and zero advertising keep the space respectful and calm.",
      pillar3Title: "Gentle Support",
      pillar3Body: "From breathing cues to curated check-ins, we focus on light-touch prompts that soften stressful waits.",
      promiseTitle: "What we promise",
      promise1: "No personal data collection beyond real-time verification",
      promise2: "Location is only checked to ensure you are inside the partner hospital",
      promise3: "All conversations auto-expire; nothing is public or permanent",
      promise4: "Emergency prompts route you to hospital staff instantly",
      back: "Back",
    },
    
    // Common
    common: {
      back: "Back",
      loading: "Loading...",
      error: "An error occurred",
    },
  },
  
  hi: {
    // Landing Page
    landing: {
      title: "Communitiful",
      subtitle: "हर उस साथी के लिए जो इंतज़ार करता है — आप अकेले नहीं हैं।",
      feature1Title: "गुमनाम और निजी",
      feature1Desc: "कोई व्यक्तिगत जानकारी आवश्यक नहीं",
      feature2Title: "दूसरों से जुड़ें",
      feature2Desc: "अनुभव सुरक्षित रूप से साझा करें",
      feature3Title: "शांतिदायक संसाधन",
      feature3Desc: "विश्राम उपकरण शामिल",
      companionMode: "साथी मोड",
      hospitalMode: "अस्पताल मोड",
      getStarted: "शुरू करें",
      whatIsThis: "यह क्या है?",
      privacyTerms: "गोपनीयता और नियम",
      tagline: "शांति, जुड़ाव और दयालु प्रतीक्षा के लिए डिज़ाइन किया गया।",
      visitWebsite: "हमारी वेबसाइट देखें",
      visitWebsiteDesc: "हमारे मिशन और प्रभाव के बारे में अधिक जानें",
    },
    
    // Chat Page
    chat: {
      welcomeMessage: "प्रतीक्षा कक्ष चैट में आपका स्वागत है!",
      welcomeSubtext: "अपने विचार साझा करें और दूसरों से जुड़ें।",
      placeholder: "अन्य साथियों के साथ साझा करें...",
      disclaimer: "यह चैट भावनात्मक साझाकरण और साथीपन के लिए है, चिकित्सा सलाह के लिए नहीं। आपात स्थिति में, कृपया अस्पताल के कर्मचारियों से संपर्क करें।",
      online: "ऑनलाइन",
      typing: "टाइप कर रहे हैं...",
      typingMultiple: "साथी टाइप कर रहे हैं...",
      checking: "जांच हो रही है...",
      userJoined: "चैट में शामिल हुए",
      userLeft: "चैट छोड़ दी",
      companion: "साथी",
      companions: "साथी",
    },
    
    // Settings Page
    settings: {
      title: "सेटिंग्स",
      accessibility: "पहुंच",
      largerText: "बड़ा पाठ",
      largerTextDesc: "बेहतर पठनीयता के लिए पाठ का आकार बढ़ाएं",
      reduceMotion: "गति कम करें",
      reduceMotionDesc: "एनिमेशन और संक्रमण कम करें",
      language: "भाषा",
      information: "जानकारी",
      privacyPolicy: "गोपनीयता नीति",
      termsOfService: "सेवा की शर्तें",
      aboutCompanions: "Communitiful के बारे में",
      leaveRoom: "कमरा छोड़ें",
      leaveRoomDesc: "छोड़ने से आपका वर्तमान सत्र समाप्त हो जाएगा। पुन: शामिल होने के लिए आपको अपना स्थान सत्यापित करना होगा और सेटअप से फिर से गुजरना होगा।",
      leaveChatRoom: "चैट रूम छोड़ें",
      version: "Communitiful v1.0.0",
      feedbackTitle: "आपका चैट अनुभव कैसा था?",
      feedbackDesc: "आपकी प्रतिक्रिया हमें इस स्थान को शांत और दयालु बनाने में मदद करती है।",
      feedbackPlaceholder: "क्या हम सुधार कर सकते हैं? (वैकल्पिक)",
      cancel: "रद्द करें",
      submitExit: "सबमिट करें और बाहर निकलें",
      thankYou: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
      redirecting: "आपको लैंडिंग पेज पर वापस ले जा रहे हैं…",
    },
    
    // Disclaimer Page
    disclaimer: {
      step: "चरण 2",
      title: "महत्वपूर्ण जानकारी",
      welcome: "स्वागत है, मित्र",
      welcomeDesc: "हमें खुशी है कि आप यहाँ हैं। यह स्थान आप जैसे साथियों के लिए बनाया गया है।\nअपनी यात्रा साझा करें और समान स्थितियों में दूसरों से जुड़ें।",
      anonymousSafe: "गुमनाम और सुरक्षित",
      anonymousSafeDesc: "कोई व्यक्तिगत जानकारी साझा नहीं की जाती। सभी संदेश सुरक्षा के लिए मॉडरेट किए जाते हैं।",
      supportiveSpace: "सहायक स्थान",
      supportiveSpaceDesc: "अपना प्रतीक्षा अनुभव साझा करें और दूसरों को भावनात्मक सहायता प्रदान करें।",
      experienceOnly: "केवल अनुभव",
      experienceOnlyDesc: "अनुभव साझा करने पर ध्यान दें, चिकित्सा सलाह या व्यक्तिगत विवरण नहीं।",
      beRespectful: "सम्मानजनक रहें",
      beRespectfulDesc: "बातचीत को सहायक और दयालु रखें",
      shareWaiting: "प्रतीक्षा साझा करें",
      shareWaitingDesc: "अपने प्रतीक्षा अनुभव के बारे में बात करें",
      noMedicalAdvice: "कोई चिकित्सा सलाह नहीं",
      noMedicalAdviceDesc: "चिकित्सा सलाह न दें या न मांगें",
      acceptText: "मैं समझता हूं कि यह केवल अनुभव साझा करने के लिए है, चिकित्सा सलाह के लिए नहीं।",
      continue: "जारी रखें",
    },
    
    // Relaxation Page
    relaxation: {
      title: "विश्राम कोना",
      breathingExercise: "श्वास अभ्यास",
      breatheIn: "धीरे-धीरे सांस लें...",
      hold: "सांस रोकें...",
      breatheOut: "धीरे-धीरे सांस छोड़ें...",
      start: "शुरू करें",
      pause: "रोकें",
      reset: "रीसेट करें",
      totalTime: "कुल समय:",
      completionMessage: "बहुत बढ़िया! आपने एक पूर्ण मिनट की सांस ली है।",
      returnToChat: "चैट पर वापस जाएं",
      grounding: "ग्राउंडिंग",
      gratitude: "कृतज्ञता",
      memoryMatch: "मेमोरी मैच",
      colorFocus: "रंग फोकस",
      selectGame: "एक गतिविधि चुनें",
      newPrompt: "नया प्रॉम्प्ट",
      matchFound: "मैच मिला!",
      gameComplete: "खेल पूरा! 🎉",
      playAgain: "फिर से खेलें",
      groundingTitle: "ग्राउंडिंग 5-4-3-2-1",
      groundingDesc: "गिनती के लिए टैप करें। 1 के बाद प्रगति रीसेट हो जाती है।",
      currentTarget: "वर्तमान लक्ष्य",
      count: "गिनती",
      tap: "टैप करें",
      findPairs: "सभी जोड़े खोजें। मिले:",
      resetGame: "रीसेट",
      allPairsFound: "🎉 बहुत बढ़िया! सभी जोड़े मिल गए।",
      gratitudeMoment: "कृतज्ञता का क्षण",
      gazeSoftly: "रंग को धीरे से देखें। रंग बदलने के लिए टैप करें।",
      phase: "चरण",
      gratitudePrompt1: "आज आप किस एक व्यक्ति के प्रति आभारी हैं, उसका नाम लें।",
      gratitudePrompt2: "हाल ही में आपने जो एक छोटी दयालुता देखी, उसे याद करें।",
      gratitudePrompt3: "इस कमरे में कौन सी एक चीज़ आराम देती है?",
      gratitudePrompt4: "इस सप्ताह आपने जो एक ताकत दिखाई है, उसके बारे में सोचें।",
    },
    
    // Avatar Display
    avatarDisplay: {
      step: "चरण 3",
      title: "आपकी गुमनाम पहचान",
      subtitle: "यह है कि आप दूसरों को चैट में कैसे दिखाई देंगे",
      info: "आपका अवतार और उपनाम आपकी गोपनीयता की सुरक्षा के लिए यादृच्छिक रूप से निर्दिष्ट किया गया है। एक बार चैट में प्रवेश करने के बाद इन्हें बदला नहीं जा सकता।",
      enterChat: "चैट रूम में प्रवेश करें",
      anonymousUser: "अज्ञात उपयोगकर्ता",
    },
    
    // Location Scan
    locationScan: {
      accessCheck: "पहुंच जांच",
      verifying: "ऑन-साइट उपस्थिति सत्यापित करना",
      limitedAccess: "पहुंच साथी अस्पताल परिसर के अंदर साथियों तक सीमित है।",
      scanning: "स्थान स्कैन कर रहे हैं…",
      passed: "स्थान जांच पास हो गई",
      withinPremises: "आप अस्पताल परिसर के भीतर हैं।",
      continue: "जारी रखें",
      privacyNote: "हम आपका सटीक स्थान कभी संग्रहीत नहीं करते। यह एक बार की जांच केवल पहुंच के लिए उपयोग की जाती है।",
      poweredBy: "द्वारा संचालित",
    },
    
    // Companion Auth
    companionAuth: {
      step: "चरण 1",
      title: "साथी सत्यापन",
      enterNumber: "अपना पंजीकृत नंबर दर्ज करें",
      privacyNote: "हम इसे केवल आपके अस्पताल पंजीकरण की पुष्टि के लिए उपयोग करते हैं। कभी भी मार्केटिंग कॉल नहीं।",
      mobileNumber: "मोबाइल नंबर",
      anonymousNote: "संदेश गुमनाम रहते हैं। केवल सत्यापित साथी ही शामिल हो सकते हैं।",
      continue: "जारी रखें",
      checking: "जांच हो रही है...",
      errorInvalid: "कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें",
      errorServer: "सर्वर से संपर्क करने में त्रुटि। कृपया पुनः प्रयास करें।",
      errorNotFound: "इस नंबर के लिए कोई पंजीकरण नहीं मिला। कृपया पंजीकरण के लिए अस्पताल के कर्मचारियों से संपर्क करें।",
    },
    
    // OTP Auth
    otpAuth: {
      title: "सत्यापन",
      enterPhone: "अपना फोन नंबर दर्ज करें",
      verifyNote: "हम बाहरी लोगों को रोकने के लिए सत्यापित करते हैं। कोई खाता नहीं बनाया जाता।",
      sendCode: "कोड भेजें",
      sending: "भेज रहे हैं...",
      enterCode: "सत्यापन कोड दर्ज करें",
      codeSent: "कोड भेजा गया",
      forTesting: "परीक्षण के लिए, उपयोग करें:",
      resendCode: "कोड पुनः भेजें",
      resendIn: "पुनः भेजें",
      changePhone: "फोन नंबर बदलें",
      invalidCode: "अमान्य कोड। कृपया पुनः प्रयास करें।",
      errorPhone: "कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें",
    },
    
    // What Is This
    whatIsThis: {
      title: "हर देखभाल करने वाले के लिए एक कोमल, गुमनाम स्थान जो वार्ड के बाहर इंतज़ार करता है।",
      description: "जब आप \"यह क्या है?\" टैप करते हैं, तो हम चाहते हैं कि आप वह शांति महसूस करें जिसके आप हकदार हैं। ऐप के अंदर की हर चीज़ को बातचीत को निजी, दयालु और अस्पताल प्रतीक्षा कक्षों की वास्तविकता में आधारित रखने के लिए डिज़ाइन किया गया है।",
      feature1Title: "गुमनाम आश्रय",
      feature1Desc: "हर उपनाम और अवतार यादृच्छिक है, आपकी पहचान को निजी रखते हुए जब आप खुले तौर पर भावनाएं साझा करते हैं।",
      feature2Title: "सहायक साथी",
      feature2Desc: "एक मॉडरेटेड चैट जहां हर संदेश को गर्मजोशी, सहानुभूति और अस्पताल-प्रतीक्षा प्रासंगिकता के लिए स्क्रीन किया जाता है।",
      feature3Title: "शांतिदायक अनुष्ठान",
      feature3Desc: "ऐप-इन सांस लेने के मार्गदर्शक और ग्राउंडिंग प्रॉम्प्ट आपको इंतज़ार के दौरान स्थिर रहने में मदद करते हैं।",
      moderationNote: "रीयल-टाइम AI सुरक्षा जांच, आपके अस्पताल के लिए जियो-फेंस्ड, और सहानुभूति-प्रथम डिज़ाइन के साथ तैयार किया गया।",
      enterSpace: "साथी स्थान में प्रवेश करें",
      back: "वापस",
    },
    
    // Privacy Terms
    privacyTerms: {
      title: "गोपनीयता और नियम",
      heading: "न्यूनतम डेटा। अधिकतम देखभाल। शांत प्रतीक्षा समय के लिए बनाया गया।",
      description: "हम केवल वही एकत्र करते हैं जो चैट को सुरक्षित, प्रासंगिक और आपकी अस्पताल यात्रा से जोड़े रखने के लिए आवश्यक है। हर तत्व — अवतार से लेकर स्थान जांच तक — ऑप्ट-इन, अल्पकालिक और पारदर्शी है।",
      card1Title: "कोई व्यक्तिगत आईडी नहीं",
      card1Body: "उपनाम और अवतार यादृच्छिक रूप से निर्दिष्ट किए जाते हैं। हम कभी भी व्यक्तिगत पहचानकर्ता प्रदर्शित या संग्रहीत नहीं करते।",
      card2Title: "उद्देश्यपूर्ण स्थान",
      card2Body: "स्थान का उपयोग एक बार यह पुष्टि करने के लिए किया जाता है कि आप अस्पताल की त्रिज्या के भीतर हैं और फिर इसे त्याग दिया जाता है।",
      card3Title: "कोमल आचरण",
      card3Body: "सभी संदेश सहायक और विषय-संबंधी रहने चाहिए। मॉडरेशन स्पैम, सलाह, या हानिकारक सामग्री को अवरुद्ध करता है।",
      note1: "हम कभी भी विज्ञापनदाताओं या तीसरे पक्षों के साथ डेटा साझा नहीं करते।",
      note2: "सभी बातचीत सुरक्षा और प्रासंगिकता के लिए मॉडरेट की जाती है।",
      note3: "आपात स्थिति या चिकित्सा सलाह के लिए, कृपया तुरंत अस्पताल के कर्मचारियों से संपर्क करें।",
      back: "वापस",
    },
    
    // About Companions
    aboutCompanions: {
      about: "के बारे में",
      title: "गोपनीय सहचर क्यों मौजूद है",
      description: "अस्पताल मरीजों की देखभाल करते हैं। हम उन लोगों की देखभाल करते हैं जो इंतज़ार करते हैं — चुपचाप, चिंतित रूप से, और अक्सर अकेले। यह परियोजना हर प्रतीक्षा हॉल के अंदर कंपनी, शांति और समुदाय प्रदान करने का हमारा वादा है।",
      pillar1Title: "मानव-प्रथम डिज़ाइन",
      pillar1Body: "अस्पताल प्रतीक्षा क्षेत्रों में लंबे समय तक बिताने वाले देखभाल करने वालों के लिए बनाया गया। हर सुविधा सहानुभूति से शुरू होती है।",
      pillar2Title: "सुरक्षा और गोपनीयता",
      pillar2Body: "गुमनाम पहचान, लाइव मॉडरेशन, और शून्य विज्ञापन स्थान को सम्मानजनक और शांत रखते हैं।",
      pillar3Title: "कोमल सहायता",
      pillar3Body: "सांस लेने के संकेतों से लेकर क्यूरेटेड चेक-इन तक, हम हल्के-स्पर्श प्रॉम्प्ट पर ध्यान केंद्रित करते हैं जो तनावपूर्ण प्रतीक्षा को नरम करते हैं।",
      promiseTitle: "हम क्या वादा करते हैं",
      promise1: "रीयल-टाइम सत्यापन के अलावा कोई व्यक्तिगत डेटा संग्रह नहीं",
      promise2: "स्थान केवल यह सुनिश्चित करने के लिए जांचा जाता है कि आप साथी अस्पताल के अंदर हैं",
      promise3: "सभी बातचीत स्वचालित रूप से समाप्त हो जाती है; कुछ भी सार्वजनिक या स्थायी नहीं है",
      promise4: "आपातकालीन प्रॉम्प्ट आपको तुरंत अस्पताल के कर्मचारियों तक पहुंचाते हैं",
      back: "वापस",
    },
    
    // Common
    common: {
      back: "वापस",
      loading: "लोड हो रहा है...",
      error: "एक त्रुटि हुई",
    },
  },
};

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English if translation not found
      value = translations.en;
      for (const k2 of keys) {
        value = value?.[k2];
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

