import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Megaphone, Utensils } from 'lucide-react';
import { useEffect } from 'react';

// Import Kshudha Nirvana Components
import KshudhaNirvanaHero from '../components/initiatives/KshudhaNirvanaHero';
import WhyKshudhaNirvana from '../components/initiatives/WhyKshudhaNirvana';
import DonationFlow from '../components/initiatives/DonationFlow';
import TransparencySection from '../components/initiatives/TransparencySection';
import DynamicSupportMission from '../components/initiatives/DynamicSupportMission';

// Import Women Empowerment Components
import WomenEmpowermentHero from '../components/initiatives/WomenEmpowermentHero';
import DefenceTheme from '../components/initiatives/DefenceTheme';
import ObjectivesSection from '../components/initiatives/ObjectivesSection';
import PhasesSection from '../components/initiatives/PhasesSection';
import WomenEmpowermentCTA from '../components/initiatives/WomenEmpowermentCTA';

// Import Public Speaking Components
import PublicSpeakingHero from '../components/initiatives/PublicSpeakingHero';
import SkillsSection from '../components/initiatives/SkillsSection';
import TrainingFormatsSection from '../components/initiatives/TrainingFormatsSection';
import BenefitsSection from '../components/initiatives/BenefitsSection';
import PublicSpeakingCTA from '../components/initiatives/PublicSpeakingCTA';

const initiativesData = {
  'women-empowerment': {
    title: 'Chains to Bridges: Women Empowerment',
    tagline: 'Breaking Chains, Making Bridges',
    icon: Users,
    color: 'from-pink-500 to-rose-600',
    tabColor: 'pink',
    description: 'Empowering women through self-defence, skill development, and awareness programs.',
    useCustomComponents: true,
    stats: [
      { value: '95%', label: 'Increased Confidence' },
      { value: '85%', label: 'Greater Autonomy' },
      { value: '40%', label: 'Economic Participation' }
    ],
    theme: {
      title: 'SELF DEFENCE',
      points: [
        { letter: 'D', word: 'Define', desc: 'Establishing identity & boundaries' },
        { letter: 'E', word: 'Empower', desc: 'Building inner and outer strength' },
        { letter: 'F', word: 'Function', desc: 'Operating independently in all spheres' },
        { letter: 'E', word: 'Efficiency', desc: 'Using resources wisely & effectively' },
        { letter: 'N', word: 'Negotiating', desc: 'Advocating for rights and needs' },
        { letter: 'C', word: 'Cater', desc: 'Addressing personal, social, and economic needs' },
        { letter: 'E', word: 'Exclusivity', desc: 'Protecting dignity and self-worth' }
      ]
    },
    objectives: [
      'Build real-life strength through self-defence and negotiation training',
      'Foster independence in decision-making',
      'Create awareness about legal rights and opportunities',
      'Enable financial and social self-resilience',
      'Protect basic rights and ensure access to resources'
    ],
    phases: [
      {
        title: 'Phase 1: Awareness',
        activities: ['Surveys & Storytelling', 'Safe Spaces Creation', 'Leadership Training', 'Skill Development Sessions']
      },
      {
        title: 'Phase 2: Agency & Skill Development',
        activities: ['Legal Literacy', 'Confidence Building', 'Mentorship Networks', 'Vocational Training']
      }
    ]
  },
  'public-speaking': {
    title: 'STEER: Public Speaking Workshop',
    tagline: 'Skill Training to Enable Employable Relevance',
    icon: Megaphone,
    color: 'from-blue-500 to-indigo-600',
    tabColor: 'blue',
    description: 'Developing communication skills, critical thinking, and professional capabilities through structured public speaking training.',
    useCustomComponents: true, // Added flag
    stats: [
      { value: '5+', label: 'Skills Developed' },
      { value: '100%', label: 'Certification Rate' },
      { value: '8+', label: 'Training Formats' }
    ],
    skills: [
      { name: 'Analytical Thinking', desc: 'Critical evaluation and logical conclusions' },
      { name: 'Language Proficiency', desc: 'Clarity and expression for effective communication' },
      { name: 'Research Methodology', desc: 'Efficient information gathering and evaluation' },
      { name: 'Room Judgment', desc: 'Dynamic presentation based on audience engagement' },
      { name: 'Categorization', desc: 'Organizing ideas logically for better structure' }
    ],
    formats: [
      'Fundamental Debate Skills',
      'Impromptu Speaking & Adaptability',
      'Formal Debate Procedures',
      'Model UN & Youth Parliament',
      'Professional Business Communication'
    ],
    benefits: [
      'Build leadership capabilities',
      'Earn reputed certifications',
      'Access prestigious institutions',
      'Develop clear career paths',
      'Acquire professional communication skills',
      'Understand workplace expectations'
    ]
  },
  'kshudha-nirvana': {
    title: 'Kshudha Nirvana: Fight Against Hunger',
    tagline: 'Every Rupee. Every Meal. Every Heartbeat Counts.',
    icon: Utensils,
    color: 'from-orange-500 to-red-600',
    tabColor: 'orange',
    useCustomComponents: true
  }
};

