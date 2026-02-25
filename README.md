# SOLE - Shoe Store

A modern, fully-functional e-commerce shoe store built with Next.js and Tailwind CSS. Features product browsing, filtering, shopping cart functionality, and connects to a custom REST API.

## 🌐 Live Demo

**[View Live Site](#)** *(Add your Vercel URL here after deployment)*

## ✨ Features

- **Product Catalog** - Browse 18+ premium shoes from top brands
- **Advanced Filtering** - Filter by brand, category, gender, and price range
- **Product Details** - Individual product pages with size and color selection
- **Shopping Cart** - Full cart functionality with add/remove/quantity controls
- **Cart Modal** - Slide-out cart panel to view and manage items
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **API Integration** - Connects to custom-built REST API
- **Real-time Updates** - Live cart counter and instant filter results

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - Component-based UI library
- **[Tailwind CSS 3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Context API](https://react.dev/learn/passing-data-deeply-with-context)** - State management for shopping cart
- **Custom REST API** - Backend API built with Express.js ([API Repository](https://github.com/Mercyaksss/shoe-store-api))

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/Mercyaksss/shoe-store.git
cd shoe-store
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
shoe-store/
├── app/
│   ├── components/
│   │   ├── Navbar/           # Navigation bar with cart
│   │   ├── Hero/             # Landing hero section
│   │   ├── ProductCard/      # Product display card
│   │   ├── FilterSidebar/    # Filter controls
│   │   └── CartModal/        # Shopping cart modal
│   ├── context/
│   │   └── CartContext.js    # Cart state management
│   ├── product/
│   │   └── [id]/             # Dynamic product pages
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout
│   └── page.js               # Homepage
├── public/                   # Static assets
└── tailwind.config.js        # Tailwind configuration
```

## 🎨 Key Features

### Product Browsing
- Grid layout with responsive columns
- Hover effects and smooth transitions
- Product images from Unsplash

### Filtering System
- Filter by brand (Nike, Adidas, Puma, etc.)
- Filter by category (sneakers, running, boots, casual)
- Price range filtering (min/max)
- Real-time results from API

### Product Pages
- Dynamic routing (`/product/[id]`)
- Size selection (US sizing)
- Color variants
- Product details and specifications

### Shopping Cart
- Add items with size/color selection
- Update quantities
- Remove items
- Real-time total calculation
- Persistent cart state (Context API)
- Slide-out cart modal

## 🔗 API Integration

This project connects to a custom-built REST API:

**API Base URL:** `https://shoe-store-api-dei7.onrender.com`

**Endpoints Used:**
- `GET /api/shoes` - Fetch all shoes
- `GET /api/shoes/:id` - Fetch single shoe
- `GET /api/shoes?brand=nike` - Filter by brand
- `GET /api/shoes?category=sneakers` - Filter by category
- `GET /api/shoes?minPrice=50&maxPrice=150` - Filter by price
- `GET /api/brands` - Get all brands
- `GET /api/categories` - Get all categories

[View API Repository →](https://github.com/Mercyaksss/shoe-store-api)

## 📱 Responsive Design

The store is fully responsive with breakpoints for:
- **Desktop** (1024px+) - Full layout with sidebar filters
- **Tablet** (768px - 1024px) - Adjusted grid and stacked filters
- **Mobile** (<768px) - Single column layout optimized for touch

## 🚧 Future Enhancements

- [ ] Search functionality
- [ ] User authentication
- [ ] Wishlist feature
- [ ] Product reviews and ratings
- [ ] Checkout flow
- [ ] Order history
- [ ] Payment integration (Stripe)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Contact

**Mercy Yakubu**

- Portfolio: [portfolio-bento-grid-ten.vercel.app](https://portfolio-bento-grid-ten.vercel.app/)
- GitHub: [@Mercyaksss](https://github.com/Mercyaksss)
- Email: mercyaksss625@gmail.com

---

⭐ If you like this project, please consider giving it a star on GitHub!"# SOLE---E-commerce-Shoe-Store" 
"# e-com-" 
