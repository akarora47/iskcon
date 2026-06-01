-- ============================================================
-- ISKCON AYODHYA — COMPLETE DATABASE SETUP
-- ✅ Hostinger Ready — Import this ONE file in phpMyAdmin
-- ============================================================
-- Instructions:
--   1. Login to Hostinger → hPanel → Databases → phpMyAdmin
--   2. Select your database from the left panel
--   3. Click the "SQL" tab at the top
--   4. Paste this entire file → click "Go"
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ══════════════════════════════════════════════════════════
-- 1. EVENTS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `events` (
  `id`             INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name`           VARCHAR(255)  NOT NULL,
  `name_hi`        VARCHAR(255)           DEFAULT NULL,
  `icon`           VARCHAR(20)            DEFAULT '🎪',
  `date`           VARCHAR(50)            DEFAULT NULL,
  `month`          VARCHAR(50)            DEFAULT NULL,
  `year`           VARCHAR(10)            DEFAULT '2026',
  `category`       VARCHAR(100)           DEFAULT NULL,
  `description`    TEXT                   DEFAULT NULL,
  `description_hi` TEXT                   DEFAULT NULL,
  `image`          VARCHAR(500)           DEFAULT NULL,
  `featured`       TINYINT(1)             DEFAULT 0,
  `active`         TINYINT(1)             DEFAULT 1,
  `created_at`     TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` (`name`, `name_hi`, `icon`, `date`, `month`, `year`, `category`, `description`, `featured`, `active`) VALUES
('Janmashtami Mahotsav', 'जन्माष्टमी महोत्सव', '🎪', '24', 'Aug', '2026', 'Festival', 'Grand celebration of Lord Krishna\'s divine birth with kirtan, abhisheka, drama, cultural programs, and free maha-prasadam.', 1, 1),
('Ram Navami Yatra', 'राम नवमी यात्रा', '🏹', '17', 'Apr', '2026', 'Festival', 'Sacred procession through Ayodhya with sankirtan, kirtan parikrama, and Ram katha. Open to all.', 0, 1),
('Bhagwat Saptah', 'भागवत सप्ताह', '📖', '5-11', 'Jun', '2026', 'Spiritual', 'Seven-day Srimad Bhagavatam recitation by senior Vaishnavas. Open to all families.', 0, 1),
('Radhashtami Celebration', 'राधाष्टमी उत्सव', '🌸', '18', 'Sep', '2026', 'Festival', 'Divine celebration of Srimati Radharani\'s appearance day with special abhisheka and kirtans.', 0, 1),
('Bhagavad Gita Course', 'भगवद्गीता पाठ्यक्रम', '🎓', 'Every Sat', 'Weekly', '2026', 'Education', 'An 8-week course on the Bhagavad Gita for beginners and seekers. Certifications provided.', 0, 1),
('Sunday Love Feast', 'संडे लव फीस्ट', '🎵', 'Every Sun', 'Weekly', '2026', 'Weekly', 'Weekly kirtan, Bhagavatam class, and free prasadam feast for all visitors. Join every Sunday.', 0, 1);


-- ══════════════════════════════════════════════════════════
-- 2. ROOMS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `rooms` (
  `id`            INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title`         VARCHAR(255)  NOT NULL,
  `title_hi`      VARCHAR(255)           DEFAULT NULL,
  `icon`          VARCHAR(20)            DEFAULT '🛏️',
  `price`         VARCHAR(100)           DEFAULT NULL,
  `price_amount`  DECIMAL(10,2)          DEFAULT NULL,
  `description`   TEXT                   DEFAULT NULL,
  `description_hi`TEXT                   DEFAULT NULL,
  `features`      LONGTEXT               DEFAULT NULL,
  `image`         VARCHAR(500)           DEFAULT NULL,
  `popular`       TINYINT(1)             DEFAULT 0,
  `active`        TINYINT(1)             DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rooms` (`title`, `icon`, `price`, `price_amount`, `description`, `features`, `popular`, `active`) VALUES
('Devotee Dormitory', '🛏️', '₹300/night', 300, 'Simple, clean accommodation for solo devotees and pilgrims who value austerity and community living.', '["AC dormitory beds","Common bathrooms","Temple proximity","Prasadam included"]', 0, 1),
('Private Room', '🏠', '₹1,200/night', 1200, 'Comfortable private rooms for families and individuals seeking a peaceful temple stay with modern amenities.', '["AC private room","Attached bathroom","Wi-Fi & TV","Daily prasadam"]', 1, 1),
('Deluxe Suite', '🌟', '₹2,500/night', 2500, 'Premium suites with beautiful views for a luxurious spiritual retreat in the sacred dham of Lord Ram.', '["Spacious AC suite","Premium bathroom","Balcony & city view","Priority prasadam"]', 0, 1);


-- ══════════════════════════════════════════════════════════
-- 3. SEVA CAMPAIGNS (Donations)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `seva_campaigns` (
  `id`            INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title`         VARCHAR(255)  NOT NULL,
  `title_hi`      VARCHAR(255)           DEFAULT NULL,
  `icon`          VARCHAR(20)            DEFAULT '🌸',
  `description`   TEXT                   DEFAULT NULL,
  `description_hi`TEXT                   DEFAULT NULL,
  `goal_amount`   DECIMAL(12,2)          DEFAULT 0,
  `raised_amount` DECIMAL(12,2)          DEFAULT 0,
  `image`         VARCHAR(500)           DEFAULT NULL,
  `featured`      TINYINT(1)             DEFAULT 0,
  `active`        TINYINT(1)             DEFAULT 1,
  `created_at`    TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `seva_campaigns` (`title`, `icon`, `description`, `goal_amount`, `raised_amount`, `featured`, `active`) VALUES
('GauShala Seva', '🐄', 'Protect and nourish the sacred cows under temple care. Your donation provides feed, shelter, and veterinary care for our beloved gomatas.', 500000, 312000, 1, 1),
('Annadan Seva', '🍽️', 'Feed thousands of pilgrims and devotees with pure prasadam daily. Your contribution ensures no devotee leaves the temple hungry.', 300000, 198000, 1, 1),
('Janmashtami Utsav', '🎪', 'Help us celebrate the grandest festival of the year — Janmashtami. Sponsor decorations, prasadam, performances and more.', 200000, 87000, 0, 1);


-- ══════════════════════════════════════════════════════════
-- 4. BOOKINGS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `bookings` (
  `id`                  INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name`                VARCHAR(255)  NOT NULL,
  `email`               VARCHAR(255)           DEFAULT NULL,
  `phone`               VARCHAR(20)            DEFAULT NULL,
  `room_id`             INT                    DEFAULT NULL,
  `room_name`           VARCHAR(255)           DEFAULT NULL,
  `check_in`            DATE                   DEFAULT NULL,
  `check_out`           DATE                   DEFAULT NULL,
  `guests`              INT                    DEFAULT 1,
  `special_requests`    TEXT                   DEFAULT NULL,
  `razorpay_order_id`   VARCHAR(100)           DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(100)           DEFAULT NULL,
  `status`              ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at`          TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ══════════════════════════════════════════════════════════
-- 5. EVENT REGISTRATIONS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id`               INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `event_id`         INT                    DEFAULT NULL,
  `event_name`       VARCHAR(255)           DEFAULT NULL,
  `first_name`       VARCHAR(255)  NOT NULL,
  `last_name`        VARCHAR(255)           DEFAULT NULL,
  `email`            VARCHAR(255)           DEFAULT NULL,
  `phone`            VARCHAR(20)            DEFAULT NULL,
  `attendees`        INT                    DEFAULT 1,
  `city`             VARCHAR(255)           DEFAULT NULL,
  `special_requests` TEXT                   DEFAULT NULL,
  `created_at`       TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ══════════════════════════════════════════════════════════
-- 6. DONATION SUBMISSIONS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `donation_submissions` (
  `id`                  INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `campaign_id`         INT                    DEFAULT NULL,
  `seva_type`           VARCHAR(255)           DEFAULT NULL,
  `full_name`           VARCHAR(255)  NOT NULL,
  `email`               VARCHAR(255)           DEFAULT NULL,
  `phone`               VARCHAR(20)            DEFAULT NULL,
  `address`             TEXT                   DEFAULT NULL,
  `pin`                 VARCHAR(20)            DEFAULT NULL,
  `pan`                 VARCHAR(20)            DEFAULT NULL,
  `amount`              DECIMAL(10,2)          DEFAULT 0,
  `message`             TEXT                   DEFAULT NULL,
  `razorpay_order_id`   VARCHAR(100)           DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(100)           DEFAULT NULL,
  `status`              ENUM('pending','received','confirmed') DEFAULT 'pending',
  `created_at`          TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ══════════════════════════════════════════════════════════
-- 7. INQUIRIES (Contact Form)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id`         INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(255)  NOT NULL,
  `email`      VARCHAR(255)           DEFAULT NULL,
  `phone`      VARCHAR(20)            DEFAULT NULL,
  `subject`    VARCHAR(255)           DEFAULT NULL,
  `message`    TEXT                   DEFAULT NULL,
  `status`     ENUM('new','read','replied') DEFAULT 'new',
  `created_at` TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ══════════════════════════════════════════════════════════
-- 8. ADMIN USERS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username`      VARCHAR(100)  NOT NULL UNIQUE,
  `password_hash` VARCHAR(255)  NOT NULL,
  `name`          VARCHAR(255)           DEFAULT NULL,
  `created_at`    TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Placeholder admin row — MUST reset password via /api/admin/setup after deploy
INSERT INTO `admin_users` (`username`, `password_hash`, `name`) VALUES
('admin', '$2b$10$placeholder.hash.reset.via.setup.endpoint.only', 'ISKCON Admin')
ON DUPLICATE KEY UPDATE `username` = `username`;


-- ══════════════════════════════════════════════════════════
-- 9. EVENT POPUP
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `event_popup` (
  `id`          INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title`       VARCHAR(255)  NOT NULL  DEFAULT 'Upcoming Event',
  `subtitle`    VARCHAR(255)            DEFAULT NULL,
  `description` TEXT                    DEFAULT NULL,
  `image`       VARCHAR(500)            DEFAULT NULL,
  `event_date`  VARCHAR(100)            DEFAULT NULL,
  `event_time`  VARCHAR(100)            DEFAULT NULL,
  `event_venue` VARCHAR(255)            DEFAULT NULL,
  `btn_text`    VARCHAR(100)  NOT NULL  DEFAULT 'Know More',
  `btn_link`    VARCHAR(500)  NOT NULL  DEFAULT '/events',
  `btn2_text`   VARCHAR(100)            DEFAULT NULL,
  `btn2_link`   VARCHAR(500)            DEFAULT NULL,
  `badge_text`  VARCHAR(100)            DEFAULT '⭐ Upcoming Event',
  `enabled`     TINYINT(1)   NOT NULL   DEFAULT 1,
  `created_at`  DATETIME     NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_popup` (`title`, `subtitle`, `description`, `event_date`, `event_time`, `event_venue`, `btn_text`, `btn_link`, `btn2_text`, `btn2_link`, `badge_text`, `enabled`) VALUES
('Janmashtami Mahotsav 2026', 'Grand Celebration of Lord Krishna\'s Divine Birth', 'Experience the divine celebration — kirtan, abhisheka, cultural programs, and free maha-prasadam for thousands of devotees.', '24 Aug 2026', '4:00 PM onwards', 'ISKCON Ayodhya Mandir', '🙏 Register Free', '/events', 'Know More', '/events', '⭐ Upcoming Event', 1);


-- ══════════════════════════════════════════════════════════
-- 10. TEMPLE PROJECTS
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `temple_projects` (
  `id`                     INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `slug`                   VARCHAR(200)  NOT NULL UNIQUE,
  `title`                  VARCHAR(255)  NOT NULL,
  `subtitle`               VARCHAR(255)           DEFAULT NULL,
  `tagline`                VARCHAR(255)           DEFAULT NULL,
  `location`               VARCHAR(255)           DEFAULT NULL,
  `construction_status`    VARCHAR(100)           DEFAULT 'In Progress',
  `description`            TEXT                   DEFAULT NULL,
  `about_content`          LONGTEXT               DEFAULT NULL,
  `construction_updates`   JSON                   DEFAULT NULL,
  `project_requirements`   TEXT                   DEFAULT NULL,
  `banner_image`           VARCHAR(500)           DEFAULT NULL,
  `thumbnail_image`        VARCHAR(500)           DEFAULT NULL,
  `stats`                  JSON                   DEFAULT NULL,
  `goal_amount`            DECIMAL(15,2)          DEFAULT 0,
  `raised_amount`          DECIMAL(15,2)          DEFAULT 0,
  `cta_title`              VARCHAR(255)           DEFAULT 'Support This Sacred Project',
  `cta_description`        TEXT                   DEFAULT NULL,
  `cta_btn_text`           VARCHAR(100)           DEFAULT '🙏 Donate Now',
  `cta_btn_link`           VARCHAR(500)           DEFAULT '/donation',
  `meta_title`             VARCHAR(255)           DEFAULT NULL,
  `meta_description`       VARCHAR(500)           DEFAULT NULL,
  `status`                 ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  `featured`               TINYINT(1)   NOT NULL  DEFAULT 0,
  `sort_order`             INT          NOT NULL  DEFAULT 0,
  `created_at`             DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `temple_project_gallery` (
  `id`         INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT           NOT NULL,
  `image_url`  VARCHAR(500)  NOT NULL,
  `caption`    VARCHAR(255)           DEFAULT NULL,
  `sort_order` INT           NOT NULL DEFAULT 0,
  FOREIGN KEY (`project_id`) REFERENCES `temple_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `temple_project_videos` (
  `id`         INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT           NOT NULL,
  `title`      VARCHAR(255)           DEFAULT NULL,
  `embed_url`  VARCHAR(500)  NOT NULL,
  `thumbnail`  VARCHAR(500)           DEFAULT NULL,
  `sort_order` INT           NOT NULL DEFAULT 0,
  FOREIGN KEY (`project_id`) REFERENCES `temple_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gilehri_seva` (
  `id`                INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `project_id`        INT           NOT NULL UNIQUE,
  `title`             VARCHAR(255)  NOT NULL DEFAULT 'Gilehri Seva',
  `subtitle`          VARCHAR(255)           DEFAULT NULL,
  `description`       TEXT                   DEFAULT NULL,
  `image`             VARCHAR(500)           DEFAULT NULL,
  `benefits`          JSON                   DEFAULT NULL,
  `suggested_amounts` JSON                   DEFAULT NULL,
  `badge_text`        VARCHAR(100)           DEFAULT '🐿️ Gilehri Seva',
  `cta_text`          VARCHAR(100)           DEFAULT '🙏 Participate in Gilehri Seva',
  `enabled`           TINYINT(1)   NOT NULL  DEFAULT 1,
  `updated_at`        DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `temple_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `temple_donation_settings` (
  `id`              INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `project_id`      INT           NOT NULL UNIQUE,
  `normal_enabled`  TINYINT(1)   NOT NULL  DEFAULT 1,
  `normal_min_amount` INT        NOT NULL  DEFAULT 1000,
  `normal_label`    VARCHAR(100) NOT NULL  DEFAULT 'Donation',
  `tile_enabled`    TINYINT(1)   NOT NULL  DEFAULT 1,
  `tile_price`      INT          NOT NULL  DEFAULT 6000,
  `tile_label`      VARCHAR(100) NOT NULL  DEFAULT 'Tiles / Square Donation',
  `tile_description`TEXT                   DEFAULT NULL,
  `tile_image`      VARCHAR(500)           DEFAULT NULL,
  `updated_at`      DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `temple_projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `temple_projects`
  (`slug`,`title`,`subtitle`,`tagline`,`location`,`construction_status`,`description`,`about_content`,`stats`,`goal_amount`,`raised_amount`,`cta_title`,`cta_description`,`cta_btn_text`,`cta_btn_link`,`meta_title`,`meta_description`,`status`,`featured`,`sort_order`)
VALUES (
  'new-temple-ayodhya',
  'New ISKCON Temple — Ayodhya Dham',
  'A Grand Spiritual Monument in the Land of Lord Ram',
  'Building a Timeless Abode for the Lord in the Holy Land of Ayodhya',
  'Ayodhya, Uttar Pradesh',
  'In Progress',
  'We are building a magnificent new temple complex in the sacred city of Ayodhya — a monument that will stand for centuries as a beacon of Vedic culture, devotion, and spiritual knowledge.',
  'The new ISKCON Ayodhya Temple will be a world-class spiritual complex featuring the main deity hall, gardens, prasadam hall, and guesthouses. Srila Prabhupada always wanted a grand temple in Ayodhya, the birthplace of Lord Ram.\n\nThis sacred project is being built with the blessings of thousands of devotees from across the world. Every contribution becomes an eternal offering at the Lord\'s lotus feet.',
  '{"Construction":"45%","Devotees":"5,000+","Target Year":"2027"}',
  50000000, 25000000,
  'Be Part of This Sacred Legacy',
  'Your contribution, however small, will be inscribed in the walls of this eternal abode. Every rupee is a petal at the Lord\'s lotus feet.',
  '🙏 Donate for the Temple',
  '/new-temple/new-temple-ayodhya',
  'New ISKCON Temple Ayodhya | Support the Sacred Project',
  'Be part of building the new ISKCON Temple in Ayodhya Dham. Donate for construction, tiles, and sacred seva.',
  'published', 1, 1
);

INSERT INTO `gilehri_seva` (`project_id`,`title`,`subtitle`,`description`,`benefits`,`suggested_amounts`,`badge_text`,`cta_text`,`enabled`) VALUES
(1, 'Gilehri Seva', 'Nourish the Sacred Squirrels of Ayodhya Dham', 'Just as squirrels helped Lord Ram build the bridge to Lanka, participate in Gilehri Seva — feeding and protecting the squirrels in the temple precincts. Your offering earns the same divine grace.', '["Earn the blessings of Lord Ram","Participate in ancient Vedic tradition","Support temple wildlife care","Receive prasadam and certificate"]', '[101,251,501,1001,2101,5100]', '🐿️ Gilehri Seva', '🙏 Participate in Gilehri Seva', 1);

INSERT INTO `temple_donation_settings` (`project_id`,`normal_enabled`,`normal_min_amount`,`normal_label`,`tile_enabled`,`tile_price`,`tile_label`,`tile_description`) VALUES
(1, 1, 1000, 'Donation', 1, 6000, 'Tiles / Square Donation', 'Have your name engraved on a sacred tile in the new ISKCON Ayodhya Temple. A divine legacy for generations.');


-- ══════════════════════════════════════════════════════════
-- 11. LIFE MEMBERSHIP
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS `life_membership_settings` (
  `id`                         INT          PRIMARY KEY DEFAULT 1,
  `page_title`                 VARCHAR(255)           DEFAULT 'Life Membership — ISKCON Ayodhya',
  `banner_image`               TEXT                   DEFAULT NULL,
  `hero_subtitle`              TEXT                   DEFAULT NULL,
  `about_title`                VARCHAR(255)           DEFAULT 'About Life Membership',
  `about_content`              LONGTEXT               DEFAULT NULL,
  `membership_fee`             INT                    DEFAULT 100000,
  `membership_enabled`         TINYINT(1)             DEFAULT 1,
  `cta_member_text`            VARCHAR(255)           DEFAULT 'Become a Life Member',
  `cta_donate_text`            VARCHAR(255)           DEFAULT 'Donate Now',
  `donation_suggested_amounts` TEXT                   DEFAULT NULL,
  `donation_cta_text`          VARCHAR(255)           DEFAULT 'Support Our Mission',
  `meta_title`                 VARCHAR(255)           DEFAULT NULL,
  `meta_description`           TEXT                   DEFAULT NULL,
  `updated_at`                 TIMESTAMP              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `life_membership_benefits` (
  `id`         INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title`      VARCHAR(255)  NOT NULL,
  `description`TEXT                   DEFAULT NULL,
  `icon`       VARCHAR(20)            DEFAULT '✦',
  `image`      TEXT                   DEFAULT NULL,
  `sort_order` INT                    DEFAULT 0,
  `created_at` TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `life_membership_applications` (
  `id`                  INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `full_name`           VARCHAR(255)  NOT NULL,
  `email`               VARCHAR(255)           DEFAULT NULL,
  `phone`               VARCHAR(20)            DEFAULT NULL,
  `address`             TEXT                   DEFAULT NULL,
  `city`                VARCHAR(100)           DEFAULT NULL,
  `state`               VARCHAR(100)           DEFAULT NULL,
  `country`             VARCHAR(100)           DEFAULT 'India',
  `date_of_birth`       DATE                   DEFAULT NULL,
  `notes`               TEXT                   DEFAULT NULL,
  `amount`              INT                    DEFAULT 0,
  `razorpay_order_id`   VARCHAR(255)           DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(255)           DEFAULT NULL,
  `payment_status`      VARCHAR(50)            DEFAULT 'confirmed',
  `created_at`          TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `life_membership_donations` (
  `id`                  INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `full_name`           VARCHAR(255)           DEFAULT NULL,
  `email`               VARCHAR(255)           DEFAULT NULL,
  `phone`               VARCHAR(20)            DEFAULT NULL,
  `amount`              INT                    DEFAULT 0,
  `message`             TEXT                   DEFAULT NULL,
  `razorpay_order_id`   VARCHAR(255)           DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(255)           DEFAULT NULL,
  `payment_status`      VARCHAR(50)            DEFAULT 'confirmed',
  `created_at`          TIMESTAMP              DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default content for Life Membership page
INSERT INTO `life_membership_settings` (`id`,`page_title`,`hero_subtitle`,`about_title`,`about_content`,`membership_fee`,`membership_enabled`,`cta_member_text`,`cta_donate_text`,`donation_suggested_amounts`,`donation_cta_text`,`meta_title`,`meta_description`) VALUES (
  1,
  'Life Membership — ISKCON Ayodhya',
  'Join the eternal family of devotees at ISKCON Ayodhya. Your Life Membership supports the divine mission of spreading Krishna Consciousness and building the Lord\'s sacred abode in the holy city of Ayodhya.',
  'About Life Membership',
  'ISKCON Ayodhya Life Membership is a sacred opportunity for devotees and well-wishers to become a permanent part of ISKCON\'s spiritual family. By becoming a Life Member, you actively participate in the divine mission of spreading Vedic culture, Krishna Consciousness, and the timeless teachings of Bhagavad Gita.\n\nYour Life Membership contribution directly supports temple construction, deity worship, Prasad distribution, educational programs, and various spiritual activities at ISKCON Ayodhya — one of the most sacred cities in the world, the birthplace of Lord Shri Ram.\n\nAs a Life Member, you receive a lifetime of spiritual association, exclusive privileges, and the blessings of the Vaishnavas. Your contribution is eligible for 80G tax exemption under the Income Tax Act.\n\nISKCON was founded in 1966 by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada with the mission to spread the teachings of Bhagavad Gita and Srimad Bhagavatam to every town and village.',
  100000, 1,
  '🌸 Become a Life Member',
  '🙏 Donate Now',
  '[1001, 2100, 5100, 11000, 21000, 51000]',
  'Your contribution, however small, becomes a sacred offering at the lotus feet of the Lord.',
  'Life Membership | ISKCON Ayodhya',
  'Become a Life Member of ISKCON Ayodhya. 80G tax benefit available. Certificate dispatched within 15 days.'
) ON DUPLICATE KEY UPDATE `id` = `id`;

INSERT INTO `life_membership_benefits` (`title`,`description`,`icon`,`sort_order`) VALUES
('Temple Privileges',      'Exclusive access to special darshans, deity rooms, and sacred areas reserved for Life Members.',        '🛕', 1),
('Spiritual Programs',     'Priority registration and complimentary access to festivals, retreats, and Bhagavad Gita courses.',     '📖', 2),
('Accommodation Benefits', 'Preferential booking and discounted rates at ISKCON Ayodhya guest house during festivals.',             '🏨', 3),
('Membership Certificate', 'A beautifully designed Life Membership certificate delivered within 15 working days of confirmation.',  '📜', 4),
('80G Tax Benefit',        'Eligible for 80G tax exemption. Official receipt issued within 7 working days of payment.',            '✅', 5),
('Prasad & Blessings',     'Receive sacred Prasad and special blessings on your birthday, anniversary, and auspicious occasions.', '🌸', 6),
('Community Access',       'Join thousands of devotees worldwide. Connect, participate, and grow spiritually together.',           '🤝', 7),
('Newsletter & Updates',   'Regular updates on temple activities, construction progress, and upcoming spiritual events.',           '📩', 8);


SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- ✅ SETUP COMPLETE
-- After importing, visit:
--   https://yourdomain.com/api/admin/setup
-- Body (POST): { "username":"admin", "password":"YourNewPassword", "secret":"iskcon-setup-2024" }
-- This sets your admin login password securely.
-- ============================================================
