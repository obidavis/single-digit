import subprocess
import json
import logging

# Configure a logger for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Optionally configure a specific handler (e.g., a file handler or stream handler)
# Here we use a stream handler for console output.
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Set a format for the log messages
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(console_handler)

def generate_sudoku(*, seed: int = 0, count: int = 1, difficulty: str = 'easy') -> dict:
    logger.info(f"Generating {count} puzzles of difficulty {difficulty} with seed {seed}")
    result = subprocess.run([
        "singledigit", "generate", 
        "--seed", str(seed),
        "--count", str(count),
        "--difficulty", difficulty,
        "--format", "json"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        logger.error(f"Failed to generate puzzles with seed {seed}")
        return {}
    
    puzzles = json.loads(result.stdout)
    logger.info(f"Generated {len(puzzles)} puzzles with seed {seed}")
    logger.info(f"Generated puzzles: {puzzles}")
    return puzzles