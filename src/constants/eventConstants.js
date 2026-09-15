export const CAMPUS_EVENT_CATEGORIES = [
  { value: 'cultural', label: 'Cultural Fest & Arts', emoji: '🎭', desc: 'Music, dance, fashion & drama' },
  { value: 'freshers', label: 'Freshers & Orientation', emoji: '🎉', desc: 'Welcome ceremony & contest' },
  { value: 'ethnic', label: 'Ethnic Day & Heritage', emoji: '🥻', desc: 'Traditional attire & folk events' },
  { value: 'reunion', label: 'Alumni Reunion & Summit', emoji: '🎓', desc: 'Batch meetups & banquet' },
  { value: 'hackathon', label: 'Hackathon & Coding', emoji: '💻', desc: '24h coding & innovation' },
  { value: 'webinar', label: 'Webinar & Masterclass', emoji: '🌐', desc: 'Online tech AMAs & talks' },
  { value: 'workshop', label: 'Tech Workshop & Labs', emoji: '🛠️', desc: 'Hands-on practical training' },
  { value: 'sports', label: 'Sports & Athletics Tournament', emoji: '🏅', desc: 'Cricket, football, athletics' },
  { value: 'techfest', label: 'Tech Fest & Science Expo', emoji: '🚀', desc: 'Robotics, project exhibitions & demos' },
  { value: 'placement_fair', label: 'Placement & Career Fair', emoji: '💼', desc: 'Job drives, hiring & internship booths' },
  { value: 'annual_day', label: 'Annual Day & Convocation', emoji: '🏛️', desc: 'Awards, convocation & gala' },
  { value: 'art_expo', label: 'Art, Design & Photo Expo', emoji: '🎨', desc: 'Creative galleries & photography contests' },
  { value: 'music_fest', label: 'Music Fest & Battle of Bands', emoji: '🎸', desc: 'Live concerts & musical showdowns' },
  { value: 'other', label: 'Other / Custom Category', emoji: '✨', desc: 'Special custom campus events' }
];

export const CATEGORY_DEFAULT_POSTERS = {
  cultural: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  freshers: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
  ethnic: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80',
  reunion: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
  hackathon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
  webinar: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&auto=format&fit=crop&q=80',
  workshop: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
  techfest: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  placement_fair: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80',
  annual_day: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
  art_expo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
  music_fest: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
  other: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
};

// Freshers & Cultural Category Options
export const FRESHERS_CATEGORIES = [
  '🎟️ Freshers Welcome Pass / General Entry',
  '👑 Mr. & Ms. Freshers Pageant Contest',
  '🎤 Solo / Duet Vocal Singing',
  '💃 Solo / Western Group Dance',
  '👗 Freshers Fashion Walk & Ramp',
  '🎭 Stand-up Comedy & Anchoring / MC',
  '🎧 Beatboxing, Rap & Hip-Hop Battles',
  '📷 Digital Art & Photography Contest',
  '✨ Other / Custom Event'
];

// Ethnic Day Category Options
export const ETHNIC_CATEGORIES = [
  '👗 Traditional Ethnic Fashion Walk & Ramp',
  '🌺 Best Ethnic Attire & Outfit Contest',
  '💃 Folk & Traditional Group Dance',
  '📷 Ethnic Photography & Reel Contest',
  '🎨 Rangoli & Mehendi Competition',
  '🎵 Ethnic Music & Folk Song Performance',
  '✨ Other / Custom Event'
];

// Sports Categories
export const SPORTS_CATEGORIES = [
  '🏃 100m Sprint Running',
  '🏃 200m Sprint Running',
  '🏃 400m Sprint Running',
  '🏃 800m Middle Distance Running',
  '🏃 1500m Long Distance Running',
  '🏃 5000m Campus Marathon',
  '🐆 Long Jump Event',
  '🦅 High Jump Event',
  '🏋️ Shot Put Throw',
  '💿 Discus Throw Event',
  '🎯 Javelin Throw Event',
  '🏃 4×100m Relay Sprint',
  '🏏 Cricket Tournament',
  '⚽ Football Championship',
  '🏀 Basketball Tournament',
  '🏐 Volleyball / Throwball League',
  '🏸 Badminton (Singles / Doubles)',
  '🏓 Table Tennis & Chess Tournament',
  '🤼 Kabaddi Championship',
  '🎮 Esports / BGMI / Valorant Gaming Tournament',
  '✨ Other / Custom Sport'
];

// Sports Positions & Roles
export const SPORTS_ROLES = [
  '🏏 Batter / Striker',
  '🎯 Fast / Spin Bowler',
  '🧤 Wicketkeeper',
  '🛡️ All-Rounder / Fielder',
  '⚽ Striker / Forward',
  '🥅 Goalkeeper',
  '🛡️ Defender / Center-Back',
  '👟 Midfielder / Playmaker',
  '🏀 Point Guard / Shooter',
  '🏸 Singles / Doubles Player',
  '♟️ Board 1 / Primary Player'
];

// Hackathon Challenge Tracks
export const HACKATHON_TRACKS = [
  '🤖 AI, LLM & Generative Media Track',
  '🌐 Full-Stack Web3 & Decentralized Apps',
  '📱 Smart Campus & IoT Systems',
  '🏥 Healthcare & MedTech Innovations',
  '🔒 Cyber Security & FinTech',
  '🌿 GreenTech & Sustainability',
  '💡 Open Innovation & Student Ventures'
];

// Hackathon Member Roles
export const HACKATHON_ROLES = [
  'Team Leader',
  'Developer',
  'Designer',
  'ML / AI Engineer',
  'Tester / QA',
  'DevOps Engineer',
  'Researcher',
  'Presenter / Pitcher'
];

// Alumni Reunion Summit Roles
export const SUMMIT_ROLES = [
  '🎓 General Alumni Delegate & Keynote Attendee',
  '🎤 Guest Speaker / Panelist',
  '🤝 Industry Mentor / Startup Pitch Evaluator',
  '💼 Talent Recruiter / Company Sponsor',
  '🏛️ Institutional Advisory Board Member',
  '🌟 Distinguished Alumni Honoree'
];

// Accompanying Guests
export const GUEST_OPTIONS = [
  'Just Me (Solo Delegate)',
  '+1 Guest (Spouse / Partner)',
  '+2 Guests (Family / Kids)',
  '+3+ Family Members'
];

// Workshop Focus Tracks
export const WORKSHOP_TRACKS = [
  '☁️ Cloud Infrastructure & AWS / Azure',
  '🐳 Docker & Kubernetes Microservices',
  '⚛️ Next.js & React Full-Stack Engineering',
  '🤖 Generative AI, RAG & LLM Deployment',
  '🔐 API Security & Performance Tuning'
];

// Workshop Experience Levels
export const WORKSHOP_LEVELS = [
  '🌱 Beginner (Learning Core Concepts)',
  '🌿 Intermediate (Building Projects)',
  '🌳 Advanced (Production / Industry Exp)'
];

// Workshop Workstation Options
export const WORKSTATION_OPTIONS = [
  '💻 Yes, I will bring my own laptop',
  '🖥️ Need college lab workstation access',
  '📱 Remote / Cloud sandbox only'
];
