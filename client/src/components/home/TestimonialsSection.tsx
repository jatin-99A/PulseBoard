import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'PulseBoard completely changed our keynote at TechCon 2026. Over 3,200 people scanned the QR code at once and the results streamed onto the giant LED wall flawlessly.',
      author: 'Marcus Vance',
      role: 'VP of Developer Ecosystem',
      company: 'CloudNative Global',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
    },
    {
      quote:
        'Our students usually tune out during remote lectures. With PulseBoard’s instant live quizzes, engagement jumped by 80%. It’s lightning fast and requires zero setup.',
      author: 'Dr. Elena Rostova',
      role: 'Professor of Computer Science',
      company: 'Tech Academy Europe',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=faces',
    },
    {
      quote:
        'We use PulseBoard for sprint retrospectives and executive voting. The anti-abuse rate limiter and clean export tools make our decision-making so much more transparent.',
      author: 'Arjun Mehta',
      role: 'Principal Agile Coach',
      company: 'Apex Technologies',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          Trusted Worldwide
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Loved by presenters, teachers, and teams
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          See how leading speakers elevate their audience participation with PulseBoard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between relative hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-slate-700" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                "{item.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/70">
              <img
                src={item.avatar}
                alt={item.author}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-white">{item.author}</h4>
                <p className="text-[11px] text-slate-400">{item.role}</p>
                <p className="text-[10px] text-indigo-400 font-medium">{item.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

