export const LOCATIONS = [
  'Indore', 'Bhopal', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Jaipur', 'Lucknow', 'Chandigarh'
];

export const HERO_STATS = [
  { count: '2,500+', label: 'Colleges' },
  { count: '1,200+', label: 'Universities' },
  { count: '50,000+', label: 'Courses' },
  { count: '10 Lakh+', label: 'Students Assisted' },
];

export const POPULAR_SEARCHES = [
  'Online MBA', 'B.Tech Colleges', 'MBA Colleges', 'MBBS in Russia', 'Study in Canada'
];

export const CATEGORY_CARDS = [
  {
    id: 'distance-online',
    title: 'Distance & Online Education',
    description: 'UG, PG, Diploma & Certificate courses from top UGC-DEB approved universities.',
    theme: 'blue',
    badgeBg: 'bg-blue-100 text-blue-600',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    borderHover: 'hover:border-blue-400',
    icon: 'Monitor',
    link: '/courses?type=online'
  },
  {
    id: 'mbbs-abroad',
    title: 'MBBS Abroad',
    description: 'Study MBBS in top foreign universities with affordable fees & global exposure.',
    theme: 'green',
    badgeBg: 'bg-emerald-100 text-emerald-600',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    borderHover: 'hover:border-emerald-400',
    icon: 'Stethoscope',
    link: '/mbbs-abroad'
  },
  {
    id: 'overseas-edu',
    title: 'Overseas Education',
    description: 'Study in UK, USA, Canada, Australia & more. Find the best universities and courses.',
    theme: 'purple',
    badgeBg: 'bg-purple-100 text-purple-600',
    buttonColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    borderHover: 'hover:border-purple-400',
    icon: 'Globe',
    link: '/study-abroad/uk'
  },
  {
    id: 'campus-admissions',
    title: 'College & University Admissions',
    description: 'Find the best colleges for Engineering, Management, Medical & more.',
    theme: 'orange',
    badgeBg: 'bg-amber-100 text-orange-600',
    buttonColor: 'bg-orange-500 hover:bg-orange-600 text-white',
    borderHover: 'hover:border-orange-400',
    icon: 'GraduationCap',
    link: '/colleges'
  }
];

export const WHY_CHOOSE_ITEMS = [
  {
    icon: 'Database',
    title: 'Large Database',
    subtitle: '1000+ Universities & 2500+ Colleges'
  },
  {
    icon: 'Scale',
    title: 'Compare & Decide',
    subtitle: 'Compare fees, placement & more'
  },
  {
    icon: 'ShieldCheck',
    title: 'Genuine Information',
    subtitle: 'Verified & updated information'
  },
  {
    icon: 'Bookmark',
    title: 'Save & Shortlist',
    subtitle: 'Shortlist your favourite colleges & courses'
  },
  {
    icon: 'UserCheck',
    title: 'Expert Guidance',
    subtitle: 'Get guidance from our education experts'
  },
  {
    icon: 'MessageSquare',
    title: 'Easy Enquiry',
    subtitle: 'Connect directly with colleges/universities'
  }
];

export const COURSES_GRID = [
  { name: 'MBA', tag: 'Management', duration: '2 Years', popular: true },
  { name: 'B.Tech', tag: 'Engineering', duration: '4 Years', popular: true },
  { name: 'BBA', tag: 'Management', duration: '3 Years' },
  { name: 'MBA (Distance)', tag: 'Online/Distance', duration: '2 Years', popular: true },
  { name: 'MCA', tag: 'Computer Apps', duration: '2 Years' },
  { name: 'BCA', tag: 'Computer Apps', duration: '3 Years' },
  { name: 'B.Com', tag: 'Commerce', duration: '3 Years' },
  { name: 'MBBS Abroad', tag: 'Medical', duration: '5.5 Years', popular: true },
  { name: 'B.Pharm', tag: 'Pharmacy', duration: '4 Years' },
  { name: 'LLB', tag: 'Law', duration: '3/5 Years' },
  { name: 'Nursing', tag: 'Medical', duration: '4 Years' },
  { name: 'B.Sc', tag: 'Science', duration: '3 Years' },
  { name: 'M.Com', tag: 'Commerce', duration: '2 Years' },
  { name: 'MA', tag: 'Arts & Humanities', duration: '2 Years' },
  { name: 'More Courses →', tag: 'Explore All', isLink: true }
];

export const DEFAULT_COMPARE_COLLEGES = [
  {
    id: 1,
    name: 'IIT Bombay - Indian Institute of Technology',
    slug: 'iit-bombay',
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    reviewsCount: 1420,
    logo: '🏛️',
    type: 'Government / Autonomous',
    fees: '₹2.2 Lakhs / Year',
    avgPackage: '₹21.8 LPA'
  },
  {
    id: 2,
    name: 'BITS Pilani - Birla Institute of Tech & Science',
    slug: 'bits-pilani',
    location: 'Pilani, Rajasthan',
    rating: 4.7,
    reviewsCount: 980,
    logo: '🎓',
    type: 'Private Deemed',
    fees: '₹4.8 Lakhs / Year',
    avgPackage: '₹18.5 LPA'
  },
  {
    id: 3,
    name: 'VIT Vellore - Vellore Institute of Technology',
    slug: 'vit-vellore',
    location: 'Vellore, Tamil Nadu',
    rating: 4.5,
    reviewsCount: 2310,
    logo: '⭐',
    type: 'Private Deemed',
    fees: '₹1.98 Lakhs / Year',
    avgPackage: '₹9.2 LPA'
  }
];

export const CATEGORY_TABS = [
  'Engineering',
  'Management',
  'Medical',
  'Law',
  'Pharmacy',
  'Nursing',
  'Commerce',
  'Arts',
  'Science',
  'More'
];

