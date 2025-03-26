import React from 'react';
import linkedin from "/linkedin.svg"

const AboutFoodisave = () => {
  return (
    <div className="min-h-screen py-12 mt-20">
      <div className="container mx-auto px-4">
        {/* Flex-container för logga och rubrik */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <img 
            src="/black_logo.png" 
            alt="Foodisave logo" 
            className="w-16 h-16"
          />
          <h1 className="text-4xl font-bold">Om Foodisave</h1>
        </div>
        <section className="space-y-6 text-lg">
          <p>
            Vi är två studenter som studerar till fullstackutvecklare med inriktning mot AI och har i ett grupparbete
            tillsammans skapat Foodisave. Idén föddes ur våra egna vardagsutmaningar, där vi ofta upptäcker
            att det kan vara svårt att planera matlagningen på ett effektivt sätt och använda de råvaror som finns hemma
            innan de blir gamla.
          </p>
          <p>
            Med Foodisave vill vi hjälpa svenska hushåll att minska matsvinnet och samtidigt sänka de dagliga utgifterna. 
            Vi tror att små förändringar i våra köksrutiner kan göra en stor skillnad för både ekonomin och miljön.
          </p>
          <p>
            Vår vision är att erbjuda en smart och användarvänlig plattform där modern teknologi, inklusive AI, hjälper 
            dig att planera din matlagning på ett effektivt sätt. Genom att analysera dina nuvarande råvaror och föreslå 
            kreativa recept vill vi göra matlagningen både enklare och mer hållbar.
          </p>
          <p>
            Vi är passionerade om både teknik och hållbarhet, och vi strävar efter att skapa en plattform där varje 
            användare känner sig inspirerad att tänka smartare kring sin matlagning. Tillsammans kan vi göra en 
            verklig skillnad – för din plånbok, för ditt kök, och för vår planet.
          </p>
          <p>
            Kontakta oss:
          </p>

          <div className="flex items-center space-x-2 mb-1">
            
            <span>Kendal Bal</span>
            <a 
                href="https://www.linkedin.com/in/kendal-bal-bb0841176?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                target="_blank" 
                rel="noopener noreferrer"
            >
                <img src={linkedin} alt="LinkedIn ikon" className="w-6 h-6" />
            </a>
            </div>
            <span><a href="mailto:kendal.bal@foodisave.se" className="underline">
            kendal.bal@foodisave.se</a></span>

            
            <div className="flex items-center space-x-2 mt-4 mb-1">
                
            <span>Marcus Wetterström</span>
            <a
                href="https://www.linkedin.com/in/marcus-wetterström-3479271b5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                target="_blank" 
                rel="noopener noreferrer"
            >
                <img src={linkedin} alt="LinkedIn ikon" className="w-6 h-6" />
            </a>
            </div>
            <p className="mt">
            <span><a href="mailto:marcus.wetterstrom@foodisave.se" className="underline">
            marcus.wetterstrom@foodisave.se</a></span>
            </p>
        </section>
      </div>
    </div>
  );
};

export default AboutFoodisave;
