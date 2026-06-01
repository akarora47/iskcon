import Link from 'next/link';
import BookingModalBtns from '../components/BookingModalBtns';
import RoomBookingModal from '../components/RoomBookingModal';
import pool from '@/lib/db';

export const metadata = {
  title: 'Accommodation & Booking | ISKCON Ayodhya — Stay in the Dham',
  description: 'Book your spiritual stay at ISKCON Ayodhya Guest House. Peaceful and sacred accommodation for pilgrims and devotees.',
};

async function getRooms() {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE active = 1 ORDER BY price_amount ASC');
    return rows.map(r => ({ ...r, features: typeof r.features === 'string' ? JSON.parse(r.features) : (r.features || []) }));
  } catch {
    // Fallback hardcoded rooms if DB unavailable
    return [
      { id: null, icon: '🛏️', title: 'Devotee Dormitory', price: '₹300/night', price_amount: 300, description: 'Simple, clean accommodation for solo devotees and pilgrims — community living with austerity.', features: ['AC dormitory beds', 'Common bathrooms', 'Temple proximity', 'Prasadam included'], image: '/prasadam-hall.jpg', popular: false },
      { id: null, icon: '🏠', title: 'Private Room', price: '₹1,200/night', price_amount: 1200, description: 'Comfortable private rooms for families and individuals with modern amenities.', features: ['AC private room', 'Attached bathroom', 'Wi-Fi & TV', 'Daily prasadam'], image: '/temple-gardens.jpg', popular: true },
      { id: null, icon: '🌟', title: 'Deluxe Suite', price: '₹2,500/night', price_amount: 2500, description: 'Premium suites with beautiful views for a luxurious spiritual retreat.', features: ['Spacious AC suite', 'Premium bathroom', 'Balcony & city view', 'Priority prasadam'], image: '/aarti-ceremony.jpg', popular: false },
    ];
  }
}

const facilities = [
  { icon: '🍽️', name: 'Daily Prasadam'       },
  { icon: '📿', name: 'Morning Aarti Access'  },
  { icon: '📖', name: 'Bhagavatam Classes'    },
  { icon: '🅿️', name: 'Free Parking'          },
  { icon: '📶', name: 'High-Speed Wi-Fi'      },
];

const guidelines = [
  { icon: '🚭', rule: 'No smoking on premises'               },
  { icon: '🥩', rule: 'No non-vegetarian food'               },
  { icon: '🎵', rule: 'No loud music — peaceful atmosphere'  },
  { icon: '⏰', rule: 'Check-in: 12 PM · Check-out: 10 AM'  },
  { icon: '🛕', rule: 'Respectful temple attire required'    },
  { icon: '📿', rule: 'Morning aarti participation encouraged'},
];

const prasadam = [
  { name: 'Breakfast',     time: '8:00 – 9:30 AM',   icon: '🌅', items: 'Upma, Poha, Fruits, Herbal Tea' },
  { name: 'Lunch',         time: '12:30 – 2:00 PM',  icon: '☀️', items: 'Rice, Dal, Sabzi, Roti, Salad, Chutney' },
  { name: 'Evening Snacks',time: '5:00 – 6:00 PM',   icon: '🌤️', items: 'Samosa, Tea, Laddu, Mathri' },
  { name: 'Dinner',        time: '7:30 – 9:00 PM',   icon: '🌙', items: 'Full sattvic meal including Kheer' },
];

export default async function BookingPage() {
  const rooms = await getRooms();

  return (
    <main style={{ overflow: 'hidden' }}>

      {/* HERO */}
      <section className="hero-dark-sm" style={{ minHeight: '62vh' }}>
        <div className="hero-pattern" />
        <div className="hero-ring" style={{ top: '20%', left: '6%', width: '140px', height: '140px' }} />
        <div className="hero-ring" style={{ bottom: '15%', right: '12%', width: '90px', height: '90px', animationDelay: '5s', borderColor: 'rgba(196,85,0,.08)' }} />
        <div className="hero-om-bg" style={{ fontSize: 'clamp(4rem,10vw,14rem)', opacity: 0.07 }}>🏨</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '11rem 1.5rem 5rem' }}>
          <div className="hero-grid">
            <div>
              <span className="section-badge">🛕 Stay in the Dham</span>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: '#111', marginBottom: '.5rem', marginTop: '.75rem', lineHeight: 1.2 }}>
                Spiritual Accommodation<br /><span className="gradient-text-gold">in Ayodhya Dham</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.8rem', color: '#ed6800', marginBottom: '1.25rem', letterSpacing: '.04em' }}>Choose Your Sacred Stay</p>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.8, marginBottom: '2rem' }}>
                Stay at the ISKCON Ayodhya Guest House — with daily aarti darshan, pure sattvic prasadam and Bhagavatam classes for a complete spiritual experience.
              </p>
              <BookingModalBtns />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.75rem', fontWeight: 700, color: '#c45500', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.25rem' }}>Included with Your Stay</p>
              {facilities.map((f) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(237,104,0,.15)', borderRadius: '1rem', padding: '.875rem 1.25rem' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{f.icon}</span>
                  <p style={{ fontSize: '.82rem', fontWeight: 600, color: '#111' }}>{f.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="sec-warm">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge">Accommodation Options</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              Choose Your <span className="gradient-text">Sacred Stay</span>
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
            <span className="section-badge light">Sattvic Prasadam</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: 'white' }}>
              Daily Prasadam <span className="gradient-text-gold">Schedule</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
            {prasadam.map((p, i) => (
              <div key={p.name} className={`card-glass reveal d${(i+1)*100}`} style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{p.icon}</div>
                <p style={{ fontFamily: 'var(--font-cinzel),serif', fontSize: '.9rem', fontWeight: 700, color: 'white', marginBottom: '.5rem' }}>{p.name}</p>
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
            <span className="section-badge">Stay Guidelines</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111' }}>
              Guest House <span className="gradient-text">Guidelines</span>
            </h2>
            <div className="gold-line-center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', maxWidth: '860px', margin: '0 auto' }}>
            {guidelines.map((g, i) => (
              <div key={g.rule} className={`card-border reveal d${(i+1)*100}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem 1.5rem' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '.1rem' }}>{g.icon}</span>
                <p style={{ fontWeight: 600, color: '#111', fontSize: '.88rem' }}>{g.rule}</p>
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
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#111', marginBottom: '.75rem', fontFamily: 'var(--font-cinzel),serif' }}>
              Welcome to Ayodhya Dham
            </h2>
            <p style={{ color: '#333', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
              Stay on sacred land, attend daily aarti, and experience the grace of Lord Ram and Krishna.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/contact" className="btn-primary">📞 Booking Assistance</Link>
              <Link href="/events" className="btn-outline">🎪 Festival Calendar</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
