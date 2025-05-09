"use client";

import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  organization: string;
}

export function Testimonials() {
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

  const testimonials: Testimonial[] = [
    {
      content: "CallGuard AI has transformed our patient follow-up process. We've been able to identify several high-risk cases that would have otherwise been missed until their next appointment.",
      author: "Dr. Sarah Johnson",
      role: "Chief of Medicine",
      organization: "Metropolitan Health Partners"
    },
    {
      content: "The early detection capabilities of this system are remarkable. We had a patient whose symptoms indicated a potential stroke, and thanks to CallGuard AI's alert, we were able to intervene within hours.",
      author: "Dr. Michael Chen",
      role: "Neurologist",
      organization: "Riverdale Medical Center"
    },
    {
      content: "As a clinic administrator, I appreciate the seamless integration with our existing systems. The ROI has been clear - reduced readmissions and better patient outcomes.",
      author: "Jennifer Williams",
      role: "Operations Director",
      organization: "Family Care Associates"
    }
  ];

  return (
    <section className="py-16 md:py-24" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "100ms" }}
          >
            Trusted by Healthcare Professionals
          </h2>
          <p 
            className="text-xl text-muted-foreground opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "200ms" }}
          >
            See how CallGuard AI is making a difference in patient care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card border rounded-xl p-6 opacity-1 translate-y-4"
              data-animate
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>
              <p className="mb-6 text-foreground/90">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">{testimonial.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}