import pandas as pd
import psycopg2
from psycopg2 import sql
import os

# Database connection parameters
db_params = {
    'dbname': 'foodisave',
    'user': 'postgres',
    'password': 'naPraPatenAxeL13.',
    'host': 'db',
    'port': '5432'
}

# Read the CSV file
df = pd.read_csv('app/dataset/all_recipes.csv')

# Connect to the PostgreSQL database
conn = psycopg2.connect(**db_params)
cur = conn.cursor()

# Define the columns where you want to remove 'g'
columns_to_clean = ['Carbohydrates', 'Protein', 'Fat', 'Energy']  # Replace with your actual column names

# Remove the letter 'g' (both lowercase and uppercase) from the specified columns
for column in columns_to_clean:
    if column in df.columns:
        # Check if the column contains string data
        if df[column].dtype == 'object':
            df[column] = df[column].astype(str).str.replace('g', '', regex=False)
            df[column] = df[column].astype(str).str.replace('G', '', regex=False)
            df[column] = df[column].astype(str).str.replace(',', '.', regex=False)
            df[column] = df[column].astype(str).str.replace(' kcal', '', regex=False)
            

# Insert data into the table
insert_query = """
INSERT INTO recipes (
    name, 
    descriptions, 
    ingredients, 
    steps, 
    servings, 
    tags, 
    cook_time,
    calories,
    protein,
    carbohydrates,
    fat,
    images
    )
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

for index, row in df.iterrows():
    cur.execute(insert_query, (row['Title'], row['Description'],
                row['Ingredients'], row['Instructions'],
                row['Servings'], row['Category'], row['Time to cook'],
                row['Energy'], row['Protein'], row['Carbohydrates'], row['Fat'],
                row['Image']
                ))

cur.execute("DELETE FROM recipes WHERE LOWER(name::text) = 'nan' AND LOWER(descriptions::text) = 'nan';")

# Commit the transaction


cur.execute("""UPDATE recipes
SET 
    calories = NULLIF(calories, 'NaN'::FLOAT),
    protein = NULLIF(protein, 'NaN'::FLOAT),
    carbohydrates = NULLIF(carbohydrates, 'NaN'::FLOAT),
    fat = NULLIF(fat, 'NaN'::FLOAT)
WHERE calories::TEXT = 'NaN' 
   OR protein::TEXT = 'NaN' 
   OR carbohydrates::TEXT = 'NaN' 
   OR fat::TEXT = 'NaN';""")

conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

print("Data inserted successfully.")


# DELETE FROM recipes
# WHERE                        
#     LOWER(name::text) = 'nan'            
#     AND LOWER(descriptions::text) = 'nan';



# UPDATE recipes
# SET 
#     calories = NULLIF(calories, 'NaN'::FLOAT),
#     protein = NULLIF(protein, 'NaN'::FLOAT),
#     carbohydrates = NULLIF(carbohydrates, 'NaN'::FLOAT),
#     fat = NULLIF(fat, 'NaN'::FLOAT)
# WHERE calories::TEXT = 'NaN' 
#    OR protein::TEXT = 'NaN' 
#    OR carbohydrates::TEXT = 'NaN' 
#    OR fat::TEXT = 'NaN';

