// js/store.js — Firebase-powered Store
import { auth, db, storage } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, doc, getDoc, getDocs, setDoc,
  addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadString, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// --- ADMIN EMAIL (change to your admin email) ---
const ADMIN_EMAIL = "admin@sketchinity.com";

// Mock Products Catalog Database (used for seeding and fallback mode)
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Molotow Premium Spray Set",
    category: "Paints & Pigments",
    price: 48.99,
    brand: "Molotow",
    vibe: "Street Art",
    description: "The ultimate spray pack for street art. Features 6 high-pressure cans with clean pigments, fast drying formula, and 3 interchangeable nozzles (fat, skinny, medium cap). Perfect for muralists and outdoor street artists looking for high opacity and weather resistance.",
    specs: {
      "Pack Size": "6 Cans (400ml each)",
      "Colors": "Primary Set (Red, Blue, Yellow, Green, Black, White)",
      "Pressure": "High Output",
      "Finish": "Matte Silk"
    },
    rating: 4.9,
    stock: 12,
    isLimited: true,
    imageStyle: "linear-gradient(135deg, #FF007F, #7F00FF)",
    imagePath: "images/molotow_spray_set.png",
    svgPath: `<circle cx="50" cy="55" r="25" fill="#121212"/><path d="M40 30h20v25H40z" fill="#7F00FF"/><rect x="45" y="15" width="10" height="15" fill="#FF8C42"/><path d="M48 10h4v5h-4z" fill="#121212"/><circle cx="50" cy="40" r="10" fill="#FF007F"/>`
  },
  {
    id: 2,
    name: "Copic Sketch 72 Color Set A",
    category: "Markers & Pens",
    price: 189.99,
    brand: "Copic",
    vibe: "Illustration",
    description: "Highly sought-after professional illustration set. Double-ended with Medium Broad and Super Brush nibs. Ideal for manga illustration, fashion design, architectural rendering, and blending. Refillable inks and replaceable nibs ensure this set lasts a lifetime.",
    specs: {
      "Ink Type": "Alcohol-based",
      "Nibs": "Super Brush & Medium Broad",
      "Colors": "72 Assorted Pastel/Deep tones",
      "Refillable": "Yes"
    },
    rating: 4.8,
    stock: 5,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #00C6FF, #0072FF)",
    imagePath: "images/copic_sketch_72.png",
    svgPath: `<rect x="25" y="20" width="10" height="60" rx="3" fill="#FFFFFF" stroke="#121212" stroke-width="2"/><rect x="38" y="20" width="10" height="60" rx="3" fill="#00C6FF" stroke="#121212" stroke-width="2"/><rect x="51" y="20" width="10" height="60" rx="3" fill="#0072FF" stroke="#121212" stroke-width="2"/><rect x="64" y="20" width="10" height="60" rx="3" fill="#FF8C42" stroke="#121212" stroke-width="2"/>`
  },
  {
    id: 3,
    name: "Sketchinity Raw Blackbook A4",
    category: "Sketchbooks",
    price: 24.99,
    brand: "Sketchinity House",
    vibe: "Street Art",
    description: "Archival-grade heavyweight blackbook designed for markers and heavy inks. Landscape layout lets you sketch wide pieces and double-page graffiti murals. Thick pages prevent bleed-through, and raw textured hardcover protects your art on the streets.",
    specs: {
      "Dimensions": "A4 (297 x 210 mm)",
      "Paper Weight": "220 GSM",
      "Pages": "80 Sheets (160 Pages)",
      "Layout": "Landscape Hardcover"
    },
    rating: 4.7,
    stock: 25,
    isLimited: true,
    imageStyle: "linear-gradient(135deg, #1E1E1E, #3A3A3A)",
    imagePath: "images/raw_blackbook_a4.png",
    svgPath: `<rect x="20" y="25" width="60" height="50" rx="4" fill="#121212" stroke="#FFFFFF" stroke-width="2"/><rect x="25" y="30" width="50" height="40" fill="#6C4AB6"/><text x="30" y="55" font-family="'Outfit'" font-weight="900" font-size="12" fill="#FF8C42">RAW</text>`
  },
  {
    id: 4,
    name: "Derwent Academy Sketching Pencils",
    category: "Markers & Pens",
    price: 14.50,
    brand: "Derwent",
    vibe: "Fine Art",
    description: "Classic tin of sketching pencils for students and studio hobbyists. Includes a range of degrees from 6B to 2H. Smooth graphite transfer, easy blending, and break-resistant cores. Best choice for life drawing, shading, and technical sketching lessons.",
    specs: {
      "Degrees Included": "6B, 4B, 2B, HB, H, 2H",
      "Core Material": "Premium Natural Graphite",
      "Casing": "Metal Storage Tin",
      "Wood Type": "California Cedar"
    },
    rating: 4.5,
    stock: 40,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #6C4AB6, #8D72E1)",
    imagePath: "images/sketching_pencils.png",
    svgPath: `<rect x="25" y="25" width="50" height="45" rx="3" fill="#52358f" stroke="#121212" stroke-width="2"/><line x1="35" y1="35" x2="35" y2="60" stroke="#FF8C42" stroke-width="3"/><line x1="45" y1="35" x2="45" y2="60" stroke="#FFFFFF" stroke-width="3"/><line x1="55" y1="35" x2="55" y2="60" stroke="#121212" stroke-width="3"/><line x1="65" y1="35" x2="65" y2="60" stroke="#FF8C42" stroke-width="3"/>`
  },
  {
    id: 5,
    name: "Sakura Micron Technical Pens",
    category: "Markers & Pens",
    price: 19.99,
    brand: "Sakura",
    vibe: "Illustration",
    description: "World-famous inking fineliners with archival Pigma pigment ink. Smudge-proof, fade-resistant, and bleed-free performance. Set contains 6 distinct point sizes to satisfy the precise lines needed by designers, manga writers, architects, and comic strip creators.",
    specs: {
      "Ink Type": "Archival Pigma Ink",
      "Sizes Included": "005, 01, 02, 03, 05, 08",
      "Color": "Deep Black",
      "Waterproof": "Yes"
    },
    rating: 4.9,
    stock: 30,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #F9D423, #FF4E50)",
    imagePath: "images/micron_pens.png",
    svgPath: `<rect x="20" y="30" width="8" height="50" fill="#121212"/><rect x="35" y="25" width="8" height="55" fill="#1E1E1E"/><rect x="50" y="35" width="8" height="45" fill="#121212"/><rect x="65" y="28" width="8" height="52" fill="#1E1E1E"/><circle cx="24" cy="20" r="3" fill="#FF8C42"/><circle cx="39" cy="15" r="3" fill="#6C4AB6"/>`
  },
  {
    id: 6,
    name: "Molotow Liquid Chrome Marker Set",
    category: "Markers & Pens",
    price: 32.50,
    brand: "Molotow",
    vibe: "Street Art",
    description: "Highly pigmented liquid alcohol-based chrome that creates a real high-gloss mirror effect. Highly UV resistant, scrape-proof, and applicable to almost any smooth surface. A legendary tool for model designers, street artists, and custom custom creators.",
    specs: {
      "Tip Sizes": "1mm, 2mm, 4mm",
      "Pigment": "Alcohol-based Liquid Chrome",
      "Mirror Effect": "High-Gloss",
      "Surfaces": "Glass, Plastic, Metal, Canvas"
    },
    rating: 4.6,
    stock: 8,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #B0F3F1, #EAF6F6)",
    imagePath: "images/liquid_chrome_markers.png",
    svgPath: `<rect x="30" y="20" width="16" height="55" fill="#1E1E1E" stroke="#121212" stroke-width="2"/><rect x="46" y="20" width="16" height="55" fill="#C0C0C0" stroke="#121212" stroke-width="2"/><polygon points="38,20 40,10 42,20" fill="#C0C0C0"/><polygon points="54,20 56,10 58,20" fill="#121212"/>`
  },
  {
    id: 7,
    name: "Sketchinity Heavy-Duty Acrylics",
    category: "Paints & Pigments",
    price: 38.00,
    brand: "Sketchinity House",
    vibe: "Fine Art",
    description: "High viscosity acrylic paints with maximum pigment load and brilliant color saturation. Formulated specifically for textured canvas paintings, heavy brushstrokes, and palette knife techniques. Flexible when dry, preventing any cracks or yellowing.",
    specs: {
      "Color Count": "12 Tubes (75ml each)",
      "Viscosity": "Heavy Body",
      "Finish": "Satin",
      "Base": "100% Acrylic Emulsion"
    },
    rating: 4.7,
    stock: 15,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #11998e, #38ef7d)",
    imagePath: "images/acrylic_paints.png",
    svgPath: `<path d="M30 40 C30 20, 70 20, 70 40 L65 75 L35 75 Z" fill="#38ef7d" stroke="#121212" stroke-width="2"/><rect x="45" y="75" width="10" height="8" fill="#121212"/><circle cx="50" cy="45" r="10" fill="#FF8C42"/>`
  },
  {
    id: 8,
    name: "Copic Multiliner Inking Set",
    category: "Markers & Pens",
    price: 26.00,
    brand: "Copic",
    vibe: "Illustration",
    description: "Waterproof drawing pens that won't bleed when used with Copic Markers. Pigment-based black ink is archival, acid-free, and photocopier safe. Provides crisp line weights for graphic artists, watercolor artists, and traditional sketch illustrators.",
    specs: {
      "Ink Type": "Waterproof Pigment",
      "Point Sizes": "0.03, 0.05, 0.1, 0.3, 0.5, 0.8, BS, BM",
      "Acid Free": "Yes",
      "Set Size": "8 Pens"
    },
    rating: 4.8,
    stock: 22,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #4A00E0, #8E2DE2)",
    imagePath: "images/copic_multiliners.png",
    svgPath: `<rect x="35" y="20" width="10" height="60" fill="#4A00E0" stroke="#121212" stroke-width="2"/><rect x="55" y="20" width="10" height="60" fill="#121212" stroke="#FFFFFF" stroke-width="1"/><circle cx="40" cy="15" r="3" fill="#FF8C42"/><circle cx="60" cy="15" r="3" fill="#6C4AB6"/>`
  },
  {
    id: 9,
    name: "Derwent Charcoal XL Blocks Pack",
    category: "Paints & Pigments",
    price: 21.50,
    brand: "Derwent",
    vibe: "Fine Art",
    description: "Extra large, chunky blocks of natural tinted charcoal. Allows you to cover broad surfaces quickly and draw expressive textures. Extremely blendable, offering rich tones of deep green, violet, blue, and classic carbon blacks for massive studio pieces.",
    specs: {
      "Pack Count": "6 Blocks",
      "Block Size": "20 x 20 x 60 mm",
      "Composition": "Tinted Charcoal Powders",
      "Blendability": "Excellent"
    },
    rating: 4.4,
    stock: 18,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #3E5151, #DECBA4)",
    imagePath: "images/charcoal_xl_blocks.png",
    svgPath: `<rect x="25" y="25" width="20" height="45" fill="#3E5151" stroke="#121212" stroke-width="2"/><rect x="55" y="30" width="20" height="40" fill="#DECBA4" stroke="#121212" stroke-width="2"/><circle cx="35" cy="45" r="5" fill="#FF8C42"/><circle cx="65" cy="50" r="5" fill="#6C4AB6"/>`
  },
  {
    id: 10,
    name: "Koi Watercolor Pocket Field Set",
    category: "Paints & Pigments",
    price: 34.99,
    brand: "Sakura",
    vibe: "Fine Art",
    description: "Compact travel watercolor kit with 24 solid half-pans and a refillable water brush pen. Integrated mixing palette makes it effortless to paint in parks, streets, or trains. Vibrantly pigmented half pans blend smoothly for quick outdoor sketches.",
    specs: {
      "Half Pan Count": "24 Colors",
      "Brush Included": "9ml Water Brush Pen",
      "Box Style": "Plastic Travel Case",
      "Pans Style": "Removable Solid Pans"
    },
    rating: 4.7,
    stock: 14,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #FF4B2B, #FF416C)",
    imagePath: "images/koi_watercolor_set.png",
    svgPath: `<rect x="20" y="25" width="60" height="50" rx="3" fill="#FFFFFF" stroke="#121212" stroke-width="2"/><circle cx="30" cy="35" r="5" fill="#FF4B2B"/><circle cx="45" cy="35" r="5" fill="#FF416C"/><circle cx="60" cy="35" r="5" fill="#6C4AB6"/><circle cx="30" cy="55" r="5" fill="#FF8C42"/><circle cx="45" cy="55" r="5" fill="#00C6FF"/><circle cx="60" cy="55" r="5" fill="#38ef7d"/>`
  },
  {
    id: 11,
    name: "Street Spray Cap Pack (50pcs)",
    category: "Accessories",
    price: 12.99,
    brand: "Sketchinity House",
    vibe: "Street Art",
    description: "An essential assortment of 50 spray caps for street graffiti and murals. Contains a balanced mix of Super Skinny caps for fine outlines, Fat Caps for fast fillings, and Calligraphy/Chisel caps for dynamic tags. Fully reusable.",
    specs: {
      "Quantity": "50 Caps",
      "Cap Types": "Gold Fat, Pink Skinny, NY Fat, Chisel",
      "Compatibility": "All standard male/female cans",
      "Material": "Reinforced ABS Plastic"
    },
    rating: 4.8,
    stock: 50,
    isLimited: true,
    imageStyle: "linear-gradient(135deg, #FF8C42, #FF3F3F)",
    imagePath: "images/spray_caps_pack.png",
    svgPath: `<circle cx="35" cy="50" r="12" fill="#FF8C42" stroke="#121212" stroke-width="2"/><circle cx="65" cy="50" r="12" fill="#FF3F3F" stroke="#121212" stroke-width="2"/><rect x="32" y="32" width="6" height="8" fill="#121212"/><rect x="62" y="32" width="6" height="8" fill="#121212"/>`
  },
  {
    id: 12,
    name: "Professional Folding Studio Easel",
    category: "Accessories",
    price: 49.00,
    brand: "Sketchinity House",
    vibe: "Fine Art",
    description: "Sturdy aluminum folding easel suitable for tabletop or outdoor field paintings. Holds canvases up to 32 inches high. Telescoping legs adapt easily to uneven terrains, and the zippered nylon transport bag provides convenient mobility.",
    specs: {
      "Material": "Reinforced Aluminum",
      "Max Canvas Height": "32 Inches",
      "Weight": "2.2 lbs",
      "Color": "Anodized Matte Black"
    },
    rating: 4.5,
    stock: 10,
    isLimited: false,
    imageStyle: "linear-gradient(135deg, #485563, #29323c)",
    imagePath: "images/folding_easel.png",
    svgPath: `<line x1="50" y1="15" x2="30" y2="80" stroke="#121212" stroke-width="3"/><line x1="50" y1="15" x2="70" y2="80" stroke="#121212" stroke-width="3"/><line x1="50" y1="15" x2="50" y2="80" stroke="#6C4AB6" stroke-width="2"/><line x1="25" y1="50" x2="75" y2="50" stroke="#FF8C42" stroke-width="3"/>`
  }
];

