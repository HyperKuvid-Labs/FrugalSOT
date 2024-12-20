# import torch
# from transformers import AutoTokenizer, AutoModelForCausalLM
# from dotenv import load_dotenv
# import os

# load_dotenv()
# hf_token = os.getenv("HF_TOKEN")

# model_name = "google/gemma-2-2b-it"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForCausalLM.from_pretrained(model_name)

# text = "This is a test input for Gemma-2 2B."
# inputs = tokenizer(text, return_tensors="pt")

# torch.onnx.export(
#     model, 
#     (inputs["input_ids"],), 
#     f"{model_name}.onnx", 
#     input_names=["input_ids"], 
#     output_names=["logits"], 
#     dynamic_axes={"input_ids": {0: "batch_size", 1: "sequence_length"}}, 
#     opset_version=12 
# )