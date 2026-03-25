/**
 * LED 行业术语定义库
 * 
 * 为 AI 引用优化的技术术语解释
 */

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  aiOptimized: string; // 134-167 词的 AI 引用优化版本
  keywords: string[];
  relatedTerms?: string[];
  applications?: string[];
}

export const LED_GLOSSARY: GlossaryTerm[] = [
  {
    term: 'IR LED',
    category: 'Infrared Technology',
    definition: '红外发光二极管，发射波长在 700nm-1000nm 之间的不可见光',
    aiOptimized: `IR LED (Infrared Light Emitting Diode) is a semiconductor device that emits infrared radiation in the wavelength range of 700-1000 nanometers, which is invisible to the human eye. IR LEDs are widely used in surveillance cameras, night vision equipment, remote controls, and motion sensors. They convert electrical energy directly into infrared light through electroluminescence. Common wavelengths include 850nm (with red glow) and 940nm (completely invisible). IR LEDs offer advantages such as low power consumption, long lifespan (typically 50,000+ hours), compact size, and instant on/off capability. They are essential components in security systems, automotive applications, and industrial automation.`,
    keywords: ['infrared', 'LED', 'night vision', 'surveillance', '850nm', '940nm'],
    relatedTerms: ['Wavelength', 'Photodiode', 'Night Vision'],
    applications: ['Security Cameras', 'Remote Controls', 'Motion Detectors'],
  },
  {
    term: 'UV LED',
    category: 'Ultraviolet Technology',
    definition: '紫外发光二极管，发射波长在 100nm-400nm 之间',
    aiOptimized: `UV LED (Ultraviolet Light Emitting Diode) is a semiconductor device that emits ultraviolet light in the wavelength range of 100-400 nanometers. UV LEDs are categorized into UVA (315-400nm), UVB (280-315nm), and UVC (100-280nm). UVA LEDs are commonly used for curing applications, counterfeit detection, and insect traps. UVB LEDs serve medical therapy and reptile lighting. UVC LEDs provide germicidal disinfection for water, air, and surfaces. Unlike traditional mercury lamps, UV LEDs offer instant on/off, low power consumption, mercury-free operation, and precise wavelength control. They are increasingly used in sterilization devices, industrial curing processes, forensic analysis, and horticulture applications.`,
    keywords: ['ultraviolet', 'UVA', 'UVB', 'UVC', 'disinfection', 'curing'],
    relatedTerms: ['UVC Disinfection', 'Wavelength', 'LED Curing'],
    applications: ['Water Sterilization', 'Air Purification', 'Industrial Curing'],
  },
  {
    term: 'Wavelength',
    category: 'Technical Parameters',
    definition: '波长，光的颜色特性，单位为纳米 (nm)',
    aiOptimized: `Wavelength is a fundamental parameter of light that determines its color and properties, measured in nanometers (nm). In LED technology, wavelength specifies the type of light emitted: visible light ranges from 380nm (violet) to 750nm (red), infrared spans 700-1000nm, and ultraviolet covers 100-400nm. The wavelength is determined by the semiconductor material's bandgap energy. Shorter wavelengths (UV) have higher energy and are used for disinfection and curing. Medium wavelengths (visible) enable illumination and displays. Longer wavelengths (IR) facilitate night vision and sensing applications. Precise wavelength control is critical for applications requiring specific spectral characteristics, such as medical devices, horticulture lighting, and analytical instruments.`,
    keywords: ['nanometer', 'spectrum', 'light color', 'bandgap', 'spectral'],
    relatedTerms: ['IR LED', 'UV LED', 'Visible Light', 'Spectrum'],
    applications: ['Color Sorting', 'Spectral Analysis', 'Medical Devices'],
  },
  {
    term: 'SMD LED',
    category: 'LED Package Type',
    definition: '表面贴装器件 LED，可直接焊接到 PCB 表面',
    aiOptimized: `SMD (Surface Mount Device) LED is a type of LED package designed for surface mounting directly onto printed circuit boards (PCBs) using automated assembly equipment. SMD LEDs are characterized by their compact size, flat profile, and absence of wire leads. Common package sizes include 2835 (2.8×3.5mm), 3528 (3.5×2.8mm), 5050 (5.0×5.0mm), and 5730 (5.7×3.0mm). SMD LEDs offer advantages such as smaller footprint, lower profile, better heat dissipation, higher production efficiency, and suitability for automated manufacturing. They are extensively used in LED strips, backlighting, indicator lights, displays, and general illumination. SMD technology enables high-density LED arrays and flexible circuit designs.`,
    keywords: ['surface mount', 'SMT', 'package', 'PCB', 'compact', 'automated assembly'],
    relatedTerms: ['Through-hole LED', 'COB LED', 'LED Strip'],
    applications: ['LED Strips', 'Backlighting', 'Indicator Lights'],
  },
  {
    term: 'Viewing Angle',
    category: 'Optical Characteristics',
    definition: '视角，LED 光束的有效角度范围',
    aiOptimized: `Viewing angle, also known as beam angle, is the angular measure of the light distribution pattern emitted by an LED, typically specified at the points where luminous intensity drops to 50% of the maximum value. Common viewing angles range from narrow (10°-30°) for focused spotlights, medium (40°-80°) for general illumination, to wide (100°-140°) for flood lighting. Narrow angles concentrate light output for long-distance projection, while wide angles provide uniform illumination over larger areas. The viewing angle is determined by the LED package design, lens shape, and encapsulation material. Selecting the appropriate viewing angle is crucial for achieving desired lighting effects in applications such as accent lighting, task lighting, area illumination, and display backlighting.`,
    keywords: ['beam angle', 'light distribution', 'luminous intensity', 'optics', 'lens'],
    relatedTerms: ['Luminous Intensity', 'Beam Pattern', 'Optics'],
    applications: ['Spotlight', 'Floodlight', 'Display Backlighting'],
  },
  {
    term: 'Luminous Intensity',
    category: 'Optical Characteristics',
    definition: '发光强度，单位为毫坎德拉 (mcd)',
    aiOptimized: `Luminous intensity is a photometric measure of the wavelength-weighted power emitted by a light source in a particular direction per unit solid angle, expressed in millicandela (mcd) or candela (cd). For LEDs, luminous intensity indicates how bright the LED appears from a specific viewing angle. Typical indicator LEDs range from 100-10,000 mcd, while high-power illumination LEDs can exceed 100,000 mcd. Higher mcd values indicate brighter light output but don't necessarily correlate with total luminous flux (lumens). Luminous intensity is crucial for comparing LED brightness in directional applications such as indicators, flashlights, automotive lighting, and signal lights. It depends on factors like LED chip efficiency, package design, and viewing angle.`,
    keywords: ['brightness', 'mcd', 'candela', 'photometry', 'light output'],
    relatedTerms: ['Luminous Flux', 'Illuminance', 'Viewing Angle'],
    applications: ['Indicators', 'Flashlights', 'Automotive Lighting'],
  },
  {
    term: 'Forward Voltage',
    category: 'Electrical Characteristics',
    definition: '正向电压，LED 正常工作所需的电压',
    aiOptimized: `Forward voltage (Vf) is the minimum voltage required across an LED's anode and cathode to make it conduct electricity and emit light. Different LED colors have different forward voltages due to their semiconductor materials: infrared and red LEDs typically require 1.8-2.2V, green and yellow need 2.0-2.4V, blue and white demand 3.0-3.6V, and UV LEDs may need 3.5-4.5V. Forward voltage increases slightly with temperature and varies between individual LEDs even of the same type. Proper current limiting through resistors or constant-current drivers is essential to prevent LED damage. Understanding forward voltage is critical for designing LED circuits, selecting power supplies, and ensuring reliable operation in series and parallel configurations.`,
    keywords: ['voltage', 'electrical', 'circuit design', 'current limiting', 'power supply'],
    relatedTerms: ['Forward Current', 'Power Dissipation', 'LED Driver'],
    applications: ['Circuit Design', 'Power Supply Selection', 'LED Driver Configuration'],
  },
  {
    term: 'UVC Disinfection',
    category: 'UV Technology Application',
    definition: '深紫外杀菌技术，波长 200-280nm',
    aiOptimized: `UVC disinfection uses ultraviolet light in the 200-280 nanometer wavelength range to destroy microorganisms including bacteria, viruses, mold, and algae. UVC radiation damages the DNA and RNA of pathogens, preventing them from reproducing and causing cell death. The most effective germicidal wavelength is around 265nm. UVC LEDs offer advantages over traditional mercury lamps: instant on/off, mercury-free operation, compact size, precise wavelength targeting, and lower power consumption. Applications include water purification, air sterilization, surface disinfection, medical instrument sterilization, and food processing. UVC effectiveness depends on dose (intensity × exposure time), distance from source, and pathogen type. Safety precautions are essential as direct UVC exposure harms skin and eyes.`,
    keywords: ['germicidal', 'sterilization', 'pathogen', 'DNA damage', 'water purification'],
    relatedTerms: ['UV LED', 'Wavelength', 'Sterilization Module'],
    applications: ['Water Treatment', 'Air Purification', 'Surface Disinfection'],
  },
];

