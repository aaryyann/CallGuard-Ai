"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { 
  PhoneCall, 
  FileAudio, 
  Brain, 
  Bell, 
  Stethoscope
} from "lucide-react";

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-animate]");
            elements.forEach((element) => {
              element.classList.add("animate-in");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const steps = [
    {
      icon: PhoneCall,
      title: "Call Recording",
      description: "Patient calls are recorded through your existing phone system or our integrated solution."
    },
    {
      icon: FileAudio,
      title: "Audio Processing",
      description: "Our system converts speech to text and organizes the conversation for analysis."
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced machine learning algorithms identify potential medical risks and symptoms."
    },
    {
      icon: Bell,
      title: "Alert Generation",
      description: "Critical findings trigger immediate alerts to the appropriate healthcare providers."
    },
    {
      icon: Stethoscope,
      title: "Clinical Action",
      description: "Healthcare professionals follow up with patients based on AI-identified risks."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50" id="how-it-works" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "0ms" }}
          >
            How CallGuard AI Works
          </h2>
          <p 
            className="text-xl text-muted-foreground opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "200ms" }}
          >
            Our simple yet powerful process helps identify patient risks in 5 easy steps.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={index}
                className="relative mb-6 opacity-1 translate-y-4"
                data-animate
                style={{ animationDelay: `${300 + index * 150}ms` }}
              >
                <div className={`md:flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`hidden md:block ${isEven ? 'md:pr-12 text-right' : 'md:pl-12'} w-1/2`}>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  
                  <div className="relative flex md:w-8 md:justify-center">
                    <div className="bg-card border shadow-md w-12 h-12 rounded-full flex items-center justify-center z-10">
                      <Icon className="h-5 w-14 text-primary" />
                    </div>
                  </div>
                  
                  <div className={`md:hidden text-left mt-4 mb-8`}>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  
                  <div className={`hidden md:block ${isEven ? 'md:pl-12' : 'md:pr-12 text-right'} w-1/2`}>
                    {index === 0 && (
                      <div className="bg-card border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <PhoneCall className="h-5 w-5 text-chart-2" />
                          <span className="font-medium">Incoming call</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-muted rounded w-3/4"></div>
                          <div className="h-2 bg-muted rounded"></div>
                          <div className="h-2 bg-muted rounded w-5/6"></div>
                        </div>
                      </div>
                    )}
                    
                    {index === 2 && (
                      <div className="bg-card border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <Brain className="h-5 w-5 text-chart-1" />
                          <span className="font-medium">AI Processing</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <div className="h-8 bg-chart-1/20 rounded"></div>
                          <div className="h-8 bg-chart-2/20 rounded"></div>
                          <div className="h-8 bg-chart-3/20 rounded"></div>
                        </div>
                        <div className="h-2 bg-muted rounded w-2/3"></div>
                      </div>
                    )}
                    
                    {index === 4 && (
                      <div className="bg-card border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <Stethoscope className="h-5 w-5 text-chart-3" />
                          <span className="font-medium">Care Provided</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Patient contacted</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}