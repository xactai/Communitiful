import { Button } from "@/components/ui/button";
import { ArrowDown, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById('problem');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <img src={logo} alt="Companions Anonymous logo" className="h-6 w-6" />
              <span className="text-white/90 font-medium">Companions Anonymous</span>
            </div>
            
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              A Safe Space for Companions,{" "}
              <span className="text-white/90">Right Outside the Clinic</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              While patients get care, their loved ones get comfort. Join an anonymous chat room to share, connect, and ease the wait.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="default" 
                size="xl"
                onClick={scrollToNext}
                className="group"
              >
                <MessageCircle className="h-5 w-5" />
                Learn How It Works
                <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                For Hospitals
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Anonymous</div>
                <div className="text-sm">Safe & Private</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Temporary</div>
                <div className="text-sm">Auto-closing</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Moderated</div>
                <div className="text-sm">AI-powered</div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-float">
              <img 
                src={heroImage} 
                alt="Hospital waiting room with companions using anonymous chat" 
                className="w-full h-auto animate-float"
              />
              
              {/* Floating chat bubbles */}
              <div className="absolute top-4 right-4 bg-white/95 rounded-2xl p-3 shadow-card animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="text-sm text-navy-primary font-medium">💙 You're not alone</div>
              </div>
              
              <div className="absolute bottom-8 left-4 bg-white/95 rounded-2xl p-3 shadow-card animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-sm text-navy-primary font-medium">🌟 Sending positive thoughts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-white/70" />
      </div>
    </section>
  );
};

export default HeroSection;