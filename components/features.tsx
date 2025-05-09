"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck, Clock, FileAudio, Brain, Stethoscope, ChartLine, LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  return (
    <div 
      className="bg-card border rounded-xl p-6 opacity-1 translate-y-4"
      data-animate
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function Features() {
  const featuresRef = useRef<HTMLDivElement>(null);

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

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "Risk Detection",
      description: "Automatically identifies potential medical risks in patient conversations."
    },
    {
      icon: Clock,
      title: "Real-time Alerts",
      description: "Receive instant notifications for urgent cases requiring immediate attention."
    },
    {
      icon: FileAudio,
      title: "Call Analysis",
      description: "Process and analyze recorded calls to extract critical health information."
    },
    {
      icon: Brain,
      title: "AI Learning",
      description: "Our system continuously learns from new cases to improve detection accuracy."
    },
    {
      icon: Stethoscope,
      title: "Clinical Integration",
      description: "Seamlessly integrate with your existing healthcare management systems."
    },
    {
      icon: ChartLine,
      title: "Trend Insights",
      description: "Track patterns and analyze data to improve patient care over time."
    }
  ];

  return (
    <section className="py-16 md:py-24" id="features" ref={featuresRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "100ms" }}
          >
            Powerful Features for Patient Safety
          </h2>
          <p 
            className="text-xl text-muted-foreground opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "200ms" }}
          >
            Our AI-powered platform helps healthcare providers identify risks and prevent emergencies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={300 + index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}