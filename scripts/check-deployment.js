#!/usr/bin/env node

/**
 * BOLES Smart Home - Deployment Configuration Checker
 * Run this script to verify your environment variables are set correctly
 */

console.log('🔍 BOLES Deployment Configuration Checker\n');

const requiredVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_URL'
];

let hasErrors = false;

console.log('📋 Required Environment Variables:');
console.log('==================================');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = value && value !== 'undefined' && value.length > 0;
  const status = isSet ? '✅' : '❌';

  if (!isSet) {
    hasErrors = true;
  }

  console.log(`${status} ${varName}: ${isSet ? 'Set' : 'Missing'}`);

  if (isSet) {
    // Show partial value for verification
    if (varName.includes('KEY')) {
      console.log(`   Preview: ${value.substring(0, 20)}...`);
    } else {
      console.log(`   Value: ${value}`);
    }
  }
});

console.log('\n📋 Optional Environment Variables:');
console.log('=================================');

optionalVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = value && value !== 'undefined' && value.length > 0;
  const status = isSet ? '✅' : '⚠️';

  console.log(`${status} ${varName}: ${isSet ? value : 'Not set (using default)'}`);
});

console.log('\n🔐 Key Validation:');
console.log('==================');

// Validate Clerk keys
const clerkPK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (clerkPK) {
  if (clerkPK.startsWith('pk_test_')) {
    console.log('✅ Clerk Publishable Key: Valid test key format');
  } else if (clerkPK.startsWith('pk_live_')) {
    console.log('✅ Clerk Publishable Key: Valid live key format');
  } else {
    console.log('❌ Clerk Publishable Key: Invalid format (should start with pk_test_ or pk_live_)');
    hasErrors = true;
  }
}

const clerkSK = process.env.CLERK_SECRET_KEY;
if (clerkSK) {
  if (clerkSK.startsWith('sk_test_')) {
    console.log('✅ Clerk Secret Key: Valid test key format');
  } else if (clerkSK.startsWith('sk_live_')) {
    console.log('✅ Clerk Secret Key: Valid live key format');
  } else {
    console.log('❌ Clerk Secret Key: Invalid format (should start with sk_test_ or sk_live_)');
    hasErrors = true;
  }
}

// Validate Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  if (supabaseUrl.includes('supabase.co')) {
    console.log('✅ Supabase URL: Valid format');
  } else {
    console.log('❌ Supabase URL: Invalid format (should contain supabase.co)');
    hasErrors = true;
  }
}

console.log('\n🏗️ Build Configuration:');
console.log('=======================');

// Check if we're in a build environment
const isVercel = process.env.VERCEL === '1';
const isNetlify = process.env.NETLIFY === 'true';
const nodeEnv = process.env.NODE_ENV;

if (isVercel) {
  console.log('✅ Detected: Vercel deployment environment');
} else if (isNetlify) {
  console.log('✅ Detected: Netlify deployment environment');
} else {
  console.log('ℹ️  Local development environment');
}

console.log(`ℹ️  NODE_ENV: ${nodeEnv || 'development'}`);

console.log('\n📊 Summary:');
console.log('===========');

if (hasErrors) {
  console.log('❌ Configuration has errors!');
  console.log('\n🚨 Next Steps:');
  console.log('1. Check your .env.local file (for local development)');
  console.log('2. Verify environment variables in Vercel/Netlify dashboard');
  console.log('3. Ensure all keys are copied correctly from Clerk and Supabase');
  console.log('4. Re-run this script after fixing issues');

  process.exit(1);
} else {
  console.log('✅ All required configuration is set!');
  console.log('\n🚀 Ready for deployment:');
  console.log('- Environment variables configured correctly');
  console.log('- API keys have valid formats');
  console.log('- Ready to build and deploy');

  console.log('\n📝 Next Steps:');
  console.log('1. Test locally: bun dev');
  console.log('2. Deploy to Vercel/Netlify');
  console.log('3. Test authentication on live site');
}

console.log('\n💡 Need help? Check the deployment guides in .same/ folder');
