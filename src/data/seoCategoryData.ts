/**
 * SEO Category Landing Pages Data & Editorial Content
 * Defines metadata, H1, comprehensive local guides, FAQs, and category mappings
 * for the high-intent Vidisha search queries.
 */

export interface SEOCategoryConfig {
  key: string;
  path: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  iconName: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  localities: string[];
  editorialGuide: {
    overview: string;
    highlights: Array<{ title: string; description: string }>;
    localitiesAdvice: string;
    bookingAdvice: string;
  };
  faqs: Array<{ question: string; answer: string }>;
  relatedSearches: Array<{ label: string; url: string }>;
}

export const SEO_CATEGORY_PAGES: Record<string, SEOCategoryConfig> = {
  restaurants: {
    key: 'restaurants',
    path: '/restaurants-in-vidisha',
    categoryId: 'cat-restaurants',
    categorySlug: 'restaurants-and-cafes',
    categoryName: 'Restaurants and Cafes',
    iconName: 'UtensilsCrossed',
    title: 'Restaurants in Vidisha – Best Places to Eat, Pure Veg & Cafes | Vidisha City',
    metaDescription: 'Discover the best restaurants in Vidisha. Explore pure vegetarian thalis, multi-cuisine family dining, cafes, and famous sweet shops with addresses, phone numbers, and reviews.',
    h1: 'Best Restaurants and Cafes in Vidisha, Madhya Pradesh',
    subtitle: 'From authentic Malwi thalis and hot jalebis to modern rooftop dining and cozy cafes in Vidisha.',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
      { name: 'Restaurants in Vidisha', url: '/restaurants-in-vidisha' },
    ],
    localities: ['Station Road', 'Bada Bazar', 'Civil Lines', 'Ahmadpur Road', 'Sanchi Road', 'Kharipathak'],
    editorialGuide: {
      overview:
        'Vidisha has a rich culinary tradition influenced by both Malwa and Bundelkhand flavors. The city is renowned for its traditional pure vegetarian family dining, morning breakfast traditions like hot poha jalebi and kachoris, executive lunch thalis, and festive sweet marts. Whether you are searching for comfortable AC family dining near the railway station or an evening fast food joint with friends, Vidisha offers delightful options.',
      highlights: [
        {
          title: 'Pure Vegetarian Dining Assurance',
          description:
            'Most established dining destinations in Vidisha maintain strict pure-vegetarian kitchens serving authentic North Indian curries, paneer delicacies, and royal thalis prepared in desi ghee.',
        },
        {
          title: 'Signature Morning Breakfast Culture',
          description:
            'Locals swear by morning breakfast spots across Station Road and Bada Bazar for freshly fried heeng kachoris, crispy samosas, poha topped with ratlami sev, and warm jalebis.',
        },
        {
          title: 'Modern Cafes & Fast Food',
          description:
            'Young diners and families enjoy a growing selection of pizza outlets, burger bars, espresso cafes, and dessert parlours offering comfortable air-conditioned seating and home delivery.',
        },
      ],
      localitiesAdvice:
        'Station Road hosts premier family restaurants and sweet shops ideal for train travellers. Bada Bazar is historic for street treats, namkeen, and festive sweets. Ahmadpur Road and Civil Lines are popular for modern cafes.',
      bookingAdvice:
        'During festival seasons (Diwali, Holi, Rakshabandhan) and wedding months, advance table reservations and bulk sweet orders are strongly recommended.',
    },
    faqs: [
      {
        question: 'Are pure vegetarian restaurants available in Vidisha?',
        answer:
          'Yes, the vast majority of family restaurants and dining halls in Vidisha are 100% pure vegetarian, offering traditional thalis, North Indian gravies, and South Indian snacks.',
      },
      {
        question: 'Where can I find the best breakfast and sweets in Vidisha?',
        answer:
          'Station Road and the Bada Bazar market are legendary for breakfast delicacies like poha-jalebi, samosa-kachori, and sweet shops offering mawa jalebi and sonroll.',
      },
      {
        question: 'Do restaurants in Vidisha offer home delivery?',
        answer:
          'Yes, several verified restaurants in Vidisha offer direct delivery or phone order service across major residential localities like Civil Lines, Mukharji Nagar, and Shastri Nagar.',
      },
    ],
    relatedSearches: [
      { label: 'Hotels in Vidisha', url: '/hotels-in-vidisha' },
      { label: 'Bakeries & Sweets in Vidisha', url: '/category/bakeries-and-sweets' },
      { label: 'Offers & Discounts in Vidisha', url: '/offers' },
      { label: 'City Business Directory', url: '/categories' },
    ],
  },

  hotels: {
    key: 'hotels',
    path: '/hotels-in-vidisha',
    categoryId: 'cat-hotels',
    categorySlug: 'hotels-and-resorts',
    categoryName: 'Hotels and Resorts',
    iconName: 'Hotel',
    title: 'Hotels in Vidisha – Best Lodges, AC Rooms & Resorts | Vidisha City',
    metaDescription: 'Find and book verified hotels in Vidisha, MP. Compare AC rooms, budget stays, banquet lodges near Vidisha Railway Station & Sanchi Stupa with amenities and contacts.',
    h1: 'Top Hotels, Lodges and Resorts in Vidisha',
    subtitle: 'Safe, verified accommodations with modern amenities for pilgrims, tourists, and business visitors in Vidisha.',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
      { name: 'Hotels in Vidisha', url: '/hotels-in-vidisha' },
    ],
    localities: ['Station Road', 'Civil Lines', 'Sanchi Road', 'Ahmadpur Road', 'Bypass Road'],
    editorialGuide: {
      overview:
        'Vidisha serves as a vital gateway for tourists exploring UNESCO World Heritage Sanchi Stupa (just 9 km away), the ancient Udayagiri Caves (5 km away), and the monumental Heliodorus Pillar. Accommodation in Vidisha ranges from reliable railway station lodges to elegant AC hotels with banquet facilities, vegetarian dining, and 24-hour room service.',
      highlights: [
        {
          title: 'Prime Station Proximity',
          description:
            'Hotels located along Station Road and Civil Lines provide hassle-free access for guests arriving via superfast express trains from Bhopal, Delhi, Mumbai, and Jhansi.',
        },
        {
          title: 'Tourist Friendly Amenities',
          description:
            'Many properties provide travel desk assistance for arranging local auto-rickshaws, taxi transfers to Sanchi Stupa, Udayagiri Caves, and historical temple circuits.',
        },
        {
          title: 'Banquets & Wedding Facilities',
          description:
            'Spacious AC marriage halls, lawn resorts on Bypass Road, and banquet properties cater to Vidisha social gatherings and destination weddings.',
        },
      ],
      localitiesAdvice:
        'For early morning train connections, choose Station Road. For quiet, comfortable stays close to government offices, Civil Lines is preferred. Sanchi Road provides picturesque routes toward the ancient stupas.',
      bookingAdvice:
        'Advance booking is strongly encouraged during the Chethiyagiri Vihara festival in Sanchi (November) and winter tourist months (October to March).',
    },
    faqs: [
      {
        question: 'Which hotels in Vidisha are close to the Railway Station?',
        answer:
          'Several reliable lodges and AC hotels are situated within 500 meters of Vidisha Railway Station along Station Road, offering 24-hour check-in and power backup.',
      },
      {
        question: 'Is Vidisha a good base to visit Sanchi Stupa and Udayagiri Caves?',
        answer:
          'Yes, Vidisha is just 9 km from Sanchi and 5 km from Udayagiri Caves, making it an affordable, convenient base with regular buses, autos, and railway access.',
      },
      {
        question: 'Do hotels in Vidisha have AC rooms and parking?',
        answer:
          'Yes, verified hotels listed on Vidisha City provide air-conditioned deluxe rooms, on-site vehicle parking, high-speed Wi-Fi, and in-room dining.',
      },
    ],
    relatedSearches: [
      { label: 'Restaurants in Vidisha', url: '/restaurants-in-vidisha' },
      { label: 'Doctors in Vidisha', url: '/doctors-in-vidisha' },
      { label: 'Top 10 Businesses', url: '/search' },
      { label: 'All Categories', url: '/categories' },
    ],
  },

  doctors: {
    key: 'doctors',
    path: '/doctors-in-vidisha',
    categoryId: 'cat-doctors',
    categorySlug: 'doctors-and-dentists',
    categoryName: 'Doctors and Dentists',
    iconName: 'Stethoscope',
    title: 'Doctors in Vidisha – Best Physicians, Dentists & Clinics | Vidisha City',
    metaDescription: 'Find and consult verified doctors in Vidisha, MP. Search experienced general physicians, dental clinics, pediatricians, gynecologists, and specialists with clinic hours and phone numbers.',
    h1: 'Verified Doctors, Dentists and Specialists in Vidisha',
    subtitle: 'Trusted healthcare practitioners, specialty medical clinics, and dental care centers across Vidisha.',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
      { name: 'Doctors in Vidisha', url: '/doctors-in-vidisha' },
    ],
    localities: ['Shastri Nagar', 'Civil Lines', 'Station Road', 'Mukharji Nagar', 'Sanchi Road', 'Kharipathak'],
    editorialGuide: {
      overview:
        'Vidisha is home to reputable medical practitioners serving the entire district and surrounding rural tehsils. With Government Medical College Hospital (Atal Bihari Vajpayee GMC) and numerous private specialty clinics, residents and visitors have access to trusted consultations in general medicine, dental care, pediatrics, obstetrics, orthopedic surgery, and ophthalmology.',
      highlights: [
        {
          title: 'Specialist Consultations',
          description:
            'Access experienced MD physicians, cardiologists, chest specialists, and orthopedists with dedicated evening OPD consultation hours.',
        },
        {
          title: 'Advanced Dental Care Clinics',
          description:
            'Modern dental clinics equipped with digital X-rays, painless root canal therapy (RCT), teeth whitening, dental implants, and orthodontic braces.',
        },
        {
          title: 'Child and Maternal Health',
          description:
            'Dedicated pediatricians and gynecologists providing immunization, prenatal care, newborn care, and women wellness treatments.',
        },
      ],
      localitiesAdvice:
        'Shastri Nagar and Mukharji Nagar are prominent medical hubs with a cluster of doctor clinics, diagnostic pathology labs, and medical stores within walking distance.',
      bookingAdvice:
        'Most doctors hold OPD sessions between 9:00 AM – 1:00 PM and 5:00 PM – 8:30 PM. Direct phone call appointments are recommended before visiting.',
    },
    faqs: [
      {
        question: 'How do I book an appointment with a doctor in Vidisha?',
        answer:
          'You can contact verified doctor clinics directly using the verified phone numbers or WhatsApp links listed on their Vidisha City profiles.',
      },
      {
        question: 'Where are the major dental clinics located in Vidisha?',
        answer:
          'Leading dental centers are located around Station Road, Shastri Nagar, and Mukharji Nagar, offering comprehensive oral health treatments.',
      },
      {
        question: 'Are diagnostic pathology labs available near clinics?',
        answer:
          'Yes, major pathology diagnostic centres and pharmacies are conveniently situated in Shastri Nagar, Civil Lines, and near the District Hospital.',
      },
    ],
    relatedSearches: [
      { label: 'Hospitals & Clinics in Vidisha', url: '/category/hospitals-and-clinics' },
      { label: 'Medical Stores & Pharmacies', url: '/category/home-repair-services' },
      { label: 'Emergency Contacts', url: '/contact' },
      { label: 'Home Page Directory', url: '/' },
    ],
  },

  coaching: {
    key: 'coaching',
    path: '/coaching-in-vidisha',
    categoryId: 'cat-coaching',
    categorySlug: 'coaching-centres',
    categoryName: 'Coaching Centres',
    iconName: 'GraduationCap',
    title: 'Coaching in Vidisha – Best MPPSC, UPSC, SSC & Exam Prep | Vidisha City',
    metaDescription: 'Find top coaching institutes in Vidisha, MP. Prepare for MPPSC, UPSC, SSC, Banking, IIT-JEE, NEET, and school board examinations with experienced faculty and mock tests.',
    h1: 'Top Coaching Institutes & Academic Centres in Vidisha',
    subtitle: 'Empowering students with structured exam guidance, test series, and competitive preparation in Vidisha.',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
      { name: 'Coaching in Vidisha', url: '/coaching-in-vidisha' },
    ],
    localities: ['Station Road', 'Mukharji Nagar', 'Civil Lines', 'Shastri Nagar', 'Tilak Nagar'],
    editorialGuide: {
      overview:
        'Vidisha has emerged as an educational hub for students across the district preparing for competitive government examinations and national academic entrances. Coaching centres in Vidisha offer structured courses for MPPSC (State Civil Services), Sub-Inspector (MP SI), Police Constable, Staff Selection Commission (SSC), Banking exams, and high school academic foundations in Mathematics and Science.',
      highlights: [
        {
          title: 'Government Job Competitive Prep',
          description:
            'Comprehensive courses focusing on Madhya Pradesh General Knowledge, Quantitative Aptitude, Reasoning, Hindi, and English for MPPSC, Patwari, and Vyapam exams.',
        },
        {
          title: 'Engineering & Medical Foundation',
          description:
            'Foundation programs for Class 9th to 12th students preparing for IIT-JEE and NEET with regular mock tests and individual doubt-clearing sessions.',
        },
        {
          title: 'Library and Study Rooms',
          description:
            'Air-conditioned self-study libraries with quiet reading zones, high-speed Wi-Fi, and reference book access for focused preparation.',
        },
      ],
      localitiesAdvice:
        'Mukharji Nagar and Station Road host the largest concentration of coaching institutes, bookstores, and student study libraries.',
      bookingAdvice:
        'New batches typically launch in April-May (post school exams) and August-September. Inquire early for batch timings and scholarship assessments.',
    },
    faqs: [
      {
        question: 'Which is the best coaching for MPPSC in Vidisha?',
        answer:
          'Vidisha has several reputed civil services coaching institutes in Mukharji Nagar and Station Road that provide complete MPPSC Prelims and Mains batches with current affairs notes.',
      },
      {
        question: 'Are there study libraries with Wi-Fi in Vidisha?',
        answer:
          'Yes, numerous self-study student libraries with air conditioning, personal desks, and high-speed internet operate 24/7 across Mukharji Nagar and Station Road.',
      },
      {
        question: 'Do coaching centres in Vidisha offer demo classes?',
        answer:
          'Most coaching institutes provide 2 to 3 days of free demo lectures so students can evaluate the teaching pedagogy before paying course fees.',
      },
    ],
    relatedSearches: [
      { label: 'Schools in Vidisha', url: '/category/schools-and-education' },
      { label: 'Bookstores & Stationery', url: '/category/gift-shops' },
      { label: 'Gyms & Fitness in Vidisha', url: '/gyms-in-vidisha' },
      { label: 'All Directory Listings', url: '/categories' },
    ],
  },

  gyms: {
    key: 'gyms',
    path: '/gyms-in-vidisha',
    categoryId: 'cat-gyms',
    categorySlug: 'gyms-and-fitness',
    categoryName: 'Gyms and Fitness',
    iconName: 'Dumbbell',
    title: 'Gyms in Vidisha – Best Fitness Clubs, Workout & Yoga | Vidisha City',
    metaDescription: 'Discover the best gyms and fitness centers in Vidisha, MP. Modern workout equipment, certified personal trainers, weight loss, and cardio workout plans with contact details.',
    h1: 'Best Gyms, Fitness Clubs & Yoga Centres in Vidisha',
    subtitle: 'Transform your health with top strength equipment, cardio gyms, and professional fitness coaches in Vidisha.',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
      { name: 'Gyms in Vidisha', url: '/gyms-in-vidisha' },
    ],
    localities: ['Station Road', 'Civil Lines', 'Shastri Nagar', 'Ahmadpur Road', 'Mukharji Nagar', 'Durga Nagar'],
    editorialGuide: {
      overview:
        'Fitness awareness in Vidisha is growing rapidly among youth, working professionals, and health-conscious residents. The city features modern air-conditioned gymnasiums equipped with imported strength machines, free weights, Olympic barbells, motorized treadmills, and dedicated functional workout zones. In addition, certified trainers and yoga studios provide customized guidance for weight loss, muscle building, and holistic wellness.',
      highlights: [
        {
          title: 'Advanced Strength & Cardio Equipment',
          description:
            'Well-ventilated workout floors featuring multi-station cable machines, incline chest presses, power racks, elliptical trainers, and spin bikes.',
        },
        {
          title: 'Certified Personal Trainers',
          description:
            'Dedicated personal training programs offering personalized workout routines, body composition analysis, and nutrition counseling tailored to individual goals.',
        },
        {
          title: 'Flexible Membership Packages',
          description:
            'Affordable monthly, quarterly, and annual subscription packages with special discount plans for students and morning workout slots.',
        },
      ],
      localitiesAdvice:
        'Centrally located gyms in Civil Lines and Station Road offer convenient access for morning commuters, while suburban centers in Durga Nagar and Ahmadpur Road offer spacious workout floors.',
      bookingAdvice:
        'Most gyms provide separate workout timings for women or mixed sessions. Ask for a 1-day free trial session before enrolling in long-term memberships.',
    },
    faqs: [
      {
        question: 'What are the typical gym membership fees in Vidisha?',
        answer:
          'Monthly gym memberships in Vidisha generally range between ₹500 to ₹1,500 depending on air conditioning, imported equipment, and steam/shower facilities.',
      },
      {
        question: 'Are there gyms in Vidisha with separate timings for women?',
        answer:
          'Yes, several fitness centers provide dedicated morning or afternoon female-only batches with female fitness instructors.',
      },
      {
        question: 'Do gyms in Vidisha provide certified personal training?',
        answer:
          'Yes, leading fitness centers feature certified trainers who guide beginners on correct exercise form, progressive overload, and dietary planning.',
      },
    ],
    relatedSearches: [
      { label: 'Doctors in Vidisha', url: '/doctors-in-vidisha' },
      { label: 'Salons & Beauty in Vidisha', url: '/category/salons-and-beauty' },
      { label: 'City Offers & Discounts', url: '/offers' },
      { label: 'All Business Categories', url: '/categories' },
    ],
  },
};
