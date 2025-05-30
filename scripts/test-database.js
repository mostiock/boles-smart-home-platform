const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database testing functions
const db = {
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  async getProductsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("name");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }
};

async function testDatabase() {
  console.log('🧪 Starting database integration tests...\n');

  try {
    // Test 1: Get all products
    console.log('📦 Testing product retrieval...');
    const products = await db.getAllProducts();
    console.log(`✅ Retrieved ${products.length} products`);
    
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log(`   Sample product: ${firstProduct.name} ($${firstProduct.price})`);
    }

    // Test 2: Get product by ID
    console.log('\n🔍 Testing single product retrieval...');
    const sampleProduct = await db.getProductById('mixpad-mini');
    if (sampleProduct) {
      console.log(`✅ Found product: ${sampleProduct.name}`);
      console.log(`   Category: ${sampleProduct.category}`);
      console.log(`   Stock: ${sampleProduct.stock_count} units`);
      console.log(`   Features: ${sampleProduct.features?.length || 0} listed`);
    } else {
      console.log('❌ Product not found');
    }

    // Test 3: Get products by category
    console.log('\n📂 Testing category filtering...');
    const controlPanels = await db.getProductsByCategory('control-panels');
    console.log(`✅ Found ${controlPanels.length} control panel products`);

    // Test 4: Get all users
    console.log('\n👥 Testing user retrieval...');
    const users = await db.getAllUsers();
    console.log(`✅ Retrieved ${users.length} users`);
    
    const adminUsers = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role === 'user');
    console.log(`   Admins: ${adminUsers.length}, Regular users: ${regularUsers.length}`);

    // Test 5: Get all orders
    console.log('\n🛒 Testing order retrieval...');
    const orders = await db.getAllOrders();
    console.log(`✅ Retrieved ${orders.length} orders`);
    
    if (orders.length > 0) {
      const firstOrder = orders[0];
      console.log(`   Sample order: ${firstOrder.order_number} ($${firstOrder.total})`);
      console.log(`   Items: ${firstOrder.order_items?.length || 0} products`);
    }

    // Test 6: Database statistics
    console.log('\n📊 Database Statistics:');
    const categoryStats = {};
    products.forEach(p => {
      categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
    });
    
    console.log('   Products by category:');
    Object.entries(categoryStats).forEach(([cat, count]) => {
      console.log(`     ${cat}: ${count} products`);
    });

    const totalInventory = products.reduce((sum, p) => sum + (p.stock_count || 0), 0);
    const avgPrice = products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / products.length;
    
    console.log(`   Total inventory: ${totalInventory} units`);
    console.log(`   Average price: $${avgPrice.toFixed(2)}`);
    console.log(`   In stock products: ${products.filter(p => p.in_stock).length}`);

    console.log('\n🎉 All database tests completed successfully!');

  } catch (error) {
    console.error('\n💥 Database test failed:', error);
  }
}

if (require.main === module) {
  testDatabase();
}

module.exports = { testDatabase, db };