const tabs = [
  { slug: 'women-empowerment', label: 'Chains to Bridges', shortLabel: 'Women' },
  { slug: 'public-speaking', label: 'STEER', shortLabel: 'Speaking' },
  { slug: 'kshudha-nirvana', label: 'Kshudha Nirvana', shortLabel: 'Hunger' }
];

export default function InitiativesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const initiative = initiativesData[slug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!initiative) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Initiative Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Tabs Navigation Component (reusable)
  const TabsNavigation = () => (
    <div className="sticky top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 sm:gap-4 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const TabIcon = initiativesData[tab.slug].icon;
            const isActive = tab.slug === slug;
            const tabData = initiativesData[tab.slug];
            
            let colorClasses = 'bg-white text-gray-700 hover:bg-gray-100';
            if (isActive) {
              switch (tabData.tabColor) {
                case 'pink':
                  colorClasses = 'bg-gradient-to-r from-pink-500 to-rose-600 text-white';
                  break;
                case 'blue':
                  colorClasses = 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
                  break;
                case 'orange':
                  colorClasses = 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
                  break;
              }
            }

            return (
              <button
                key={tab.slug}
                onClick={() => navigate(`/initiatives/${tab.slug}`)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap shadow-sm ${colorClasses}`}
              >
                <TabIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // If Women Empowerment with custom components
  if (initiative.useCustomComponents && slug === 'women-empowerment') {
    return (
      <div className="min-h-screen bg-gray-50">
        <WomenEmpowermentHero onBackClick={() => navigate('/')} />
        <TabsNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <DefenceTheme />
          <ObjectivesSection />
          <PhasesSection />
          <WomenEmpowermentCTA 
            onDonateClick={() => navigate('/donations')}
            onContactClick={() => navigate('/contact')}
          />
        </div>
        <DynamicSupportMission initiative="women-empowerment" />
      </div>
    );
  }

  // If Public Speaking with custom components
  if (initiative.useCustomComponents && slug === 'public-speaking') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicSpeakingHero onBackClick={() => navigate('/')} />
        <TabsNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <SkillsSection />
          <TrainingFormatsSection />
          <BenefitsSection />
          <PublicSpeakingCTA 
            onDonateClick={() => navigate('/donations')}
            onContactClick={() => navigate('/contact')}
          />
        </div>
        <DynamicSupportMission initiative="public-speaking" />
      </div>
    );
  }

  // If Kshudha Nirvana, use custom components
  if (initiative.useCustomComponents && slug === 'kshudha-nirvana') {
    return (
      <div className="min-h-screen bg-white">
        <KshudhaNirvanaHero />
        <TabsNavigation />
        <WhyKshudhaNirvana />
        <DonationFlow />
        <TransparencySection />
        <DynamicSupportMission initiative="kshudha-nirvana" />
      </div>
    );
  }

  // Fallback (should not reach here with current setup)
  return null;
}