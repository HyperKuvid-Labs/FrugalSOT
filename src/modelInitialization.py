import json
import sys

def modelsInitialization(ramGB):
    with open('../data/config.json', 'r') as f:
        data = json.load(f)
    
    config = data["MoreThan8GB"] if ramGB >= 8 else data["LessThan8gb"]
    
    print(json.dumps(config))

if __name__ == "__main__":
    ramGB = float(sys.argv[1])
    modelsInitialization(ramGB)
