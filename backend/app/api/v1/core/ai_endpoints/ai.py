from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status, Query, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint
import json
import re
from app.settings import settings
import google.generativeai as genai
import base64
from PIL import Image
import io


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


@router.get("/suggest_recipes")
def suggest_recipes(ingredients: str = Query(..., description="Lista över ingredienser, separerade med komma")):
    """ Anropar Gemini API för att föreslå recept baserat på ingredienser """

    ingredient_list = [ing.strip() for ing in ingredients.split(",")]

    prompt_text = (
        f"Jag har följande ingredienser: {', '.join(ingredient_list)}.\n"
        "Skapa en detaljerad lista på **tre recept** som kan tillagas med dessa ingredienser.\n"
        "Svar **endast i JSON-format**, ingen extra text.\n\n"
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


@router.get("/modify-recipe")
def modify_recipes(ingredients: str = Query(..., description="Lista över ingredienser, separerade med komma")):
    """ Anropar Gemini API för att föreslå recept baserat på ingredienser """

    ingredient_list = [ing.strip() for ing in ingredients.split(",")]

    prompt_text = (
        f"Jag har följande ingredienser: {', '.join(ingredient_list)}.\n"
        "Skapa en detaljerad lista på **tre recept** som kan tillagas med dessa ingredienser.\n"
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


def compress_image(image_bytes, max_size=(800, 800), quality=80):
    """
    Komprimerar bilden genom att ändra storlek om den överstiger maxstorleken 
    och spara den med reducerad kvalitet.
    """
    image = Image.open(io.BytesIO(image_bytes))
    # Ändra storlek om bilden är större än max_size
    image.thumbnail(max_size)
    buffer = io.BytesIO()
    # Spara som JPEG med reducerad kvalitet (du kan ändra formatet om nödvändigt)
    image.save(buffer, format="JPEG", quality=quality)
    return buffer.getvalue()


@router.post("/suggest_recipe_from_image")
async def suggest_recipe_from_image(file: UploadFile = File(...)):
    """
    Tar emot en bildfil, komprimerar den om den är för stor, kombinerar en prompt med bilddata
    och anropar Gemini API för att få receptförslag.
    """
    try:
        # Läs in originalbilden
        original_image_bytes = await file.read()

        # Komprimera bilden
        compressed_image_bytes = compress_image(original_image_bytes)
        encoded_image = base64.b64encode(
            compressed_image_bytes).decode("utf-8")

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

        # Kombinera prompten med den base64-kodade, komprimerade bilden
        combined_prompt = f"{prompt_text}\nBilddata: {encoded_image}"

        # Anropa Gemini API med det kombinerade promptet
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(combined_prompt)

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
