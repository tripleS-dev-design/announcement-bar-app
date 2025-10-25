#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting Shopify app with stable URL...');

// Set fixed tunnel URL to match shopify.app.toml
process.env.SHOPIFY_APP_URL = 'https://southern-preparation-hold-headphones.trycloudflare.com';

// Start cloudflare tunnel with specific subdomain
const tunnel = exec('npx cloudflared tunnel --url http://localhost:3000 --hostname southern-preparation-hold-headphones.trycloudflare.com', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Tunnel error:', error);
    return;
  }
  console.log('🌐 Tunnel output:', stdout);
});

// Start Shopify dev server
setTimeout(() => {
  console.log('📱 Starting Shopify app...');
  const shopify = exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Shopify error:', error);
      return;
    }
    console.log('✅ Shopify output:', stdout);
  });
  
  shopify.stdout.on('data', (data) => {
    console.log(data);
  });
  
  shopify.stderr.on('data', (data) => {
    console.error(data);
  });
}, 3000);

tunnel.stdout.on('data', (data) => {
  console.log('🌐 Tunnel:', data);
});

tunnel.stderr.on('data', (data) => {
  console.error('🌐 Tunnel error:', data);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping servers...');
  tunnel.kill();
  process.exit();
});

