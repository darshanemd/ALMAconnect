import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ChevronDown, Upload, Image as ImageIcon, Check 
} from 'lucide-react';
import './EventCreationModal.css';

export const EVENT_FORM_CATEGORIES = [
  { 
    id: 'cultural', 
    label: 'Cultural Fest', 
    icon: '🎭',
    placeholderTitle: 'e.g. Tarang Cultural Fest 2026 / Freshers Welcome',
    placeholderVenue: 'e.g. Open Air Auditorium / Campus Quadrangle',
    placeholderDesc: 'Detailed outline of performances, chief guests, competitions, and food stalls...',
    banners: [
      { title: 'Festival Stage', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' },
      { title: 'Concert Lights', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80' },
      { title: 'Live DJ Night', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
      { title: 'Live Band Rock', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80' },
      { title: 'Acoustic Night', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' },
      { title: 'Cultural Dance', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'freshers', 
    label: 'Freshers Day', 
    icon: '🎉',
    placeholderTitle: 'e.g. Freshers Welcome & Orientation Fiesta 2026',
    placeholderVenue: 'e.g. Main Auditorium & Central Lawn',
    placeholderDesc: 'Welcome celebration for incoming batch with talent hunt, games, and dinner...',
    banners: [
      { title: 'Welcome Fiesta', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80' },
      { title: 'Campus Celebration', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80' },
      { title: 'Youth Night', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
      { title: 'Orientation Gala', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80' },
      { title: 'Freshers Party', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80' },
      { title: 'Sparkler Night', url: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'ethnic', 
    label: 'Ethnic Day', 
    icon: '🥻',
    placeholderTitle: 'e.g. Annual Campus Ethnic Day & Traditional Showcase',
    placeholderVenue: 'e.g. Quadrangle & Cultural Amphitheatre',
    placeholderDesc: 'Celebration of Indian heritage, traditional attire walk, rangoli and folk performances...',
    banners: [
      { title: 'Traditional Heritage', url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80' },
      { title: 'Rangoli & Lights', url: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&auto=format&fit=crop&q=80' },
      { title: 'Cultural Attire', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80' },
      { title: 'Diya & Festivities', url: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&auto=format&fit=crop&q=80' },
      { title: 'Folk Rhythm', url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80' },
      { title: 'Campus Traditions', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'reunion', 
    label: 'Alumni Reunion', 
    icon: '🎓',
    placeholderTitle: 'e.g. Grand Alumni Homecoming & Silver Jubilee Reunion',
    placeholderVenue: 'e.g. Campus Banquet Hall & Convention Center',
    placeholderDesc: 'Reconnect with old batchmates, reminisce memories, campus nostalgia walk and gala dinner...',
    banners: [
      { title: 'Homecoming Gala', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80' },
      { title: 'Auditorium Meet', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80' },
      { title: 'Campus Walk', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80' },
      { title: 'Alumni Banquet', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80' },
      { title: 'Networking Lounge', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80' },
      { title: 'Silver Jubilee', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'hackathon', 
    label: 'Hackathon & Coding', 
    icon: '💻',
    placeholderTitle: 'e.g. HackAlma 2026: 24-Hour Campus Hackathon',
    placeholderVenue: 'e.g. Innovation Hub & Computing Lab 3',
    placeholderDesc: '24-hour non-stop codeathon building high-impact tech solutions with alumni mentors...',
    banners: [
      { title: 'Coding Lab', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
      { title: 'Cyber Hack Night', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
      { title: 'Team Innovation', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80' },
      { title: 'Matrix Neon', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80' },
      { title: '24h Sprint', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80' },
      { title: 'Demo Pitch Day', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'webinar', 
    label: 'Webinar & Masterclass', 
    icon: '🌐',
    placeholderTitle: 'e.g. Global Tech AMA & Career Transition Webinar',
    placeholderVenue: 'e.g. Virtual Zoom / YouTube Live Stream',
    placeholderDesc: 'Interactive live session with distinguished alumni leaders discussing industry growth and hiring...',
    banners: [
      { title: 'Virtual Stream', url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&auto=format&fit=crop&q=80' },
      { title: 'Keynote Talk', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80' },
      { title: 'Tech Presentation', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80' },
      { title: 'Global Podcast', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80' },
      { title: 'Live AMA', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80' },
      { title: 'Leadership Summit', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'workshop', 
    label: 'Workshop & Hands-on', 
    icon: '🛠️',
    placeholderTitle: 'e.g. Practical Full-Stack AI & Cloud Architecture Masterclass',
    placeholderVenue: 'e.g. Seminar Hall B & Computer Lab 2',
    placeholderDesc: 'Hands-on practical technical workshop with live system demonstrations and code walkthroughs...',
    banners: [
      { title: 'Hands-on Lab', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80' },
      { title: 'Maker Space', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80' },
      { title: 'Interactive Session', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80' },
      { title: 'Robotics Lab', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
      { title: 'Design Sprint', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80' },
      { title: 'Code Bootcamp', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'sports', 
    label: 'Sports & Athletics', 
    icon: '🏅',
    placeholderTitle: 'e.g. Annual Inter-College Sports & Athletics Tournament',
    placeholderVenue: 'e.g. College Sports Complex & Athletics Ground',
    placeholderDesc: 'Campus sports meet featuring cricket, football, basketball, badminton, chess, and track events...',
    banners: [
      { title: 'Stadium Ground', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80' },
      { title: 'Track & Field', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
      { title: 'Championship Arena', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80' },
      { title: 'Cricket Pitch', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80' },
      { title: 'Basketball Court', url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&auto=format&fit=crop&q=80' },
      { title: 'Football Turf', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'techfest', 
    label: 'Tech Fest & Expo', 
    icon: '🚀',
    placeholderTitle: 'e.g. Technova 2026: National Level Science & Engineering Expo',
    placeholderVenue: 'e.g. Central Exhibition Hall & Robotics Quad',
    placeholderDesc: 'Annual science and engineering symposium featuring robotics combat, circuit design, and tech project showcases...',
    banners: [
      { title: 'Robotics Arena', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
      { title: 'Science Exhibition', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
      { title: 'Drone Showcase', url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80' },
      { title: 'Futuristic Tech', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80' },
      { title: 'Hardware Expo', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
      { title: 'Project Display', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'placement_fair', 
    label: 'Placement & Job Fair', 
    icon: '💼',
    placeholderTitle: 'e.g. Mega Alumni & Corporate Campus Placement Drive 2026',
    placeholderVenue: 'e.g. Placement Cell & Auditorium Annex',
    placeholderDesc: 'Flagship hiring expo hosting top tier corporate recruiters, on-spot interviews, and internship allocations...',
    banners: [
      { title: 'Corporate Recruitment', url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80' },
      { title: 'Career Expo', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80' },
      { title: 'Interview Booths', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80' },
      { title: 'HR Summit', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80' },
      { title: 'Walk-in Drive', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80' },
      { title: 'Internship Fair', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'annual_day', 
    label: 'Annual Day & Convocation', 
    icon: '🏛️',
    placeholderTitle: 'e.g. 50th Annual Day Celebrations & Graduation Convocation',
    placeholderVenue: 'e.g. Grand Convocation Grounds',
    placeholderDesc: 'Ceremonial convocation awarding degrees, felicitating academic toppers, followed by cultural evening...',
    banners: [
      { title: 'Convocation Ceremony', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80' },
      { title: 'Graduation Gala', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80' },
      { title: 'Awards Night', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80' },
      { title: 'Campus Hall', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80' },
      { title: 'Achievement Awards', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80' },
      { title: 'Golden Jubilee', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'art_expo', 
    label: 'Art & Photography Expo', 
    icon: '🎨',
    placeholderTitle: 'e.g. Kalakriti: Annual Student & Alumni Art Exhibition',
    placeholderVenue: 'e.g. Creative Arts Gallery & Lobby',
    placeholderDesc: 'Exhibition of student and alumni paintings, digital illustrations, sculptures, and campus photography...',
    banners: [
      { title: 'Creative Gallery', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80' },
      { title: 'Photo Exhibition', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80' },
      { title: 'Digital Canvas', url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop&q=80' },
      { title: 'Sculpture Showcase', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80' },
      { title: 'Design Showcase', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80' },
      { title: 'Art Workshop', url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'music_fest', 
    label: 'Music Fest & Band Battle', 
    icon: '🎸',
    placeholderTitle: 'e.g. Symphony Rock Night & Inter-College Band Battle',
    placeholderVenue: 'e.g. Main Amphitheatre & Music Stage',
    placeholderDesc: 'Electrifying evening of musical performances, live rock bands, acoustic showcases, and DJ wars...',
    banners: [
      { title: 'Battle of Bands', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80' },
      { title: 'Rock Night', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80' },
      { title: 'EDM Festival', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
      { title: 'Acoustic Strings', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' },
      { title: 'Live Chorus', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' },
      { title: 'Symphony Orchestra', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  { 
    id: 'other', 
    label: 'Other / Custom Category', 
    icon: '✨',
    placeholderTitle: 'e.g. Inter-College Gaming Tournament / Quiz Bowl 2026',
    placeholderVenue: 'e.g. Campus Quadrangle / Student Activity Center',
    placeholderDesc: 'Full details of rules, schedule, prizes, registration criteria, and guidelines...',
    banners: [
      { title: 'Auditorium Gala', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' },
      { title: 'Campus Amphitheatre', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80' },
      { title: 'Celebration Lights', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' },
      { title: 'Innovation Center', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80' },
      { title: 'Spotlight Stage', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80' },
      { title: 'Open Campus Quad', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80' }
    ]
  }
];

export default function EventCreationModal({ onClose, onSubmit }) {
  const [selectedCategory, setSelectedCategory] = useState(EVENT_FORM_CATEGORIES[0]);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-24');
  const [time, setTime] = useState('10:00 AM - 4:00 PM');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [fee, setFee] = useState('0');
  const [selectedBannerUrl, setSelectedBannerUrl] = useState(EVENT_FORM_CATEGORIES[0].banners[0].url);
  const [customBannerUrl, setCustomBannerUrl] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setDropdownOpen(false);
    if (!customBannerUrl) {
      setSelectedBannerUrl(cat.banners[0]?.url || '');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCustomBannerUrl(dataUrl);
      setSelectedBannerUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter an Event Title.');
      return;
    }
    if (selectedCategory.id === 'other' && !customCategoryName.trim()) {
      alert('Please specify a Custom Category Name.');
      return;
    }
    if (!date) {
      alert('Please select an Event Date.');
      return;
    }
    if (!time.trim()) {
      alert('Please specify the Event Time.');
      return;
    }
    if (!location.trim()) {
      alert('Please enter Location / Venue.');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a Description for the event.');
      return;
    }

    const finalCategoryLabel = selectedCategory.id === 'other' ? (customCategoryName.trim() || 'Custom Event') : selectedCategory.label;
    const finalCategoryType = selectedCategory.id === 'other' ? (customCategoryName.trim().toLowerCase().replace(/\s+/g, '_') || 'other') : selectedCategory.id;

    onSubmit({
      title: title.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      type: finalCategoryType,
      category: finalCategoryLabel,
      maxAttendees: Number(capacity) || 100,
      fee: Number(fee) || 0,
      image: selectedBannerUrl || selectedCategory.banners[0]?.url || null,
      description: description.trim(),
      registrationMode: '1click',
      customQuestions: []
    });
  };

  const modalDisplayCategory = selectedCategory.id === 'other' 
    ? (customCategoryName.trim() || 'Other / Custom Event')
    : selectedCategory.label;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-admin-form-modal" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="event-modal-header">
          <h3 className="event-modal-title">
            Create Event / {modalDisplayCategory}
          </h3>
          <button 
            type="button" 
            className="event-modal-close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="event-modal-form">
          
          {/* Event Title */}
          <div className="event-form-group">
            <label className="event-form-label">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="event-form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={selectedCategory.placeholderTitle}
              required
            />
          </div>

          {/* Date and Time Row */}
          <div className="event-form-row-2">
            <div className="event-form-group">
              <label className="event-form-label">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="event-form-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>

            <div className="event-form-group">
              <label className="event-form-label">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="event-form-input"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="10:00 AM - 4:00 PM"
                required
              />
            </div>
          </div>

          {/* Location / Venue */}
          <div className="event-form-group">
            <label className="event-form-label">
              Location / Venue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="event-form-input"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder={selectedCategory.placeholderVenue}
              required
            />
          </div>

          {/* Category, Capacity & Entry Fee Row */}
          <div className="event-form-row-3">
            {/* Category Custom Dropdown */}
            <div className="event-form-group event-category-field-wrap" ref={dropdownRef}>
              <label className="event-form-label">
                Category <span className="text-red-500">*</span>
              </label>
              
              <button
                type="button"
                className={`event-category-dropdown-btn ${dropdownOpen ? 'open' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropdownOpen(prev => !prev);
                }}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{selectedCategory.icon}</span>
                  <span className="truncate font-semibold">{selectedCategory.label}</span>
                </div>
                <ChevronDown size={15} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="event-category-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  {EVENT_FORM_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`event-category-dropdown-item ${selectedCategory.id === cat.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectCategory(cat);
                      }}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{cat.label}</span>
                      {selectedCategory.id === cat.id && (
                        <Check size={14} className="ml-auto text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Capacity */}
            <div className="event-form-group">
              <label className="event-form-label">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                className="event-form-input"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                placeholder="100"
                required
              />
            </div>

            {/* Entry Fee (INR) */}
            <div className="event-form-group">
              <label className="event-form-label">
                Entry Fee (INR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="event-form-input"
                value={fee}
                onChange={e => setFee(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Specify Custom Category Name (Shown when "Other" is chosen) */}
          {selectedCategory.id === 'other' && (
            <div className="event-form-group">
              <label className="event-form-label">
                Specify Custom Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="event-form-input"
                value={customCategoryName}
                onChange={e => setCustomCategoryName(e.target.value)}
                placeholder="e.g. Robotics Championship / Inter-College Quiz / LAN Gaming"
                required
              />
            </div>
          )}

          {/* Banner Section */}
          <div className="event-banner-section">
            <div className="event-banner-header">
              <span className="event-banner-title">
                <ImageIcon size={15} className="text-emerald-600" /> Event Banner Image
              </span>

              <button
                type="button"
                className="event-upload-photo-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={13} />
                <span>Upload Custom Photo</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <span className="event-banner-subtitle">
              Select Category Preset Banner:
            </span>

            {/* Preset Banner Cards */}
            <div className="event-preset-banners-grid">
              {selectedCategory.banners.map((preset, idx) => {
                const isSelected = selectedBannerUrl === preset.url;
                return (
                  <div
                    key={idx}
                    className={`event-preset-banner-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedBannerUrl(preset.url)}
                  >
                    <div className="event-preset-banner-img-wrap">
                      <img src={preset.url} alt={preset.title} />
                      {isSelected && (
                        <div className="event-preset-selected-badge">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <span className="event-preset-banner-name">{preset.title}</span>
                  </div>
                );
              })}

              {/* Custom uploaded banner preview card if available */}
              {customBannerUrl && (
                <div
                  className={`event-preset-banner-card ${selectedBannerUrl === customBannerUrl ? 'selected' : ''}`}
                  onClick={() => setSelectedBannerUrl(customBannerUrl)}
                >
                  <div className="event-preset-banner-img-wrap">
                    <img src={customBannerUrl} alt="Custom Upload" />
                    {selectedBannerUrl === customBannerUrl && (
                      <div className="event-preset-selected-badge">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                  <span className="event-preset-banner-name">Custom Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="event-form-group">
            <label className="event-form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="event-form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={selectedCategory.placeholderDesc}
              rows={3}
              required
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="event-modal-footer">
            <button
              type="button"
              className="event-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="event-btn-publish"
            >
              Publish Event
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
