import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Plus, Minus, Leaf, Flame, UtensilsCrossed, X } from "lucide-react";
import { useGetMenuCategories, useGetMenuItems } from "@workspace/api-client-react";
import { useCartStore } from "@/store/cartStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";

// All menu data as fallback
const MENU_DATA = [
  { id: 101, name: "Chicken Clear Soup", price: 170, categorySlug: "soups", categoryName: "Soups", isVeg: false, isBestseller: false, isAvailable: true, description: "Light and delicate chicken broth", rating: 4.2, reviewCount: 45, orderCount: 120, spiceLevel: 1 },
  { id: 102, name: "Chicken Dragon Soup", price: 170, categorySlug: "soups", categoryName: "Soups", isVeg: false, isBestseller: true, isAvailable: true, description: "Spicy dragon-style soup with fiery flavors", rating: 4.5, reviewCount: 67, orderCount: 180, spiceLevel: 3 },
  { id: 103, name: "Chicken Hot & Sour Soup", price: 170, categorySlug: "soups", categoryName: "Soups", isVeg: false, isBestseller: false, isAvailable: true, description: "Classic hot and sour with chicken", rating: 4.3, reviewCount: 52, orderCount: 145, spiceLevel: 3 },
  { id: 104, name: "Chicken Lemon Coriander Soup", price: 170, categorySlug: "soups", categoryName: "Soups", isVeg: false, isBestseller: false, isAvailable: true, description: "Refreshing lemon-infused soup", rating: 4.1, reviewCount: 38, orderCount: 98, spiceLevel: 1 },
  { id: 105, name: "Chicken Manchow Soup", price: 170, categorySlug: "soups", categoryName: "Soups", isVeg: false, isBestseller: true, isAvailable: true, description: "Indo-Chinese manchow with crispy noodles", rating: 4.6, reviewCount: 89, orderCount: 220, spiceLevel: 2 },
  { id: 201, name: "Baby Corn Manchurian", price: 250, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: false, isAvailable: true, description: "Crispy baby corn in tangy Manchurian sauce", rating: 4.2, reviewCount: 56, orderCount: 140, spiceLevel: 2 },
  { id: 202, name: "Babycorn 65", price: 260, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: false, isAvailable: true, description: "South Indian style spicy babycorn 65", rating: 4.1, reviewCount: 43, orderCount: 110, spiceLevel: 3 },
  { id: 203, name: "Butter Garlic Babycorn", price: 290, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: false, isAvailable: true, description: "Tender babycorn sauteed in rich butter garlic", rating: 4.3, reviewCount: 37, orderCount: 95, spiceLevel: 1 },
  { id: 204, name: "Butter Garlic Mushroom", price: 290, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: true, isAvailable: true, description: "Juicy mushrooms in aromatic butter garlic sauce", rating: 4.6, reviewCount: 78, orderCount: 195, spiceLevel: 1 },
  { id: 205, name: "Chilli Babycorn", price: 260, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: false, isAvailable: true, description: "Indo-Chinese chilli babycorn with peppers", rating: 4.0, reviewCount: 32, orderCount: 85, spiceLevel: 3 },
  { id: 206, name: "Chilli Gobi", price: 250, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: true, isAvailable: true, description: "Crispy cauliflower in spicy chilli sauce", rating: 4.4, reviewCount: 92, orderCount: 230, spiceLevel: 3 },
  { id: 207, name: "Hong Kong Gobi", price: 280, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: false, isAvailable: true, description: "Cauliflower in Hong Kong style sauce", rating: 4.2, reviewCount: 44, orderCount: 112, spiceLevel: 2 },
  { id: 208, name: "Mushroom 65", price: 290, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: false, isAvailable: true, description: "Spicy South Indian style mushroom 65", rating: 4.3, reviewCount: 51, orderCount: 128, spiceLevel: 3 },
  { id: 209, name: "Mushroom Manchurian", price: 290, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: false, isAvailable: true, description: "Mushroom in classic Manchurian gravy", rating: 4.1, reviewCount: 39, orderCount: 98, spiceLevel: 2 },
  { id: 210, name: "Paneer 65", price: 320, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: true, isAvailable: true, description: "Crispy paneer cubes marinated in spiced yogurt", rating: 4.7, reviewCount: 112, orderCount: 280, spiceLevel: 2 },
  { id: 211, name: "Paneer Majestic", price: 340, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: true, isAvailable: true, description: "Premium paneer in rich masala with cashews", rating: 4.8, reviewCount: 134, orderCount: 340, spiceLevel: 2 },
  { id: 212, name: "Crispy Corn", price: 260, categorySlug: "veg-starters", categoryName: "Veg Starters", isVeg: true, isBestseller: true, isAvailable: true, description: "Golden crispy corn kernels with herbs", rating: 4.5, reviewCount: 88, orderCount: 220, spiceLevel: 1 },
  { id: 301, name: "Chicken 65", price: 320, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Iconic spicy South Indian fried chicken", rating: 4.7, reviewCount: 156, orderCount: 420, spiceLevel: 3 },
  { id: 302, name: "Chicken 555", price: 340, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: false, isAvailable: true, description: "Fiery five-spice marinated crispy chicken", rating: 4.5, reviewCount: 98, orderCount: 245, spiceLevel: 3 },
  { id: 303, name: "Chicken Majestic", price: 360, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Premium chicken in rich royal masala", rating: 4.8, reviewCount: 178, orderCount: 450, spiceLevel: 2 },
  { id: 304, name: "Chicken Manchurian", price: 350, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: false, isAvailable: true, description: "Classic Indo-Chinese Manchurian chicken", rating: 4.4, reviewCount: 89, orderCount: 222, spiceLevel: 2 },
  { id: 305, name: "Chicken Lollipop", price: 340, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Frenched chicken wings in fiery coating", rating: 4.7, reviewCount: 167, orderCount: 420, spiceLevel: 3 },
  { id: 306, name: "Chicken Drumsticks", price: 360, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: false, isAvailable: true, description: "Juicy drumsticks marinated in signature spices", rating: 4.5, reviewCount: 112, orderCount: 280, spiceLevel: 2 },
  { id: 307, name: "Kalmi Chicken Kabab", price: 420, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Tender half-leg marinated in aromatic spices", rating: 4.8, reviewCount: 145, orderCount: 365, spiceLevel: 2 },
  { id: 308, name: "Red Charcoal Chicken Kabab", price: 440, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Smoky red charcoal-grilled kabab pieces", rating: 4.9, reviewCount: 189, orderCount: 480, spiceLevel: 2 },
  { id: 309, name: "Mint Mustard Chicken", price: 420, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: false, isAvailable: true, description: "Herb-marinated chicken in fresh mint mustard", rating: 4.6, reviewCount: 78, orderCount: 195, spiceLevel: 1 },
  { id: 310, name: "Kaju Nut Chicken", price: 390, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: false, isAvailable: true, description: "Premium chicken with roasted cashew coating", rating: 4.5, reviewCount: 67, orderCount: 168, spiceLevel: 2 },
  { id: 311, name: "Chicken Tikka", price: 420, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Classic tandoor-grilled marinated chicken cubes", rating: 4.8, reviewCount: 198, orderCount: 495, spiceLevel: 2 },
  { id: 312, name: "Chicken Tandoori", price: 480, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Whole chicken marinated in tandoori masala", rating: 4.9, reviewCount: 234, orderCount: 585, spiceLevel: 2 },
  { id: 313, name: "Chicken Pepper Fry", price: 370, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: false, isAvailable: true, description: "Bold black pepper chicken dry fry", rating: 4.4, reviewCount: 82, orderCount: 205, spiceLevel: 3 },
  { id: 314, name: "Dragon Chicken", price: 360, categorySlug: "non-veg-starters", categoryName: "Non Veg Starters", isVeg: false, isBestseller: true, isAvailable: true, description: "Fiery dragon-style crispy chicken", rating: 4.7, reviewCount: 143, orderCount: 358, spiceLevel: 4 },
  { id: 401, name: "Chicken Dum Biryani", price: 280, categorySlug: "biryanis", categoryName: "Biryanis", isVeg: false, isBestseller: true, isAvailable: true, description: "Slow-cooked dum biryani with tender chicken", rating: 4.8, reviewCount: 245, orderCount: 620, spiceLevel: 2 },
  { id: 402, name: "Chicken Dilkush Biryani", price: 320, categorySlug: "biryanis", categoryName: "Biryanis", isVeg: false, isBestseller: true, isAvailable: true, description: "Special heart-warming biryani with aromatic spices", rating: 4.9, reviewCount: 312, orderCount: 780, spiceLevel: 2 },
  { id: 403, name: "Chicken Tikka Biryani", price: 340, categorySlug: "biryanis", categoryName: "Biryanis", isVeg: false, isBestseller: true, isAvailable: true, description: "Biryani loaded with smoky tikka chicken", rating: 4.8, reviewCount: 278, orderCount: 695, spiceLevel: 2 },
  { id: 404, name: "Chicken Fry Piece Biryani", price: 340, categorySlug: "biryanis", categoryName: "Biryanis", isVeg: false, isBestseller: false, isAvailable: true, description: "Biryani with crispy fried chicken pieces", rating: 4.6, reviewCount: 189, orderCount: 475, spiceLevel: 2 },
  { id: 405, name: "Chicken Boneless Biryani", price: 360, categorySlug: "biryanis", categoryName: "Biryanis", isVeg: false, isBestseller: true, isAvailable: true, description: "Tender boneless chicken in fragrant basmati", rating: 4.7, reviewCount: 234, orderCount: 585, spiceLevel: 2 },
  { id: 406, name: "Mutton Biryani", price: 420, categorySlug: "biryanis", categoryName: "Biryanis", isVeg: false, isBestseller: true, isAvailable: true, description: "Slow-cooked mutton in dum style biryani", rating: 4.9, reviewCount: 298, orderCount: 745, spiceLevel: 2 },
  { id: 407, name: "Special Family Pack Biryani", price: 899, categorySlug: "biryanis", categoryName: "Biryanis", isVeg: false, isBestseller: true, isAvailable: true, description: "XL family portion with mixed chicken pieces", rating: 4.9, reviewCount: 178, orderCount: 445, spiceLevel: 2 },
  { id: 501, name: "Veg Fried Rice", price: 220, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: true, isBestseller: false, isAvailable: true, description: "Indo-Chinese fried rice with fresh vegetables", rating: 4.2, reviewCount: 67, orderCount: 168, spiceLevel: 1 },
  { id: 502, name: "Egg Fried Rice", price: 240, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: false, isBestseller: false, isAvailable: true, description: "Classic fried rice with scrambled egg", rating: 4.3, reviewCount: 78, orderCount: 195, spiceLevel: 1 },
  { id: 503, name: "Chicken Fried Rice", price: 280, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: false, isBestseller: true, isAvailable: true, description: "Wok-tossed fried rice with chicken", rating: 4.6, reviewCount: 134, orderCount: 335, spiceLevel: 2 },
  { id: 504, name: "Schezwan Chicken Fried Rice", price: 320, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: false, isBestseller: true, isAvailable: true, description: "Fiery Schezwan sauce chicken fried rice", rating: 4.7, reviewCount: 156, orderCount: 390, spiceLevel: 4 },
  { id: 505, name: "Veg Noodles", price: 220, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: true, isBestseller: false, isAvailable: true, description: "Stir-fried noodles with fresh vegetables", rating: 4.1, reviewCount: 45, orderCount: 112, spiceLevel: 1 },
  { id: 506, name: "Egg Noodles", price: 240, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: false, isBestseller: false, isAvailable: true, description: "Tossed noodles with egg", rating: 4.2, reviewCount: 56, orderCount: 140, spiceLevel: 1 },
  { id: 507, name: "Chicken Noodles", price: 280, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: false, isBestseller: true, isAvailable: true, description: "Wok noodles with chicken strips", rating: 4.5, reviewCount: 112, orderCount: 280, spiceLevel: 2 },
  { id: 508, name: "Mixed Noodles", price: 340, categorySlug: "fried-rice-noodles", categoryName: "Fried Rice & Noodles", isVeg: false, isBestseller: true, isAvailable: true, description: "Chef special mixed noodles with egg and chicken", rating: 4.7, reviewCount: 145, orderCount: 362, spiceLevel: 2 },
  { id: 601, name: "CRC Special Shawarma Plate", price: 260, categorySlug: "shawarma", categoryName: "Shawarma", isVeg: false, isBestseller: true, isAvailable: true, description: "Signature shawarma plate with garlic sauce and fries", rating: 4.9, reviewCount: 234, orderCount: 585, spiceLevel: 2 },
  { id: 602, name: "Chicken Shawarma Roll", price: 180, categorySlug: "shawarma", categoryName: "Shawarma", isVeg: false, isBestseller: true, isAvailable: true, description: "Freshly rolled chicken shawarma wrap", rating: 4.8, reviewCount: 312, orderCount: 780, spiceLevel: 2 },
  { id: 603, name: "Rumali Shawarma", price: 220, categorySlug: "shawarma", categoryName: "Shawarma", isVeg: false, isBestseller: true, isAvailable: true, description: "Shawarma wrapped in thin rumali roti", rating: 4.7, reviewCount: 189, orderCount: 472, spiceLevel: 2 },
  { id: 701, name: "Brownie with Ice Cream", price: 220, categorySlug: "desserts", categoryName: "Desserts", isVeg: true, isBestseller: true, isAvailable: true, description: "Warm chocolate brownie with vanilla ice cream scoop", rating: 4.9, reviewCount: 198, orderCount: 495, spiceLevel: 0 },
  { id: 702, name: "Death By Chocolate", price: 260, categorySlug: "desserts", categoryName: "Desserts", isVeg: true, isBestseller: true, isAvailable: true, description: "Intense multi-layer chocolate indulgence", rating: 4.8, reviewCount: 167, orderCount: 418, spiceLevel: 0 },
  { id: 801, name: "Vanilla Ice Cream", price: 120, categorySlug: "ice-creams", categoryName: "Ice Creams", isVeg: true, isBestseller: false, isAvailable: true, description: "Classic creamy vanilla ice cream", rating: 4.3, reviewCount: 89, orderCount: 222, spiceLevel: 0 },
  { id: 802, name: "Chocolate Ice Cream", price: 140, categorySlug: "ice-creams", categoryName: "Ice Creams", isVeg: true, isBestseller: false, isAvailable: true, description: "Rich dark chocolate ice cream", rating: 4.4, reviewCount: 112, orderCount: 280, spiceLevel: 0 },
  { id: 803, name: "Butterscotch Ice Cream", price: 140, categorySlug: "ice-creams", categoryName: "Ice Creams", isVeg: true, isBestseller: false, isAvailable: true, description: "Sweet caramel butterscotch ice cream", rating: 4.5, reviewCount: 98, orderCount: 245, spiceLevel: 0 },
  { id: 804, name: "Putu Ice Cream", price: 220, categorySlug: "ice-creams", categoryName: "Ice Creams", isVeg: true, isBestseller: true, isAvailable: true, description: "Traditional putu with creamy ice cream", rating: 4.7, reviewCount: 134, orderCount: 335, spiceLevel: 0 },
  { id: 805, name: "Sundae Special", price: 260, categorySlug: "ice-creams", categoryName: "Ice Creams", isVeg: true, isBestseller: true, isAvailable: true, description: "Layered ice cream sundae with toppings", rating: 4.8, reviewCount: 145, orderCount: 362, spiceLevel: 0 },
  { id: 901, name: "Orange Mint Mojito", price: 180, categorySlug: "mojitos", categoryName: "Mojitos", isVeg: true, isBestseller: true, isAvailable: true, description: "Fresh orange juice with mint and soda", rating: 4.7, reviewCount: 156, orderCount: 390, spiceLevel: 0 },
  { id: 902, name: "Blue Lagoon Mojito", price: 190, categorySlug: "mojitos", categoryName: "Mojitos", isVeg: true, isBestseller: false, isAvailable: true, description: "Blue curacao flavored tropical mojito", rating: 4.5, reviewCount: 89, orderCount: 222, spiceLevel: 0 },
  { id: 903, name: "Virgin Mojito", price: 170, categorySlug: "mojitos", categoryName: "Mojitos", isVeg: true, isBestseller: true, isAvailable: true, description: "Classic lime mint refresher", rating: 4.6, reviewCount: 134, orderCount: 335, spiceLevel: 0 },
  { id: 904, name: "Watermelon Mojito", price: 190, categorySlug: "mojitos", categoryName: "Mojitos", isVeg: true, isBestseller: false, isAvailable: true, description: "Fresh watermelon with mint and soda", rating: 4.4, reviewCount: 78, orderCount: 195, spiceLevel: 0 },
  { id: 1001, name: "Oreo Milkshake", price: 220, categorySlug: "drinks", categoryName: "Drinks", isVeg: true, isBestseller: true, isAvailable: true, description: "Thick creamy Oreo cookies milkshake", rating: 4.8, reviewCount: 189, orderCount: 472, spiceLevel: 0 },
  { id: 1002, name: "Chocolate Milkshake", price: 220, categorySlug: "drinks", categoryName: "Drinks", isVeg: true, isBestseller: false, isAvailable: true, description: "Rich chocolate thick shake", rating: 4.6, reviewCount: 112, orderCount: 280, spiceLevel: 0 },
  { id: 1003, name: "Strawberry Milkshake", price: 220, categorySlug: "drinks", categoryName: "Drinks", isVeg: true, isBestseller: false, isAvailable: true, description: "Fresh strawberry flavored milkshake", rating: 4.5, reviewCount: 98, orderCount: 245, spiceLevel: 0 },
  { id: 1004, name: "Soft Drinks", price: 60, categorySlug: "drinks", categoryName: "Drinks", isVeg: true, isBestseller: false, isAvailable: true, description: "Assorted chilled soft drinks", rating: 4.0, reviewCount: 56, orderCount: 140, spiceLevel: 0 },
];

const CATEGORIES = [
  { id: 0, name: "All", slug: "all" },
  { id: 1, name: "Soups", slug: "soups" },
  { id: 2, name: "Veg Starters", slug: "veg-starters" },
  { id: 3, name: "Non Veg Starters", slug: "non-veg-starters" },
  { id: 4, name: "Biryanis", slug: "biryanis" },
  { id: 5, name: "Fried Rice & Noodles", slug: "fried-rice-noodles" },
  { id: 6, name: "Shawarma", slug: "shawarma" },
  { id: 7, name: "Desserts", slug: "desserts" },
  { id: 8, name: "Ice Creams", slug: "ice-creams" },
  { id: 9, name: "Mojitos", slug: "mojitos" },
  { id: 10, name: "Drinks", slug: "drinks" },
];

function SpiceIndicator({ level }: { level: number | null | undefined }) {
  if (!level || level === 0) return null;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: Math.min(level, 4) }).map((_, i) => (
        <Flame key={i} className="w-2.5 h-2.5 text-orange-400" />
      ))}
    </div>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});

  const { data: apiItems, isLoading } = useGetMenuItems({
    category: activeCategory !== "all" ? activeCategory : undefined,
    search: search || undefined,
    vegOnly: vegOnly || undefined,
  });

  const { addItem, removeItem, items: cartItems } = useCartStore();
  const { openDrawer } = useCartDrawerStore();

  // Use API data or fallback
  const allItems = apiItems ?? MENU_DATA;

  const filtered = allItems.filter((item) => {
    if (activeCategory !== "all" && item.categorySlug !== activeCategory) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (vegOnly && !item.isVeg) return false;
    return true;
  });

  const getCartQty = (id: number) => cartItems.find((i) => i.menuItemId === id)?.quantity ?? 0;

  const handleAdd = (item: typeof MENU_DATA[0]) => {
    addItem({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1, isVeg: item.isVeg, imageUrl: null });
    openDrawer();
  };

  const handleIncrease = (item: typeof MENU_DATA[0]) => {
    addItem({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1, isVeg: item.isVeg, imageUrl: null });
  };

  const handleDecrease = (id: number) => {
    const qty = getCartQty(id);
    if (qty <= 1) removeItem(id);
    else {
      const store = useCartStore.getState();
      store.updateQuantity(id, qty - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              data-testid="menu-search-input"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setVegOnly(!vegOnly)}
              data-testid="veg-filter-toggle"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                vegOnly
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : "border-white/10 text-muted-foreground hover:border-white/20"
              }`}
            >
              <Leaf className="w-3 h-3" />
              Veg Only
            </motion.button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.slug}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.slug)}
                data-testid={`category-tab-${cat.slug}`}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-primary text-white shadow-[0_0_12px_rgba(255,43,43,0.4)]"
                    : "border border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {search && (
          <p className="text-muted-foreground text-sm mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </p>
        )}

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const qty = getCartQty(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  whileHover={{ y: -4 }}
                  data-testid={`menu-item-${item.id}`}
                  className="rounded-2xl overflow-hidden border border-white/5 group cursor-pointer"
                  style={{
                    background: "linear-gradient(145deg, rgba(17,17,17,0.9), rgba(5,5,5,0.95))",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Image area */}
                  <div className="h-32 relative overflow-hidden flex-shrink-0"
                    style={{ background: item.isVeg ? "linear-gradient(135deg, #021402 0%, #041404 50%, #030303 100%)" : "linear-gradient(135deg, #200808 0%, #2d0a0a 50%, #0a0a0a 100%)" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <UtensilsCrossed className="w-12 h-12" style={{ color: item.isVeg ? "rgba(34,197,94,0.15)" : "rgba(255,43,43,0.2)" }} />
                    </div>
                    {/* Gradient overlay for depth */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8) 100%)" }} />
                    <div className="absolute inset-0 group-hover:opacity-100 opacity-0 transition-opacity duration-500"
                      style={{ background: "radial-gradient(ellipse at center, rgba(255,43,43,0.12) 0%, transparent 70%)" }} />

                    {/* Veg indicator */}
                    <div className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? "border-green-500 bg-green-950/60" : "border-red-500 bg-red-950/60"}`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                    </div>

                    {item.isBestseller && (
                      <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wide"
                        style={{ background: "linear-gradient(135deg, #FF2B2B, #C1121F)" }}>
                        🔥 Hot
                      </div>
                    )}
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(255,43,43,0.3)" }} />

                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 leading-tight">{item.name}</h3>
                    {item.description && (
                      <p className="text-muted-foreground text-xs mb-2 line-clamp-1">{item.description}</p>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      {item.rating && (
                        <span className="flex items-center gap-0.5 text-xs" style={{ color: "#FBBF24" }}>
                          <Star className="w-3 h-3" style={{ fill: "#FBBF24", color: "#FBBF24" }} />{item.rating}
                        </span>
                      )}
                      <SpiceIndicator level={item.spiceLevel} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-base" data-testid={`item-price-${item.id}`}>
                        ₹{item.price}
                      </span>

                      {qty === 0 ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdd(item)}
                          data-testid={`add-to-cart-${item.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-bold border border-primary/50 hover:bg-primary hover:border-primary transition-all"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1 border border-primary/30 rounded-xl overflow-hidden">
                          <button onClick={() => handleDecrease(item.id)} data-testid={`decrease-${item.id}`}
                            className="w-7 h-7 flex items-center justify-center hover:bg-primary/20 transition-colors text-white">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white font-bold text-xs w-5 text-center" data-testid={`quantity-${item.id}`}>{qty}</span>
                          <button onClick={() => handleIncrease(item)} data-testid={`increase-${item.id}`}
                            className="w-7 h-7 flex items-center justify-center hover:bg-primary/20 transition-colors text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No dishes found. Try a different filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
