/**
 * Constants for the generate/ad creation flow
 */

export const steps = [
  { number: 1, label: "URL" },
  { number: 2, label: "Strategy" },
  { number: 3, label: "Banners" },
  { number: 4, label: "Results" },
];

export const adOptions = [
  { value: 3, label: "Quick test", badge: null as string | null },
  { value: 5, label: "Best", badge: null as string | null },
  { value: 8, label: "More variety", badge: null as string | null },
  { value: 10, label: "Maximum", badge: null as string | null },
  { value: 20, label: "Pro", badge: "PRO" as string | null },
];

export const bannerSizes = [
  { 
    id: "square", 
    name: "Square", 
    dimensions: "1080×1080", 
    description: "Feed, Carousel",
    icon: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"
  },
  { 
    id: "portrait", 
    name: "Portrait", 
    dimensions: "1080×1350", 
    description: "Feed (optimal)",
    icon: "M720-80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80h480v-640H240v640Zm0 0v-640 640Z"
  },
  { 
    id: "story", 
    name: "Story", 
    dimensions: "1080x1920", 
    description: "Stories, Reels",
    icon: "M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm120-40h160q17 0 28.5-11.5T600-200q0-17-11.5-28.5T560-240H400q-17 0-28.5 11.5T360-200q0 17 11.5 28.5T400-160Z"
  },
  { 
    id: "landscape", 
    name: "Landscape", 
    dimensions: "1200×628", 
    description: "Link ads",
    icon: "M200-280q-33 0-56.5-23.5T120-360v-240q0-33 23.5-56.5T200-680h560q33 0 56.5 23.5T840-600v240q0 33-23.5 56.5T760-280H200Zm0-80h560v-240H200v240Zm0 0v-240 240Z"
  },
];

export interface Archetype {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export const archetypeCategories = [
  {
    name: "NATIVE/ORGANIC",
    archetypes: [
      { id: "lofi", name: "Lo-Fi", description: "iPhone-style casual shot", icon: "M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z" },
      { id: "ugc", name: "UGC", description: "TikTok creator review style", icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
      { id: "meme", name: "Meme", description: "Organic meme format", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
      { id: "messages", name: "Messages", description: "iMessage conversation", icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" },
    ],
  },
  {
    name: "SOCIAL PROOF",
    archetypes: [
      { id: "5star", name: "5-Star", description: "Gold star testimonial", icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" },
      { id: "quote", name: "Quote", description: "Customer quote + photo", icon: "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" },
      { id: "comments", name: "Comments", description: "Social comments praising product", icon: "M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" },
      { id: "stats", name: "Stats", description: "Giant statistic focal point", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" },
    ],
  },
  {
    name: "URGENCY/SALES",
    archetypes: [
      { id: "price", name: "Price", description: "Crossed-out price + discount", icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" },
      { id: "timer", name: "Timer", description: "Limited time countdown", icon: "M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" },
      { id: "airdrop", name: "AirDrop", description: "iOS notification popup", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
      { id: "notify", name: "Notify", description: "Lock screen notification", icon: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" },
    ],
  },
  {
    name: "EDUCATIONAL",
    archetypes: [
      { id: "listicle", name: "Listicle", description: "Numbered benefits list", icon: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z" },
      { id: "grid", name: "Grid", description: "3-4 benefits in grid", icon: "M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" },
      { id: "split", name: "Split", description: "Before vs After", icon: "M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z" },
      { id: "compare", name: "Compare", description: "Competitor comparison", icon: "M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22v-2h-7.01V5L13 9l3.99 4z" },
    ],
  },
  {
    name: "PRODUCT FOCUS",
    archetypes: [
      { id: "lifestyle", name: "Lifestyle", description: "Product in real-world use", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
      { id: "unbox", name: "Unbox", description: "Package opening moment", icon: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" },
      { id: "app", name: "App", description: "App-style rating card", icon: "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" },
      { id: "minimal", name: "Minimal", description: "Clean, 80% whitespace", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" },
    ],
  },
];

export const quickFilters = ["Ecommerce", "Saas", "Services", "Restaurant"];

// Predefined archetype selections for each quick filter
export const quickFilterSelections: Record<string, string[]> = {
  Ecommerce: ["lifestyle", "5star", "price"],
  Saas: ["5star", "quote", "app"],
  Services: ["5star", "quote", "stats"],
  Restaurant: ["lifestyle", "5star", "ugc"],
};
