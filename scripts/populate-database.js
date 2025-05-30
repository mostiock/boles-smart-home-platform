const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample products data (extracted from the TypeScript file)
const productsData = [
  // CONTROL PANELS (15 products)
  {
    id: "mixpad-mini",
    name: "MixPad Mini Super Smart Panel",
    description: "Compact 4-inch smart control panel with multi-touch capacitive screen and unlimited scenario support.",
    price: 299,
    category: "control-panels",
    brand: "BOLES",
    model: "MP-MINI-001",
    stock_count: 25,
    in_stock: true,
    warranty: "2 years",
    image_url: "https://res.cloudinary.com/control4/image/upload/f_auto,q_auto,dpr_auto/www/control4/homepage/OS_3_WWW_Home_1b.jpg",
    images: [
      "https://res.cloudinary.com/control4/image/upload/f_auto,q_auto,dpr_auto/www/control4/homepage/OS_3_WWW_Home_1b.jpg",
      "https://m.media-amazon.com/images/I/61f8O-P1fqL._AC_UF894,1000_QL80_.jpg"
    ],
    features: [
      "4 inches, 480x480P resolution display",
      "Multi-touch capacitive screen",
      "AAC 1813 speaker",
      "220V zero live wire power supply",
      "Wi-Fi and Bluetooth connectivity",
      "Unlimited scenarios supported"
    ],
    specifications: {
      "Display": "4 inches, 480×480P resolution",
      "Touch Layer": "Multi-touch capacitive screen",
      "Speaker": "AAC 1813 speaker",
      "Power Supply": "220V zero live wire power supply",
      "Connectivity": "Wi-Fi, Bluetooth",
      "Scenarios": "Unlimited scenarios supported"
    },
    badges: ["Best Seller"]
  },
  {
    id: "mixpad-s-gateway",
    name: "MixPad S All-in-one Gateway Panel",
    description: "Advanced smart panel with built-in gateway, supporting up to 350 devices with zigbee networking.",
    price: 449,
    original_price: 499,
    category: "control-panels",
    brand: "BOLES",
    model: "MP-S-GW-001",
    stock_count: 15,
    in_stock: true,
    warranty: "2 years",
    image_url: "https://m.media-amazon.com/images/I/61C2YFb1-+L._AC_UF1000,1000_QL80_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61C2YFb1-+L._AC_UF1000,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/61jVMVk76VL._AC_UF894,1000_QL80_.jpg"
    ],
    features: [
      "2GB RAM, 8GB ROM storage",
      "4 inches, 480x480P resolution",
      "Dual microphone array",
      "Built-in zigbee gateway",
      "Supports 350 devices",
      "Wi-Fi, Bluetooth, Zigbee 3.0"
    ],
    specifications: {
      "Storage": "2GB RAM, 8GB ROM",
      "Display": "4 inches, 480×480P resolution",
      "Microphone": "Dual microphone array",
      "Gateway": "Built-in Zigbee 3.0 gateway",
      "Device Support": "Up to 350 devices",
      "Connectivity": "Wi-Fi, Bluetooth, Zigbee 3.0"
    },
    badges: ["Featured", "Gateway Hub"]
  },
  // Add more products here - for demo purposes, I'll add a few key ones from each category
  {
    id: "smart-led-strip",
    name: "BOLES RGB Smart LED Strip",
    description: "Color-changing LED strip with app control and voice compatibility.",
    price: 79,
    original_price: 99,
    category: "smart-lighting",
    brand: "BOLES",
    model: "LED-RGB-10M",
    stock_count: 45,
    in_stock: true,
    warranty: "1 year",
    image_url: "https://m.media-amazon.com/images/I/714sp-DjYhL._AC_UF1000,1000_QL80_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/714sp-DjYhL._AC_UF1000,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/61X27IypvjL._AC_UF1000,1000_QL80_.jpg"
    ],
    features: [
      "16 million colors",
      "Music sync capability",
      "Voice control compatible",
      "Easy installation",
      "32.8ft length",
      "App control"
    ],
    specifications: {
      "Length": "32.8ft (10m)",
      "Colors": "16 million colors",
      "Connectivity": "Wi-Fi, App control",
      "Features": "Music sync, Voice control",
      "Installation": "Adhesive backing",
      "Voltage": "12V DC"
    },
    badges: ["Popular", "Best Seller"]
  },
  {
    id: "outdoor-security-cam",
    name: "BOLES Outdoor Security Camera",
    description: "Weatherproof 4K security camera with night vision and motion detection.",
    price: 249,
    original_price: 299,
    category: "security-cameras",
    brand: "BOLES",
    model: "SEC-4K-001",
    stock_count: 18,
    in_stock: true,
    warranty: "3 years",
    image_url: "https://m.media-amazon.com/images/I/716Ed4DBAML.jpg",
    images: [
      "https://m.media-amazon.com/images/I/716Ed4DBAML.jpg",
      "https://m.media-amazon.com/images/I/71oWCr2tZCL.jpg"
    ],
    features: [
      "4K Ultra HD recording",
      "Night vision up to 100ft",
      "Motion detection alerts",
      "Weatherproof IP66 rating",
      "Two-way audio",
      "Cloud storage included"
    ],
    specifications: {
      "Resolution": "4K Ultra HD (3840×2160)",
      "Night Vision": "Up to 100ft infrared range",
      "Weather Rating": "IP66 weatherproof",
      "Audio": "Two-way communication",
      "Storage": "Cloud and local storage",
      "Connectivity": "Wi-Fi 6, Ethernet"
    },
    badges: ["Weatherproof", "Best Seller"]
  },
  {
    id: "voice-assistant-hub",
    name: "BOLES Voice Assistant Hub",
    description: "Premium smart speaker with superior sound quality and smart home control.",
    price: 179,
    category: "smart-speakers",
    brand: "BOLES",
    model: "VAH-001",
    stock_count: 34,
    in_stock: true,
    warranty: "2 years",
    image_url: "https://m.media-amazon.com/images/I/61F4vOdQpqL._AC_UF1000,1000_QL80_.jpg",
    features: [
      "Superior 360° sound",
      "Built-in smart hub",
      "Voice control",
      "Music streaming",
      "Smart device control",
      "Multiple assistant support"
    ],
    specifications: {
      "Audio": "360° omnidirectional sound",
      "Connectivity": "Wi-Fi, Bluetooth",
      "Voice": "Multi-assistant support",
      "Hub": "Smart home integration",
      "Streaming": "All major services",
      "Power": "AC powered"
    },
    badges: ["Premium Audio", "Best Seller"]
  },
  {
    id: "keypad-smart-lock",
    name: "Smart Keypad Door Lock",
    description: "Keyless entry with keypad, smartphone app, and backup keys.",
    price: 279,
    category: "smart-locks",
    brand: "BOLES",
    model: "SKL-001",
    stock_count: 22,
    in_stock: true,
    warranty: "2 years",
    image_url: "https://m.media-amazon.com/images/I/71WCY7n+nuL._AC_UF894,1000_QL80_.jpg",
    features: [
      "Keyless entry",
      "Smartphone app control",
      "Backup physical keys",
      "Auto-lock feature",
      "Access logs",
      "Easy installation"
    ],
    specifications: {
      "Access": "Keypad, app, backup keys",
      "Security": "Auto-lock feature",
      "Connectivity": "Wi-Fi, Bluetooth",
      "Battery": "12 months AA batteries",
      "Installation": "Standard deadbolt",
      "Logs": "Access history tracking"
    },
    badges: ["Secure", "Best Seller"]
  },
  {
    id: "motion-sensor",
    name: "Smart Motion Sensor",
    description: "Wireless motion detector with smartphone alerts and automation triggers.",
    price: 39,
    category: "sensors-detectors",
    brand: "BOLES",
    model: "SMS-001",
    stock_count: 65,
    in_stock: true,
    warranty: "2 years",
    image_url: "https://ae01.alicdn.com/kf/Sfa40a9cb54bb42249f124b0f9c3955fd5.png",
    features: [
      "Wireless connectivity",
      "Instant alerts",
      "Long battery life",
      "Easy mounting",
      "Automation triggers",
      "Pet-friendly option"
    ],
    specifications: {
      "Detection": "PIR motion sensor",
      "Range": "30ft detection range",
      "Battery": "2 years CR2032",
      "Connectivity": "Zigbee 3.0",
      "Mounting": "Adhesive or screw",
      "Alerts": "Real-time notifications"
    },
    badges: ["Wireless", "Best Seller"]
  }
];

