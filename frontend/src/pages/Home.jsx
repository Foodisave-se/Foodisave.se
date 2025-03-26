import { Link } from "react-router-dom";
import React from "react";
import black_logo from "/black_logo.png";
import bagare_bild from "/bagare_bild.jpg";
import blabar from "/blabar.jpg";
import ingredients from "/ingredients.svg"
import kitchen from "/kitchen.svg"
import plate from "/plate.svg"
import chef from "/chef.svg"
import heart from "/heart.svg"
import user from "/user.svg"
import empty from "/empty.svg"
import plusUser from "/plus_user.svg"

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Första sektionen: Logotyp och titel – fyller hela viewporten */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-[#c8c8c8]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-4">
            <img
              src={black_logo}
              alt="foodisave logo"
              className="w-12 sm:w-24 md:w-44 h-auto"
            />
            <h1 className="text-4xl sm:text-5xl md:text-9xl font-bold text-black">
              foodisave
            </h1>
          </div>
          <div className="text-m sm:text-l md:text-xl text-gray-900 mt-4">
            Ta vara på dina råvaror och laga hållbart, varje dag!
          </div>
          <div className="text-m sm:text-l md:text-xl text-gray-900 mt-4">
          </div>
          <button
           onClick={() => {
            document.getElementById("readmore").scrollIntoView({ behavior: "smooth" });
          }}
            className="mt-8 bg-black text-white py-2 px-6 rounded-md shadow-lg
                      hover:bg-[#888383] transition-all duration-300 text-lg cursor-pointer"
          >
            Läs mer
          </button>
        </div>
      </section>

      {/* Andra sektionen: Bild och ny text – visas vid scroll */}
      <section className="w-full flex items-center justify-center bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-7xl mx-auto px-4 ">
          {/* Bilddel */}
          <div className="flex justify-center">
            <img
              src={bagare_bild}
              alt="Bagarbild"
              className="w-full max-h-126 object-cover mt-10 rounded-4xl"
            />
          </div>
          {/* Textdel */}
          <div className="max-h-126">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
              Minska matsvinn och spara pengar
            </h2>
            <p className="text-gray-900 text-base sm:text-lg md:text-xl mb-4">
            Foodisave är en AI-driven plattform som hjälper dig att minska matsvinn, 
            spara pengar och laga kreativa måltider med det du redan har hemma. 
            Genom att enkelt ange dina ingredienser eller fotografera ditt kylskåp genererar 
            Foodisave skräddarsydda recept som maximerar varje råvaras potential. Med interaktiva 
            matlagningstips, personlig rådgivning och smart måltidsplanering blir matlagningen både 
            enklare och roligare. Oavsett om du vill få ut det mesta av dina råvaror, spara tid i köket 
            eller upptäcka nya smakkombinationer – Foodisave gör det smidigt att laga hållbart, varje dag!
            </p>
            <p className="text-gray-900 text-base sm:text-lg md:text-xl mb-4">
              Enligt uppgifter från Konsumentverket slänger en person  
              i genomsnitt cirka 30 kilo mat per år i Sverige. Detta inkluderar färsk frukt, 
              grönsaker, bröd och mejerier. Det vill vi ändra på!
            </p>
          </div>
        

            {/* Textdel */}
            <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
              Recept på vår sida
            </h2>
            <p className="text-gray-900 text-base sm:text-lg md:text-xl mb-4">
            Saknar du inspiration i köket? Vi har lösningen! Med vår Receptroulette kan du slumpa fram ett spännande recept från Arla och ICA när idéerna tryter.
            </p>
            <p className="text-gray-900 text-base sm:text-lg md:text-xl mb-4">
            Vill du istället söka efter något specifikt? Vår smarta sökfunktion låter dig filtrera och hitta recept från samma källor, anpassade efter dina önskemål. Och det bästa av allt – du kan spara dina favoritrecept och enkelt hitta tillbaka till dem när du behöver. Oavsett om du vill ha en snabb lösning eller planera en måltid, hjälper vi dig att hitta rätt recept på ett ögonblick.            </p>
          </div>
          {/* Bilddel */}
          <div className="flex justify-center">
            <img
              src={blabar}
              alt="Blåbär"
              className="w-full max-h-126 object-cover rounded-4xl mb-10"
            />
          </div>

        </div>
      </section>
      {/* Verktyg-sektion */}
      <section id="readmore" className="bg-[#c8c8c8] py-12">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black">
     Verktyg
    </h2>
    <p className="text-gray-900 text-m text-center sm:text-l md:text-xl mt-2">
      Med våra olika verktyg underlättar vi din vardag i köket.<br/>
      Använd dem för att generera recept skräddarsydda efter dina preferenser eller 
      chatta direkt med vår digitala kock för personliga tips och justeringar.
    </p>
  </div>

  {/* Kort-layout med fyra kolumner för planerna */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 mt-8">
    
    {/* Kort 1 */}
    <div className="relative bg-white rounded-md shadow-lg p-6
                    transform transition-transform duration-300
                    hover:scale-105 hover:shadow-xl">
      <img
        src={ingredients}
        alt="Ingredienser ikon"
        className="mx-auto mb-4 w-10 h-10"
      />
      <h3 className="text-xl font-bold text-black text-center mb-2">Recept via Ingredienser</h3>
      
      <div className="mt-4">
        <p className="text-center">
          Ta en bild på dina ingredienser som du önskar att använda och få ett recept på nolltid.
        </p>
        
        
       
      </div>
    </div>

    {/* Kort 2 */}
    <div className="bg-white rounded-md shadow-lg p-6
                    transform transition-transform duration-300
                    hover:scale-105 hover:shadow-xl">

      <img
        src={plate}
        alt="Ingredienser ikon"
        className="mx-auto mb-4 w-10 h-10"
      />
      <h3 className="text-xl font-bold text-black text-center mb-2">Recept via Maträtt</h3>
      
      <div className="mt-4">
        <p className="text-center">
          Ta en bild på en maträtt, oavsett om du befinner dig på en resturang eller hemma och få reda på hur man tillagar det helt på egen hand.
        </p>
        
        
       
      </div>
    
    </div>

    {/* Kort 3 */}
    <div className="bg-white rounded-md shadow-lg p-6
                    transform transition-transform duration-300
                    hover:scale-105 hover:shadow-xl">

<     img
        src={chef}
        alt="Ingredienser ikon"
        className="mx-auto mb-4 w-10 h-10"
      />
      <h3 className="text-xl font-bold text-black text-center mb-2">Digitala Kocken</h3>
      
      <div className="mt-4">
        <p className="text-center">
          Använd dig utav din helt personliga assistent i köket och lista ut vad man ska dricka till maten eller hur vilken ingrediens som kan bytas ut till något annat.
        </p>
        
        
       
      </div>
    </div>
    <div className="bg-white rounded-md shadow-lg p-6
                    transform transition-transform duration-300
                    hover:scale-105 hover:shadow-xl">

      <img
        src={kitchen}
        alt="Ingredienser ikon"
        className="mx-auto mb-4 w-10 h-10"
      />
      <h3 className="text-xl font-bold text-black text-center mb-2">Mitt Kök</h3>
      
      <div className="mt-4">
        <p className="text-center">
          Efter du har varit och handlat så kan du enkelt ta bild på dina råvaror och lagra dem i ditt kök, håll enkelt koll på vad du har hemma med några knapptryck.
        </p>
        
        
       
      </div>
    </div>

    {/* Bli medlem-knapp nedanför kolumnerna (om du vill ha den i grid-raden) */}
    
  </div>
  <div className="flex items-center justify-center mt-4">
      <Link to="/register" >
        <button
          className="mt-8 bg-orange-500 py-2 px-6 rounded-md shadow-lg
                     hover:bg-orange-700 transition-all duration-300 text-lg cursor-pointer"
        >
          Prova Gratis
        </button>
      </Link>
    </div>
</section>
<section className="min-h-110 bg-white">
        
        <div className="text-center mx-auto">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black pt-6">Credits</h3>
           <p className="text-gray-900 text-m text-center sm:text-l md:text-xl mt-2">När man blir medlem så startar man med 100 credits. <br/> Alla Ai-funktioner kommer dra av en bestämd mängd credits från ditt konto varje gång de används.</p>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center pt-6 gap-8 max-w-7xl mx-auto px-4 pb-10">
          {/* Bilddel */}
          <div className="max-h-126">
            <h2 className="text-4xl sm:text-3xl md:text-3xl font-bold text-black mb-4">
              Hur credits spenderas
            </h2>
            <ul>
              <li className="bg-[#c8c8c8] py-2 rounded-md pl-2 shadow-md">
                <div className="flex items-center">
                <img
                    src={ingredients}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Recept via Ingrediens: -2 Credits/bild</p>
                </div>
              </li>
              <li className="bg-[#c8c8c8] my-2 py-2 rounded-md pl-2 shadow-md">
              <div className="flex items-center">
                <img
                    src={plate}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Recept via Maträtt: -2 Credits/bild</p>
                </div>
              </li>
              <li className="bg-[#c8c8c8] py-2 mb-2 rounded-md pl-2 shadow-md">
              <div className="flex items-center">
                <img
                    src={chef}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Digitala Kocken: -1 Credits/Meddelande</p>
                </div>
              </li>
              <li className="bg-[#c8c8c8] py-2 rounded-md pl-2 shadow-md">
              <div className="flex items-center">
                <img
                    src={kitchen}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Mitt Kök: -1 Credits/Bild</p>
                </div>
              </li>
            </ul>
          </div>
          {/* Textdel */}
          <div className="max-h-126">
            <h2 className="text-4xl sm:text-3xl md:text-3xl font-bold text-black mb-4">
              Hur man får credits
            </h2>
            <ul>
              <li className="bg-[#c8c8c8] py-2 rounded-md pl-2 shadow-md">
              <div className="flex items-center">
                <img
                    src={plusUser}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Ny Medlem: +100 Credits</p>
                </div>
              </li>
              <li className="bg-[#c8c8c8] mt-2 py-2 rounded-md pl-2 shadow-md">
              <div className="flex items-center">
                <img
                    src={heart}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Sparat Recept: +2 Credits/Dag</p>
                </div>
              </li>
              <li className="bg-[#c8c8c8] my-2 py-2 rounded-md pl-2 shadow-md">
              <div className="flex items-center">
                <img
                    src={user}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Inloggning: +2 Credits/Dag</p>
                </div>
              </li>
              <li className="bg-[#c8c8c8] py-2 rounded-md pl-2 shadow-md">
              <div className="flex items-center">
                <img
                    src={empty}
                    alt="Ingredienser ikon"
                    className="w-6 h-6"
                  />
                  <p className="pl-2">Slut på Credits: +10 Credits nästa dag</p>
                </div>
              </li>
            </ul>
          </div>
        

            

        </div>
        
      </section>
    </div>
  );
}
