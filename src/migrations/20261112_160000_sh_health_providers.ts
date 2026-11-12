import fs from 'fs'
import path from 'path'
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Content only: bring provider profiles in line with sh.health and add the providers it lists that the site was missing.
type Fields = { title?: string; bio?: string[]; sections?: { heading: string; items: string[] }[]; offices?: string[]; languages?: string[] }
const UPDATES: Record<string, Fields> = {
  "bernard-a-feigenbaum-md": {
    "bio": [
      "Bernard A. Feigenbaum, M.D. attended the Boston University 6-year accelerated medical program and received his B.A. and M.D. in 1989. He is a Voluntary Assistant Clinical Professor at UCSD School of Medicine, and was formerly on the clinical faculty at Yale University School of Medicine and NYU School of Medicine. He is Board-Certified, and has over 30 years of clinical and teaching experience as an adult and pediatric Allergy & Immunology specialist.",
      "He has experience with a wide range of conditions including eczema/dermatitis, food allergy, allergic nasal and sinus issues, asthma, vocal cord dysfunction, drug reactions as well as a wide range of allergy testing and procedures in the clinic and hospital.",
      "Dr. Feigenbaum is passionate about providing evidence-based Allergy & Immunology medical care with the goal of identifying root causes and minimizing the need for medication. He is known for his friendly, caring manner, professionalism, and his teaching and communication.",
      "He recently moved from San Diego and loves exploring SF and the Marin Headlands and jamming on his acoustic."
    ],
    "sections": [
      {
        "heading": "Education and Training",
        "items": [
          "1989 MD Boston University School of Medicine (Accelerated 6 Year Medical Program. Combined BA/MD 1983 to 1989), Residency & Fellowship",
          "1989-1992 Internal Medicine Intern and Resident, (Scripps) Mercy Hospital",
          "1992-1993 Chief Resident, (Scripps) Mercy Hospital",
          "1993-1995 Clinical Fellow in Allergy & Immunology, Scripps Clinic"
        ]
      },
      {
        "heading": "Publications",
        "items": [
          "Lieberman SM, Jacobs JB, Lebowitz RA, Fitzgerald MB, Crawford J, Feigenbaum BA.Measurement of",
          "Mycotoxins in Patients with Chronic Rhinosinusitis. Otolaryngol Head Neck Surg, 2011;145(2): 327–29",
          "Romanos-Sirakis, E, Feigenbaum BA. Immediate Hypersensitivity Reaction and Successful Rapid Desensitization",
          "to Rituximab Followed by Serum Sickness in a 4 Year Old. (Abstract) J Allergy Clin Immunol, 2011; 127: Supp,",
          "AB198.",
          "Mathew A, Ballas M, Gorsky M, Miro K, Feigenbaum BA. Rapid Desensitization Does Not Prevent",
          "“Idiosyncratic” Reaction with Fever to Oxaliplatin. (Abstract) J Allergy Clin Immunol, 2011; 127: Supplement,",
          "AB195.",
          "Sutaria M, Miro K, Kister I, Herbert J, Mathew A, Feigenbaum BA. Special Considerations for Rapid Drug",
          "Desensitization with Natalizumab. (Abstract) J Allergy Clin Immunol, 2011; 127:Supp, AB196.",
          "Mathew A, Feigenbaum BA, Miro K, Weinfeld JN. Iatrogenic Hypogammaglobulinemia Resembling Common",
          "Variable Immunodeficiency. (Abstract) Ann Allergy Asthma Immunol 2010; 105; A101.",
          "Miro K, Feigenbaum BA, Mathew A, Weinfeld JN. Successful Oxaliplatin Desensitization After Unsuccessful",
          "Infusion Using A Hypersensitivity Protocol. (Abstract) Ann Allergy Asthma Immunol 2010; 105; A27.",
          "Feigenbaum BA. Fractional exhaled nitric oxide in subjects with atopic asthma: Correct Definitions",
          "of the Terms Atopy and Asthma. (Correspondence) Ann Allergy Asthma Immunol 2008; 101; 110.",
          "Feigenbaum BA, Simon RA. Remission of Steroid Dependent Asthma Following Fundoplication for",
          "Asymptomatic Reflux. J Allergy Clin Immunol, 1995; 95:202.",
          "Feigenbaum BA. Insect-sting challenges-all risk and no benefit? (Letter) J Allergy Clin Immunol 1995;",
          "96:704-705.",
          "Feigenbaum BA, Stevenson DD, Simon RA. Hydrocortisone Sodium Succinate Does Not Cross-react",
          "With Aspirin in Aspirin Sensitive Asthmatics. J Allergy Clin Immunol 1995; 96:545-8.",
          "Feigenbaum BA, Simon RA. A Case of Vocal Cord Dysfunction Mimicking Asthma. Ann Allergy, 1995; 74:92.",
          "Feigenbaum BA, Stevenson DD, Simon RA. Respiratory Succinate Sensitivity That Does Not Cross-react",
          "In An Aspirin Sensitive Asthmatic. Ann Allergy, 1994; 72:94.",
          "Feigenbaum BA, Simon RA, Stevenson DD. Aspirin Intolerance. (Letter) Ann Allergy, 1994; 73:455-56.",
          "Feigenbaum BA, Stevenson DD, Simon RA. Lack of Cross-Sensitivity To IV Hydrocortisone in",
          "Aspirin-Sensitive Subjects With Asthma. J Allergy Clin Immunol 1994; 93:242."
        ]
      }
    ],
    "offices": [
      "marin",
      "union"
    ]
  },
  "brooke-leonard-au-d": {
    "bio": [
      "Brooke Leonard, Au.D., joined SH Audiology in August 2025. She received her bachelor’s in linguistics with a specialization in speech and language sciences from the University of California, San Diego. After completing her residency at UCSF Medical Center, Dr. Leonard obtained her doctorate in audiology from the University of Colorado Boulder. A Sacramento native, she was delighted to return to Northern California for residency and is grateful for the opportunity to continue to serve the Bay Area community.",
      "Dr. Leonard’s clinical interests include adult and pediatric diagnostic hearing evaluations, hearing aids, vestibular and balance evaluations, tinnitus management and implantable hearing technology. She is passionate about utilizing audiologic best practices to deliver comprehensive, compassionate and person-centered care."
    ],
    "offices": [
      "union",
      "mtnview"
    ]
  },
  "pramoda-arachchige-had": {
    "bio": [
      "Pramoda joined San Francisco Audiology in October 2024. After growing up in Sri Lanka and earning her bachelor’s in business administration and psychology from Galilee College, she studied diagnostic testing and hearing aid amplification at Nova South Eastern University, Florida.",
      "Pramoda has over 10 years of experience in hearing aid fitting and has helped improve the lives of many individuals with hearing loss. She is a licensed hearing aid dispenser through the Speech-Language Pathology and Audiology and Hearing Aid Dispensers Board of California.",
      "Pramoda is excited to be part of our team and provide excellent patient care."
    ],
    "offices": [
      "walnut"
    ]
  },
  "joshua-d-glasner-mm-ph-d-ccc-slp": {
    "bio": [
      "Dr. Glasner is a voice, upper airway, and swallowing-specialized speech-language pathologist. He received his clinical graduate training at Delaware Valley University. He completed clinical externships at the Johns Hopkins Voice Center and the Duke Voice Care Center, and completed a voice and upper airway clinical fellowship at the Lions Voice Clinic at the University of Minnesota. Prior to becoming a speech-language pathologist, he held academic positions in music and speech-language pathology, and taught singers all around the world—including singers at the Metropolitan Opera and on Broadway—for over a decade.",
      "Dr. Glasner enjoys collaboratively and empathetically helping patients and clients with a variety of voice, upper airway, and swallowing conditions through their rehabilitation journey. His clinical interests include singing voice rehabilitation (all styles), chronic throat pain, gender affirming voice care, the aging voice, and neurodegenerative voice disorders."
    ],
    "sections": [
      {
        "heading": "Teaching Experience",
        "items": [
          "New York University, School of Professional Studies (Certificate in Vocology)- Adjunct Professor (2023-Present)",
          "Delaware Valley University, School of Graduate Studies (Speech-Language Pathology)- Assistant Professor (2022-2024)",
          "Clarke University (Music)- Assistant Professor (2020-2022)",
          "Coastal Carolina University (Music)- Visiting Assistant Professor (2019-2020)",
          "New York University, Steinhardt School of Culture, Education, and Human Development (Music)- Adjunct Professor (2013-2019)"
        ]
      },
      {
        "heading": "Education/Training",
        "items": [
          "University of Minnesota, Lions Voice Clinic, Clinical Fellowship in Voice and Upper Airway Speech-Language Pathology (2024-2025)",
          "Delaware Valley University, Master of Science in Speech-Language Pathology (2023-2024)",
          "New York University, Doctor of Philosophy in Voice Pedagogy (2013-2019)",
          "National Center for Voice and Speech, Certificate in Vocology (2016)",
          "Westminster Choir College, Master of Music in Voice Pedagogy and Performance, Voice Pedagogy Emphasis-Degree with Distinction (2011-2013)",
          "University of Delaware, Bachelor of Music in Voice Performance-Degree with Distinction (2007-2011)"
        ]
      },
      {
        "heading": "Memberships",
        "items": [
          "American Speech-Language-Hearing Association (ASHA)",
          "The Voice Foundation",
          "The National Association of Teachers of Singing (NATS)",
          "Pan-American Vocology Association (PAVA)",
          "Acoustical Society of America"
        ]
      },
      {
        "heading": "Peer-reviewed papers",
        "items": [
          "1. Glasner, J.D. & Johnson, A. M. (2020). Effects of Historical Recording Technology on Vibrato in Modern-Day Opera Singers. Journal of Voice, 36(4), 464-478. DOI: https://doi.org/10.1016/j.jvoice.2020.07.022.",
          "2. Bottalico, P., Łastowiecka, N., Glasner, J.D., & Redman, Y.G. (2022). Singing in different performance spaces: The effects of room acoustics on vibrato and pitch inaccuracy. Journal of the Acoustical Society of America, 151(6), 4131-4139. DOI: https://doi.org/10.1121/10.0011675.",
          "3. Redman, Y.G., Glasner, J.D., D’Orazio, D. & Bottalico, P. (2023). Singing in different performance spaces: The effect of room acoustics on singers’ perception. Journal of the Acoustical Society of America, 154(4): 2256-2264. DOI: https://doi.org/10.1121/10.0021331",
          "4. Perna, N., Redman, Y.G., & Glasner, J.D. (Nov/Dec 2024). Flipping the Voice Pedagogy Frame: Background, Foundation, and Framework. Journal of Singing, 81(2).",
          "5. Glasner, J.D. & Nix, J. (In Press). Perception of vibrato by professional voice teachers: A pilot study. Journal of Voice. DOI: 10.1016/j.jvoice.2023.10.032",
          "Non-peer-reviewed papers/essays",
          "1. Howell, I.L., Gautereaux, K.J., Glasner, J.D., Perna, N., Ballantyne, C., & Nestorova, T. (March 2020). “Preliminary report: Comparing the audio quality of classical music lessons over Zoom, Microsoft Teams, VoiceLessonsApp, and Apple FaceTime.” Special Report of the New England Conservatory of Music Voice and Sound Analysis Laboratory.",
          "2. Glasner, J.D. (October 2020). “Can you hear me now? : Evolving best practice for connecting with our clients.” PAVA InFormant, 1(3).",
          "3. Nestorova, T. & Glasner, J.D. (September 2021). “What about extent: Examining current vibrato extent metrics.” PAVA InFormant, 2(3).",
          "4. Bottalico, P., Glasner, J.D., & Redman, Y.G. (Feb. 2023). “The effect of room acoustics on singers’ vibrato.” Voice Foundation Newsletter, 28(1).",
          "5. Bottalico, P., Wingfield, C., Nudelman, C., Glasner, J., & Redman, Y.G. (May 2025). “Does virtual reality match reality? Vocal performance across environments.” 188th Meeting, Architectural Acoustics, Lay Language Paper, Musical Acoustics, Signal Processing, Speech Communication. https://acoustics.org/does-virtual-reality-match-reality-vocal-performance-across-environments/",
          "Invited Book Chapters",
          "1. Perna, N., & Glasner, J.D. (commissioned). Online Teaching of Voice. In J. Nix & L. Scearce (Eds.), The Oxford Handbook of Vocal Pedagogy. Oxford University Press."
        ]
      }
    ]
  },
  "mike-main-md": {
    "bio": [
      "My name is Dr. Mike Main, an allergist and immunologist located in San Francisco, California. I am a recent graduate of the Stanford University Allergy and Immunology fellowship, having previously completed my medical school education at the New York University Grossman School of Medicine and internal medicine residency at Vanderbilt University Medical Center, where I also earned a certification in LGBTQ+ healthcare. I am thrilled to be part of San Francisco Allergy, Asthma and Immunology and to take care of conditions that can significantly hamper your quality of life, including asthma, food allergies, eczema, seasonal allergies, and chronic rhinosinusitis."
    ],
    "sections": [
      {
        "heading": "Education",
        "items": [
          "2022-2024 Stanford University, Allergy and Immunology Fellowship",
          "2019-2022 Vanderbilt University Medical Center, Internal Medicine Residency",
          "2015-2019 New York University Grossman School of Medicine, Medical Doctorate, May 2019",
          "2009-2015 University of Nevada, Las Vegas, Bachelor of Science in Biological Sciences"
        ]
      },
      {
        "heading": "Memberships",
        "items": [
          "American Academy of Allergy, Asthma and Immunology",
          "American College of Allergy, Asthma and Immunology"
        ]
      }
    ],
    "title": "Allergist & Immunologist in San Francisco, CA"
  },
  "douglas-mann-md-mba": {
    "bio": [],
    "sections": [
      {
        "heading": "Education",
        "items": [
          "1968-1972: Brooklyn College, City University of New York BS, Chemistry, Summa Cum Laude",
          "1972-1976: Yale University School of Medicine, New Haven, CT, MD",
          "1997-1999: West Chester University , West Chester, PA, MBA, Finance"
        ]
      },
      {
        "heading": "Postgraduate Training",
        "items": [
          "1976-1978: Resident, General Surgery Montefiore Hospital, Albert Einstein College of Medicine, Bronx, NY",
          "1978-1981: Resident, Otolaryngology, Yale-New Haven Hospital, New Haven, CT"
        ]
      },
      {
        "heading": "Military Service",
        "items": [
          "1981-1983: Lieutenant Commander, Medical Corps United States Naval Reserves, Naval Regional Medical Center Philadelphia, PA"
        ]
      },
      {
        "heading": "Board Certification",
        "items": [
          "1981: American Board of Otolaryngology (lifetime)",
          "1995: American Board of Facial Plastic and Reconstructive Surgery"
        ]
      },
      {
        "heading": "Professional Experience",
        "items": [
          "1982-1998: Private practice, single specialty group practice Plastic Surgical, Ear, Nose and Throat Associates, PC, Chester, PA 19013, Status: Shareholder",
          "1998-2004: Private practice, Single specialty group practice Head and Neck Associates of Southeastern PA, Havertown, PA 19083, Status: Partner",
          "2004-2017: Private solo practice: Upper Cape Ear, Nose, & Throat, PC, Falmouth, MA",
          "2017-Present: Hospital owned practice, Falmouth, MA"
        ]
      },
      {
        "heading": "Licensure",
        "items": [
          "1977 New York (131140, inactive)",
          "1980 Connecticut (021912, inactive)",
          "1981 Pennsylvania (024529E, inactive)",
          "2004 Massachusetts (219845)",
          "2022 California (G183283)"
        ]
      },
      {
        "heading": "Faculty Appointments",
        "items": [
          "1980-1981: Instructor, Otolaryngology, Yale University School of Medicine",
          "1982-2004: Assistant Professor, Otolaryngology, Thomas Jefferson University School of Medicine"
        ]
      },
      {
        "heading": "Committee Memberships",
        "items": [
          "1993-1998: Chairman, O.R. Committee, Crozer Chester Medical Center, Chester, PA",
          "1989-1996: Chairman, Laser Committee, Crozer Chester Medical Center, Chester, PA",
          "1988-1990: Executive Committee, Taylor Hospital, Ridley Park, PA",
          "1986-1994: Chair, Surgical Case Review Committee, Community Hospital, Chester, PA",
          "2003-2004: OR Committee Riddle Memorial Hospital, Media, PA.",
          "2006-2009: OR Committee Falmouth Hospital, Falmouth, MA",
          "2006-2014: Member, med exec committee, Falmouth hospital",
          "2011-2013: President of Medical staff, Falmouth Hospital",
          "2009-2011: Vice President of Medical staff, Falmouth Hospital",
          "2007-2009: Secretary treasurer, Falmouth Hospital medical, Staff",
          "2010-2011: Chairman Bylaws Committee Falmouth Hospital",
          "2008-2018: Member, Board of Directors, Cape Hospital Insurance Co.",
          "2017-2019: Director and Secretary, Cape Cod Preferred Physicians",
          "2019-2021: Vice President, Cape Cod Preferred Physicians"
        ]
      }
    ]
  },
  "aasif-kazi-md-pharm-d": {
    "title": "Board Certified Otolaryngologist / Head and Neck Surgeon · Facial Plastic and Reconstructive Surgeon · Head and Neck Oncologic Surgeon · Skull Base Surgeon",
    "bio": [
      "Aasif Kazi is a board certified otolaryngologist / head and neck surgeon. After obtaining his Doctor of Pharmacy, he completed medical school at the Medical College of Georgia. He went on to complete his residency in otolaryngology / head and neck at Virginia Commonwealth University. He is one of the few otolaryngologists to have undergone further specialization in endoscopic skull base surgery, facial plastic and reconstructive surgery, and advanced head and neck oncology with microvascular reconstruction at Loma Linda University. He treats a wide variety of adult and pediatric disorders including tumors of the thyroid and parathyroid glands, salivary gland tumors, sino-nasal tumors as well as other benign and malignant conditions of the head and neck. His expertise lies in complex head and neck reconstruction including free flap reconstruction of the head and neck, cosmetic and functional rhinoplasty, facial reanimation, and skull base reconstruction."
    ],
    "sections": [
      {
        "heading": "Education/Training",
        "items": [
          "Loma Linda University Medical Center 2023-2024",
          "Advanced Head and Neck Oncologic and Microvascular Reconstructive Surgery Fellow",
          "Loma Linda University Medical Center 2022-2023",
          "Facial Plastic and Reconstructive Surgery Fellow",
          "Skull Base Surgery Fellow",
          "Virginia Commonwealth University Health System 2017-2021",
          "Resident, Department of Otolaryngology / Head and Neck Surgery",
          "Medical College of Georgia 2010-2014",
          "Doctor of Medicine"
        ]
      },
      {
        "heading": "Memberships",
        "items": [
          "American Head and Neck Society",
          "American Academy of Facial Plastic Surgery",
          "American Academy of Otolaryngology – Head and Neck Surgery",
          "California Medical Association"
        ]
      },
      {
        "heading": "Hospital Affiliations",
        "items": [
          "UCSF",
          "CPMC",
          "Campus Surgery Center",
          "Pacific Heights Surgery Center",
          "El Camino Health"
        ]
      }
    ],
    "offices": [
      "union",
      "mtnview"
    ]
  },
  "angela-l-chang-md": {
    "sections": [
      {
        "heading": "EDUCATION",
        "items": [
          "2004 – 2008 Duke University B.S. Biological Sciences",
          "2008 – 2012 Case Western Reserve University M.D.",
          "2012 – 2015 Northwestern University Resident Pediatrics",
          "2015 – 2017 University of California, San Francisco Fellow Pediatric Allergy/Immunology"
        ]
      },
      {
        "heading": "LICENSES, CERTIFICATION",
        "items": [
          "2015 Medical License, California Medical Board, #135218",
          "2015 American Board of Pediatrics, #112738",
          "2015 DEA, #FC5137193",
          "2017 American Board of Allergy and Immunology, #11572"
        ]
      },
      {
        "heading": "MEMBERSHIPS",
        "items": [
          "2012 – 2015 American Academy of Pediatrics",
          "2015 – present American Academy of Allergy, Asthma, and Immunology",
          "2015 – present American College of Allergy, Asthma, and Immunology",
          "2017 – present Allergy Association of Northern California"
        ]
      },
      {
        "heading": "PEER REVIEWED PUBLICATIONS",
        "items": [
          "2010 Lin A, Kirshbom PM. Early and Delayed Atrioventricular Conduction Block Following Routine Congenital Heart Surgery. Journal of Thoracic and Cardiovascular Surgery. 2010 Jul;140(1): 158-160., Prepared: September 4, 2024",
          "2012 Lin A, Danziger-Isakov L. Assessment of Cytomegalovirus Hybrid Preventative Strategy in Pediatric Heart Transplant Patients. Journal of Pediatric Infectious Diseases. 2012 Dec;1(4): 278-283.",
          "2016 Chang A, Singh AM. Natural history of food triggered atopic dermatitis and development of immediate reactions in children. Journal of Allergy and Clinical Immunology: In Practice. Mar-Apr 2016;4(2): 229-236.",
          "2021 Chang A, Cabana M, LaFlam T, Patel S, Okumura M. Early Peanut Introduction and Testing: A Framework for General Pediatrician Beliefs and Practices. Pediatric Allergy, Immunology, and Pulmonology. 2021 Jun;34(2):53-59.",
          "2021 Cho E, Chang A. First reported allergic reaction in the United States to pili nut (Canarium ovatum). Journal of Allergy and Clinical Immunology: In Practice. 2021 Jan;9(1):537-538."
        ]
      }
    ]
  },
  "sai-challapalli-md": {
    "sections": [
      {
        "heading": "Teaching Experience",
        "items": [
          "2015 Research Assistant at Knights of Columbus Pediatrics Center",
          "2013 – 2014 Physics Lab Teaching Assistant",
          "2013 – 2014 Chemistry Private Tutor",
          "2012 General Chemistry Grading Assistant",
          "2011-2012 Biology Lab Teaching Assistant"
        ]
      },
      {
        "heading": "Education/Training",
        "items": [
          "2023- 2024 Washington University in St Louis, Fellow in Facial Plastics and Reconstructive Surgery",
          "2018 – 2023 Otorhinolaryngology Head and Neck Surgery Residency, University of Texas Health Science Center at Houston, McGovern Medical School",
          "2014-2018 Doctor of Medicine, Saint Louis University School of Medicine, Saint Louis, Missouri, Medical Scholars Program (Combined BS/MD program)",
          "2010-2014 Bachelor of Sciences in Investigative Medical Sciences, Minor in, Music and Biology, Saint Louis University, Saint Louis, Missouri, Medical Scholars Program (Combined BS/MD program)"
        ]
      },
      {
        "heading": "Memberships",
        "items": [
          "American Academy of Facial Plastics and Reconstructive Surgery",
          "American Academy of Otolaryngology",
          "American Medical Association"
        ]
      },
      {
        "heading": "Hospital Affiliations",
        "items": [
          "University of California, SF"
        ]
      }
    ]
  },
  "monica-lee-md": {
    "sections": [
      {
        "heading": "Teaching Positions in Otolaryngology",
        "items": [
          "Clinical Instructor of Otolaryngology, Harvard University (August 2012 – December 2022)"
        ]
      },
      {
        "heading": "Education and Training",
        "items": [
          "Boston Medical Center, Boston University School of Medicine, Boston, MA",
          "Department of Otolaryngology – Head and Neck Surgery",
          "Administrative Chief Resident (June 2011 – June 2012)",
          "Boston Medical Center, Boston University School of Medicine, Boston, MA",
          "Department of Otolaryngology – Head and Neck Surgery",
          "Resident (June 2008 – June 2011)",
          "Boston Medical Center, Boston University School of Medicine, Boston, MA",
          "Department of Surgery",
          "Intern (June 2007 – June 2008)",
          "University of Massachusetts Medical School , Worcester, MA",
          "Doctor of Medicine (June 2007)",
          "University of Pennsylvania , College of Arts & Sciences, Philadelphia, PA",
          "Bachelor of Arts in Biology, with Distinction in Biology, Minor in Chemistry (May 2002)"
        ]
      },
      {
        "heading": "Memberships",
        "items": [
          "American Academy of Otolaryngology – Head and Neck Surgery , Member (June 2007 – Present)",
          "American Academy of Otolaryngic Allergy , Fellow (2012 – Present)",
          "Massachusetts Medical Society , Member (2003 – Present)"
        ]
      }
    ],
    "languages": [
      "English",
      "Cantonese"
    ]
  },
  "joseph-hitchcock-mm-ms": {
    "sections": [
      {
        "heading": "Education & Training",
        "items": [
          "M.M., Vocal Performance & Voice Pedagogy, New York University",
          "M.S., Communication Disorders, Emerson College",
          "Clinical Fellowship, Voice, Swallowing, and Upper Airway Disorders, Lakeshore Professional Voice Center"
        ]
      },
      {
        "heading": "Clinical Training",
        "items": [
          "Grabscheid Voice and Swallowing Center, Mount Sinai Hospital, New York City",
          "Saco Bay Orthopaedics and Sport Physical Therapy – Outpatient Neurogenic Rehab Clinic, Portland, ME",
          "Frisbie Memorial Hospital Voice and Speech Center, Rochester, NH"
        ]
      },
      {
        "heading": "Research",
        "items": [
          "Daşdöğen, Ü., Hitchcock, J., Ahn, S., Ng, B. B., & Verdolini-Abbott, K. (2026). Visual–Spatial Influences on Vocal Intensity: Effects of Speaker-to-Listener Distance and Room Size in Immersive Virtual Reality. Journal of Speech, Language, and Hearing Research , 1–9. https://doi.org/10.1044/2026_jslhr-25-00798",
          "Daşdöğen, Ü., & Hitchcock, J. (2026). The Effects of Visual Input in Virtual Reality on Voice Production: Comparing Trained Singers and Untrained Speakers. Journal of Voice . https://doi.org/10.1016/j.jvoice.2026.01.001"
        ]
      }
    ],
    "offices": [
      "union",
      "mateo"
    ]
  },
  "farshid-taghizadeh-md": {
    "title": "Otolaryngologist"
  },
  "stephanie-johannes-md": {
    "offices": [
      "castro",
      "pac"
    ]
  },
  "rosana-amaro-au-d": {
    "offices": [
      "marin",
      "phill"
    ]
  },
  "lauren-luk-md-fars": {
    "offices": [
      "union",
      "mateo",
      "mtnview"
    ]
  },
  "andrea-h-yeung-md": {
    "languages": [
      "English",
      "Cantonese",
      "Spanish"
    ]
  }
}
const CREATE: (Fields & { slug: string; name: string; role: string; file: string; departments: string[] })[] = [
  {
    "slug": "james-c-wu-md",
    "name": "James C. Wu, MD",
    "role": "ENT · Facial plastic surgeon",
    "title": "Otolaryngologist – Head and Neck / Facial Plastic Surgeon",
    "offices": [
      "mateo"
    ],
    "bio": [
      "Dr. James C. Wu is a double board-certified otolaryngologist and facial plastic and reconstructive surgeon with more than 25 years of experience. He has a special interest in helping patients breathe better and focuses on the comprehensive evaluation and surgical treatment of nasal obstruction. By combining his expertise in nasal function with advanced training in facial plastic surgery, Dr. Wu carefully considers both breathing and appearance when developing an individualized treatment plan. He performs procedures such as septoplasty, turbinate reduction, nasal valve repair, functional rhinoplasty, and minimally invasive treatments for nasal obstruction and rhinorrhea. Dr. Wu’s goal is simple: to help each patient breathe more comfortably, sleep better, and improve their quality of life."
    ],
    "sections": [
      {
        "heading": "Board Certifications",
        "items": [
          "American Board of Otolaryngology – Head and Neck Surgery",
          "American Board of Facial Plastic & Reconstructive Surgery"
        ]
      },
      {
        "heading": "Education & Training",
        "items": [
          "M.D., University of Illinois at Chicago",
          "Residency, Otolaryngology – Head and Neck Surgery, State University of New York at Stony Brook",
          "Fellowship, Facial Plastic and Reconstructive Surgery / Craniomaxillofacial and Skull Base Surgery, St. Luke’s Roosevelt Hospital Center for Cranial Base Surgery, Columbia University College of Physicians and Surgeons"
        ]
      }
    ],
    "file": "specialist-james-c-wu-md.jpg",
    "departments": [
      "ent",
      "facial-plastics",
      "surgery"
    ]
  },
  {
    "slug": "alexis-gandarilla-pa-c",
    "name": "Alexis Gandarilla, PA-C",
    "role": "Physician assistant · ENT",
    "title": "Board-Certified Physician Assistant",
    "offices": [
      "marin"
    ],
    "bio": [
      "Alexis Gandarilla, PA-C is a board-certified Physician Assistant specializing in Otolaryngology. She joined SH Medical in April 2026 and brings more than seven years of clinical experience in Internal Medicine and Primary Care, with a focused background in ENT care.",
      "Alexis treats adult patients with a wide range of ear, nose, and throat conditions, including sinus disease, hearing concerns, cerumen impaction, and throat-related disorders. She is committed to providing compassionate, patient-centered care and values helping patients better understand their diagnoses and treatment options."
    ],
    "sections": [
      {
        "heading": "Education & Training",
        "items": [
          "Master of Science in Biomedical Sciences in Physician Assistant Studies — University of Toledo",
          "Bachelor of Science — Santa Clara University"
        ]
      },
      {
        "heading": "Certifications & Licensure",
        "items": [
          "Board Certified Physician Assistant — National Commission on Certification of Physician Assistants (NCCPA)",
          "California State Physician Assistant License"
        ]
      }
    ],
    "file": "specialist-alexis-gandarilla-pa-c.jpg",
    "departments": [
      "ent"
    ]
  },
  {
    "slug": "felix-meier-l-ac",
    "name": "Felix Meier, L.Ac.",
    "role": "Licensed acupuncturist",
    "title": "Licensed Acupuncturist",
    "offices": [
      "union"
    ],
    "bio": [
      "Felix is a licensed acupuncturist at SH Medical, specializing in orthopedic, sports, and community-based care. He earned his Master of Science in Traditional Chinese Medicine from the Acupuncture & Integrative Medicine College, Berkeley (AIMC Berkeley), where he trained in classical Five Element and channel-based diagnosis alongside contemporary biomedical science.",
      "Felix’s clinical background includes work with UC Berkeley Athletics Orthopedics and the Santa Rosa Community Clinic, in addition to maintaining his own private practice. This experience has shaped a treatment approach that draws equally on classical TCM theory and modern musculoskeletal science.",
      "A competitive masters rower, Felix also coaches adult novice and middle school development rowers at the Marin Rowing Association. Combined with earlier experience as a personal trainer, this gives him a practical, movement-first perspective on musculoskeletal care that informs how he works with patients recovering from injury or managing chronic pain.",
      "Felix believes that community, movement, and education are among the most powerful tools for healing, and he brings that philosophy to every patient interaction."
    ],
    "sections": [],
    "file": "specialist-felix-meier-l-ac.jpg",
    "departments": [
      "wellness"
    ]
  }
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs: officeDocs } = await payload.find({ collection: 'offices', depth: 0, limit: 100, req })
  const officeId = new Map(officeDocs.map((o) => [o.slug, o.id]))
  const toData = (f: Fields) => ({
    ...(f.title !== undefined ? { title: f.title } : {}),
    ...(f.bio ? { bio: f.bio.map((text) => ({ text })) } : {}),
    ...(f.sections ? { sections: f.sections } : {}),
    ...(f.offices ? { offices: f.offices.map((s) => officeId.get(s)).filter((id): id is number => id != null) } : {}),
    ...(f.languages ? { languages: f.languages } : {}),
  })

  for (const [slug, f] of Object.entries(UPDATES)) {
    const { docs } = await payload.find({ collection: 'specialists', where: { slug: { equals: slug } }, depth: 0, limit: 1, req })
    if (docs[0]) await payload.update({ collection: 'specialists', id: docs[0].id, data: toData(f), req })
  }

  for (const c of CREATE) {
    const { docs: existing } = await payload.find({ collection: 'specialists', where: { slug: { equals: c.slug } }, depth: 0, limit: 1, req })
    let id = existing[0]?.id
    if (!id) {
      const filePath = path.resolve(process.cwd(), 'public/uploads', c.file)
      const photo = fs.existsSync(filePath) ? await payload.create({ collection: 'media', data: { alt: c.name }, filePath, req }) : null
      const doc = await payload.create({
        collection: 'specialists',
        data: { name: c.name, slug: c.slug, role: c.role, ...toData(c), ...(photo ? { photo: photo.id } : {}) },
        req,
      })
      id = doc.id
    }
    for (const dept of c.departments) {
      const { docs } = await payload.find({ collection: 'departments', where: { slug: { equals: dept } }, depth: 0, limit: 1, req })
      const d = docs[0]
      if (!d) continue
      const members = (d.team?.members || []).map((m) => (typeof m === 'object' ? m.id : m))
      if (members.includes(id)) continue
      await payload.update({
        collection: 'departments',
        id: d.id,
        data: { team: { ...d.team, members: [...members, id], ...(dept === 'wellness' ? { heading: 'Meet the team', emptyNote: null } : {}) } },
        req,
      })
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content updates; earlier versions of each profile stay in the admin's version history.
}
