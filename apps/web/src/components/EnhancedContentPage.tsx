'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import AnimatedParticles from './AnimatedParticles'
import RGBBorder from './RGBBorder'
import ReadingProgress from './ReadingProgress'
import TableOfContents from './TableOfContents'
import Logo from './Logo'

export default function EnhancedContentPage({
  title,
  content,
  logo = true,
}: {
  title: string
  content: string
  logo?: boolean
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const sections = el.querySelectorAll('h1, h2, h3')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
          }
        })
      },
      { threshold: 0.15 }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [content])

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedParticles />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.06),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <ReadingProgress />
      <TableOfContents />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RGBBorder className="p-6 sm:p-8 lg:p-12">
            {logo && (
              <div className="mb-8">
                <Logo size="sm" />
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10">
              {title}
            </h1>

            <div
              ref={contentRef}
              id="page-content"
              className="enhanced-prose"
              dangerouslySetInnerHTML={{
                __html: content.replace(
                  /<(h[1-3])(\s[^>]*)?>/g,
                  (match, tag, attrs) => {
                    const rest = attrs || ''
                    return `<${tag}${rest} class="section-heading group relative" data-heading="true">`
                  }
                ),
              }}
            />
          </RGBBorder>
        </motion.div>
      </div>

      <style jsx global>{`
        .enhanced-prose {
          color: #d1d5db;
          line-height: 1.8;
          font-size: 1.0625rem;
        }
        .enhanced-prose h1,
        .enhanced-prose h2,
        .enhanced-prose h3 {
          color: #fff;
          font-weight: 600;
          letter-spacing: -0.01em;
          scroll-margin-top: 100px;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .enhanced-prose h1 { font-size: 1.75rem; margin-top: 2.5rem; margin-bottom: 1rem; }
        .enhanced-prose h2 { font-size: 1.4rem; margin-top: 2rem; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .enhanced-prose h3 { font-size: 1.15rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .enhanced-prose p { margin-bottom: 1.25rem; }
        .enhanced-prose ul, .enhanced-prose ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .enhanced-prose li { margin-bottom: 0.5rem; }
        .enhanced-prose a { color: #22d3ee; text-decoration: none; border-bottom: 1px solid rgba(34,211,238,0.2); transition: border-color 0.2s; }
        .enhanced-prose a:hover { border-color: rgba(34,211,238,0.6); }
        .enhanced-prose code {
          color: #22d3ee;
          background: rgba(31, 41, 55, 0.8);
          padding: 0.15rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.9em;
          font-family: 'JetBrains Mono', monospace;
        }
        .enhanced-prose pre {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid rgba(75, 85, 99, 0.3);
          border-radius: 0.75rem;
          padding: 1.25rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .enhanced-prose blockquote {
          border-left: 3px solid rgba(6, 182, 212, 0.5);
          padding-left: 1.25rem;
          color: #9ca3af;
          font-style: italic;
          margin: 1.5rem 0;
        }
        .enhanced-prose img { border-radius: 0.75rem; margin: 1.5rem 0; max-width: 100%; }
        .enhanced-prose hr { border-color: rgba(75,85,99,0.3); margin: 2rem 0; }
        .enhanced-prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .enhanced-prose th, .enhanced-prose td { padding: 0.75rem 1rem; border: 1px solid rgba(75,85,99,0.3); text-align: left; }
        .enhanced-prose th { background: rgba(31,41,55,0.5); color: #fff; font-weight: 500; }

        .section-heading {
          position: relative;
        }
        .section-heading::before {
          content: '#';
          position: absolute;
          left: -1.5rem;
          color: rgba(6, 182, 212, 0.3);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .section-heading:hover::before {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .enhanced-prose { font-size: 1rem; }
          .enhanced-prose h1 { font-size: 1.5rem; }
          .enhanced-prose h2 { font-size: 1.25rem; }
          .enhanced-prose h3 { font-size: 1.05rem; }
        }
      `}</style>
    </div>
  )
}
