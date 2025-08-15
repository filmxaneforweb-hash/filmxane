'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Crown, Check, Star, Zap, Shield, Download, Users } from 'lucide-react'

interface Feature {
  type: string
  value: boolean | number | string
  description: string
  displayName: string
  icon?: React.ComponentType<any>
}

interface Plan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  features: Feature[]
  popular?: boolean
  color: string
}

export function SubscriptionPlans() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Plana Bingehîn',
      price: selectedPeriod === 'monthly' ? 29 : 290,
      period: selectedPeriod,
      color: 'from-slate-500 to-gray-600',
      features: [
        {
          type: 'video_quality',
          value: '720p',
          description: 'Kalîteya 720p',
          displayName: 'Kalîteya Vîdyoyê',
          icon: Zap
        },
        {
          type: 'profiles',
          value: 2,
          description: '2 profîl',
          displayName: 'Profîlên',
          icon: Users
        },
        {
          type: 'ad_free',
          value: true,
          description: 'Tu reklam tune',
          displayName: 'Bê Reklam',
          icon: Shield
        }
      ]
    },
    {
      id: 'standard',
      name: 'Plana Standard',
      price: selectedPeriod === 'monthly' ? 49 : 490,
      period: selectedPeriod,
      color: 'from-red-500 to-pink-500',
      features: [
        {
          type: 'video_quality',
          value: '1080p',
          description: 'Kalîteya 1080p',
          displayName: 'Kalîteya Vîdyoyê',
          icon: Zap
        },
        {
          type: 'profiles',
          value: 4,
          description: '4 profîl',
          displayName: 'Profîlên',
          icon: Users
        },
        {
          type: 'ad_free',
          value: true,
          description: 'Tu reklam tune',
          displayName: 'Bê Reklam',
          icon: Shield
        },
        {
          type: 'download',
          value: true,
          description: 'Daxistin ji bo nexşe',
          displayName: 'Daxistin',
          icon: Download
        }
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Plana Premium',
      price: selectedPeriod === 'monthly' ? 79 : 790,
      period: selectedPeriod,
      color: 'from-purple-500 to-indigo-500',
      features: [
        {
          type: 'video_quality',
          value: '4K+HDR',
          description: 'Kalîteya 4K + HDR',
          displayName: 'Kalîteya Vîdyoyê',
          icon: Zap
        },
        {
          type: 'profiles',
          value: 6,
          description: '6 profîl',
          displayName: 'Profîlên',
          icon: Users
        },
        {
          type: 'ad_free',
          value: true,
          description: 'Tu reklam tune',
          displayName: 'Bê Reklam',
          icon: Shield
        },
        {
          type: 'download',
          value: true,
          description: 'Daxistin ji bo nexşe',
          displayName: 'Daxistin',
          icon: Download
        },
        {
          type: 'exclusive_content',
          value: true,
          description: 'Destpêgihêştina aksesûran',
          displayName: 'Naveroka Taybet',
          icon: Crown
        }
      ]
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Modern section header with enhanced styling */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                Plansên Abonementê
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Plana guncan ji bo pêdiviyên te hilbijêre
              </p>
            </div>
          </div>
          
          {/* Enhanced Period Toggle with modern design */}
          <div className="flex items-center justify-center space-x-6 mb-12">
            <span className={`text-lg font-medium transition-colors duration-300 ${selectedPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Mehane
            </span>
            <motion.button
              onClick={() => setSelectedPeriod(selectedPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 shadow-lg ${
                selectedPeriod === 'yearly' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-slate-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-8 w-8 transform rounded-full bg-white shadow-md"
                animate={{
                  x: selectedPeriod === 'yearly' ? 44 : 4
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <div className="text-left">
              <span className={`text-lg font-medium transition-colors duration-300 ${selectedPeriod === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                Salane
              </span>
              <div className="text-red-400 text-sm font-medium">
                20% kêmkirin
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modern plan cards with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.popular
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                {/* Popular badge */}
                {isPopular && (
                  <motion.div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                  >
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl shadow-red-500/25 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Pir Navdar
                    </div>
                  </motion.div>
                )}

                {/* Plan card */}
                <motion.div
                  className={`relative p-8 rounded-3xl border-2 transition-all duration-500 group-hover:scale-105 ${
                    isPopular
                      ? 'border-red-500/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm transform scale-105 shadow-2xl shadow-red-500/20'
                      : `border-slate-600/30 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm hover:border-slate-500/50 hover:shadow-2xl`
                  }`}
                  whileHover={{ y: -8 }}
                >
                  {/* Background glow effect */}
                  {isPopular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-3xl" />
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 ml-3 text-lg font-medium">
                        {selectedPeriod === 'monthly' ? 'Lîre/meh' : 'Lîre/sal'}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced features list */}
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => {
                      const FeatureIcon = feature.icon || Check
                      return (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-center text-slate-300 text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.2 + featureIndex * 0.1 }}
                        >
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <FeatureIcon className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="flex-1 font-medium">{feature.displayName}</span>
                          <div className="text-xs text-slate-500 ml-3 font-semibold">
                            {typeof feature.value === 'boolean' && (
                              <span className={feature.value ? 'text-green-400' : 'text-red-400'}>
                                {feature.value ? '✓' : '✗'}
                              </span>
                            )}
                            {typeof feature.value === 'number' && (
                              <span className="text-blue-400">{feature.value}</span>
                            )}
                            {typeof feature.value === 'string' && (
                              <span className="text-purple-400">{feature.value}</span>
                            )}
                          </div>
                        </motion.li>
                      )
                    })}
                  </ul>

                  {/* Enhanced CTA button */}
                  <motion.button
                    className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 text-lg shadow-lg ${
                      isPopular
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-500/25 hover:shadow-red-500/40'
                        : 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white hover:shadow-slate-500/25'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Plana Hilbijêre
                  </motion.button>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Modern "Need Help?" section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-slate-400 text-lg mb-6">
            Pirsgirêkek heye? Em alîkarîya te dikin
          </p>
          <motion.button
            className="px-8 py-3 bg-slate-800/40 backdrop-blur-sm text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/40 font-medium"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Alîkarîya Me → 
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
