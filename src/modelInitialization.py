import json
import sys
import os

def modelsInitialization(ramGB):
    # Get the absolute path to config.json
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "config.json")
    with open(config_path, 'r') as f:
        data = json.load(f)
    
    config = data["MoreThan8GB"] if ramGB >= 8 else data["LessThan8gb"]
    
    print(json.dumps(config))

if __name__ == "__main__":
    ramGB = float(sys.argv[1])
    modelsInitialization(ramGB)
