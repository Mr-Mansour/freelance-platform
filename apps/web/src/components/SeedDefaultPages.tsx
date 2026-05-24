'use client'

import { useEffect } from 'react'

const PAGE_TEMPLATES = [
  { title: 'Privacy Policy', slug: 'privacy-policy', content: '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, post a project, or communicate with other users.</p><h2>How We Use Your Information</h2><p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p><h2>Data Protection</h2><p>We implement industry-standard security measures to protect your data.</p><h2>Contact</h2><p>For any privacy-related inquiries, contact us through our support channels.</p>' },
  { title: 'Terms of Service', slug: 'terms-of-service', content: '<h1>Terms of Service</h1><p>By using Cybrion, you agree to these terms. Please read them carefully.</p><h2>Acceptance of Terms</h2><p>By accessing and using this platform, you accept and agree to be bound by these terms.</p><h2>User Responsibilities</h2><p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.</p><h2>Payment Terms</h2><p>All payments are processed securely through our escrow system. Funds are released only when work is approved by both parties.</p><h2>Termination</h2><p>We reserve the right to suspend or terminate accounts that violate these terms.</p>' },
  { title: 'Cookie Policy', slug: 'cookie-policy', content: '<h1>Cookie Policy</h1><p>This Cookie Policy explains how Cybrion uses cookies and similar technologies.</p><h2>What Are Cookies</h2><p>Cookies are small text files stored on your device when you visit a website.</p><h2>How We Use Cookies</h2><p>We use cookies to improve your experience, analyze traffic, and provide personalized content.</p><h2>Managing Cookies</h2><p>You can control and manage cookies in your browser settings.</p>' },
  { title: 'GDPR Compliance', slug: 'gdpr', content: '<h1>GDPR Compliance</h1><p>We are committed to protecting the privacy rights of individuals in the European Union.</p><h2>Your Rights</h2><p>Under GDPR, you have the right to access, rectify, erase, and port your data.</p><h2>Data Processing</h2><p>We process personal data only for specified, explicit, and legitimate purposes.</p><h2>Data Protection Officer</h2><p>Contact our DPO for any GDPR-related inquiries.</p>' },
  { title: 'Data Processing Agreement', slug: 'dpa', content: '<h1>Data Processing Agreement</h1><p>This Data Processing Agreement governs the processing of personal data by Cybrion on behalf of its users.</p><h2>Scope</h2><p>This DPA applies to all processing of personal data carried out by Cybrion.</p><h2>Security Measures</h2><p>We implement appropriate technical and organizational measures to ensure data security.</p><h2>Sub-processors</h2><p>We maintain a list of authorized sub-processors and will notify you of any changes.</p>' },
]

export default function SeedDefaultPages() {
  useEffect(() => {
    const stored = localStorage.getItem('cybrion_custom_pages')
    if (!stored || JSON.parse(stored).length === 0) {
      const defaultPages = PAGE_TEMPLATES.map((t, i) => ({
        id: `default-${i}`,
        ...t,
        published: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }))
      localStorage.setItem('cybrion_custom_pages', JSON.stringify(defaultPages))
    }
  }, [])

  return null
}