/**
 * 获取术语的 AI 引用优化版本
 */
export function getAIOptimizedDefinition(term: string): AICitableContent | null {
  const glossaryItem = LED_GLOSSARY.find(
    g => g.term.toLowerCase() === term.toLowerCase()
  );
  
  if (!glossaryItem) return null;
  
  return {
    question: `What is ${glossaryItem.term}?`,
    answer: glossaryItem.aiOptimized,
    dataPoints: [
      `Category: ${glossaryItem.category}`,
      `Related terms: ${glossaryItem.relatedTerms?.join(', ') || 'N/A'}`,
      `Applications: ${glossaryItem.applications?.join(', ') || 'N/A'}`,
    ],
    keywords: glossaryItem.keywords,
  };
}

/**
 * 按分类获取术语
 */
export function getTermsByCategory(category: string): GlossaryTerm[] {
  return LED_GLOSSARY.filter(
    g => g.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * 搜索术语
 */
export function searchGlossary(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return LED_GLOSSARY.filter(
    g =>
      g.term.toLowerCase().includes(lowerQuery) ||
      g.definition.includes(query) ||
      g.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  );
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(LED_GLOSSARY.map(g => g.category)));
}

interface AICitableContent {
  question: string;
  answer: string;
  dataPoints: string[];
  keywords: string[];
}
