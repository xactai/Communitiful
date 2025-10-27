import problemImage from "@/assets/problem-illustration.jpg";
import { Clock, Frown, Users } from "lucide-react";

const ProblemSection = () => {
  return (
    <section id="problem" className="py-24 gradient-section">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative animate-fade-in-up">
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <img 
                src={problemImage} 
                alt="Stressed family members waiting outside clinic looking isolated" 
                className="w-full h-auto"
              />
              
              {/* Overlay stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-2xl font-bold">2.3 hours</div>
                <div className="text-sm opacity-90">Average wait time</div>
              </div>
            </div>
          </div>
          
          {/* Right Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy-primary mb-8">
              The Silent Stress in{" "}
              <span className="text-success-green">Waiting Rooms</span>
            </h2>
            
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              While patients receive care, their companions often wait outside—worrying, 
              overthinking, and feeling isolated. This emotional weight makes the waiting 
              period feel endless and overwhelming.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-destructive/10 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-primary mb-2">Endless Waiting</h3>
                  <p className="text-text-secondary">Hours of uncertainty with no one to talk to about fears and concerns.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-destructive/10 p-3 rounded-xl">
                  <Frown className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-primary mb-2">Emotional Isolation</h3>
                  <p className="text-text-secondary">Feeling alone in worries, with no outlet for stress and anxiety.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-destructive/10 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-primary mb-2">No Support Network</h3>
                  <p className="text-text-secondary">Missing connection with others who understand the same experience.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-white rounded-2xl shadow-soft border border-success-green/20">
              <div className="text-success-green font-semibold mb-2">Did you know?</div>
              <div className="text-navy-primary">
                <span className="font-bold">78% of patient companions</span> report feeling anxious 
                and isolated during medical visits, with waiting being the most stressful part.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
