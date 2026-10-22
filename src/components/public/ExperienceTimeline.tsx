import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building2 } from 'lucide-react';
import type { Experience } from '../../types';
import { Badge } from '../ui/Badge';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences }) => {
  return (
    <section id="experiences" className="py-14 sm:py-20 relative">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-left">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400">
              CHRONOLOGY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F3F4F6] tracking-tight">
            Rekam Jejak & Pengalaman Profesional
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1.5 sm:mt-2 font-mono leading-relaxed">
            Rangkuman peran, tanggung jawab, dan dampak teknis yang dihasilkan di berbagai institusi dan proyek.
          </p>
        </div>

        {/* Timeline Line & Items */}
        <div className="relative pl-5 sm:pl-8 border-l border-[#1F2924] space-y-8 sm:space-y-12 ml-2 sm:ml-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="relative group"
            >
              {/* Timeline Indicator Dot (Centered on line) */}
              <div className="absolute -left-[28.5px] sm:-left-[40.5px] top-2 w-4 h-4 rounded-full bg-[#050505] border-2 border-emerald-500 flex items-center justify-center group-hover:scale-125 group-hover:border-emerald-400 group-hover:shadow-emerald-glow transition-all duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              {/* Card Container */}
              <div className="rounded-xl sm:rounded-2xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md p-4 sm:p-6 hover:border-[#10B981] hover:shadow-emerald-glow transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#F3F4F6] group-hover:text-emerald-400 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{exp.organization}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <Badge variant="cyber" size="sm" icon={<Calendar className="w-3 h-3" />} className="text-[10px] sm:text-xs">
                      {exp.period}
                    </Badge>
                    {exp.is_current && (
                      <Badge variant="emerald" size="sm" className="text-[10px] sm:text-xs">
                        CURRENT
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-3 sm:mt-4">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
