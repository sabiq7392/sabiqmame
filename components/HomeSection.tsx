'use client'

import HeroSection from './sections/HeroSection'
import SkillsSection from './sections/SkillsSection'
import EducationSection from './sections/EducationSection'
import ExperienceSection from './sections/ExperienceSection'
import RecentTools from './RecentTools'

export default function HomeSection() {
  return (
    <div className="w-full min-h-[calc(100vh-96px)] p-4 max-w-[1500px] mx-auto flex flex-col gap-12 md:gap-8">
      <RecentTools />
      <HeroSection />
      {/* <AboutSection /> */}
      <SkillsSection />
      <ExperienceSection />
      {/* <ProjectsSection /> */}
      <EducationSection />
    </div>
  )
}
