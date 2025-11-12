'use client'

import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import EducationSection from './sections/EducationSection'

export default function HomeSection() {
  return (
    <div className="w-full min-h-[calc(100vh-96px)] p-8 md:p-4">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12 md:gap-8">
        <HeroSection />
        {/* <AboutSection /> */}
        <SkillsSection />
        {/* <ProjectsSection /> */}
        <EducationSection />
      </div>
    </div>
  )
}