export const UNIVERSITIES_BY_CATEGORY = {
  'Engineering': [
    { id: 101, name: 'IIT Bombay', location: 'Mumbai, Maharashtra', rating: 4.8, reviews: 1420, tag: 'NIRF #3', icon: '🏛️', fees: '₹2.2 L/yr' },
    { id: 102, name: 'BITS Pilani', location: 'Pilani, Rajasthan', rating: 4.7, reviews: 980, tag: 'NIRF #20', icon: '🎓', fees: '₹4.8 L/yr' },
    { id: 103, name: 'VIT Vellore', location: 'Vellore, Tamil Nadu', rating: 4.5, reviews: 2310, tag: 'NAAC A++', icon: '⭐', fees: '₹1.98 L/yr' },
    { id: 104, name: 'SRM University', location: 'Chennai, Tamil Nadu', rating: 4.3, reviews: 1850, tag: 'Top Private', icon: '🏫', fees: '₹2.5 L/yr' },
    { id: 105, name: 'Lovely Professional University (LPU)', location: 'Jalandhar, Punjab', rating: 4.2, reviews: 3100, tag: 'UGC Approved', icon: '🌐', fees: '₹1.8 L/yr' },
    { id: 106, name: 'DTU - Delhi Technological University', location: 'New Delhi, Delhi', rating: 4.6, reviews: 1200, tag: 'NIRF Top 35', icon: '⚡', fees: '₹1.9 L/yr' }
  ],
  'Management': [
    { id: 201, name: 'IIM Ahmedabad', location: 'Ahmedabad, Gujarat', rating: 4.9, reviews: 890, tag: 'NIRF #1', icon: '📈', fees: '₹24 L (Full Course)' },
    { id: 202, name: 'IIM Bangalore', location: 'Bangalore, Karnataka', rating: 4.9, reviews: 760, tag: 'NIRF #2', icon: '📊', fees: '₹23.5 L (Full Course)' },
    { id: 203, name: 'XLRI Jamshedpur', location: 'Jamshedpur, Jharkhand', rating: 4.8, reviews: 620, tag: 'AACSB Accredited', icon: '🎯', fees: '₹26 L (Full Course)' },
    { id: 204, name: 'Symbiosis (SIBM)', location: 'Pune, Maharashtra', rating: 4.6, reviews: 1410, tag: 'Top Private MBA', icon: '🏆', fees: '₹11 L/yr' },
    { id: 205, name: 'NMIMS School of Business', location: 'Mumbai, Maharashtra', rating: 4.5, reviews: 1950, tag: 'AMBA Accredited', icon: '🏢', fees: '₹12.5 L/yr' }
  ],
  'Medical': [
    { id: 301, name: 'AIIMS New Delhi', location: 'New Delhi, Delhi', rating: 4.9, reviews: 1100, tag: 'NIRF #1 Medical', icon: '🏥', fees: '₹1,628/yr' },
    { id: 302, name: 'Christian Medical College (CMC)', location: 'Vellore, Tamil Nadu', rating: 4.8, reviews: 840, tag: 'Top Ranked', icon: '🩺', fees: '₹52,000/yr' },
    { id: 303, name: 'KMC Manipal', location: 'Manipal, Karnataka', rating: 4.7, reviews: 920, tag: 'NMC Approved', icon: '💊', fees: '₹15 L/yr' },
    { id: 304, name: 'King George’s Medical University', location: 'Lucknow, UP', rating: 4.6, reviews: 780, tag: 'State Govt', icon: '💉', fees: '₹54,000/yr' }
  ],
  'Law': [
    { id: 401, name: 'NLSIU Bangalore', location: 'Bangalore, Karnataka', rating: 4.9, reviews: 650, tag: 'NIRF #1 Law', icon: '⚖️', fees: '₹3.5 L/yr' },
    { id: 402, name: 'NLU Delhi', location: 'New Delhi, Delhi', rating: 4.8, reviews: 520, tag: 'Top Law School', icon: '📜', fees: '₹3.2 L/yr' },
    { id: 403, name: 'NALSAR University of Law', location: 'Hyderabad, Telangana', rating: 4.7, reviews: 490, tag: 'Premier NLU', icon: '🏛️', fees: '₹2.8 L/yr' }
  ]
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aayush Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    university: 'IIT Bombay, B.Tech CSE',
    rating: 5,
    quote: 'Shikhar360 made comparing B.Tech curriculums and placements so straightforward! Their counsellors guided me through the counseling portal step-by-step.'
  },
  {
    id: 2,
    name: 'Priyanka Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    university: 'SIBM Pune, MBA Marketing',
    rating: 5,
    quote: 'I was confused between three top business schools. The verified ROI comparison on Shikhar360 gave me accurate fee structures and genuine student feedback.'
  },
  {
    id: 3,
    name: 'Rohit Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    university: 'Bashkir State Medical University (Russia)',
    rating: 5,
    quote: 'Finding NMC-recognized MBBS universities abroad was scary until I contacted Shikhar360. Zero hidden charges and transparent admission guidance!'
  },
  {
    id: 4,
    name: 'Sneha Verma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    university: 'Manipal University, Online MBA',
    rating: 5,
    quote: 'Being a working professional, I needed a UGC-DEB certified executive program. The instant comparison and counsellor callback on Shikhar360 helped me enroll within 48 hours.'
  }
];

export const TRUST_STATS = [
  { value: '10 Lakh+', label: 'Students Assisted' },
  { value: '25,000+', label: 'Enquiries This Month' },
  { value: '500+', label: 'Expert Counsellors' },
  { value: '15+', label: 'Years Of Experience' },
];
