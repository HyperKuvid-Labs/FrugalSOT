import json

def modelsInitialization(ramGB):
    try:
        with open('../data/config.json', 'r') as f:
            data = json.load(f)
        print(data)
        return data
    except FileNotFoundError:
        print("Config file not found.")
        return None
    except json.JSONDecodeError:
        print("Error decoding JSON.")
        return None
