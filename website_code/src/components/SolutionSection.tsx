import chatMockup from "@/assets/chat-mockup.jpg";
import { Button } from "@/components/ui/button";
import { QrCode, Shield, MessageCircle, Clock } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy-primary mb-6">
            Introducing{" "}
            <span className="text-success-green">Temporary Anonymous Chat Rooms</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            A simple QR code scan connects companions to a safe, temporary community 
            of people sharing similar experiences.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-success-green/10 p-3 rounded-xl">
                  <QrCode className="h-6 w-6 text-success-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-primary mb-2 text-lg">Instant Access</h3>
                  <p className="text-text-secondary">
                    Simply scan a QR code in the hospital waiting area. No signup, 
                    no personal information required.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-success-green/10 p-3 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-success-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-primary mb-2 text-lg">Anonymous Support</h3>
                  <p className="text-text-secondary">
                    Connect with others who understand your situation. Share thoughts, 
                    offer comfort, and receive support—all completely anonymous.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-success-green/10 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-success-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-primary mb-2 text-lg">Time-Bound Rooms</h3>
                  <p className="text-text-secondary">
                    Chat rooms exist only during waiting periods, then automatically 
                    close for privacy and security.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-success-green/10 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-success-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-primary mb-2 text-lg">AI-Moderated Safety</h3>
                  <p className="text-text-secondary">
                    Real-time AI moderation ensures conversations remain supportive, 
                    respectful, and on-topic.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Button variant="success" size="lg" className="group">
                <MessageCircle className="h-5 w-5" />
                See How It Works
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </div>
          </div>
          
          {/* Right Mobile Mockup */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Phone frame effect */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-2 shadow-float">
                <div className="bg-black rounded-2xl p-1">
                  <img 
                    src={chatMockup} 
                    alt="Diverse companions in hospital waiting room using their phones to connect through QR code" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
              
              {/* Floating UI elements */}
              <div className="absolute -top-4 -right-4 bg-success-green text-white p-3 rounded-2xl shadow-card animate-float">
                <div className="text-sm font-medium">3 active companions</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-2xl shadow-card animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-sm text-navy-primary font-medium">🔒 Anonymous & Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
