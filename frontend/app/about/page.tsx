import { motion } from 'framer-motion'
import { Film, Users, Globe, Heart, Award, Star } from 'lucide-react'

export default function AboutPage() {
  const handleContactClick = () => {
    // TODO: Implement contact functionality
    console.log('Contact button clicked')
    alert('Ji kerema xwe bi me re têkilî daynin: info@filmxane.com')
  }

  const features = [
    {
      icon: Film,
      title: 'Naveroka Ciwan',
      description: 'Herî baştirîn fîlm û rêzefîlmên kurdî û cîhanî'
    },
    {
      icon: Users,
      title: 'Civaka Mezin',
      description: 'Bi hezaran endamên kurd û cîhanî'
    },
    {
      icon: Globe,
      title: 'Zimanên Pir',
      description: 'Altyazî û dub bi çend zimanan'
    },
    {
      icon: Heart,
      title: 'Kultûra Kurdî',
      description: 'Parastina û belavkirina kultûra kurdî'
    },
    {
      icon: Award,
      title: 'Kalîteya Bilind',
      description: 'HD, 4K û HDR kalîteya vîdyo'
    },
    {
      icon: Star,
      title: 'Pêşniyaren Şexsî',
      description: 'Algoritma AI ji bo pêşniyaren şexsî'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20">
      {/* Hero Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
              Derbarê Me
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Filmxane, platformeke vîdyo ya kurdî ye ku dixwaze kultûra kurdî û cîhanî belav bike
          </motion.p>
          <motion.button
            onClick={handleContactClick}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Bi Me Re Têkilî Daynin
          </motion.button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-white mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Taybetmendiyên Me
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group hover:scale-105"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-12 border border-slate-600/30 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Mîsyona Me</h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Em dixwazin platformeke vîdyo ya kurdî ava bikin ku hemû kurd û hevalên kurdan 
              dikarin fîlm û rêzefîlmên xwe yên herî baş temaşe bikin. Em dixwazin kultûra kurdî 
              belav bikin û cîhanê bi vê kultûra dewlemend nas bikin.
            </p>
            <p className="text-slate-400">
              Bi hevra, em dikarin çêbikin platformeke mezin û dewlemend ji bo hemû kurdan.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
