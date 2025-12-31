import { Product } from './models/index.js';
import slugify from 'slugify';

const products = await Product.findAll();

for (let p of products) {
  const slug = slugify(p.name, { lower: true, strict: true });
  await p.update({ slug });
}

console.log('Slugs populated successfully.');
process.exit();
