export type Noise = "quiet" | "lively" | "loud";
export type Parking = "lot" | "valet" | "street";

export interface Spot {
  name: string;
  neighborhood: string;
  vibe: string;
  knownFor: string;
  noise: Noise;
  parking: Parking;
  reservations: boolean;
  openSunday: boolean;
  price: "$" | "$$" | "$$$";
  tags: string[];
  menuUrl: string;
  reserveUrl?: string;
  id?: string;
  lat?: number | null;
  lng?: number | null;
  parkingNotes?: { quote: string; url: string; source: string }[];
}

// Curated starter list. Details should be re-verified by the owner before launch.
export const SPOTS: Spot[] = [
  { name: "Lockeland Table", neighborhood: "East Nashville", vibe: "Cozy neighborhood dining room", knownFor: "Wood-fired pizza and community hour", noise: "quiet", parking: "lot", reservations: true, openSunday: false, price: "$$", tags: ["family", "date", "cozy"], menuUrl: "https://www.lockelandtable.com", reserveUrl: "https://www.lockelandtable.com" },
  { name: "Margot Cafe & Bar", neighborhood: "East Nashville", vibe: "Candlelit French-Italian bistro", knownFor: "Seasonal menu and Sunday brunch", noise: "quiet", parking: "street", reservations: true, openSunday: true, price: "$$$", tags: ["date", "brunch", "romantic", "family"], menuUrl: "https://www.margotcafe.com", reserveUrl: "https://www.margotcafe.com" },
  { name: "Peninsula", neighborhood: "East Nashville", vibe: "Moody, intimate Iberian kitchen", knownFor: "Tasting-style Spanish plates", noise: "quiet", parking: "street", reservations: true, openSunday: false, price: "$$$", tags: ["date", "romantic", "cocktails"], menuUrl: "https://www.peninsulanashville.com", reserveUrl: "https://www.peninsulanashville.com" },
  { name: "Butcher & Bee", neighborhood: "East Nashville", vibe: "Bright, buzzy Mediterranean", knownFor: "Whipped feta and shared plates", noise: "lively", parking: "lot", reservations: true, openSunday: true, price: "$$", tags: ["brunch", "friends", "patio"], menuUrl: "https://butcherandbee.com/nashville", reserveUrl: "https://butcherandbee.com/nashville" },
  { name: "Rolf and Daughters", neighborhood: "Germantown", vibe: "Industrial-chic pasta house", knownFor: "Handmade pasta", noise: "lively", parking: "street", reservations: true, openSunday: true, price: "$$$", tags: ["date", "friends", "cocktails"], menuUrl: "https://www.rolfanddaughters.com", reserveUrl: "https://www.rolfanddaughters.com" },
  { name: "City House", neighborhood: "Germantown", vibe: "Warm Southern-Italian", knownFor: "Belly ham pizza, Sunday supper", noise: "lively", parking: "lot", reservations: true, openSunday: true, price: "$$", tags: ["family", "date"], menuUrl: "https://www.cityhousenashville.com", reserveUrl: "https://www.cityhousenashville.com" },
  { name: "Germantown Cafe", neighborhood: "Germantown", vibe: "Classic bistro with skyline views", knownFor: "Brunch and patio", noise: "quiet", parking: "lot", reservations: true, openSunday: true, price: "$$", tags: ["family", "brunch", "patio"], menuUrl: "https://www.germantowncafe.com", reserveUrl: "https://www.germantowncafe.com" },
  { name: "Henrietta Red", neighborhood: "Germantown", vibe: "Airy, light-filled oyster bar", knownFor: "Oysters and wood-fired veggies", noise: "lively", parking: "street", reservations: true, openSunday: true, price: "$$$", tags: ["date", "brunch", "cocktails"], menuUrl: "https://www.henriettared.com", reserveUrl: "https://www.henriettared.com" },
  { name: "Hattie B's Hot Chicken", neighborhood: "Midtown", vibe: "Fast, loud, legendary", knownFor: "Hot chicken and cold beer", noise: "loud", parking: "lot", reservations: false, openSunday: true, price: "$", tags: ["casual", "hot chicken", "beer", "friends"], menuUrl: "https://hattieb.com" },
  { name: "The Catbird Seat", neighborhood: "Midtown", vibe: "Chef's counter theater", knownFor: "Tasting menu experience", noise: "quiet", parking: "valet", reservations: true, openSunday: false, price: "$$$", tags: ["date", "romantic", "special"], menuUrl: "https://www.thecatbirdseatrestaurant.com", reserveUrl: "https://www.thecatbirdseatrestaurant.com" },
  { name: "Bolton's Spicy Chicken & Fish", neighborhood: "East Nashville", vibe: "No-frills hot chicken shack", knownFor: "Spicy fried fish and chicken", noise: "lively", parking: "lot", reservations: false, openSunday: false, price: "$", tags: ["casual", "hot chicken"], menuUrl: "https://boltonsspicy.com" },
  { name: "Adele's", neighborhood: "The Gulch", vibe: "Breezy garage-style dining room", knownFor: "Weekend brunch", noise: "lively", parking: "valet", reservations: true, openSunday: true, price: "$$", tags: ["brunch", "family", "patio"], menuUrl: "https://www.adelesnashville.com", reserveUrl: "https://www.adelesnashville.com" },
  { name: "Biscuit Love", neighborhood: "The Gulch", vibe: "Bustling brunch staple", knownFor: "Bonuts and biscuits", noise: "loud", parking: "street", reservations: false, openSunday: true, price: "$", tags: ["brunch", "casual", "friends"], menuUrl: "https://biscuitlove.com" },
  { name: "Burger Up", neighborhood: "12 South", vibe: "Easygoing local burger joint", knownFor: "Local beef burgers", noise: "lively", parking: "street", reservations: false, openSunday: true, price: "$", tags: ["casual", "beer", "family"], menuUrl: "https://www.burger-up.com" },
  { name: "Urban Grub", neighborhood: "12 South", vibe: "Polished patio steak and seafood", knownFor: "Oysters and steaks on the patio", noise: "lively", parking: "valet", reservations: true, openSunday: true, price: "$$$", tags: ["date", "patio", "cocktails", "brunch"], menuUrl: "https://www.urbangrub.net", reserveUrl: "https://www.urbangrub.net" },
];
