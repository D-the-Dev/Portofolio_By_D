import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, FolderGit2 } from 'lucide-react';
import type { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GithubIcon } from '../ui/Icons';

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('all');

  const filteredProjects = activeFilter === 'featured'
    ? projects.filter((p) => p.is_featured)
    : projects;

  return (
    <section id="projects" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400">
                PORTFOLIO
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F3F4F6] tracking-tight">
              Proyek & Rekayasa Perangkat Lunak
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1.5 sm:mt-2 font-mono leading-relaxed">
              Pengembangan website, rancang bangun sistem, dan arsitektur komputer yang dibangun dengan standar, performa dan keamanan terbaik.
            </p>
          </div>

          {/* Filter Pills with touch-friendly spacing */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-[#0F1412] border border-[#1F2924] rounded-lg self-start sm:self-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 text-xs font-mono rounded-md transition-all ${activeFilter === 'all'
                ? 'bg-emerald-500 text-black font-semibold'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Semua ({projects.length})
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center justify-center gap-1.5 ${activeFilter === 'featured'
                ? 'bg-emerald-500 text-black font-semibold'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              <Sparkles className="w-3 h-3" />
              Unggulan ({projects.filter((p) => p.is_featured).length})
            </button>
          </div>
        </div>

        {/* Grid List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-xl border border-dashed border-[#1F2924] bg-[#0F1412]/50">
            <FolderGit2 className="w-10 h-10 text-gray-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-mono text-gray-400">Belum ada proyek yang cocok dengan filter ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="group relative rounded-xl sm:rounded-2xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md overflow-hidden flex flex-col justify-between hover:border-[#10B981] hover:shadow-emerald-glow transition-all duration-300"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/60 border-b border-[#1F2924]">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1412] via-transparent to-transparent opacity-80" />

                  {project.is_featured && (
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                      <Badge variant="emerald" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                        UNGGULAN
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#F3F4F6] group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack badges */}
                  <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#1F2924]/80">
                    <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
                      {project.tech_stack?.map((tag) => (
                        <Badge key={tag} variant="cyber" size="sm" className="text-[10px] sm:text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Links (Responsive buttons) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full justify-center"
                            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                          >
                            Live Demo
                          </Button>
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={project.demo_url ? 'flex-1 sm:flex-1' : 'flex-1'}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full justify-center"
                            leftIcon={<GithubIcon className="w-3.5 h-3.5" />}
                          >
                            Source Code
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
