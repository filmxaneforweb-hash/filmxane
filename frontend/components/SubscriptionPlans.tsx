'use client'

import { useState } from 'react'
// import { div } from 'framer-div' // SSR sorunu nedeniyle kaldırıldı
import { Crown, Star, Zap, Users, Shield, Download, Check, ChevronRight } from 'lucide-react'

export function SubscriptionPlans() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = (planId: string, planName: string) => {
    // TODO: Implement actual subscription logic
    console.log(`Subscribing to ${planName} (${planId}) - ${selectedPeriod}`)
    
    // Show success message or redirect to payment
    alert(`Tevlî ${planName} bû! Ji kerema xwe pereyan bidin.`)
  }

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
    console.log('Contacting support...')
    alert('Ji kerema xwe bi me re têkilî daynin: support@filmxane.com')
  }

  const plans = [
    {
      id: 'basic',
      name: 'Bingehîn',
      price: selectedPeriod === 'monthly' ? '29.99' : '299.99',
      originalPrice: selectedPeriod === 'monthly' ? '39.99' : '399.99',
      description: 'Ji bo kullanıcıyên yekane',
      features: [
        'HD kalîteya vîdyo',
        '2 cîhazên eynî dem',
        'Naveroka standard',
        'Altyazîya kurdî',
        'Bê reklam'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      price: selectedPeriod === 'monthly' ? '49.99' : '499.99',
      originalPrice: selectedPeriod === 'monthly' ? '59.99' : '599.99',
      description: 'Ji bo malbata te',
      features: [
        'Full HD kalîteya vîdyo',
        '4 cîhazên eynî dem',
        'Naveroka premium',
        'Altyazîya çend zimanan',
        'Daxistina offline',
        'Bê reklam'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: selectedPeriod === 'monthly' ? '79.99' : '799.99',
      originalPrice: selectedPeriod === 'monthly' ? '89.99' : '899.99',
      description: 'Ji bo kullanıcıyên profesyonel',
      features: [
        '4K + HDR kalîteya vîdyo',
        '6 cîhazên eynî dem',
        'Naveroka eksklusîf',
        'Altyazîya hemû zimanan',
        'Daxistina offline',
        'Dolby Atmos',
        'Bê reklam'
      ],
      popular: false
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-8 max-w-7xl mx-auto">
        {/* Modern section header with enhanced styling */}
        <div 
          className="text-center mb-16"

        >
          {/* Modern section header with enhanced styling */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div 
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl"

            >
              <Crown className="w-8 h-8 text-white" />
            </div>
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
            <button
              onClick={() => setSelectedPeriod(selectedPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 shadow-lg ${
                selectedPeriod === 'yearly' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-slate-700'
              }`}

            >
              <span
                className="inline-block h-8 w-8 transform rounded-full bg-white shadow-md"

              />
            </button>
            <div className="text-left">
              <span className={`text-lg font-medium transition-colors duration-300 ${selectedPeriod === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                Salane
              </span>
              <div className="text-red-400 text-sm font-medium">
                20% kêmkirin
              </div>
            </div>
          </div>
        </div>

        {/* Modern plan cards with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.popular
            return (
              <div
                key={plan.id}

                className="relative group"
              >
                {/* Popular badge */}
                {isPopular && (
                  <div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"

                  >
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl shadow-red-500/25 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Pir Navdar
                    </div>
                  </div>
                )}

                {/* Plan card */}
                <div
                  className={`relative p-8 rounded-3xl border-2 transition-all duration-500 group-hover:scale-105 ${
                    isPopular
                      ? 'border-red-500/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm transform scale-105 shadow-2xl shadow-red-500/20'
                      : `border-slate-600/30 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm hover:border-slate-500/50 hover:shadow-2xl`
                  }`}

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
                    {plan.originalPrice !== plan.price && (
                      <div className="text-slate-500 line-through text-lg">
                        {plan.originalPrice} Lîre
                      </div>
                    )}
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}

                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe button */}
                  <button
                    onClick={() => handleSubscribe(plan.id, plan.name)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
                    }`}

                  >
                    <span>Abone Bibe</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Need Help Section */}
        <div 
          className="text-center mt-16"

        >
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Alîkariya te heye?</h3>
            <p className="text-slate-400 mb-6">
              Eger pirsgirêkek hebe an jî alîkariya te hewce be, bi me re têkilî daynin.
            </p>
            <button
              onClick={handleContactSupport}
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 border border-slate-600 hover:border-slate-500"

            >
              Alîkariya Bixwaze
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
