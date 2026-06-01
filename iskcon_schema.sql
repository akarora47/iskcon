-- ============================================================
-- ISKCON Ayodhya — MySQL / MariaDB Database Schema
-- ✅ Hostinger-ready version (no CREATE DATABASE / USE)
-- Import this file in phpMyAdmin after selecting your database
-- ============================================================

-- ── 1. EVENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  name_hi      VARCHAR(255),
  icon         VARCHAR(20)  DEFAULT '🎪',
  date         VARCHAR(50),
  month        VARCHAR(50),
  year         VARCHAR(10)  DEFAULT '2026',
  category     VARCHAR(100),
  description  TEXT,
  description_hi TEXT,
  featured     TINYINT(1)   DEFAULT 0,
  active       TINYINT(1)   DEFAULT 1,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events (name, name_hi, icon, date, month, year, category, description, description_hi, featured, active) VALUES
('Janmashtami Mahotsav', 'जन्माष्टमी महोत्सव', '🎪', '24', 'Aug', '2026', 'Festival', 'Grand celebration of Lord Krishna\'s divine birth with kirtan, abhisheka, drama, cultural programs, and free maha-prasadam.', 'भगवान श्री कृष्ण के दिव्य प्रकटोत्सव का भव्य आयोजन — महाभिषेक, नाटक, संकीर्तन और हज़ारों भक्तों को महाप्रसाद का वितरण।', 1, 1),
('Ram Navami Yatra', 'राम नवमी यात्रा', '🏹', '17', 'Apr', '2026', 'Festival', 'Sacred procession through Ayodhya with sankirtan, kirtan parikrama, and Ram katha. Open to all.', 'अयोध्या की पवित्र गलियों में संकीर्तन यात्रा, राम कथा और भव्य नगर परिक्रमा।', 0, 1),
('Bhagwat Saptah', 'भागवत सप्ताह', '📖', '5-11', 'Jun', '2026', 'Spiritual', 'Seven-day Srimad Bhagavatam recitation by senior Vaishnavas. Open to all families.', 'सात दिवसीय श्रीमद्भागवत पारायण — वरिष्ठ वैष्णवों द्वारा। परिवार सहित आएं।', 0, 1),
('Radhashtami Celebration', 'राधाष्टमी उत्सव', '🌸', '18', 'Sep', '2026', 'Festival', 'Divine celebration of Srimati Radharani\'s appearance day with special abhisheka and kirtans.', 'श्रीमती राधारानी के प्रकटोत्सव का दिव्य उत्सव — विशेष अभिषेक और मधुर कीर्तन।', 0, 1),
('Bhagavad Gita Course', 'भगवद्गीता पाठ्यक्रम', '🎓', 'Every Sat', 'Weekly', '2026', 'Education', 'An 8-week course on the Bhagavad Gita for beginners and seekers. Certifications provided.', 'नए साधकों के लिए ८ सप्ताह का भगवद्गीता पाठ्यक्रम। प्रमाण-पत्र सहित।', 0, 1),
('Sunday Love Feast', 'संडे लव फीस्ट', '🎵', 'Every Sun', 'Weekly', '2026', 'Weekly', 'Weekly kirtan, Bhagavatam class, and free prasadam feast for all visitors. Join every Sunday.', 'साप्ताहिक संकीर्तन, भागवत कक्षा और सभी आगंतुकों के लिए निःशुल्क प्रसाद भोज।', 0, 1);

-- ── 2. ROOMS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  title_hi       VARCHAR(255),
  icon           VARCHAR(20)  DEFAULT '🛏️',
  price          VARCHAR(100),
  price_amount   DECIMAL(10,2),
  description    TEXT,
  description_hi TEXT,
  features       LONGTEXT,
  image          VARCHAR(500),
  popular        TINYINT(1)   DEFAULT 0,
  active         TINYINT(1)   DEFAULT 1
);

INSERT INTO rooms (title, title_hi, icon, price, price_amount, description, description_hi, features, image, popular, active) VALUES
('Devotee Dormitory', 'भक्त आश्रम', '🛏️', '₹300/night', 300, 'Simple, clean accommodation for solo devotees and pilgrims who value austerity and community living.', 'एकल भक्तों और तीर्थयात्रियों के लिए सरल, स्वच्छ आवास — सामुदायिक जीवन की भावना के साथ।', '["AC dormitory beds","Common bathrooms","Temple proximity","Prasadam included"]', '/prasadam-hall.jpg', 0, 1),
('Private Room', 'एकल कक्ष', '🏠', '₹1,200/night', 1200, 'Comfortable private rooms for families and individuals seeking a peaceful temple stay with modern amenities.', 'परिवारों और व्यक्तियों के लिए आरामदायक निजी कक्ष — आधुनिक सुविधाओं के साथ।', '["AC private room","Attached bathroom","Wi-Fi & TV","Daily prasadam"]', '/temple-gardens.jpg', 1, 1),
('Deluxe Suite', 'डीलक्स सुइट', '🌟', '₹2,500/night', 2500, 'Premium suites with beautiful views for a luxurious spiritual retreat in the sacred dham of Lord Ram.', 'सुंदर दृश्यों के साथ प्रीमियम सुइट — अयोध्या के पवित्र धाम में भव्य आध्यात्मिक प्रवास।', '["Spacious AC suite","Premium bathroom","Balcony & city view","Priority prasadam"]', '/aarti-ceremony.jpg', 0, 1);

