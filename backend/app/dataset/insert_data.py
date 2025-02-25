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
df = pd.read_csv('app/dataset/cleaned_dataset.csv')

# # Add a new column 'num_of_ingredients' to the dataset
# df['num_of_ingredients'] = df['Ingredients'].apply(lambda x: len(x.split(',')))

# Connect to the PostgreSQL database
conn = psycopg2.connect(**db_params)
cur = conn.cursor()

# Insert data into the table
insert_query = """
INSERT INTO recipes (
    name, 
    descriptions, 
    ingredients, 
    ingredients_raw, 
    steps, 
    servings, 
    serving_size, 
    tags, 
    calories, 
    fat_content, 
    saturated_fat_content, 
    sodium_content,
    carbohydrate_content,
    fiber_content,
    sugar_content,
    protein_content,
    images
    )
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

for index, row in df.iterrows():
    cur.execute(insert_query, (row['name'], row['description'],
                row['ingredients'], row["ingredients_raw"], row['steps'],
                row['servings'], row["serving_size"], row['tags'],
                row['calories'], row["fat_content"], row['saturated_fat_content'],
                row['sodium_content'], row["carbohydrate_content"], row['fiber_content'],
                row['sugar_content'], row["protein_content"], row['images']
                ))

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

print("Data inserted successfully.")


# DELETE FROM recipes
# WHERE
#     LOWER(name::text) = 'nan'
#     OR LOWER(descriptions::text) = 'nan'
#     OR LOWER(ingredients::text) = 'nan'
#     OR LOWER(ingredients_raw::text) = 'nan'
#     OR LOWER(steps::text) = 'nan'
#     OR LOWER(servings::text) = 'nan'
#     OR LOWER(serving_size::text) = 'nan'
#     OR LOWER(tags::text) = 'nan'
#     OR LOWER(images::text) = 'nan'
#     OR LOWER(calories::text) = 'nan'
#     OR LOWER(fat_content::text) = 'nan'
#     OR LOWER(saturated_fat_content::text) = 'nan'
#     OR LOWER(sodium_content::text) = 'nan'
#     OR LOWER(carbohydrate_content::text) = 'nan'
#     OR LOWER(fiber_content::text) = 'nan'
#     OR LOWER(sugar_content::text) = 'nan'
#     OR LOWER(protein_content::text) = 'nan';
