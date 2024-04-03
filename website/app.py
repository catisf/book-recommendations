from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Flask application
app = Flask(__name__)

# Create SQLite database engine
engine = create_engine('sqlite:///books_dataset.db')

# Define file path using environment variables or relative path
data_path = os.getenv('data_path', 'clustered_data_no_outliers.csv')

# Load cleaned data from CSV file
data = pd.read_csv(data_path)

# Save cleaned data to the database
data.to_sql('data', engine, index=False, if_exists='replace')

# Define a route to print data 
@app.route('/book_4_you')
def book_4_you():
    try:
        # Convert data to JSON format
        data_all_json = data.to_json(orient='records')

        # Return a JSON response
        return jsonify({'books_data': data_all_json})
    except Exception as e:
        # Print the exception for debugging
        print(f"Error in print_sample_data_all route: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Define the main route to render the index.html template
@app.route('/')
def index():
    return render_template('index.html')

# Run the application
if __name__ == '__main__':
    # Enable debugging and reloading in the development environment
    debug = os.getenv('DEBUG', True)
    use_reloader = os.getenv('USE_RELOADER', True)

    app.run(debug=debug, use_reloader=use_reloader)