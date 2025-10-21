import { ClipboardList, QrCode, Smartphone, Users, MessageCircle, Shield, Link2, TimerOff } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Hospital Registration",
    description: "This step records essential patient and companion information to formally initiate the hospital process",
    detail: "Secure and efficient registration process"
  },
  {
    icon: QrCode,
    title: "Scan QR Code",
    description: "Companion scans QR code placed in hospital waiting hall",
    detail: "Quick and easy access with no downloads required"
  },
  {
    icon: Smartphone,
    title: "Companion Login",
    description: "The companion enters their mobile number for authentication",
    detail: "Ensures that only verified companions can participate in the process"
  },
  {
    icon: Users,
    title: "Join Chat Room",
    description: "Instantly joins a temporary chat room with others waiting",
    detail: "Anonymous identity with friendly avatar assignment"
  },
  {
    icon: MessageCircle,
    title: "Chat & Share",
    description: "Chat anonymously, share thoughts, and find comfort",
    detail: "Real-time conversations with people who understand"
  },
  {
    icon: Shield,
    title: "AI Ensures Safety",
    description: "AI ensures a positive and safe space for all participants",
    detail: "24/7 moderation with instant content filtering"
  },
  {
    icon: Link2,
    title: "IRL (In Real Life)",
    description: "This step bridges the digital and physical experiences",
    detail: "Ensuring that the online process translates effectively into real-world action"
  },
  {
    icon: TimerOff,
    title: "Room Closes",
    description: "Room closes after the waiting period ends automatically",
    detail: "Complete privacy with no conversation history stored"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy-primary mb-6">
            How It{" "}
            <span className="text-success-green">Works</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Eight simple steps from scan to support. No complexity, just connection.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-success-green/20 via-success-green to-success-green/20"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-8 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step number */}
                <div className="bg-success-green text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-6 mx-auto lg:mx-0 shadow-soft relative z-10">
                  {index + 1}
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-float transition-smooth group">
                  <div className="bg-success-green/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce">
                    <step.icon className="h-8 w-8 text-success-green" />
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-navy-primary mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-text-secondary mb-3 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  
                  <p className="text-success-green text-xs font-medium">
                    {step.detail}
                  </p>
                </div>
                
                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <div className="w-0.5 h-8 bg-success-green/30"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-neutral-light p-8 rounded-2xl shadow-soft max-w-4xl mx-auto">
            <h3 className="font-heading text-2xl font-semibold text-navy-primary mb-4">
              From Isolation to Connection in Seconds
            </h3>
            <p className="text-text-secondary text-lg">
              Transform the waiting experience from lonely anxiety to supported community. 
              Every conversation brings comfort, understanding, and hope.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
