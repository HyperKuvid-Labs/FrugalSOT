import subprocess
import json
from dotenv import load_dotenv
import os

from prompt import classify_prompt_complexity

load_dotenv()
REMOTE_PATH = os.getenv('REMOTE_PATH')

prompt = "what is AI?"
complexity = classify_prompt_complexity(prompt)


with open("data/test.txt", "w") as f:
    f.write(str(json.dumps({"prompt":prompt,"complexity":complexity})))

command = ["scp", "data/test.txt", REMOTE_PATH]
subprocess.run(command, check=True)