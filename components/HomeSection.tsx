'use client'

import HeroSection from './sections/HeroSection'
import StatsSection from './sections/StatsSection'
import SkillsSection from './sections/SkillsSection'
import ExperienceSection from './sections/ExperienceSection'
import ProjectsSection from './sections/ProjectsSection'
import EducationSection from './sections/EducationSection'
import RecentTools from './RecentTools'

export default function HomeSection() {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-16 md:gap-20 py-4 px-4">
      <RecentTools />
      <HeroSection />
      <StatsSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />

      {/* Footer spacer */}
      <div className="pb-8" />
    </div>
  )
}
