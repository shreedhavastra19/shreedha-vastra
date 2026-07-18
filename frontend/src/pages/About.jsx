import { Helmet } from '../components/common/Helmet';

const About = () => (
  <div className="container-custom py-16 max-w-3xl">
    <Helmet title="About Us | Shreedha Vastra" description="Learn about Shreedha Vastra's story, craftsmanship, and commitment to premium Indian ethnic wear." />
    <h1 className="font-serif text-4xl mb-6 text-center">Our Story</h1>
    <div className="space-y-6 text-charcoal/80 dark:text-ivory/80 leading-relaxed">
      <p>
        Shreedha Vastra was born from a love for India's rich textile heritage and a desire to bring
        that heritage into the modern woman's everyday wardrobe. Every piece we create blends
        traditional craftsmanship with contemporary silhouettes — designed to make you feel royal,
        elegant, and effortlessly yourself.
      </p>
      <p>
        From intricately embroidered suit sets to flowing festive wear and bridal ensembles, our
        collections are curated with a single promise: uncompromising quality, fabrics that feel as
        good as they look, and designs that honor tradition while embracing today.
      </p>
      <p>
        We work closely with skilled artisans across India to bring you garments that carry not just
        beauty, but the stories and skill of the hands that made them. Thank you for being part of
        the Shreedha Vastra family.
      </p>
    </div>
  </div>
);

export default About;
