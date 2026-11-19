import type { Product, Service } from "./api";

/**
 * Embedded fallback catalogue — used ONLY if the backend API cannot be
 * reached, so the shop still renders. The real catalogue lives in the
 * backend (backend/src/data.ts, or MongoDB when seeded). If you change the
 * real catalogue, update this copy too so the fallback matches.
 */
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const FALLBACK_PRODUCTS: Product[] = [
  { id: "iphone-13-128", name: "iPhone 13 · 128GB", category: "Phones", price: 520000, oldPrice: 580000, description: "UK-used iPhone 13 in excellent condition, 128GB storage, Face ID and battery health verified.", stock: 6, badge: "Best Seller", image: img("photo-1592750475338-74b7b21085ab") },
  { id: "samsung-a55", name: "Samsung Galaxy A55 5G", category: "Phones", price: 485000, description: "Brand-new Galaxy A55 5G with 8GB RAM and 128GB storage, 50MP camera and a 5,000mAh battery.", stock: 8, image: img("photo-1610945415295-d9bbf067e59c") },
  { id: "infinix-note-40-pro", name: "Infinix Note 40 Pro", category: "Phones", price: 285000, oldPrice: 310000, description: "Infinix Note 40 Pro with 12GB RAM, 256GB storage, 108MP camera and 70W fast charging.", stock: 12, badge: "New", image: img("photo-1511707171634-5f897ff02aa9") },
  { id: "tecno-spark-20", name: "Tecno Spark 20", category: "Phones", price: 145000, description: "Affordable everyday phone — 8GB RAM, 128GB storage, 50MP camera and a big 5,000mAh battery.", stock: 20, image: img("photo-1598327105666-5b89351aff97") },
  { id: "hp-pavilion-15", name: "HP Pavilion 15 · Ryzen 5", category: "Laptops & Computers", price: 780000, oldPrice: 850000, description: "HP Pavilion 15 with AMD Ryzen 5, 8GB RAM and 512GB SSD. UK-used, tested.", stock: 4, badge: "Best Seller", image: img("photo-1496181133206-80ce9b88a853") },
  { id: "lenovo-ideapad-slim-3", name: "Lenovo IdeaPad Slim 3", category: "Laptops & Computers", price: 620000, description: "Slim and light IdeaPad with Intel Core i5, 8GB RAM and 512GB SSD. Brand new, sealed.", stock: 5, image: img("photo-1541807084-5c52b6b3adef") },
  { id: "macbook-air-m2", name: "Apple MacBook Air M2", category: "Laptops & Computers", price: 1450000, description: "MacBook Air with Apple M2 chip, 8GB unified memory and 256GB SSD.", stock: 3, badge: "Premium", image: img("photo-1517336714731-489689fd1ca8") },
  { id: "anker-20w-charger", name: "Anker 20W USB-C Fast Charger", category: "Accessories", price: 18500, description: "Genuine Anker 20W USB-C charger — charges an iPhone to 50% in about 30 minutes.", stock: 40, image: img("photo-1609091839311-d5365f9ff1c5") },
  { id: "oraimo-freepods-4", name: "Oraimo FreePods 4 ANC Earbuds", category: "Accessories", price: 32000, oldPrice: 38000, description: "Oraimo FreePods 4 with active noise cancellation and 35-hour total playtime.", stock: 25, image: img("photo-1590658268037-6bf12165a8df") },
  { id: "logitech-m185-mouse", name: "Logitech M185 Wireless Mouse", category: "Accessories", price: 14000, description: "Reliable Logitech wireless mouse with a 1-year battery life.", stock: 30, image: img("photo-1527864550417-7fd91fc51a46") },
  { id: "iphone-13-screen", name: "iPhone 13 Replacement Screen", category: "Spares", price: 85000, description: "Original-quality replacement screen for iPhone 13. Fitting available in-store in Lagos.", stock: 10, image: img("photo-1512941937669-90a1b58e7e9c") },
  { id: "samsung-a-series-battery", name: "Samsung A-Series Replacement Battery", category: "Spares", price: 22000, description: "Genuine-capacity replacement battery for Samsung Galaxy A-series phones.", stock: 15, image: img("photo-1585060544812-6b45742d762f") },
  { id: "smartwatch-series-9", name: "Smart Watch Series 9", category: "Gadgets", price: 95000, oldPrice: 110000, description: "Smart watch with AMOLED display, Bluetooth calling and health tracking.", stock: 9, badge: "New", image: img("photo-1546868871-7041f2a55e12") },
  { id: "jbl-go-3-speaker", name: "JBL Go 3 Bluetooth Speaker", category: "Gadgets", price: 48000, oldPrice: 55000, description: "Pocket-sized JBL Go 3 speaker with big sound and waterproof design.", stock: 14, image: img("photo-1608043152269-423dbba4e7e1") },
  { id: "microsoft-365-personal", name: "Microsoft 365 Personal · 1 Year", category: "Software", price: 42000, description: "Genuine Microsoft 365 Personal licence for 1 year — Word, Excel, PowerPoint, Outlook and 1TB OneDrive.", stock: 50, badge: "Digital Delivery", image: img("photo-1551288049-bebda4e38f71") },
  { id: "laptop-backpack-156", name: "Water-Resistant Laptop Backpack 15.6″", category: "General Goods", price: 35000, description: "Padded, water-resistant backpack that fits laptops up to 15.6″, with a USB charging port.", stock: 18, image: img("photo-1553062407-98eeb64c6a62") },
];

export const FALLBACK_SERVICES: Service[] = [
  { id: "software-development", name: "Software Development", tagline: "Custom software, built for your business", description: "From internal tools and dashboards to full business systems — we design, build and support software that fits how your team actually works.", startingFrom: 500000, features: ["Custom web dashboards & business tools", "APIs and system integrations", "Testing, deployment & ongoing support"] },
  { id: "it-consulting", name: "IT Consulting", tagline: "Straight answers on tech, before you spend", description: "We help small businesses choose the right hardware, software and systems — and set them up properly.", startingFrom: 100000, features: ["Hardware & software advice", "Network and office setup", "Security and data-backup planning"] },
  { id: "web-applications", name: "Web Applications", tagline: "Fast, modern websites that sell", description: "Company websites, online stores and web apps — designed to look professional and load fast.", startingFrom: 350000, features: ["Business websites & online stores", "Booking, ordering & payment flows", "SEO and mobile-first design"] },
  { id: "mobile-applications", name: "Mobile Applications", tagline: "Your business in your customers' pockets", description: "Android and iOS apps built with React Native — from shop apps to booking apps.", startingFrom: 600000, features: ["Android & iOS from one codebase", "App Store & Play Store publishing", "Push notifications and payments"] },
];

export const FALLBACK_CATEGORIES: string[] = Array.from(
  new Set(FALLBACK_PRODUCTS.map((p) => p.category)),
);
