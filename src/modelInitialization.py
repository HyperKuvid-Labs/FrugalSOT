import json

def modelsInitialization(ramGB):
    with open('data\config.json', 'r') as f:
        data = json.load(f)
    # print(data)
    if ramGB>= 8:
        print(data["MoreThan8GB"])
    else:
        print(data["LessThan8gb"])
    

# modelsInitialization(7.75)