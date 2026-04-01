import { useEffect } from 'react';
import gsap from 'gsap';
import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import Cloud from 'lucide-react/dist/esm/icons/cloud'
import Database from 'lucide-react/dist/esm/icons/database'
import Github from 'lucide-react/dist/esm/icons/github'
import Bot from 'lucide-react/dist/esm/icons/bot'
import Code from 'lucide-react/dist/esm/icons/code'
import Palette from 'lucide-react/dist/esm/icons/palette'
import Video from 'lucide-react/dist/esm/icons/video'
import FileText from 'lucide-react/dist/esm/icons/file-text'
import MessageSquare from 'lucide-react/dist/esm/icons/message-square'
import Zap from 'lucide-react/dist/esm/icons/zap'
import Cpu from 'lucide-react/dist/esm/icons/cpu'
import Layers from 'lucide-react/dist/esm/icons/layers';

const techCategories = [
  {
    title: 'Infraestructura & Deploy',
    icon: Cloud,
    tools: [
      { name: 'Oracle Cloud', icon: Cloud },
      { name: 'CapRover', icon: Layers },
      { name: 'Supabase', icon: Database },
      { name: 'GitHub', icon: Github },
    ],
  },
  {
    title: 'IA & Agentes',
    icon: Bot,
    tools: [
      { name: 'Google Gemini', icon: Cpu },
      { name: 'Claude', icon: Bot },
      { name: 'Perplexity', icon: Zap },
      { name: 'NotebookLM', icon: FileText },
    ],
  },
  {
    title: 'Desarrollo Web',
    icon: Code,
    tools: [
      { name: 'React', icon: Code },
      { name: 'Python', icon: Cpu },
      { name: 'Streamlit', icon: Layers },
      { name: 'Tailwind', icon: Palette },
    ],
  },
  {
    title: 'Diseño Gráfico',
    icon: Palette,
    tools: [
      { name: 'Figma', icon: Palette },
      { name: 'Photoshop', icon: Layers },
      { name: 'Affinity', icon: Palette },
      { name: 'Canva', icon: Video },
    ],
  },
  {
    title: 'Video & Contenido',
    icon: Video,
    tools: [
      { name: 'CapCut', icon: Video },
      { name: 'Filmora', icon: Video },
      { name: 'After Effects', icon: Layers },
      { name: 'Premiere', icon: Video },
    ],
  },
  {
    title: 'Gestión & Ops',
    icon: FileText,
    tools: [
      { name: 'Notion', icon: FileText },
      { name: 'Linear', icon: Zap },
      { name: 'Slack', icon: MessageSquare },
      { name: 'Drive', icon: Cloud },
    ],
  },
  {
    title: 'Automatización',
    icon: Zap,
    tools: [
      { name: 'n8n', icon: Zap },
      { name: 'WhatsApp API', icon: MessageSquare },
      { name: 'Zapier', icon: Zap },
      { name: 'Make', icon: Layers },
    ],
  },
];

export default function TechStack() {
  const [sectionRef] = useReveal<HTMLDivElement>();
  const gridRef = useRevealGroup<HTMLDivElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Infinite scroll animation for tools
      gsap.to('.tools-marquee', {
        x: '-50%',
        duration: 30,
        ease: 'none',
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-ag-bg-primary overflow-hidden"
      aria-labelledby="stack-title"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ag-blue/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="stack-eyebrow eyebrow mb-4 inline-flex reveal-fade">
            <Cpu className="w-3 h-3 text-ag-blue" />
            STACK TECNOLÓGICO
          </span>
          <h2 id="stack-title" className="stack-title font-display text-display-3 lg:text-display-2 text-white reveal-up">
            Herramientas de
            <span className="gradient-text"> élite</span>
          </h2>
          <p className="text-ag-text-gray mt-4 max-w-2xl mx-auto reveal-up">
            Tecnología de punta para resultados de punta. Cada herramienta seleccionada 
            por su capacidad de entregar más, mejor y más rápido.
          </p>
        </div>

        {/* Categories Grid - Scrollable on mobile */}
        <div ref={gridRef} className="stack-grid flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory hide-scrollbar reveal-group">
          {techCategories.map((category, catIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={catIndex}
                className="stack-category flex-shrink-0 w-[280px] lg:w-auto snap-center glass-card p-6 group hover:border-ag-blue/30 transition-colors duration-300 reveal-child"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ag-blue/10 flex items-center justify-center group-hover:bg-ag-blue/20 transition-colors">
                    <CategoryIcon className="w-5 h-5 text-ag-blue" />
                  </div>
                  <h3 className="font-display text-sm text-white">{category.title}</h3>
                </div>

                {/* Tools List */}
                <div className="space-y-2">
                  {category.tools.map((tool, toolIndex) => {
                    const ToolIcon = tool.icon;
                    return (
                      <div
                        key={toolIndex}
                        className="flex items-center gap-2 text-ag-text-gray text-sm group/tool hover:text-white transition-colors"
                      >
                        <ToolIcon className="w-4 h-4 text-ag-text-muted group-hover/tool:text-ag-blue transition-colors" />
                        <span>{tool.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Marquee of tools */}
        <div className="mt-16 overflow-hidden">
          <div className="tools-marquee flex gap-8 whitespace-nowrap">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-8">
                {techCategories.flatMap(cat => cat.tools).map((tool, i) => (
                  <span
                    key={`${setIndex}-${i}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-ag-text-gray text-sm"
                  >
                    <Zap className="w-4 h-4 text-ag-blue" />
                    {tool.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
