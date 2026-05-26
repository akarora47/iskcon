import Link from 'next/link';
import BookingModalBtns from '../components/BookingModalBtns';
import RoomBookingModal from '../components/RoomBookingModal';
import pool from '@/lib/db';

export const metadata = {
  title: 'आवास एवं बुकिंग | ISKCON Ayodhya — धाम में ठहरें',
  description: 'ISKCON अयोध्या गेस्ट हाउस में अपना आध्यात्मिक आवास बुक करें। तीर्थयात्रियों और भक्तों के लिए शांत और पवित्र निवास।',
};

async function getRooms() {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE active = 1 ORDER BY price_amount ASC');
    return rows.map(r => ({ ...r, features: typeof r.features === 'string' ? JSON.parse(r.features) : (r.features || []) }));
  } catch {
    // Fallback hardcoded rooms if DB unavailable
    return [
      { id: null, icon: '🛏️', title: 'Devotee Dormitory', title_hi: 'भक्त आश्रम', price: '₹300/night', price_amount: 300, description: 'Simple, clean accommodation for solo devotees and pilgrims — community living with austerity.', description_hi: 'एकल भक्तों और तीर्थयात्रियों के लिए सरल, स्वच्छ आवास — सामुदायिक जीवन की भावना के साथ।', features: ['AC dormitory beds', 'Common bathrooms', 'Temple proximity', 'Prasadam included'], image: '/prasadam-hall.jpg', popular: false },
      { id: null, icon: '🏠', title: 'Private Room', title_hi: 'एकल कक्ष', price: '₹1,200/night', price_amount: 1200, description: 'Comfortable private rooms for families and individuals with modern amenities.', description_hi: 'परिवारों और व्यक्तियों के लिए आरामदायक निजी कक्ष — आधुनिक सुविधाओं के साथ।', features: ['AC private room', 'Attached bathroom', 'Wi-Fi & TV', 'Daily prasadam'], image: '/temple-gardens.jpg', popular: true },
      { id: null, icon: '🌟', title: 'Deluxe Suite', title_hi: 'डीलक्स सुइट', price: '₹2,500/night', price_amount: 2500, description: 'Premium suites with beautiful views for a luxurious spiritual retreat.', description_hi: 'सुंदर दृश्यों के साथ प्रीमियम सुइट — भव्य आध्यात्मिक प्रवास के लिए।', features: ['Spacious AC suite', 'Premium bathroom', 'Balcony & city view', 'Priority prasadam'], image: '/aarti-ceremony.jpg', popular: false },
    ];
  }
}

const facilities = [
  { icon: '🍽️', name: 'दैनिक प्रसाद',         nameEn: 'Daily Prasadam'      },
  { icon: '📿', name: 'प्रातः आरती दर्शन',      nameEn: 'Morning Aarti Access' },
  { icon: '📖', name: 'भागवत कक्षाएँ',          nameEn: 'Bhagavatam Classes'   },
  { icon: '🅿️', name: 'निःशुल्क पार्किंग',     nameEn: 'Free Parking'         },
  { icon: '📶', name: 'हाई-स्पीड Wi-Fi',         nameEn: 'High-Speed Wi-Fi'     },
];

const guidelines = [
  { icon: '🚭', rule: 'परिसर में धूम्रपान वर्जित',           ruleEn: 'No smoking on premises'                  },
  { icon: '🥩', rule: 'मांसाहारी भोजन निषेध',               ruleEn: 'No non-vegetarian food'                  },
  { icon: '🎵', rule: 'शांत वातावरण — तेज़ संगीत नहीं',     ruleEn: 'No loud music — peaceful atmosphere'     },
  { icon: '⏰', rule: 'चेक-इन: दोपहर १२ · चेक-आउट: सुबह १०', ruleEn: 'Check-in: 12 PM · Check-out: 10 AM'   },
  { icon: '🛕', rule: 'मंदिर में उचित वस्त्र अनिवार्य',      ruleEn: 'Respectful temple attire required'       },
  { icon: '📿', rule: 'प्रातः आरती में सहभागिता प्रोत्साहित', ruleEn: 'Morning aarti participation encouraged'  },
];

