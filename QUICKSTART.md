# Quick Start Guide - Heba Mind & Body Website

## 🎯 What You Have

A complete, modern wellness website with:

- 6 fully functional pages
- Working booking system for classes and retreats
- Mobile-responsive design
- Beautiful premium aesthetic

## 🚀 Running the Website

The development server is already running at: **http://localhost:5173/**

Open this URL in your browser to see the website live!

## 📄 Pages Available

Navigate to these pages from the menu:

1. **Home** (`/`) - Landing page with hero, services, testimonials
2. **Classes** (`/classes`) - Browse and book yoga/pilates classes
3. **Retreats** (`/retreats`) - View and book wellness retreats
4. **Pricing** (`/pricing`) - Package options and pricing
5. **About** (`/about`) - About Heba, certifications, philosophy
6. **Contact** (`/contact`) - Contact form, info, and FAQs

## 🎨 Customizing Content

### To change class information:

Open `src/data/mockData.js` and edit the `classes` array.

### To change retreat information:

Edit the `retreats` array in `src/data/mockData.js`.

### To change pricing:

Edit the `pricingPlans` array in `src/data/mockData.js`.

### To change testimonials:

Edit the `testimonials` array in `src/data/mockData.js`.

## 🖼️ Changing Images

Currently using placeholder images from Unsplash. To use your own:

1. Add your images to `public/` folder
2. Replace image URLs in components with `/your-image.jpg`

Example locations:

- Home page hero: `src/pages/Home.jsx` (line ~30)
- Retreat cards: `src/data/mockData.js` (in retreats array)
- About page: `src/pages/About.jsx` (line ~40)

## 🎨 Changing Colors

Edit `tailwind.config.js` to modify:

- `sage` color (primary green)
- `sand` color (beige/neutral)

The color scheme is used throughout the site automatically.

## ⚙️ Testing the Booking Flow

1. Go to Classes page
2. Click "Book Now" on any class
3. Fill out the form (step by step)
4. See the confirmation message

Same process for Retreats!

## 🌐 Deploying to Production

When ready to launch:

```bash
npm run build
```

This creates a `dist/` folder with optimized files you can upload to any web host:

- Vercel
- Netlify
- GitHub Pages
- Any web server

## 📝 Next Steps

### Phase 1 - Content

- [ ] Replace mock data with real class schedule
- [ ] Add real retreat information
- [ ] Update pricing with actual prices
- [ ] Add real testimonials
- [ ] Replace placeholder images with professional photos

### Phase 2 - Backend (Future)

- [ ] Set up database for classes/bookings
- [ ] Integrate real payment gateway
- [ ] Add email notifications
- [ ] Create admin dashboard

### Phase 3 - Marketing (Future)

- [ ] Add SEO meta tags
- [ ] Set up Google Analytics
- [ ] Create social media integration
- [ ] Add blog section

## 🆘 Common Issues

**Website not loading?**

- Make sure dev server is running (`npm run dev`)
- Check you're on http://localhost:5173/

**Styling looks broken?**

- Ensure Tailwind is properly configured
- Check `tailwind.config.js` and `postcss.config.js` exist

**Booking not working?**

- This is currently mock data - no real bookings are saved
- Connect to a backend to save real bookings

## 📞 Need Help?

This is a complete, ready-to-use website. All functionality is working with mock data. To go live, you'll need to:

1. Replace mock data with real content
2. Add your actual images
3. Set up a backend for real bookings (future phase)

**The website is production-ready as a static site!** You can deploy it right now and collect bookings via the contact form while building the backend.

---

**Your website is live on localhost:5173 - enjoy! 🌿**