const INITIAL_REVIEWS = {
  1: [
    { author: "Dexter_Graff", rating: 5, level: "Pro", comment: "These Molotow cans are insane. Constant high pressure and zero drips. Outlines are crisp." },
    { author: "Mia_ArtStudent", rating: 4, level: "Student", comment: "Great pigment flow! Yellow cap fills quickly, but it runs out faster than I expected." }
  ],
  2: [
    { author: "IllustratePro", rating: 5, level: "Pro", comment: "The blend quality on Copic markers is unmatched. A heavy price, but worth every single penny." }
  ],
  3: [
    { author: "TagKing_NY", rating: 5, level: "Pro", comment: "Thick, heavy black pages that hold paint markers like a champ. Hardcover is rugged." }
  ]
};

class Store {
  constructor() {
    this.init();
  }

  init() {
    this.user = null;
    this.isAdmin = false;
    this.cart = JSON.parse(localStorage.getItem('sketchinity_cart')) || [];
    this.products = [];
    this.reviews = {};
    this.userOrders = [];
    this.listeners = [];

    if (!this.isFirebaseConfigured) {
      console.warn("Firebase is not configured. Running in Local Storage Fallback Mode.");
      
      // Load fallback products
      const cachedProducts = localStorage.getItem('sketchinity_products');
      if (!cachedProducts) {
        localStorage.setItem('sketchinity_products', JSON.stringify(INITIAL_PRODUCTS));
      }
      this.products = JSON.parse(localStorage.getItem('sketchinity_products'));

      // Load fallback reviews
      const cachedReviews = localStorage.getItem('sketchinity_reviews');
      if (!cachedReviews) {
        localStorage.setItem('sketchinity_reviews', JSON.stringify(INITIAL_REVIEWS));
      }
      this.reviews = JSON.parse(localStorage.getItem('sketchinity_reviews'));

      // Load fallback user
      this.user = JSON.parse(localStorage.getItem('sketchinity_user')) || null;
      this.isAdmin = this.user ? this.user.email === ADMIN_EMAIL : false;
      this.loadUserOrdersSync();

      // Resolve initPromise immediately
      this.initPromise = Promise.resolve();
      return;
    }

    // Expose initPromise so router can await data loading
    this.initPromise = Promise.all([
      this.loadProducts(),
      this.loadReviews(),
      new Promise((resolve) => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            this.user = {
              uid: firebaseUser.uid,
              username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email: firebaseUser.email,
            };
            // Check if admin
            this.isAdmin = firebaseUser.email === ADMIN_EMAIL;
            // Sync cart and user orders from Firestore
            await Promise.all([
              this.loadCart().catch(err => console.error("Error loading cart:", err)),
              this.loadUserOrders().catch(err => console.error("Error loading orders:", err))
            ]);
          } else {
            this.user = null;
            this.isAdmin = false;
            this.userOrders = [];
          }
          this.notify();
          resolve();
        });
      })
    ]).catch(err => {
      console.error("Store initialization failed:", err);
    });
  }

  get isFirebaseConfigured() {
    return auth && auth.app && auth.app.options && auth.app.options.apiKey && !auth.app.options.apiKey.startsWith("YOUR_");
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  // ─── AUTH ────────────────────────────────────────────────

  async register(username, email, artistLevel, password) {
    if (!this.isFirebaseConfigured) {
      // Mock Register
      const users = JSON.parse(localStorage.getItem('sketchinity_users_db')) || [];
      if (users.find(u => u.email === email)) {
        return { success: false, message: "Email already registered." };
      }
      const newUser = { username, email, artistLevel, password, orders: [] };
      users.push(newUser);
      localStorage.setItem('sketchinity_users_db', JSON.stringify(users));

      this.user = { username, email, artistLevel };
      localStorage.setItem('sketchinity_user', JSON.stringify(this.user));
      this.isAdmin = email === ADMIN_EMAIL;
      this.loadUserOrdersSync();
      this.notify();
      return { success: true };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Save extra user profile to Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        username, email, artistLevel, createdAt: new Date()
      });
      this.notify();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async login(email, password) {
    if (!this.isFirebaseConfigured) {
      // Mock Login
      const users = JSON.parse(localStorage.getItem('sketchinity_users_db')) || [];
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (!foundUser && email === "artist@sketchinity.com" && password === "paint123") {
        this.user = { username: "BanksyWannabe", email: "artist@sketchinity.com", artistLevel: "Pro" };
        this.isAdmin = true;
        localStorage.setItem('sketchinity_user', JSON.stringify(this.user));
        this.loadUserOrdersSync();
        this.notify();
        return { success: true };
      }
      if (foundUser) {
        this.user = { username: foundUser.username, email: foundUser.email, artistLevel: foundUser.artistLevel };
        this.isAdmin = foundUser.email === ADMIN_EMAIL;
        localStorage.setItem('sketchinity_user', JSON.stringify(this.user));
        this.loadUserOrdersSync();
        this.notify();
        return { success: true };
      }
      return { success: false, message: "Invalid email or password." };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, message: "Invalid email or password." };
    }
  }

  async loginWithGoogle() {
    if (!this.isFirebaseConfigured) {
      return { success: false, message: "Google Login requires Firebase configuration." };
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async logout() {
    if (!this.isFirebaseConfigured) {
      this.user = null;
      this.isAdmin = false;
      this.userOrders = [];
      localStorage.removeItem('sketchinity_user');
      this.cart = [];
      localStorage.removeItem('sketchinity_cart');
      this.notify();
      return;
    }
    await signOut(auth);
    this.cart = [];
    localStorage.removeItem('sketchinity_cart');
    this.notify();
  }

  async resetPassword(email) {
    if (!this.isFirebaseConfigured) {
      return { success: false, message: "Password reset requires Firebase configuration." };
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  // ─── PRODUCTS ────────────────────────────────────────────

  async loadProducts() {
    if (!this.isFirebaseConfigured) {
      return this.products;
    }
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      let productsList = snapshot.docs.map(d => {
        const id = isNaN(d.id) ? d.id : Number(d.id);
        return { ...d.data(), id };
      });

      // Auto-seed if the live database has no products
      if (productsList.length === 0) {
        console.log("Firestore database is empty. Auto-seeding initial products catalog...");
        for (const prod of INITIAL_PRODUCTS) {
          const docRef = doc(collection(db, "products"), String(prod.id));
          await setDoc(docRef, {
            ...prod,
            createdAt: new Date()
          });
          productsList.push(prod);
        }
      }

      this.products = productsList;
      this.notify();
    } catch (e) {
      console.error("Firestore read products error:", e);
      // Fallback to local products if permission is denied
      const cachedProducts = localStorage.getItem('sketchinity_products');
      this.products = cachedProducts ? JSON.parse(cachedProducts) : INITIAL_PRODUCTS;
      this.notify();
    }
    return this.products;
  }

  async addProduct(product) {
    if (!this.isFirebaseConfigured) {
      this.products.push(product);
      localStorage.setItem('sketchinity_products', JSON.stringify(this.products));
      this.notify();
      return true;
    }

    try {
      let imagePath = product.imagePath;

      // Upload base64 image to Firebase Storage if provided
      if (imagePath && imagePath.startsWith('data:')) {
        const imageRef = ref(storage, `products/${Date.now()}`);
        await uploadString(imageRef, imagePath, 'data_url');
        imagePath = await getDownloadURL(imageRef);
      }

      // Generate a numeric ID to ensure compatibility with views expecting numeric IDs
      const newId = Date.now();

      await setDoc(doc(db, "products", String(newId)), {
        ...product,
        id: newId,
        imagePath,
        createdAt: new Date()
      });

      await this.loadProducts();
      return true;
    } catch (err) {
      console.error("Add product error:", err);
      return false;
    }
  }

  async deleteProduct(productId) {
    if (!this.isFirebaseConfigured) {
      this.products = this.products.filter(p => p.id !== Number(productId));
      localStorage.setItem('sketchinity_products', JSON.stringify(this.products));
      this.notify();
      return true;
    }
    await deleteDoc(doc(db, "products", String(productId)));
    await this.loadProducts();
    return true;
  }

  // ─── CART (localStorage + Firestore sync) ────────────────

  saveCart() {
    localStorage.setItem('sketchinity_cart', JSON.stringify(this.cart));
    // Also sync to Firestore if user is logged in
    if (this.isFirebaseConfigured && this.user) {
      setDoc(doc(db, "carts", this.user.uid), { items: this.cart }).catch(err => console.error(err));
    }
    this.notify();
  }

  async loadCart() {
    if (!this.isFirebaseConfigured || !this.user) return;
    try {
      const cartDoc = await getDoc(doc(db, "carts", this.user.uid));
      if (cartDoc.exists()) {
        this.cart = cartDoc.data().items || [];
        localStorage.setItem('sketchinity_cart', JSON.stringify(this.cart));
        this.notify();
      }
    } catch (err) {
      console.error("Load cart from Firestore error:", err);
    }
  }

  addToCart(productId, quantity = 1) {
    const targetId = (typeof productId === 'string' && !isNaN(productId) && productId.trim() !== '') ? Number(productId) : productId;
    const product = this.products.find(p => p.id === targetId);
    if (!product) return false;
    const existing = this.cart.find(i => i.product.id === targetId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      this.cart.push({ product, quantity: Number(quantity) });
    }
    this.saveCart();
    return true;
  }

  removeFromCart(productId) {
    const targetId = (typeof productId === 'string' && !isNaN(productId) && productId.trim() !== '') ? Number(productId) : productId;
    this.cart = this.cart.filter(i => i.product.id !== targetId);
    this.saveCart();
  }

  updateCartQty(productId, quantity) {
    const targetId = (typeof productId === 'string' && !isNaN(productId) && productId.trim() !== '') ? Number(productId) : productId;
    const item = this.cart.find(i => i.product.id === targetId);
    if (item) { item.quantity = Math.max(1, Number(quantity)); this.saveCart(); }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getCartTotal() {
    return this.cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);
  }

  getCartCount() {
    return this.cart.reduce((s, i) => s + i.quantity, 0);
  }

  // ─── ORDERS ──────────────────────────────────────────────

  async checkout(customerDetails, shippingAddress) {
    if (this.cart.length === 0) return { success: false, message: "Cart is empty." };
    const orderId = "SK-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString(),
      items: [...this.cart],
      total: this.getCartTotal(),
      shipping: shippingAddress,
      customer: customerDetails,
      status: "Processing",
      userId: this.user?.uid || null,
      createdAt: new Date()
    };

    if (!this.isFirebaseConfigured) {
      // Mock Checkout
      const orders = JSON.parse(localStorage.getItem('sketchinity_orders')) || [];
      orders.push(newOrder);
      localStorage.setItem('sketchinity_orders', JSON.stringify(orders));

      if (this.user) {
        const users = JSON.parse(localStorage.getItem('sketchinity_users_db')) || [];
        const userIdx = users.findIndex(u => u.email === this.user.email);
        if (userIdx !== -1) {
          users[userIdx].orders = users[userIdx].orders || [];
          users[userIdx].orders.push(newOrder);
          localStorage.setItem('sketchinity_users_db', JSON.stringify(users));
        }
      }
      // Save locally
      this.userOrders.push(newOrder);
      this.clearCart();
      return { success: true, order: newOrder };
    }

    try {
      await addDoc(collection(db, "orders"), newOrder);
      this.userOrders.push(newOrder);
      this.clearCart();
      return { success: true, order: newOrder };
    } catch (e) {
      console.error("Firebase checkout save error:", e);
      // fallback checkout locally
      this.userOrders.push(newOrder);
      this.clearCart();
      return { success: true, order: newOrder };
    }
  }

  async loadUserOrders() {
    if (!this.user) {
      this.userOrders = [];
      return;
    }
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      this.userOrders = snapshot.docs
        .map(d => d.data())
        .filter(o => o.userId === this.user.uid);
    } catch (err) {
      console.error("Firestore load orders error:", err);
      this.loadUserOrdersSync(); // Fallback to local
    }
  }

  loadUserOrdersSync() {
    if (!this.user) {
      this.userOrders = [];
      return;
    }
    const users = JSON.parse(localStorage.getItem('sketchinity_users_db')) || [];
    const foundUser = users.find(u => u.email === this.user.email);
    if (foundUser) {
      this.userOrders = foundUser.orders || [];
      return;
    }
    const orders = JSON.parse(localStorage.getItem('sketchinity_orders')) || [];
    this.userOrders = orders.filter(o => o.customer.email === this.user.email);
  }

  getUserOrders() {
    return this.userOrders || [];
  }

  // ─── REVIEWS & FEEDBACK (mock/fallback support) ──────────

  async loadReviews() {
    if (!this.isFirebaseConfigured) {
      return;
    }
    try {
      const snapshot = await getDocs(collection(db, "reviews"));
      const reviewsMap = {};
      snapshot.forEach((doc) => {
        reviewsMap[doc.id] = doc.data().reviews || [];
      });

      // Auto-seed reviews if empty
      if (Object.keys(reviewsMap).length === 0) {
        console.log("Firestore database has no reviews. Auto-seeding initial reviews...");
        for (const [prodId, revList] of Object.entries(INITIAL_REVIEWS)) {
          const docRef = doc(collection(db, "reviews"), String(prodId));
          await setDoc(docRef, { reviews: revList });
          reviewsMap[prodId] = revList;
        }
      }
      this.reviews = reviewsMap;
      this.notify();
    } catch (e) {
      console.error("Firestore read reviews error:", e);
      this.reviews = INITIAL_REVIEWS;
      this.notify();
    }
  }

  getProductReviews(productId) {
    return this.reviews[productId] || [];
  }

  submitReview(productId, reviewObj) {
    if (!this.reviews[productId]) {
      this.reviews[productId] = [];
    }
    this.reviews[productId].push(reviewObj);

    if (!this.isFirebaseConfigured) {
      localStorage.setItem('sketchinity_reviews', JSON.stringify(this.reviews));
      
      const product = this.products.find(p => p.id === Number(productId));
      if (product) {
        const productReviews = this.reviews[productId];
        const sum = productReviews.reduce((s, r) => s + r.rating, 0);
        product.rating = Number((sum / productReviews.length).toFixed(1));
        localStorage.setItem('sketchinity_products', JSON.stringify(this.products));
      }
      this.notify();
      return true;
    }

    setDoc(doc(db, "reviews", String(productId)), { reviews: this.reviews[productId] }).catch(err => {
      console.error("Failed to save review:", err);
    });
    
    const product = this.products.find(p => p.id === Number(productId));
    if (product) {
      const productReviews = this.reviews[productId];
      const sum = productReviews.reduce((s, r) => s + r.rating, 0);
      product.rating = Number((sum / productReviews.length).toFixed(1));

      setDoc(doc(db, "products", String(productId)), product).catch(err => {
        console.error("Failed to update product rating:", err);
      });
    }

    this.notify();
    return true;
  }

  submitFeedback(name, rating, message) {
    const feedbackItem = {
      name,
      rating: Number(rating),
      message,
      date: new Date().toLocaleDateString()
    };

    if (!this.isFirebaseConfigured) {
      const feedback = JSON.parse(localStorage.getItem('sketchinity_feedback')) || [];
      feedback.push(feedbackItem);
      localStorage.setItem('sketchinity_feedback', JSON.stringify(feedback));
      this.notify();
      return true;
    }

    addDoc(collection(db, "feedback"), feedbackItem).catch(err => {
      console.error("Failed to submit feedback:", err);
    });

    this.notify();
    return true;
  }
}

export const store = new Store();
export default store;
