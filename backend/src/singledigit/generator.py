import subprocess
import json
import logging
from dataclasses import dataclass
from enum import StrEnum

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

@dataclass
class GenerateOptions:
    seed: int | None = None
    count: int = 1
    difficulty: str = 'any'


def generate_sudoku(opts: GenerateOptions) -> dict:
    logger.info(f"Generating {opts.count} puzzles of difficulty {opts.difficulty} with seed {opts.seed}")
    command = [
        "singledigit", "generate", 
        "--format", "json",
        "--indent", "-1",
        "--count", str(opts.count)
    ]
    
    if opts.seed is not None:
        command.extend(["--seed", str(opts.seed)])
    if opts.difficulty != 'any':
        command.extend(["--difficulty", opts.difficulty])

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        return {}
    
    puzzles = json.loads(result.stdout)
    logger.info(f"Generated puzzles: {puzzles}")
    return puzzles