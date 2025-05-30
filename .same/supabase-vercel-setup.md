# 🚀 Connecting Supabase Database to Vercel - Step by Step Guide

## ✅ **Status: Ready for Setup**

Your BOLES Smart Home platform is now configured with:
- ✅ **Clerk Authentication** - Professional auth service
- ✅ **Supabase Database** - PostgreSQL with real-time features
- ✅ **Vercel Deployment** - Serverless hosting platform

---

## 🗄️ **Step 1: Create Supabase Project**

### **1.1 Sign Up for Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended for easier integration)

### **1.2 Create New Project**
1. Click "New Project"
2. **Project Name**: `boles-smart-home`
3. **Database Password**: Create a strong password (save it!)
4. **Region**: Choose closest to your users
5. Click "Create new project"

### **1.3 Wait for Setup**
- Database creation takes 2-3 minutes
- You'll see a progress screen

---

## 🗃️ **Step 2: Set Up Database Schema**

### **2.1 Access SQL Editor**
1. In your Supabase dashboard, click "SQL Editor"
2. Click "New query"

### **2.2 Run Database Setup Script**
Copy and paste this SQL script:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (for future product management)
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT,
  stock_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  warranty TEXT,
  image_url TEXT,
  images TEXT[],
  features TEXT[],
  specifications JSONB,
  badges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  payment_method JSONB,
  tracking_number TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id TEXT NOT NULL, -- Using TEXT to match with static product data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own data" ON users
  FOR ALL USING (clerk_id = auth.jwt() ->> 'sub');

-- Create RLS policies for products table
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
      AND role = 'admin'
    )
  );

-- Create RLS policies for orders table
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
      AND users.id = orders.user_id
    )
  );

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
      AND users.id = orders.user_id
    )
  );

-- Create RLS policies for wishlist table
CREATE POLICY "Users can manage own wishlist" ON wishlist
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
      AND users.id = wishlist.user_id
    )
  );
```

### **2.3 Run the Script**
1. Click "RUN" button
2. Verify all tables were created successfully
3. Check that there are no errors

---

## 🔑 **Step 3: Get Supabase Credentials**

### **3.1 Find Project Credentials**
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"

### **3.2 Copy These Values**
```env
# You'll need these for Step 4
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔐 **Step 4: Set Up Clerk Authentication**

### **4.1 Create Clerk Account**
1. Go to [clerk.com](https://clerk.com)
2. Sign up with your email or GitHub
3. Create a new application

### **4.2 Configure Clerk Application**
1. **Application Name**: `BOLES Smart Home`
2. **Framework**: Choose "Next.js"
3. Click "Create Application"

### **4.3 Get Clerk Keys**
After creating your app:
```env
# Copy these from Clerk Dashboard → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## 🌐 **Step 5: Deploy to Vercel**

### **5.1 Connect GitHub Repository**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your `boles-smart-home-platform` repository

### **5.2 Configure Environment Variables**
In Vercel project settings, add these environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### **5.3 Deploy**
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-app.vercel.app`

---

## 👥 **Step 6: Create Admin User**

### **6.1 Sign Up on Your Live Site**
1. Visit your deployed Vercel URL
2. Click "Sign Up" in the header
3. Create account with your admin email

### **6.2 Set Admin Role in Supabase**
1. Go to Supabase → Table Editor → users
2. Find your user record
3. Edit the `role` field from `user` to `admin`
4. Save changes

### **6.3 Test Admin Access**
1. Refresh your site
2. You should now see admin features
3. Access admin panel (if implemented)

---

## 🎯 **Step 7: Test Everything**

### **7.1 Authentication Flow**
- ✅ Sign up new users
- ✅ Sign in existing users
- ✅ User profile display
- ✅ Sign out functionality

### **7.2 Database Operations**
- ✅ User creation in Supabase
- ✅ Wishlist add/remove
- ✅ Order creation (when implemented)
- ✅ Admin role checking

### **7.3 Production Features**
- ✅ Fast page loads
- ✅ Secure authentication
- ✅ Database persistence
- ✅ Mobile responsiveness

---

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

#### **Issue: "Failed to fetch" errors**
```bash
# Check environment variables in Vercel
# Ensure NEXT_PUBLIC_ prefix for client-side vars
```

#### **Issue: Users not being created in Supabase**
```sql
-- Check if user exists
SELECT * FROM users WHERE email = 'your-email@domain.com';

-- Manual user creation if needed
INSERT INTO users (clerk_id, email, first_name, last_name, role)
VALUES ('your-clerk-id', 'your-email@domain.com', 'First', 'Last', 'admin');
```

#### **Issue: RLS policies blocking access**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- Remember to re-enable after testing
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

---

## 📈 **What You Get**

### **Production Benefits**
- ✅ **Scalable**: Handles 1000s of users
- ✅ **Fast**: Edge-optimized globally
- ✅ **Secure**: Industry-standard auth
- ✅ **Reliable**: 99.9% uptime SLA

### **Developer Benefits**
- ✅ **Real Database**: PostgreSQL with relations
- ✅ **Admin Dashboard**: Supabase table editor
- ✅ **Auto Deployments**: GitHub integration
- ✅ **Environment Management**: Separate dev/prod

### **User Benefits**
- ✅ **Social Login**: Google, GitHub, etc.
- ✅ **Password Reset**: Built-in recovery
- ✅ **Secure Sessions**: JWT tokens
- ✅ **Fast Loading**: CDN optimization

---

## 🆘 **Need Help?**

If you encounter any issues:

1. **Check Vercel Build Logs**: Vercel dashboard → Deployments → View Function Logs
2. **Check Supabase Logs**: Supabase dashboard → Logs
3. **Verify Environment Variables**: Ensure all keys are correctly set
4. **Test Locally First**: Run `bun dev` with `.env.local` file

---

## 🎉 **Success!**

Once completed, you'll have:
- ✅ **Live production site** on Vercel
- ✅ **Real user authentication** with Clerk
- ✅ **Persistent database** with Supabase
- ✅ **Admin capabilities** for managing content
- ✅ **Automatic deployments** from GitHub

Your BOLES Smart Home platform is now production-ready! 🚀
