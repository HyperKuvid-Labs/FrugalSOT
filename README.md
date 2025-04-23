# FrugalSOT - Frugal Search Over Models

<table>
<tr>
<td>

## 🚀 Introduction
FrugalSOT (Frugal Search Over Models) is an optimized AI inference framework designed for resource-constrained devices. Inspired by FrugalGPT, it dynamically selects machine learning models based on request complexity to optimize computational resource allocation while maintaining response quality. By leveraging techniques such as prompt length analysis, named entity recognition (NER), and syntactic structure evaluation, FrugalSOT ensures efficient and adaptive model selection.

</td>
<td>

![image](https://github.com/user-attachments/assets/0fe0a7f8-90f6-4eca-868d-65428aa31efa)

</td>
</tr>
</table>

## 📌 Features
- **Dynamic Model Selection**: Uses a multi-tiered model approach based on request complexity.
- **Ollama Integration**: Executes models locally, eliminating cloud dependency.
- **Efficient Resource Utilization**: Minimizes computational load while ensuring high-quality responses.
- **Scalable Architecture**: Can be extended with additional lightweight models for varied use cases.
- **Privacy-Focused**: Keeps data processing entirely on-device for enhanced security.

## 🛠️ Setup & Installation
Follow these steps to set up and run FrugalSOT on any compatible device:

```bash
# 1. Clone the repository
$ git clone https://github.com/HARISH20205/RPI.git

# 2. Navigate to the project directory
$ cd RPI

# 3. Create a virtual environment
$ python -m venv rpienv

# 4. Activate the virtual environment (for Ubuntu/Linux)
$ source rpienv/bin/activate

# 5. Install dependencies (this may take some time)
$ pip install -r requirements.txt

# 6. Run the FrugalSOT script
$ cd scripts && bash frugalSot.sh
```

## 📌 Usage
After installation, FrugalSOT will dynamically determine the most efficient model for each request based on:
- **Prompt Length** 📏
- **Named Entity Recognition (NER)** 🔍
- **Syntactic Complexity** 🧠

### Model Selection Criteria:
| Complexity Level | Assigned Model |
|-----------------|--------------|
| Low (Score ≤ 4) | TinyLLaMA |
| Mid (5 ≤ Score ≤ 8) | TinyDolphin |
| High (Score > 8) | Gemma 2 2B |
| Last Resort | Phi 2.7B (fallback) |

## 🖥️ System Requirements
- **Hardware**: Can run on any compatible device 🖥️
- **OS**: Ubuntu 22.04 or equivalent Linux environment 🐧
- **Software Dependencies**: Ollama, Python 3.8+, Pip, Bash

## 📊 Performance Metrics
| Model | Avg Execution Time |
|-------|------------------|
| TinyLLaMA | ~60-80s |
| TinyDolphin | ~80-100s |
| Gemma 2 2B | ~240-280s |
| Phi 2.7B | Used as fallback |

## 💡 Future Enhancements
- Implementing adaptive model selection thresholds based on real-time feedback.
- Exploring hardware acceleration for improved inference speed.
- Expanding support for additional lightweight AI models.
- **Developing FrugalSOT as a CLI tool** for easier interaction and usability.

## 🚧 Development Status
FrugalSOT is actively being developed to function as a full CLI tool for streamlined usage. We proposed the architecture and tested it on Raspberry Pi 5 as an aid for edge computing, but it is designed to be flexible across various devices.

## 🤝 Contributing
We welcome contributions! Feel free to submit issues, pull requests, or suggestions to enhance FrugalSOT.

## 📬 Contact
For questions or collaborations, reach out to:
📧 Email: frugalSot@gmail.com  
🌍 Project Repository: [GitHub - HARISH20205/RPI](https://github.com/HARISH20205/RPI)  

###checkout out CLI tool for this 
[Github - HyperKuvid-Labs/FrugalSOT-CLI](https://github.com/HyperKuvid-Labs/FrugalSOT-CLI)
---
🚀 *Optimized AI Inference for Edge Devices*
