import { useState, useEffect } from 'react'
import { CVData, defaultCVData } from '@/data/cv-maker.data'
import { SectionId, DEFAULT_SECTION_ORDER } from '@/utils/cv-section-order'

const STORAGE_KEY = 'cv-maker-data'
const SECTION_ORDER_KEY = 'cv-section-order'

export function useCVStorage() {
  const [cvData, setCvData] = useState<CVData>(defaultCVData)
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(DEFAULT_SECTION_ORDER)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure this only runs on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    if (!isClient) return

    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setCvData(parsedData)
      } catch (error) {
        console.error('Error loading saved CV data:', error)
      }
    }

    const savedOrder = localStorage.getItem(SECTION_ORDER_KEY)
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder)
        setSectionOrder(parsedOrder)
      } catch (error) {
        console.error('Error loading saved section order:', error)
      }
    }

    setIsLoaded(true)
  }, [isClient])

  // Save data to localStorage
  const saveToLocalStorage = (data: CVData) => {
    if (!isClient) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setCvData(data)
    } catch (error) {
      console.error('Error saving CV data to localStorage:', error)
    }
  }

  // Save section order to localStorage
  const saveSectionOrder = (order: SectionId[]) => {
    if (!isClient) return

    try {
      localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(order))
      setSectionOrder(order)
    } catch (error) {
      console.error('Error saving section order:', error)
    }
  }

  return {
    cvData,
    setCvData,
    saveToLocalStorage,
    sectionOrder,
    setSectionOrder,
    saveSectionOrder,
    isLoaded,
    isClient,
  }
}

