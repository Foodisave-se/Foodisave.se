import React from "react";

export default function TermsAndPrivacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold text-center text-black">Användarvillkor</h1>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">1. Allmänt</h2>
        <p className="mt-2">
          Denna sida tillhandahålls av Foodisave som en service till våra användare.
          Genom att använda vår plattform samtycker du till dessa villkor. Om du inte accepterar dem, vänligen avstå från att använda vår tjänst.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">2. Syfte med tjänsten</h2>
        <p className="mt-2">
          Foodisave är en plattform för att spara, organisera och dela recept. Vårt mål är att förenkla måltidsplanering och minska matsvinn.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">3. Användarens skyldigheter</h2>
        <p className="mt-2">Som användare förbinder du dig att:</p>
        <ul className="list-disc ml-6 ">
          <li>Inte sprida spam eller oönskad reklam.</li>
          <li>Inte utge dig för att vara någon annan.</li>
          <li>Inte skicka in material som är kränkande, olagligt eller på annat sätt olämpligt.</li>
          <li>Inte samla in eller spara andra användares personuppgifter utan deras medgivande.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">4. Ansvarsfriskrivning</h2>
        <p className="mt-2">
          Vi strävar efter att informationen på Foodisave är korrekt och uppdaterad, men vi kan inte garantera att den är helt fri från fel.
          Vi tar inte ansvar för eventuella förluster eller skador som kan uppstå vid användning av vår tjänst.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">5. Länkar till externa webbplatser</h2>
        <p className=" mt-2">
          Foodisave kan innehålla länkar till externa webbplatser. Vi tar inget ansvar för innehållet på dessa sidor eller de produkter och tjänster som erbjuds där.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">6. Hantering av personuppgifter</h2>
        <p className=" mt-2">
          Vi respekterar din integritet och behandlar dina personuppgifter enligt gällande lagar. Läs mer om vår personuppgiftspolicy längre ner.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">7. Immateriella rättigheter</h2>
        <p className=" mt-2">
          Alla varumärken, logotyper och innehåll på Foodisave tillhör Foodisave. Ingen får använda eller kopiera vårt innehåll utan skriftligt tillstånd.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">8. Jurisdiktion</h2>
        <p className=" mt-2">
          Dessa villkor regleras av svensk lag. Eventuella tvister ska avgöras av svensk domstol med Stockholms tingsrätt som första instans.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">9. Ändringar av villkoren</h2>
        <p className=" mt-2">
          Foodisave har rätt att ändra dessa villkor när som helst. Vid större ändringar kommer vi att meddela användarna via vår webbplats eller e-post.
        </p>
      </section>

      <h1 className="text-3xl font-bold text-center mb-4 mt-20">
        Personuppgiftspolicy
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">1. Introduktion</h2>
        <p>
          Foodisave värnar om din integritet och skyddar dina personuppgifter. Denna policy beskriver hur vi samlar in, behandlar och lagrar information enligt EU:s dataskyddsförordning (GDPR). Genom att använda vår tjänst samtycker du till behandlingen av dina uppgifter enligt denna policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">2. Vilka personuppgifter samlar vi in?</h2>
        <p>
          Vi samlar in och behandlar följande typer av personuppgifter:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <strong>Kontaktuppgifter:</strong> Förnamn, efternamn och e-postadress. Dessa används för att skapa och hantera ditt konto samt kommunicera med dig.
          </li>
          <li>
            <strong>Inloggningsuppgifter:</strong> Lösenord lagras aldrig i klartext utan endast i hashad form med salt, vilket skyddar ditt konto.
          </li>
          <li>
            <strong>Användargenererat innehåll:</strong> Recept (inklusive namn, beskrivningar, ingredienser, instruktioner, kategorier, näringsinformation) samt bilder som du laddar upp.
          </li>
          <li>
            <strong>Teknisk information:</strong> Loggdata, IP-adress, webbläsartyp och annan information som samlas in automatiskt för att förbättra tjänstens prestanda och säkerhet.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">3. Syfte och laglig grund</h2>
        <p>
          Vi behandlar dina personuppgifter för följande ändamål:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <strong>Kontohantering:</strong> Skapa, administrera och underhålla ditt konto (laglig grund: avtal och/eller samtycke).
          </li>
          <li>
            <strong>Kommunikation:</strong> Skicka aktiverings-, återställnings- och annan kundkommunikation (laglig grund: samtycke och berättigat intresse).
          </li>
          <li>
            <strong>Tjänsteutveckling:</strong> Förbättra våra tjänster genom analyser (laglig grund: berättigat intresse).
          </li>
          <li>
            <strong>Säkerhet:</strong> Skydda våra system och förhindra bedrägeri (laglig grund: rättslig förpliktelse och berättigat intresse).
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">4. Lagring och skydd</h2>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <strong>Säker lagring:</strong> Dina uppgifter lagras på säkra servrar med hög säkerhet.
          </li>
          <li>
            <strong>Kryptering och hashning:</strong> Lösenord lagras som hashade värden med ett starkt saltningssystem.
          </li>
          <li>
            <strong>Åtkomstbegränsning:</strong> Endast behörig personal har tillgång till dina uppgifter.
          </li>
          <li>
            <strong>Tredjepartsleverantörer:</strong> Vid användning av externa tjänster (t.ex. AWS S3) säkerställer vi att de följer GDPR via databehandlingsavtal.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">5. Lagringstid och gallring</h2>
        <p>
          Vi lagrar dina uppgifter endast så länge det är nödvändigt för att uppfylla de syften de samlades in för, eller så länge lagen kräver det. Inaktiva konton kan raderas eller anonymiseras efter en viss tids inaktivitet.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">6. Dina rättigheter</h2>
        <p>
          Enligt GDPR har du följande rättigheter:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Rätt till information</li>
          <li>Rätt till åtkomst</li>
          <li>Rätt till rättelse</li>
          <li>Rätt till radering ("rätten att bli glömd")</li>
          <li>Rätt till begränsning av behandling</li>
          <li>Rätt till dataportabilitet</li>
          <li>Rätt att göra invändningar</li>
          <li>Rätt att inte bli föremål för automatiserat beslutsfattande</li>
        </ul>
        <p className="mt-2">
          Om du vill utöva dina rättigheter eller har frågor om denna policy, kontakta oss på nedan kontaktuppgifter.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">7. Cookies och spårning</h2>
        <p>
          Vi använder för tillfället inte cookies och liknande tekniker för att förbättra din upplevelse på vår webbplats. Om vi börjar använda det kommer du vid ditt besök på hemsidan få möjlighet att acceptera eller neka cookies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-black mb-2">8. Ändringar i policyn</h2>
        <p>
          Vi förbehåller oss rätten att ändra denna personuppgiftspolicy när som helst. Vid större ändringar kommer vi att informera våra användare via e-post och/eller publicera en uppdaterad version på vår webbplats.
        </p>
      </section>


      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-black">Kontakt</h2>
        <p className=" mt-2">
          Om du har frågor om våra användarvillkor eller vår personuppgiftspolicy, vänligen kontakta oss:
        </p>
        <p className=" mt-2">
          <span>Kendal Bal: <a href="mailto:marcus.wetterstrom@foodisave.se" className="underline">
          kendal.bal@foodisave.se</a></span>
        </p>
        <p className=" mt-2">
          <span>Marcus Wetterström: <a href="mailto:marcus.wetterstrom@foodisave.se" className="underline">
          marcus.wetterstrom@foodisave.se</a></span>
        </p>
      </section>

      <div className="text-center mt-10">
        <a href="/" className="text-black font-semibold underline">Tillbaka till startsidan</a>
      </div>
    </div>
  );
}
