import json

def modelsInitialization(ramGB):
    with open('data\config.json', 'r') as f:
        data = json.load(f)
    # print(data)
    if ramGB>= 8:
        print(data["MoreThan8GB"])
        data1 = data
    else:
        print(data["LessThan8gb"])
        data1 = data
    return data1
    

# modelsInitialization(7.75)