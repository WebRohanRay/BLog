import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Newsletter } from '@/components/newsletter'
import { ChefHat, Globe, BookOpen, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Spice & Simmer — our mission is to make Indian food approachable, exciting and globally inspired for every home cook.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
              About Spice &amp; Simmer
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Making Indian food familiar, exciting, and accessible to everyone — with a touch of the world
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-12 border border-border">
            <Image
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&h=400&fit=crop"
              alt="Indian spices and cooking ingredients"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <p className="text-white font-serif text-xl font-semibold">
                "Indian flavors, inspired by the world"
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif mb-12">
            <h2>Our Story</h2>
            <p>
              Spice &amp; Simmer was born from a simple belief: Indian food is one of the most flavour-rich, 
              deeply satisfying cuisines on earth — and it deserves to be enjoyed by everyone, everywhere. 
              We combine traditional Indian techniques and spices with ideas drawn from kitchens all around 
              the world, creating dishes that feel both deeply familiar and wonderfully new.
            </p>

            <h2>Our Philosophy</h2>
            <p>
              Great food should not require a culinary degree or a specialty ingredient shop. Every recipe 
              here is designed to be achievable in a home kitchen, using spices and produce you can find 
              at any good grocery store. We believe that bold flavour and everyday cooking can — and should — 
              go hand in hand.
            </p>
            <p>
              The result is food that surprises you. Dishes that carry the warmth of an Indian kitchen but 
              borrow from Thai, Mediterranean, Mexican, Japanese, and other global traditions to create 
              something entirely their own.
            </p>

            <h2>What You&apos;ll Find Here</h2>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              {
                icon: ChefHat,
                title: 'Authentic Indian Roots',
                desc: 'Every recipe starts with true Indian flavours — the spices, techniques and soul that make this cuisine so special.'
              },
              {
                icon: Globe,
                title: 'Global Inspirations',
                desc: 'We draw from cuisines around the world to create fusion dishes that are exciting, fresh and endlessly interesting.'
              },
              {
                icon: BookOpen,
                title: 'Step-by-Step Guides',
                desc: 'Clear, detailed instructions with tips at every stage so you can cook with confidence, whatever your skill level.'
              },
              {
                icon: Sparkles,
                title: 'Spice Education',
                desc: 'Learn how Indian spices work and how to use them to transform any dish — Indian or otherwise.'
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 bg-muted/50 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-serif mb-12">
            <h2>Our Promise</h2>
            <p>
              Every recipe published here is tested in a real home kitchen. We only publish recipes we 
              would be proud to serve to family and friends. Honest food, honestly made.
            </p>
            <p>
              Have a question or want to share your experience?{' '}
              <Link href="/contact" className="text-primary hover:underline">Get in touch</Link> — 
              we love hearing from fellow food lovers.
            </p>
          </div>

          {/* Newsletter */}
          <div className="mt-16">
            <Newsletter />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
