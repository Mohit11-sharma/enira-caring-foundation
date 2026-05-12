import ContactHero from "../components/contact/ContactHero";
import ContactInfoCards from "../components/contact/ContactInfoCards";
import ContactForm from "../components/contact/ContactForm";
import ContactMap from "../components/contact/ContactMap";

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <ContactInfoCards />
      <ContactForm />
      <ContactMap />
    </div>
  );
}