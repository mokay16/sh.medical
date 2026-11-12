import fs from 'fs'
import path from 'path'
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: the administrative team, as listed on sh.health, for the About page.
const STAFF: { slug: string; name: string; jobTitle: string; bio: string[]; order: number }[] = [
  {
    "slug": "alex-aruliah",
    "name": "Alex Aruliah",
    "jobTitle": "Chief Administrative Officer",
    "bio": [
      "Alex Aruliah is a distinguished healthcare executive with over two decades of comprehensive experience spanning executive leadership, healthcare operations, and medical billing. With a Master’s in Business Administration, Alex has successfully led strategic and operational functions across multiple healthcare organizations, including serving as Director of Operations in prior roles.",
      "In his current position as Chief Administrative Officer at SH Medical, Alex provides exceptional leadership across the organization. He oversees a multidisciplinary team, driving the alignment of administrative functions with clinical operations to ensure operational excellence, patient satisfaction, and sustainable growth. His deep expertise in medical billing and revenue cycle management continues to be a critical asset in ensuring financial precision and strengthening the organization’s fiscal health.",
      "Under Alex’s strategic leadership, SH Medical has achieved a fivefold expansion—an outcome fueled by his ability to scale systems, lead change, and build high-performing teams. His approach to executive leadership combines data-driven decision-making with a deep commitment to patient-centered care.",
      "Alex’s role transcends traditional administration; he is a catalyst for innovation and continuous improvement across the organization. With a strong foundation in both strategic planning and hands-on execution, he remains at the forefront of driving organizational success in today’s complex healthcare environment."
    ],
    "order": 1
  },
  {
    "slug": "wendy-zhu",
    "name": "Wendy Zhu",
    "jobTitle": "Physician Assistant · Clinical Research",
    "bio": [
      "Wendy’s journey with SH Medical began as a dedicated medical assistant and scribe, where she showcased her passion for healthcare. Wendy pursued her degree at the University of Washington, and returned to SH Medical in 2023 after graduating her PA program. Wendy has seamlessly transitioned into her new role, blending her past experiences with newfound knowledge.",
      "Wendy’s contributions extend far and wide within our practice. Her involvement in managing clinical research trials has been instrumental in obtaining FDA approval for various medical devices, showcasing her commitment to advancing healthcare. Additionally, Wendy spearheaded our Nightlase program, a short in-office procedure proven to reduce snoring.",
      "Beyond her administrative and research roles, Wendy is deeply invested in patient care. She takes pride in establishing meaningful connections with our patients through offering compassionate and personalized treatment plans. With her diverse skill set and unwavering dedication, Wendy embodies the spirit of SH Medical, continuously striving to elevate the standard of care for all. Wendy is also fluent in Cantonese."
    ],
    "order": 2
  },
  {
    "slug": "sally-weiss",
    "name": "Sally Weiss",
    "jobTitle": "Patient Care Concierge, Audiology",
    "bio": [
      "Sally Weiss joined SH Medical almost 30 years ago when there were less than 5 providers and only one location. She has dedicated her professional life to the audiology field and works daily as the Patient Care Concierge of our audiology department. In her time with SH Medical, Sally has worked in almost every position and helped to hire and onboard more than half of our providers. She has helped to build our practice into what it is today and uses her extensive knowledge of healthcare management and hearing health to provide the best possible experience for our patients and staff."
    ],
    "order": 3
  },
  {
    "slug": "joyce-carter-zeigler",
    "name": "Joyce Carter-Zeigler",
    "jobTitle": "",
    "bio": [
      "I was born and raised in Berkeley, CA. I received my LPN degree from Norfolk Medical College in Norfolk, VA. I received my BA in Healthcare Management from Cal State Hayward and my MS in HR Management from USC. I have over 15 years of combined expertise in the medical field, including managing high-performing practices, human resources management, and revenue cycle management. I partnered with the physicians of the practice to develop business strategies, formulate budgets, and manage daily operations. I am also involved in medical missions with my church, donating my time and expertise in clinics and hospitals. I have been to Haiti, the Dominican Republic, and Africa. I enjoy spending time with my family and showing dogs on the weekend."
    ],
    "order": 4
  },
  {
    "slug": "jason-gomes",
    "name": "Jason Gomes",
    "jobTitle": "Billing & EHR Manager",
    "bio": [
      "Jason Gomes came to SH Medical over 7 years ago and has over 15 years of experience in billing with knowledge in Radiology, Allergy, Audiology and ENT. He is the Billing and EHR Manager for the practice, overseeing AR and communicating denials and trends to providers for improved coding and billing feedback. Jason works hard to ensure the best billing experience possible for patients and SH Medical."
    ],
    "order": 5
  },
  {
    "slug": "navnit-kaur",
    "name": "Navnit Kaur",
    "jobTitle": "Healthcare Department Manager, Allergy, Asthma & Immunology",
    "bio": [
      "Navnit Kaur is an accomplished professional deeply committed to healthcare management and improving patient outcomes. With a Bachelor’s degree in Healthcare Administration from George Mason University, she has dedicated her career to enhancing healthcare operations, always prioritizing high-quality, efficient, and patient-centered care. Currently, she excels as the Healthcare Department Manager for Allergy, Asthma, and Immunology."
    ],
    "order": 6
  },
  {
    "slug": "heather-olk",
    "name": "Heather Olk",
    "jobTitle": "Healthcare Department Manager, Sleep & Plastics",
    "bio": [
      "I am thrilled to join the SH Medical team as a Healthcare Department Manager, supporting the Sleep and Plastics departments at the new surgery center. I have spent the last 15 years in dental management and am eager to start this new chapter in the medical sector. Originally from Denver, Colorado, I moved to San Francisco 14 years ago and have loved calling the Bay Area home ever since. Outside of work, I enjoy traveling, hiking local trails, and hosting dinner parties with friends."
    ],
    "order": 7
  },
  {
    "slug": "jaymie-zimmerman",
    "name": "Jaymie Zimmerman",
    "jobTitle": "Business Manager",
    "bio": [
      "Jaymie Zimmerman serves as the Business Manager at SH Medical, bringing extensive experience in healthcare operations, patient experience, and practice development. She joined the group in 2019 and has worked in healthcare since 2017, gaining hands-on experience in roles ranging from front desk and back office to surgery scheduling. Her broad exposure across nearly every department and level of administration gives her a unique, well-rounded perspective on what it takes to deliver truly individualized, high-quality care.",
      "Jaymie earned her Bachelor’s degree in Health Services from Saint Mary’s College of California in 2016. Since then, she has played a key role in overseeing facility-based projects, managing communications with community partners, leading marketing initiatives, and driving efforts to modernize and streamline practice operations. She is passionate about creating a healthcare environment where patients feel cared for and staff are empowered to do their best work."
    ],
    "order": 8
  },
  {
    "slug": "jennifer-frank",
    "name": "Jennifer Frank",
    "jobTitle": "Human Resources Manager",
    "bio": [
      "Jennifer Frank joined SH Medical in December 2020 as the Human Resources Manager and oversees all aspects of HR such as recruitment, onboarding, benefits management, retention, separation, employee relations, and performance management. Her commitment to professional development and staying abreast of evolving HR practices equips her to effectively support the clinic’s mission of providing exceptional patient care.",
      "Jennifer holds a Masters in Business Administration specializing in Personnel Management from Alagappa University, India. After receiving her Bachelor’s in mathematics from Women’s Christian College close to two decades ago, she has worn various hats in HR management, project management, program management, and others including the one she considers the most challenging and rewarding of them all – as a homemaker for three lovely children, all under the age of 13 as of May 2024. Outside of work, Jennifer loves to spend time with her family and friends and enjoys going for hikes and long drives. She also loves connecting with and serving people in her local community in the SF Bay Area."
    ],
    "order": 9
  },
  {
    "slug": "caroline-jesudoss",
    "name": "Caroline Jesudoss",
    "jobTitle": "Administrative Coordinator",
    "bio": [
      "Caroline Jesudoss began her career in healthcare administration over 7 years ago as a front desk associate. Since then, she has graduated with her Master of Science in Healthcare Administration from Grand Canyon University while simultaneously working her way up in the healthcare and data entry fields. Caroline is now the Administrative Coordinator at SH Medical, working to ensure proper staffing, provider credentialing, and coordination between the administrative team and the clinical sites."
    ],
    "order": 10
  },
  {
    "slug": "michelle-joseph",
    "name": "Michelle Joseph",
    "jobTitle": "Administrative & HR Coordinator",
    "bio": [
      "Michelle is an Administrative & HR Coordinator with a well-rounded background in both corporate and community-focused work. She holds a Bachelor’s degree in Commerce and a Master’s degree in Human Resources, and brings a thoughtful, people-focused approach to her role.",
      "Before moving into Human Resources, Michelle cultivated a strong background in financial crime compliance and anti-money laundering, where she developed strong attention to detail and a commitment to integrity. She has also volunteered for several years as an ESL (English as a Second Language) teacher for senior citizens—an experience that reflects her dedication to helping others and supporting lifelong learning.",
      "Outside of work, she enjoys baking, cooking, exploring new cuisines, crafting, and spending time with her loved ones."
    ],
    "order": 11
  },
  {
    "slug": "anita-kirubakaran",
    "name": "Anita Kirubakaran",
    "jobTitle": "Accounting Manager",
    "bio": [
      "Anita Kirubakaran joined the SH Medical administrative team 5 years ago and worked her way up to becoming the Accounting Manager. With a passion for making a difference, she previously dedicated herself to supporting special needs children as a caregiver and educator in a school setting. Leveraging her expertise in both finance and compassion, Anita seamlessly integrates fiscal responsibility with a commitment to improving the lives of others in her role."
    ],
    "order": 12
  },
  {
    "slug": "julio-aguilera",
    "name": "Julio Aguilera",
    "jobTitle": "Business Manager",
    "bio": [
      "Julio Aguilera joined SH Medical 10 years ago and worked his way up through the administration and accounting teams to become the Business Manager. In his career, he worked in sales, finance, and operation management in various industries before finding his passion for healthcare at our practice. Julio plays a crucial role in maintaining the financial health of our practice. He is adept at interpreting complex financial data and providing strategic insights to support decision-making at all levels of the company. Additionally, Julio manages all payroll operations to ensure timely and accurate compensation for employees. He coordinates with various departments, ensuring compliance with all relevant laws and regulations while maintaining confidentiality and security of payroll data."
    ],
    "order": 13
  },
  {
    "slug": "jesus-mejia",
    "name": "Jesus Mejia",
    "jobTitle": "Facilities & IT Coordinator",
    "bio": [
      "Jesus Mejia’s career journey has been an adventure, spanning roles from chef to handyman and now our Facilities & IT Coordinator. He is the main point of contact across SH Medical’s 10+ locations and 120+ employees for everything Facilities & IT related. Jesus ensures that all technology and equipment at the practice are patient friendly and allows all staff to easily communicate about patient care."
    ],
    "order": 14
  },
  {
    "slug": "hawi-awash",
    "name": "Hawi Awash",
    "jobTitle": "Branding & Marketing Strategist",
    "bio": [
      "Hawi Awash is a Branding and Marketing Strategist at SH Medical, where she leads initiatives in brand development, storytelling, and content strategy to elevate the practice’s visibility and community impact. With a strong foundation in entrepreneurship and digital marketing, Hawi brings a proactive, creative approach to healthcare branding—helping shape SH Medical’s narrative through thoughtful content and culturally resonant campaigns.",
      "As the co-founder of the lifestyle brand YEMA, Hawi has successfully built and launched retail stores in both California and New York, using fashion as a vehicle for cultural empowerment and social impact. Her experience managing cross-functional teams, executing high-level brand campaigns, and cultivating authentic community relationships has uniquely positioned her as a strategic voice in both the medical and lifestyle sectors.",
      "Hawi’s work is shaped by her global experiences—she’s lived, worked, and traveled across different countries, which gives her a unique ability to connect with people from all backgrounds. She’s known for being proactive, thoughtful, and deeply committed to doing meaningful work, whether it’s in healthcare, fashion, or community building."
    ],
    "order": 15
  },
  {
    "slug": "zuzanna-zapiorkowska",
    "name": "Zuzanna Zapiórkowska",
    "jobTitle": "Business Operations Coordinator",
    "bio": [
      "Zuzanna Zapiórkowska joined SH Medical in September 2025 as a Business Operations Coordinator. She brings over six years of experience driving strategic outcomes across healthcare, technology, and education. Prior to joining, she worked as a Project Manager at Stanford School of Medicine, where she supported high-level projects ranging from executive events to multimillion-dollar research contracts.",
      "She holds a Master of Public Administration from Grand Valley State University and Master’s and Bachelor’s degrees in Finance and Accounting from Cracow University of Economics, and is a certified Project Management Professional (PMP).",
      "Originally from Poland, Zuz is fluent in both Polish and English. Outside of work, she enjoys volunteering, community engagement, and spending time with her family."
    ],
    "order": 16
  }
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const s of STAFF) {
    const { docs } = await payload.find({ collection: 'staff', where: { slug: { equals: s.slug } }, depth: 0, limit: 1, req })
    if (docs[0]) continue
    const dir = path.resolve(process.cwd(), 'public/uploads')
    const file = ['jpg', 'png'].map((ext) => path.join(dir, `staff-${s.slug}.${ext}`)).find((f) => fs.existsSync(f))
    const photo = file ? await payload.create({ collection: 'media', data: { alt: s.name }, filePath: file, req }) : null
    await payload.create({
      collection: 'staff',
      data: { name: s.name, slug: s.slug, ...(s.jobTitle ? { jobTitle: s.jobTitle } : {}), bio: s.bio.map((text) => ({ text })), order: s.order, ...(photo ? { photo: photo.id } : {}) },
      req,
    })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Staff entries can be edited or removed in the admin.
}
