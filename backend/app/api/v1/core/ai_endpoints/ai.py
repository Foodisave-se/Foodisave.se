from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status, Query, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint
import json
import re
import os
from app.settings import settings
import google.generativeai as genai

from PIL import Image
import uuid
import io
from app.db_setup import get_db
from app.api.v1.core.recipe_endpoints.recipe_db import (
    get_one_recipe_db
)


from app.api.v1.core.recipe_endpoints.recipe_db import (
    get_recipe_db,
    get_random_recipe_db
)

from app.api.v1.core.models import (
    Users,
    Recipes,
    UserRecipes,
    Images,
    Comments,
    Messages,
    Reviews
)

from app.api.v1.core.schemas import (
    SearchRecipeSchema,
    RandomRecipeSchema
)

from app.db_setup import get_db

router = APIRouter()


GEMINI_API_KEY = settings.GEMINI_API_KEY

# Konfigurera Gemini API
genai.configure(api_key=GEMINI_API_KEY)


@router.get("/shopping-list/{recipe_id}")
def modify_recipes(recipe_id: int, portions: int, db: Session = Depends(get_db)):
    """ Generate a shopping list for the recipe, scaled to the specified number of servings """

    # Retrieve the recipe object from the database
    recipe = get_one_recipe_db(recipe_id, db)
    
    # Convert SQLAlchemy object to dictionary
    # You might need to adjust this based on your specific model
    recipe_dict = {
        "name": recipe.name,
        "servings": recipe.servings,
        "ingredients": recipe.ingredients
    }

    # Parse the ingredients string into a more structured format
    ingredients_list = recipe_dict['ingredients'].split(' | ')

    prompt_text = (
        f"Jag har följande recept: {recipe_dict['name']}.\n"
        f"Originalportioner: {recipe_dict['servings']}\n"
        f"Önskat antal portioner: {portions}\n"
        "Ingredienser:\n" + 
        "\n".join(ingredients_list) + "\n\n"
        "Uppgift: Skapa en detaljerad inköpslista med justerade ingredienskvantiteter för det önskade antalet portioner.\n"
        "Regler för svaret:\n"
        "1. Svara ENDAST i JSON-format\n"
        "2. Ingen extra text eller förklaringar\n"
        "3. Använd följande JSON-struktur exakt:\n"
        "{\n"
        "  \"recipes\": [\n"
        "    {\n"
        "      \"name\": \"Ingrediensnamn\",\n"
        "      \"amount\": \"Justerad mängd\",\n"
        "      \"unit\": \"Enhet\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt_text)

        print(" Gemini API Response:", response)

        if response and response.text:
            cleaned_text = response.text.strip()

            # Remove markdown json formatting if present
            cleaned_text = re.sub(r"^```json\n|\n```$", "", cleaned_text)

            # Clean up extra commas and whitespace
            cleaned_text = cleaned_text.strip().rstrip(",")

            try:
                # Parse JSON
                recipes = json.loads(cleaned_text)

                # Validate the JSON structure
                if "recipes" not in recipes:
                    raise ValueError("JSON saknar 'recipes'-nyckeln.")

                return JSONResponse(content={"suggested_recipes": recipes["recipes"]})
            except json.JSONDecodeError as e:
                print(" JSON-dekodningsfel:", e)
                raise HTTPException(
                    status_code=500, detail="500: Misslyckades att tolka svaret från AI som JSON")
            except ValueError as e:
                print(" JSON-fel:", e)
                raise HTTPException(
                    status_code=500, detail=f"500: JSON-formatfel - {str(e)}")

        return JSONResponse(content={"suggested_recipes": []}, status_code=200)

    except Exception as e:
        print(f" Fel vid API-förfrågan: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Fel vid API-förfrågan: {str(e)}")

    except Exception as e:
        print(f" Fel vid API-förfrågan: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Fel vid API-förfrågan: {str(e)}")
    
@router.get("/suggest-recipe/{recipe_id}")
def modify_recipes(recipe_id: int, db: Session = Depends(get_db)):
    """ Anropar Gemini API för att föreslå recept baserat på ingredienser """

    recipe = get_one_recipe_db(recipe_id, db)

    prompt_text = (
        f"Jag har följande recept: {recipe}. \n" 
        "Skapa en detaljerad lista på **tre recept** som liknar detta recept.\n"
        "Svar **endast i JSON-format**, ingen extra text, inget extra värde.\n\n"
        "Struktur för JSON-utdata:\n"
        "{\n"
        "  \"recipes\": [\n"
        "    {\n"
        "      \"title\": \"Titel på receptet\",\n"
        "      \"description\": \"En kort beskrivning av rätten.\",\n"
        "      \"time\": \"Total tillagningstid (t.ex. 30 min)\",\n"
        "      \"difficulty\": \"Svårighetsgrad (Enkel, Medel, Avancerad)\",\n"
        "      \"ingredients\": [\n"
        "        {\"name\": \"Ingrediensnamn\", \"amount\": \"Mängd\", \"unit\": \"Enhet\"}\n"
        "      ],\n"
        "      \"instructions\": [\n"
        "        \"Steg 1: Beskrivning\",\n"
        "        \"Steg 2: Beskrivning\",\n"
        "        \"Steg 3: Beskrivning\"\n"
        "      ],\n"
        "      \"image\": \"En genererad bild av rätten baserat på titeln och ingredienserna\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt_text)

        #  Logga API-svaret
        print(" Gemini API Response:", response)

        if response and response.text:
            cleaned_text = response.text.strip()

            # ✅ Ta bort markdown ```json ... ``` om det finns
            cleaned_text = re.sub(r"^```json\n|\n```$", "", cleaned_text)

            # ✅ Rensa bort extra kommatecken och blanksteg i slutet av JSON-strängen
            cleaned_text = cleaned_text.strip().rstrip(",")

            try:
                # ✅ Försök att tolka JSON
                recipes = json.loads(cleaned_text)

                # ✅ Kontrollera att JSON innehåller "recipes"-nyckeln
                if "recipes" not in recipes:
                    raise ValueError("JSON saknar 'recipes'-nyckeln.")

                return JSONResponse(content={"suggested_recipes": recipes["recipes"]})
            except json.JSONDecodeError as e:
                print(" JSON-dekodningsfel:", e)
                raise HTTPException(
                    status_code=500, detail="500: Misslyckades att tolka svaret från AI som JSON")
            except ValueError as e:
                print(" JSON-fel:", e)
                raise HTTPException(
                    status_code=500, detail=f"500: JSON-formatfel - {str(e)}")

        return JSONResponse(content={"suggested_recipes": []}, status_code=200)

    except Exception as e:
        print(f" Fel vid API-förfrågan: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Fel vid API-förfrågan: {str(e)}")


@router.get("/change-ingredients/{recipe_id}")
def modify_recipes(recipe_id: int,
                    ingredients: str = Query(..., description="Lista över ingredienser, separerade med komma"), 
                    db: Session = Depends(get_db)):
    """ Anropar Gemini API för att föreslå recept baserat på ingredienser """

    recipe = get_one_recipe_db(recipe_id, db)

    ingredient_list = [ing.strip() for ing in ingredients.split(",")]

    prompt_text = (
        f"Jag har följande recept: {recipe}. \n" 
        f"jag behöver byta ut dessa ingredienser{', '.join(ingredient_list)} med andra ingredienser som passar.\n"
        "Skapa en detaljerad lista på **tre recept** med dem utbytta ingredienserna.\n"
        "Svar **endast i JSON-format**, ingen extra text, inget extra värde.\n\n"
        "Struktur för JSON-utdata:\n"
        "{\n"
        "  \"recipes\": [\n"
        "    {\n"
        "      \"title\": \"Titel på receptet\",\n"
        "      \"description\": \"En kort beskrivning av rätten.\",\n"
        "      \"time\": \"Total tillagningstid (t.ex. 30 min)\",\n"
        "      \"difficulty\": \"Svårighetsgrad (Enkel, Medel, Avancerad)\",\n"
        "      \"ingredients\": [\n"
        "        {\"name\": \"Ingrediensnamn\", \"amount\": \"Mängd\", \"unit\": \"Enhet\"}\n"
        "      ],\n"
        "      \"instructions\": [\n"
        "        \"Steg 1: Beskrivning\",\n"
        "        \"Steg 2: Beskrivning\",\n"
        "        \"Steg 3: Beskrivning\"\n"
        "      ],\n"
        "      \"image\": \"En genererad bild av rätten baserat på titeln och ingredienserna\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt_text)

        #  Logga API-svaret
        print(" Gemini API Response:", response)

        if response and response.text:
            cleaned_text = response.text.strip()

            # ✅ Ta bort markdown ```json ... ``` om det finns
            cleaned_text = re.sub(r"^```json\n|\n```$", "", cleaned_text)

            # ✅ Rensa bort extra kommatecken och blanksteg i slutet av JSON-strängen
            cleaned_text = cleaned_text.strip().rstrip(",")

            try:
                # ✅ Försök att tolka JSON
                recipes = json.loads(cleaned_text)

                # ✅ Kontrollera att JSON innehåller "recipes"-nyckeln
                if "recipes" not in recipes:
                    raise ValueError("JSON saknar 'recipes'-nyckeln.")

                return JSONResponse(content={"suggested_recipes": recipes["recipes"]})
            except json.JSONDecodeError as e:
                print(" JSON-dekodningsfel:", e)
                raise HTTPException(
                    status_code=500, detail="500: Misslyckades att tolka svaret från AI som JSON")
            except ValueError as e:
                print(" JSON-fel:", e)
                raise HTTPException(
                    status_code=500, detail=f"500: JSON-formatfel - {str(e)}")

        return JSONResponse(content={"suggested_recipes": []}, status_code=200)

    except Exception as e:
        print(f" Fel vid API-förfrågan: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Fel vid API-förfrågan: {str(e)}")
    
@router.get("/add-ingredients/{recipe_id}")
def modify_recipes(recipe_id: int,
                    ingredients: str = Query(..., description="Lista över ingredienser, separerade med komma"), 
                    db: Session = Depends(get_db)):
    """ Anropar Gemini API för att föreslå recept baserat på ingredienser """

    recipe = get_one_recipe_db(recipe_id, db)

    ingredient_list = [ing.strip() for ing in ingredients.split(",")]

    prompt_text = (
        f"Jag har följande recept: {recipe}. \n" 
        f"jag behöver lägga till dessa ingredienser{', '.join(ingredient_list)}.\n"
        "Skapa en detaljerad lista på **tre recept** med dem tillagda ingredienserna.\n"
        "Svar **endast i JSON-format**, ingen extra text, inget extra värde.\n\n"
        "Struktur för JSON-utdata:\n"
        "{\n"
        "  \"recipes\": [\n"
        "    {\n"
        "      \"title\": \"Titel på receptet\",\n"
        "      \"description\": \"En kort beskrivning av rätten.\",\n"
        "      \"time\": \"Total tillagningstid (t.ex. 30 min)\",\n"
        "      \"difficulty\": \"Svårighetsgrad (Enkel, Medel, Avancerad)\",\n"
        "      \"ingredients\": [\n"
        "        {\"name\": \"Ingrediensnamn\", \"amount\": \"Mängd\", \"unit\": \"Enhet\"}\n"
        "      ],\n"
        "      \"instructions\": [\n"
        "        \"Steg 1: Beskrivning\",\n"
        "        \"Steg 2: Beskrivning\",\n"
        "        \"Steg 3: Beskrivning\"\n"
        "      ],\n"
        "      \"image\": \"En genererad bild av rätten baserat på titeln och ingredienserna\"\n"
        "    }\n"
        "  ]\n"
        "}"
    )

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt_text)

        #  Logga API-svaret
        print(" Gemini API Response:", response)

        if response and response.text:
            cleaned_text = response.text.strip()

            # ✅ Ta bort markdown ```json ... ``` om det finns
            cleaned_text = re.sub(r"^```json\n|\n```$", "", cleaned_text)

            # ✅ Rensa bort extra kommatecken och blanksteg i slutet av JSON-strängen
            cleaned_text = cleaned_text.strip().rstrip(",")

            try:
                # ✅ Försök att tolka JSON
                recipes = json.loads(cleaned_text)

                # ✅ Kontrollera att JSON innehåller "recipes"-nyckeln
                if "recipes" not in recipes:
                    raise ValueError("JSON saknar 'recipes'-nyckeln.")

                return JSONResponse(content={"suggested_recipes": recipes["recipes"]})
            except json.JSONDecodeError as e:
                print(" JSON-dekodningsfel:", e)
                raise HTTPException(
                    status_code=500, detail="500: Misslyckades att tolka svaret från AI som JSON")
            except ValueError as e:
                print(" JSON-fel:", e)
                raise HTTPException(
                    status_code=500, detail=f"500: JSON-formatfel - {str(e)}")

        return JSONResponse(content={"suggested_recipes": []}, status_code=200)

    except Exception as e:
        print(f" Fel vid API-förfrågan: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Fel vid API-förfrågan: {str(e)}")

@router.post("/suggest_recipe_from_image")
async def suggest_recipe_from_image(file: UploadFile = File(...)):
    """
    Tar emot en bildfil, sparar den i images-mappen, 
    öppnar bilden med PIL, och anropar Gemini API för att få receptförslag.
    """
    try:
        # Generera ett unikt filnamn
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(os.path.dirname(__file__), "images", unique_filename)

        # Spara bilden på disk
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Öppna bilden med PIL
        pil_image = Image.open(file_path)

        # Skapa prompt-texten
        prompt_text = (
            "Analysera bilden nedan med ingredienser. Identifiera de ingredienser som syns i bilden "
            "och skapa en detaljerad lista med förslag på ett recept som kan lagas med endast dessa ingredienser som du identifierat i bilden. "
            "Svar endast i JSON-format, ingen extra text. "
            "Struktur för JSON-utdata:\n"
            "{\n"
            '  "recipes": [\n'
            "    {\n"
            '      "title": "Titel på receptet",\n'
            '      "description": "En kort beskrivning av rätten.",\n'
            '      "time": "Total tillagningstid (t.ex. 30 min)",\n'
            '      "difficulty": "Svårighetsgrad (Enkel, Medel, Avancerad)",\n'
            '      "ingredients": [\n'
            '        {"name": "Ingrediensnamn", "amount": "Mängd", "unit": "Enhet"}\n'
            "      ],\n"
            '      "instructions": [\n'
            '        "Steg 1: Beskrivning",\n'
            '        "Steg 2: Beskrivning",\n'
            '        "Steg 3: Beskrivning"\n'
            "      ],\n"
            '      "image": "En genererad bild av rätten baserat på titeln och ingredienserna"\n'
            "    }\n"
            "  ]\n"
            "}"
        )

        

        # Anropa Gemini API med bilden och prompten
        model = genai.GenerativeModel("gemini-2.0-flash")

        print(model.count_tokens([prompt_text, pil_image]))
        
        response = model.generate_content([prompt_text, pil_image])
        

        print("Gemini API Response for image analysis:", response)

        if response and response.text:
            cleaned_text = response.text.strip()
            # Ta bort eventuell markdown (```json ... ```)
            cleaned_text = re.sub(r"^```json\n|\n```$", "", cleaned_text)
            cleaned_text = cleaned_text.strip().rstrip(",")

            try:
                result = json.loads(cleaned_text)
                if "recipes" not in result:
                    raise ValueError("JSON saknar 'recipes'-nyckeln.")
                return JSONResponse(content={"suggested_recipes": result["recipes"]})
            except json.JSONDecodeError as e:
                print("JSON-dekodningsfel:", e)
                raise HTTPException(
                    status_code=500, detail="500: Misslyckades att tolka svaret från AI som JSON")

        return JSONResponse(content={"suggested_recipes": []}, status_code=200)
    except Exception as e:
        print(f"Fel vid API-förfrågan: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Fel vid API-förfrågan: {str(e)}")
    finally:
        # Rensa upp bildfilen efter användning (valfritt)
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
