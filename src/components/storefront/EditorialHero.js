import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function EditorialHero({ products = [] }) {
  const images = products.filter((product) => product.images?.[0]).slice(0, 2);
  return (
    <section className="trend-hero" aria-labelledby="trend-hero-title">
      <div className="store-container trend-hero-grid">
        <div className="trend-hero-copy">
          <p className="trend-eyebrow">THE TRENDVIBES EDIT / 01</p>
          <h1 id="trend-hero-title">Good style is<br /><em>always personal.</em></h1>
          <p>Discover the pieces you’ll reach for every day. Thoughtful finds, chosen for the way you live.</p>
          <Link href="/products" className="trend-hero-link">Explore the collection <ArrowUpRight size={17} /></Link>
          <span className="trend-hero-note">CURATED FOR YOUR EVERYDAY</span>
        </div>
        <div className="trend-hero-images">
          {images.map((product, index) => <Link href={'/products/' + product.slug} className={'trend-hero-image trend-hero-image-' + index} key={product.id} aria-label={'View ' + product.name}><Image src={product.images[0]} alt={product.name} fill priority={index === 0} sizes="(max-width: 640px) 55vw, 30vw" className="object-cover" /></Link>)}
        </div>
      </div>
    </section>
  );
}