const prasadam = [
  { name: 'प्रातः प्रसाद',    nameEn: 'Breakfast',     time: '८:०० – ९:३० प्रातः', icon: '🌅', items: 'उपमा, पोहा, फल, हर्बल चाय' },
  { name: 'मध्याह्न प्रसाद', nameEn: 'Lunch',         time: '१२:३० – २:०० दोपहर', icon: '☀️', items: 'चावल, दाल, सब्जी, रोटी, सलाद, चटनी' },
  { name: 'सायं जलपान',      nameEn: 'Evening Snacks', time: '५:०० – ६:०० शाम',    icon: '🌤️', items: 'समोसा, चाय, लड्डू, मठरी' },
  { name: 'रात्रि प्रसाद',   nameEn: 'Dinner',        time: '७:३० – ९:०० रात्रि', icon: '🌙', items: 'पूर्ण सात्विक भोजन, खीर सहित' },
];

export default async function BookingPage() {
  const rooms = await getRooms();

  return (
    <main style={{ overflow: 'hidden' }}>

      {/* HERO */}
      <section className="hero-dark-sm" style={{ minHeight: '62vh' }}>
        <div className="hero-pattern" />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.07 }}>🏨</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">
            <div>
              <span className="section-badge light">🛕 धाम में ठहरें · Stay in the Dham</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                अयोध्या धाम में<br /><span className="gradient-text-gold">आध्यात्मिक आवास</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: 'rgba(255,210,100,.75)', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Choose Your Sacred Stay</p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.8, marginBottom: '2rem' }}>
                ISKCON अयोध्या के गेस्ट हाउस में ठहरें — प्रतिदिन आरती दर्शन, शुद्ध सात्विक प्रसाद, और भागवत कक्षाओं के साथ एक संपूर्ण आध्यात्मिक अनुभव।
              </p>
              <BookingModalBtns />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.75rem', fontWeight: 700, color: 'rgba(237,104,0,.9)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.25rem' }}>आवास में सम्मिलित सुविधाएँ</p>
              {facilities.map((f) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(237,104,0,.15)', borderRadius: '1rem', padding: '.875rem 1.25rem' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <p style={{ fontSize: '.82rem', fontWeight: 600, color: 'white', marginBottom: '.05rem' }}>{f.name}</p>
                    <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)' }}>{f.nameEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS — dynamic from DB */}
      <section className="sec-warm">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">आवास विकल्प · Accommodation Options</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              अपना <span className="gradient-text">पवित्र आवास</span> चुनें
            </h2>
            <div className="gold-line-center" />
          </div>
          <RoomBookingModal rooms={rooms} />
        </div>
      </section>

      {/* PRASADAM SCHEDULE */}
      <section className="sec-dark">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge light">सात्विक भोजन · Sattvic Prasadam</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white' }}>
              दैनिक प्रसाद <span className="gradient-text-gold">कार्यक्रम</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
            {prasadam.map((p, i) => (
              <div key={p.name} className={`card-glass reveal d${(i+1)*100}`} style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{p.icon}</div>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.9rem', fontWeight: 700, color: 'white', marginBottom: '.15rem' }}>{p.name}</p>
                <p style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', marginBottom: '.5rem' }}>{p.nameEn}</p>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.78rem', color: '#ed6800', fontWeight: 600, marginBottom: '.875rem' }}>{p.time}</p>
                <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}>{p.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDELINES */}
      <section className="sec-warm">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">आवास नियम · Stay Guidelines</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              पवित्र <span className="gradient-text">आवास नियम</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', maxWidth: '860px', margin: '0 auto' }}>
            {guidelines.map((g, i) => (
              <div key={g.rule} className={`card-border reveal d${(i+1)*100}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem 1.5rem' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '.1rem' }}>{g.icon}</span>
                <div>
                  <p style={{ fontWeight: 600, color: '#111', fontSize: '.88rem', marginBottom: '.2rem' }}>{g.rule}</p>
                  <p style={{ fontSize: '.75rem', color: '#888' }}>{g.ruleEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec-saffron">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛕</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              अयोध्या धाम में<br />आपका स्वागत है
            </h2>
            <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.82rem', color: 'rgba(255,230,150,.85)', marginBottom: '1.25rem' }}>Welcome to Ayodhya Dham</p>
            <p style={{ color: 'rgba(255,255,255,.9)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              पवित्र भूमि पर ठहरें, प्रतिदिन आरती में सम्मिलित हों और प्रभु श्री राम तथा कृष्ण की कृपा का अनुभव करें।
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/contact" className="btn-primary" style={{ background: 'white', color: '#ed6800' }}>📞 बुकिंग सहायता</Link>
              <Link href="/events" className="btn-outline-light">🎪 उत्सव कैलेंडर</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