// Sample users data
const usersData = [
  {
    clerk_id: "admin_001",
    email: "admin@boles.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin"
  },
  {
    clerk_id: "user_001", 
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "user"
  },
  {
    clerk_id: "user_002",
    email: "jane.smith@example.com", 
    first_name: "Jane",
    last_name: "Smith",
    role: "user"
  }
];

// Categories data
const categoriesData = [
  {
    id: "smart-lighting",
    name: "Smart Lighting",
    description: "Intelligent lighting solutions for modern homes",
    icon: "💡"
  },
  {
    id: "security-cameras",
    name: "Security Cameras", 
    description: "Advanced surveillance and monitoring systems",
    icon: "📹"
  },
  {
    id: "smart-speakers",
    name: "Smart Speakers",
    description: "Voice-controlled audio and smart home hubs", 
    icon: "🔊"
  },
  {
    id: "smart-locks",
    name: "Smart Locks",
    description: "Secure keyless entry solutions",
    icon: "🔐"
  },
  {
    id: "sensors-detectors", 
    name: "Sensors & Detectors",
    description: "Motion, temperature, and security sensors",
    icon: "🌡️"
  },
  {
    id: "control-panels",
    name: "Control Panels",
    description: "Central hubs for smart home automation",
    icon: "📱"
  }
];

async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');

    // Insert categories first
    console.log('📦 Inserting categories...');
    const { data: categoryResult, error: categoryError } = await supabase
      .from('categories')
      .upsert(categoriesData, { onConflict: 'id' });

    if (categoryError) {
      console.error('❌ Error inserting categories:', categoryError);
    } else {
      console.log('✅ Categories inserted successfully');
    }

    // Insert users
    console.log('👥 Inserting users...');
    const { data: userResult, error: userError } = await supabase
      .from('users')
      .upsert(usersData, { onConflict: 'clerk_id' });

    if (userError) {
      console.error('❌ Error inserting users:', userError);
    } else {
      console.log('✅ Users inserted successfully');
    }

    // Insert products
    console.log('🛍️ Inserting products...');
    const { data: productResult, error: productError } = await supabase
      .from('products')
      .upsert(productsData, { onConflict: 'id' });

    if (productError) {
      console.error('❌ Error inserting products:', productError);
    } else {
      console.log('✅ Products inserted successfully');
    }

    console.log('🎉 Database population completed!');
    
    // Verify data
    const { data: productCount } = await supabase
      .from('products')
      .select('id', { count: 'exact' });
    
    const { data: userCount } = await supabase
      .from('users')
      .select('id', { count: 'exact' });

    console.log(`📊 Summary:`);
    console.log(`   Products: ${productCount?.length || 0}`);
    console.log(`   Users: ${userCount?.length || 0}`);
    console.log(`   Categories: ${categoriesData.length}`);

  } catch (error) {
    console.error('💥 Error populating database:', error);
  }
}

if (require.main === module) {
  populateDatabase();
}

module.exports = { populateDatabase };