-- ── 3. SEVA CAMPAIGNS (Donations) ─────────────────────────
CREATE TABLE IF NOT EXISTS seva_campaigns (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  title_hi        VARCHAR(255),
  icon            VARCHAR(20)  DEFAULT '🌸',
  description     TEXT,
  description_hi  TEXT,
  goal_amount     DECIMAL(12,2) DEFAULT 0,
  raised_amount   DECIMAL(12,2) DEFAULT 0,
  image           VARCHAR(500),
  featured        TINYINT(1)   DEFAULT 0,
  active          TINYINT(1)   DEFAULT 1,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO seva_campaigns (title, title_hi, icon, description, description_hi, goal_amount, raised_amount, image, featured, active) VALUES
('GauShala Seva', 'गौशाला सेवा', '🐄', 'Protect and nourish the sacred cows under temple care. Your donation provides feed, shelter, and veterinary care for our beloved gomatas.', 'मंदिर की पवित्र गायों की रक्षा और पोषण करें। आपका दान चारा, आश्रय और पशु चिकित्सा सेवा प्रदान करता है।', 500000, 312000, '/gaushala.jpg', 1, 1),
('Annadan Seva', 'अन्नदान सेवा', '🍽️', 'Feed thousands of pilgrims and devotees with pure prasadam daily. Your contribution ensures no devotee leaves the temple hungry.', 'प्रतिदिन हज़ारों तीर्थयात्रियों और भक्तों को शुद्ध प्रसाद खिलाएं। आपका योगदान सुनिश्चित करता है कि कोई भी भक्त भूखा न जाए।', 300000, 198000, '/prasadam-hall.jpg', 1, 1),
('Janmashtami Utsav', 'जन्माष्टमी उत्सव', '🎪', 'Help us celebrate the grandest festival of the year — Janmashtami. Sponsor decorations, prasadam, performances and more.', 'वर्ष के सबसे भव्य उत्सव जन्माष्टमी को मनाने में सहयोग करें। सजावट, प्रसाद, कार्यक्रम और अधिक को प्रायोजित करें।', 200000, 87000, '/festival-kirtan.jpg', 0, 1);

-- ── 4. BOOKINGS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  name                 VARCHAR(255) NOT NULL,
  email                VARCHAR(255),
  phone                VARCHAR(20),
  room_id              INT,
  room_name            VARCHAR(255),
  check_in             DATE,
  check_out            DATE,
  guests               INT          DEFAULT 1,
  special_requests     TEXT,
  razorpay_order_id    VARCHAR(100),
  razorpay_payment_id  VARCHAR(100),
  status               ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- ── 5. EVENT REGISTRATIONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS event_registrations (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  event_id         INT,
  event_name       VARCHAR(255),
  first_name       VARCHAR(255) NOT NULL,
  last_name        VARCHAR(255),
  email            VARCHAR(255),
  phone            VARCHAR(20),
  attendees        INT          DEFAULT 1,
  city             VARCHAR(255),
  special_requests TEXT,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- ── 6. DONATION SUBMISSIONS ────────────────────────────────
CREATE TABLE IF NOT EXISTS donation_submissions (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id           INT,
  seva_type             VARCHAR(255),
  full_name             VARCHAR(255) NOT NULL,
  email                 VARCHAR(255),
  phone                 VARCHAR(20),
  amount                DECIMAL(10,2),
  message               TEXT,
  razorpay_order_id     VARCHAR(100),
  razorpay_payment_id   VARCHAR(100),
  status                ENUM('pending','received','confirmed') DEFAULT 'pending',
  created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── 7. ADMIN USERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255),
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Default admin: username=admin  password=admin@123
-- NOTE: Visit /api/admin/setup after installation to set your real password!
INSERT INTO admin_users (username, password_hash, name) VALUES
('admin', '$2b$10$rOzJqvqvqvqvqvqvqvqvqO8K1234567890abcdefghijklmnopqr', 'ISKCON Admin');

-- ── 8. INQUIRIES (Contact Form) ────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255),
  phone      VARCHAR(20),
  subject    VARCHAR(255),
  message    TEXT,
  status     ENUM('new','read','replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
