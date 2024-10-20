import os
import json
from flask import Blueprint, request, jsonify
from datetime import datetime
from .generator import generate_sudoku, GenerateOptions

api_bp = Blueprint('api', __name__)

CACHE_FILE = 'daily_puzzles_cache.json'

def load_cache():
    """Load cached puzzles if they exist and are from today."""
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            cache = json.load(f)
            if cache['date'] == datetime.now().strftime("%Y-%m-%d"):
                return cache
    return None

def save_cache(data):
    """Save puzzles to cache."""
    with open(CACHE_FILE, 'w') as f:
        json.dump(data, f)

@api_bp.route('/daily-puzzles', methods=['GET'])
def daily_puzzle():
    # Step 1: Check if we already have cached puzzles for today
    cached_puzzles = load_cache()
    if cached_puzzles:
        return cached_puzzles

    # Step 2: Generate new puzzles
    date = datetime.now().strftime("%Y-%m-%d")
    seed = datetime.now().toordinal()

    easy_options = GenerateOptions(seed=seed, count=1, difficulty='easy')
    moderate_options = GenerateOptions(seed=seed, count=1, difficulty='moderate')
    tough_options = GenerateOptions(seed=seed, count=1, difficulty='tough')
    hard_options = GenerateOptions(seed=seed, count=1, difficulty='hard')

    easy = generate_sudoku(easy_options)
    moderate = generate_sudoku(moderate_options)
    tough = generate_sudoku(tough_options)
    hard = generate_sudoku(hard_options)

    puzzles = {
        "date": date,
        "easy": easy["puzzles"][0],
        "moderate": moderate["puzzles"][0],
        "tough": tough["puzzles"][0],
        "hard": hard["puzzles"][0]
    }

    # Step 3: Cache the newly generated puzzles
    save_cache(puzzles)

    return puzzles

@api_bp.route('/generate', methods=['POST'])
def generate():
    data = request.json
    seed = data.get('seed', None)
    count = data.get('count', 1)
    if count < 1:
        return jsonify({"error": "Count must be at least 1"}), 400
    if count > 100:
        return jsonify({"error": "Count must be at most 100"}), 400
    difficulty = data.get('difficulty', 'any')
    if difficulty not in ['easy', 'moderate', 'tough', 'hard', 'any']:
        return jsonify({"error": "Invalid difficulty"}), 400
    options = GenerateOptions(seed=seed, count=count, difficulty=difficulty)
    puzzles = generate_sudoku(options)
    return puzzles
