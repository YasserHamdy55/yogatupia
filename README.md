# Heba Mind & Body - Wellness Website

A modern, responsive wellness website for a premium Yoga, Pilates, and Reformer Pilates studio with retreat booking capabilities.

## 🌿 Features

### Pages

- **Homepage**: Hero section, services overview, testimonials, newsletter signup
- **Classes**: Weekly schedule with filters, detailed class information, booking system
- **Retreats**: Upcoming retreats with full itineraries, booking flow
- **Pricing**: Package options with detailed features
- **About**: Instructor biography, philosophy, certifications, media appearances
- **Contact**: Contact form, studio information, FAQ section, map placeholder

### Functionality

- **Booking System**: Multi-step booking flow for classes with:
  - Personal details collection
  - Payment method selection (mock)
  - Booking confirmation
- **Retreat Booking**: Enhanced booking flow with:
  - Room type selection (shared/private)
  - Deposit or full payment options
  - Detailed booking summary
- **Class Filtering**: Filter classes by type (Yoga, Pilates, Reformer)
- **Responsive Design**: Mobile-first approach, works beautifully on all devices
- **Smooth Animations**: Elegant hover effects and transitions
- **Newsletter Subscription**: Email collection with confirmation

## 🎨 Design

### Color Palette

- **Sage Green**: Primary brand color (#637263 and variants)
- **Sand/Beige**: Warm neutrals (#f5f3ef, #ebe7de)
- **White**: Clean backgrounds
- **Muted Gold**: Accent touches

### Typography

- **Headings**: Cormorant Garamond (serif, elegant)
- **Body**: Inter (sans-serif, clean)

### UI Elements

- Rounded cards with soft shadows
- Rounded buttons (pill-shaped)
- Spacious layouts with breathing room
- High-quality placeholder images from Unsplash

## 🛠️ Technology Stack

- **React 19.2**: Component-based UI
- **React Router 7**: Client-side routing
- **Tailwind CSS 4**: Utility-first styling
- **Vite 8**: Fast build tool and dev server
- **Lucide React**: Beautiful icon library

## 📁 Project Structure

```
heba-mind-body/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky navigation with mobile menu
│   │   ├── Footer.jsx           # Footer with links and social media
│   │   ├── BookingModal.jsx     # Class booking flow
│   │   └── RetreatBookingModal.jsx  # Retreat booking flow
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Classes.jsx          # Class schedule
│   │   ├── Retreats.jsx         # Retreat listings
│   │   ├── Pricing.jsx          # Pricing packages
│   │   ├── About.jsx            # About instructor
│   │   └── Contact.jsx          # Contact form
│   ├── data/
│   │   └── mockData.js          # Mock data (classes, retreats, etc.)
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:

```bash
cd heba-mind-body
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to http://localhost:5173/

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📊 Mock Data

All content is currently powered by mock data in `src/data/mockData.js`:

- **Classes**: 8 sample classes with different types, times, and details
- **Retreats**: 3 upcoming retreats with full information
- **Testimonials**: 4 customer reviews
- **Pricing Plans**: 6 package options
- **FAQs**: Common questions and answers
- **Services**: 6 service categories

You can easily modify this data to match real content.

## 🔄 Future Enhancements

### Backend Integration

- Connect to a real database (MongoDB, PostgreSQL, etc.)
- User authentication and login system
- Real payment processing (Stripe, PayPal, Paymob)
- Email notifications (SendGrid, Mailgun)
- Calendar sync (Google Calendar, iCal)

### Features to Add

- User accounts and booking history
- Instructor profiles (if multiple instructors)
- Blog/articles section
- Video library for online classes
- Live class streaming
- Reviews and ratings system
- Waitlist functionality
- Gift cards
- Membership portal

### Technical Improvements

- Add form validation library (React Hook Form + Zod)
- Add state management (Zustand or Redux)
- Add animations library (Framer Motion)
- Implement lazy loading for images
- Add PWA support
- SEO optimization (meta tags, sitemap)
- Analytics integration (Google Analytics)

## 🎯 Key Features for Business

1. **Professional Branding**: Premium, calming design suitable for media/TV presence
2. **Easy Booking**: Streamlined booking flow reduces friction
3. **Mobile Optimized**: Most users will browse on mobile
4. **Scalable**: Clean code structure makes it easy to add features
5. **Conversion Focused**: Multiple CTAs guide users to book

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

All components are fully responsive and tested across devices.

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js` to modify the sage and sand color palettes.

### Change Fonts

Update the Google Fonts import in `src/index.css` and the font families in `tailwind.config.js`.

### Modify Content

All mock data is in `src/data/mockData.js` - just edit the arrays and objects.

### Add Images

Replace Unsplash placeholder URLs with your own images. For best results:

- Hero images: 1920x1080px minimum
- Retreat cards: 800x600px
- Portrait images: 600x800px

## 📝 License

This is a custom project built for Heba Mind & Body. All rights reserved.

## 🤝 Support

For questions or support, contact: hello@hebamindbody.com

---

**Built with ❤️ for wellness and mindful movement**
