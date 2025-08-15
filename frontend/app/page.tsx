import { Hero } from '@/components/Hero'
import { Navigation } from '@/components/Navigation'
import { VideoRow } from '@/components/VideoRow'
import { Categories } from '@/components/Categories'
import { SubscriptionPlans } from '@/components/SubscriptionPlans'
import { getVideoCategories, getFeaturedVideo } from '@/lib/data'

export default function HomePage() {
  const videoCategories = getVideoCategories()
  const featuredVideo = getFeaturedVideo()

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <Hero featuredVideo={featuredVideo} />
      
      {/* Main Content with modern spacing */}
      <div className="relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.03),transparent_70%)]" />
        
        {/* Content sections */}
        <div className="relative z-10 space-y-0">
          {/* Video Rows - Netflix tarzı with enhanced spacing */}
          {videoCategories.map((category, index) => (
            <VideoRow
              key={category.id}
              title={category.title}
              videos={category.videos}
              category={category.name}
              showProgress={category.showProgress}
              className={index % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-800/10'}
            />
          ))}
          
          {/* Categories with modern design */}
          <Categories />
          
          {/* Subscription Plans with enhanced styling */}
          <SubscriptionPlans />
        </div>
      </div>
    </main>
  )
}
