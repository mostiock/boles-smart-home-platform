# 🔐 BOLES Authentication Setup for Vercel Deployment

## 🚨 **Current Issue**
The file-based authentication system won't work on Vercel because:
- Vercel is serverless (stateless functions)
- No persistent file system between deployments
- Each function instance runs independently

## ✅ **Solution: Clerk Authentication + Supabase Database**

### **Why This Approach?**
- ✅ **Clerk**: Professional authentication service
- ✅ **Supabase**: PostgreSQL database with real-time features
- ✅ **Serverless Compatible**: Works perfectly with Vercel
- ✅ **Production Ready**: Scalable and secure

---

## 🛠️ **Step 1: Set Up Clerk Authentication**

### **1.1 Create Clerk Account**
1. Go to [clerk.com](https://clerk.com)
2. Sign up for free account
3. Create new application: "BOLES Smart Home"
4. Choose "Next.js" as framework

### **1.2 Get Clerk Keys**
After creating your app, you'll get:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### **1.3 Install Clerk**
```bash
cd boles-smart-shop
npm install @clerk/nextjs
```

---

## 🗄️ **Step 2: Set Up Supabase Database**

### **2.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project: "boles-smart-home"
3. Choose region closest to your users
4. Set strong database password

### **2.2 Get Supabase Keys**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SECRET_KEY=your-secret-key
```

### **2.3 Create Database Tables**
Run this SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR ALL USING (clerk_id = auth.jwt() ->> 'sub');
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = auth.jwt() ->> 'sub'
    AND role = 'admin'
  )
);
```

---

## ⚙️ **Step 3: Configure Environment Variables**

### **3.1 Create .env.local**
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SECRET_KEY=your_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **3.2 Add to Vercel Dashboard**
1. Go to your Vercel project settings
2. Add all environment variables
3. Deploy with new environment variables

---

## 🔧 **Step 4: Update Code for Production Authentication**

### **4.1 Install Required Packages**
```bash
npm install @clerk/nextjs @supabase/supabase-js
```

### **4.2 Create Middleware**
Create `middleware.ts` in project root:

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/products(.*)", "/categories(.*)", "/auth(.*)"],
  ignoredRoutes: ["/api/webhook"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};
```

---

## 🚀 **Step 5: Deploy to Vercel**

### **5.1 Quick Deploy**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### **5.2 Vercel Deploy Button**
Add this to your README for one-click deploy:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mostiock/boles-smart-home-platform&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

---

## 👥 **Step 6: Set Up Admin Users**

### **6.1 Create Admin Account**
1. Deploy your app
2. Sign up with your admin email
3. In Supabase, update the user role:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

### **6.2 Demo Accounts Setup**
For demo purposes, create test accounts and set roles in Supabase.

---

## 🎯 **Benefits of This Setup**

### **Production Ready**
- ✅ **Scalable**: Handles thousands of users
- ✅ **Secure**: Industry-standard authentication
- ✅ **Fast**: Optimized for Vercel Edge Network
- ✅ **Reliable**: No file system dependencies

### **Developer Experience**
- ✅ **Easy Setup**: Clear configuration steps
- ✅ **Real Database**: Persistent data storage
- ✅ **Admin Dashboard**: Supabase provides database UI
- ✅ **Analytics**: Built-in usage analytics

### **User Experience**
- ✅ **Social Login**: Google, GitHub, etc.
- ✅ **Password Reset**: Built-in flow
- ✅ **Email Verification**: Automatic
- ✅ **Session Management**: Secure and persistent

---

## 📋 **Migration Checklist**

- [ ] Create Clerk account and get keys
- [ ] Create Supabase project and database
- [ ] Install required packages
- [ ] Add environment variables
- [ ] Update authentication context
- [ ] Create middleware for route protection
- [ ] Test locally with new setup
- [ ] Deploy to Vercel
- [ ] Set up admin users in production
- [ ] Test all authentication flows

---

## 🆘 **Need Help?**
If you need assistance with any of these steps, I can help you:
1. Set up the authentication code
2. Configure the database
3. Deploy to Vercel
4. Test the login flows

This setup will give you production-ready authentication that scales with your business!
