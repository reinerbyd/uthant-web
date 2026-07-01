import Preloader from "@/components/Preloader";
import ScrollFX from "@/components/ScrollFX";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Story from "@/components/Story";
import CurtainImage from "@/components/CurtainImage";
import Stats from "@/components/Stats";
import Collection from "@/components/Collection";
import Quarter from "@/components/Quarter";
import Schools from "@/components/Schools";
import Quote from "@/components/Quote";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import { getResidences, getHeroTagline, getContact, getWhatsApp } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [residences, heroTagline, contact, whatsapp] = await Promise.all([
    getResidences(),
    getHeroTagline(),
    getContact(),
    getWhatsApp(),
  ]);

  return (
    <>
      {/* interaction layer (client) */}
      <Preloader />

      <Nav />

      <main id="top">
        <Hero tagline={heroTagline} />
        <Marquee />
        <Story />
        <CurtainImage />
        <Stats />
        <Collection items={residences} />
        <Quarter />
        <Schools />
        <Quote />
        <ContactCTA residences={residences} contact={contact} whatsapp={whatsapp} />
      </main>

      <Footer />

      {/* animation engine — mounts last so all section DOM exists */}
      <ScrollFX />
    </>
  );
}
