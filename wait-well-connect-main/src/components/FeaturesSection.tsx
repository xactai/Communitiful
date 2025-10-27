import { Shield, UserX, Clock, Smartphone, Heart, Bot } from "lucide-react";

const features = [
  {
    icon: UserX,
    title: "Anonymous Conversations",
    description: "Speak your heart out without revealing your identity. Complete privacy guaranteed."
  },
  {
    icon: Clock,
    title: "Temporary Rooms",
    description: "Rooms exist only during the waiting period, then close automatically for security."
  },
  {
    icon: Bot,
    title: "AI Moderation",
    description: "Real-time filtering of abusive or off-topic content for safe, supportive conversations."
  },
  {
    icon: Smartphone,
    title: "Easy Access",
    description: "Just scan a QR code in the waiting hall. No sign-up or app download required."
  },
  {
    icon: Heart,
    title: "Stress Relief & Support",
    description: "Talk, listen, and share with people who understand exactly what you're going through."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "No personal data stored. No tracking. Your conversations remain completely private."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 gradient-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy-primary mb-6">
            Key Features That{" "}
            <span className="text-success-green">Make It Work</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Designed with empathy, built for safety, and focused on creating genuine 
            human connections during difficult moments.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="gradient-card p-8 rounded-2xl shadow-card hover:shadow-float transition-smooth group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-success-green/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce">
                <feature.icon className="h-8 w-8 text-success-green" />
              </div>
              
              <h3 className="font-heading text-xl font-semibold text-navy-primary mb-4">
                {feature.title}
              </h3>
              
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-soft">
            <Shield className="h-5 w-5 text-success-green" />
            <span className="text-navy-primary font-medium">HIPAA Compliant & Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
