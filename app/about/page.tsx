import { Metadata } from 'next'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Newsletter } from '@/components/newsletter'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet Priya Sharma, the passionate home cook behind Spice & Simmer. Learn about our mission to bring bold Indian-American fusion flavors to busy home cooks.',
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
              About Spice & Simmer
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Where bold Indian spices meet American comfort food
            </p>
          </div>

          {/* Author Image */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary/20">
            <Image
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop"
              alt="Priya Sharma - Spice & Simmer founder"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif">
            <h2>Hi, I&apos;m Priya!</h2>
            <p>
              Welcome to Spice & Simmer! I&apos;m a first-generation Indian-American who grew up watching my mother transform simple ingredients into aromatic feasts. Now, as a busy professional and home cook, I&apos;ve made it my mission to bridge the gap between traditional Indian flavors and the practical needs of American home cooking.
            </p>

            <h2>Our Philosophy</h2>
            <p>
              I believe that bold, flavorful food shouldn&apos;t require hours in the kitchen or a trip to specialty stores. Every recipe here is designed with busy home cooks in mind — people who want exciting meals without the fuss. I take the vibrant spices and techniques from Indian cuisine and merge them with American comfort food favorites.
            </p>
            <p>
              The result? Butter Chicken Tacos. Tikka Masala Mac and Cheese. Masala Chai Brownies. Dishes that feel familiar yet exciting, comforting yet adventurous.
            </p>

            <h2>What You&apos;ll Find Here</h2>
            <ul>
              <li><strong>Fusion Recipes:</strong> Creative combinations that blend the best of both culinary worlds</li>
              <li><strong>Step-by-Step Guides:</strong> Detailed instructions with photos so you can cook with confidence</li>
              <li><strong>Time-Saving Tips:</strong> Meal prep strategies and shortcuts that don&apos;t compromise on flavor</li>
              <li><strong>Spice Education:</strong> Learn how to use Indian spices to transform any dish</li>
            </ul>

            <h2>My Promise to You</h2>
            <p>
              Every recipe on Spice & Simmer is tested multiple times in my home kitchen. I use ingredients you can find at your regular grocery store. And I never publish a recipe that I wouldn&apos;t proudly serve to my own family.
            </p>

            <h2>Let&apos;s Connect</h2>
            <p>
              I love hearing from fellow food lovers! Whether you have a question about a recipe, want to share your cooking wins, or just want to say hi, drop me a message through the{' '}
              <a href="/contact" className="text-primary hover:underline">contact page</a>.
            </p>
            <p>
              Happy cooking!<br />
              <em>— Priya</em>
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
