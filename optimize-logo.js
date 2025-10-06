// This script helps optimize your logo for web
const logoOptimizationTips = {
  formats: ['png', 'webp', 'ico'],
  sizes: {
    favicon: [16, 32],
    appleTouch: [180],
    general: [192, 512]
  },
  optimization: {
    png: 'Use TinyPNG or Squoosh to compress',
    webp: 'Convert for better performance',
    ico: 'For classic favicon support'
  }
};

console.log('Logo Optimization Tips:', logoOptimizationTips);