import impactImage from "@/assets/impact-illustration.jpg";
import { Heart, TrendingUp, Users, Award } from "lucide-react";

const stats = [
  {
    icon: Heart,
    value: "89%",
    label: "Reduced Anxiety",
    description: "Companions report feeling calmer after using our service"
  },
  {
    icon: Users,
    value: "2.3M",
    label: "Connections Made",
    description: "Meaningful conversations between companions worldwide"
  },
  {
    icon: TrendingUp,
    value: "94%",
    label: "Positive Feedback",
    description: "Hospital partners see improved satisfaction scores"
  },
  {
    icon: Award,
    value: "150+",
    label: "Healthcare Partners",
    description: "Hospitals and clinics trust our platform"
  }
];

const benefits = [
  {
    title: "For Companions",
    points: [
      "Reduced stress and anxiety during waiting periods",
      "Emotional support from people who understand",
      "Sense of community during vulnerable moments",
      "Improved mental health and coping strategies"
    ]
  },
  {
    title: "For Healthcare Institutions",
    points: [
      "Enhanced patient and family satisfaction scores",
      "Demonstration of empathy and care beyond treatment",
      "Reduced complaints about waiting experiences",
      "Positive brand association with innovation"
    ]
  }
];

const ImpactSection = () => {
  return (
    <section className="py-24 gradient-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-navy-primary mb-6">
            Why It{" "}
            <span className="text-success-green">Matters</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            More than just a chat platform—we're transforming the healthcare experience 
            for families and institutions alike.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-float transition-smooth group">
                <div className="bg-success-green/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-bounce">
                  <stat.icon className="h-8 w-8 text-success-green" />
                </div>
                <div className="text-3xl font-bold text-navy-primary mb-2">{stat.value}</div>
                <div className="font-semibold text-success-green mb-2">{stat.label}</div>
                <div className="text-sm text-text-secondary">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Benefits */}
          <div className="animate-fade-in-up">
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-card">
                  <h3 className="font-heading text-2xl font-semibold text-navy-primary mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-success-green rounded-full"></div>
                    {benefit.title}
                  </h3>
                  <ul className="space-y-3">
                    {benefit.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-success-green rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-text-secondary">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-float">
              <img 
                src={impactImage} 
                alt="Happy, relieved companions in hospital waiting room feeling supported" 
                className="w-full h-auto"
              />
              
              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-t from-success-green/20 to-transparent"></div>
              
              {/* Floating testimonial */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 p-4 rounded-2xl shadow-card backdrop-blur-sm">
                <p className="text-navy-primary font-medium text-sm mb-2">
                  "Finally, I didn't feel alone during the hardest 3 hours of my life. 
                  Knowing others understood made all the difference."
                </p>
                <div className="text-success-green text-xs">— Sarah, Daughter of Cancer Patient</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-success-green/5 border border-success-green/20 p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="font-heading text-2xl font-semibold text-navy-primary mb-4">
              Creating Ripples of Compassion
            </h3>
            <p className="text-text-secondary text-lg">
              Every conversation creates a ripple effect—reducing anxiety, building empathy, 
              and transforming healthcare environments into spaces of genuine care and community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
