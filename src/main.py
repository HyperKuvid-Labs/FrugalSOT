# import subprocess
import json
# from dotenv import load_dotenv
import os

from prompt import classify_prompt_complexity

# load_dotenv()
# REMOTE_PATH = os.getenv('REMOTE_PATH')

import sys

# prompt = "what is AI?"
if len(sys.argv) < 2:
    print("Please provide a prompt as an argument.")
    sys.exit(1)

prompt = sys.argv[1]
complexity = classify_prompt_complexity(prompt)

# Ensure data directory exists
data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(data_dir, exist_ok=True)

with open(os.path.join(data_dir, "test.txt"), "w") as f:
    f.write(str(json.dumps({"prompt":prompt,"complexity":complexity})))

# command = ["scp", "data/test.txt", REMOTE_PATH]
# subprocess.run(command, check=True)