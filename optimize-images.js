#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts image URLs to WebP format with proper parameters
 * Saves ~267KB according to PageSpeed Insights
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🖼️  Starting Image Optimization...\n');

// Find all HTML and JS files
const files = glob.sync('**/*.{html,js}', {
  ignore: ['node_modules/**', 'dist/**', '.git/**', 'optimize-images.js']
});

let totalOptimizations = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let modified = false;
  let fileOptimizations = 0;

  // Optimize Unsplash images
  const unsplashRegex = /(https:\/\/images\.unsplash\.com\/[^"'\s)]+)/g;
  const newContent = content.replace(unsplashRegex, (match) => {
    // Check if already has optimization params
    if (match.includes('fm=webp') && match.includes('auto=format')) {
      return match;
    }

    // Add or update params for WebP and auto format
    let optimizedUrl = match;
    
    // Remove existing format params if any
    optimizedUrl = optimizedUrl.replace(/&?fm=(jpg|jpeg|png)/gi, '');
    optimizedUrl = optimizedUrl.replace(/&?auto=format/gi, '');
    
    // Add WebP and auto format
    const separator = optimizedUrl.includes('?') ? '&' : '?';
    optimizedUrl += `${separator}fm=webp&auto=format`;
    
    // Add compression quality if not present
    if (!optimizedUrl.includes('q=')) {
      optimizedUrl += '&q=80';
    }

    if (optimizedUrl !== match) {
      fileOptimizations++;
      modified = true;
    }
    
    return optimizedUrl;
  });

  if (modified) {
    writeFileSync(file, newContent, 'utf-8');
    console.log(`✅ ${file}: Optimized ${fileOptimizations} image(s)`);
    totalOptimizations += fileOptimizations;
  }
});

console.log(`\n🎉 Optimization Complete!`);
console.log(`📊 Total images optimized: ${totalOptimizations}`);
console.log(`💾 Expected savings: ~267KB (as per PageSpeed Insights)`);
console.log(`\n📝 Changes:`);
console.log(`   - Added fm=webp for WebP format`);
console.log(`   - Added auto=format for browser compatibility`);
console.log(`   - Set q=80 for optimal quality/size balance`);
