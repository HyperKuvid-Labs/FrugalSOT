import subprocess
import tkinter as tk
from tkinter import scrolledtext
from threading import Thread
import os

def run_script():
    def execute_script():
        prompt = prompt_entry.get().strip()

        if not prompt:
            output_text.insert(tk.END, "\u274C Please enter a prompt.\n", "error")
            output_text.see(tk.END)
            run_button.config(state=tk.NORMAL)
            return

        output_text.insert(tk.END, f"\U0001F4DD Prompt: {prompt}\n", "prompt")
        output_text.insert(tk.END, "\U0001F680 Starting script execution...\n", "info")
        output_text.see(tk.END)

        process = subprocess.Popen(
            ["bash", "../scripts/frugalSot.sh"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        stdout, stderr = process.communicate(input=prompt)

        if stdout:
            for line in stdout.splitlines():
                if "And the clock starts ticking!" in line:
                    output_text.insert(tk.END, "\u23F0 Execution started...\n", "status")
                elif "Analyzing the complexity" in line:
                    output_text.insert(tk.END, "\U0001F50D Analyzing complexity...\n", "status")
                elif "Stepping it up!" in line or "Heavy lifting ahead" in line:
                    output_text.insert(tk.END, f"\u2699\uFE0F {line}\n", "status")
                elif "Running similarity test" in line:
                    output_text.insert(tk.END, "\U0001F9EA Running similarity test...\n", "status")
                elif "\U0001F3AF Bullseye" in line:
                    output_text.insert(tk.END, "\U0001F3AF Relevant response found!\n", "success")
                elif "Mission accomplished" in line:
                    output_text.insert(tk.END, f"\u2705 {line}\n", "info")
                else:
                    output_text.insert(tk.END, f"{line}\n", "output")
                    #final_output.insert(tk.END, f"{line}\n", "output")  

        # Uncomment this section to handle errors
        # if stderr:
        #     output_text.insert(tk.END, f"\u26A0\uFE0F Error: {stderr}\n", "error")
        output_file_path = os.path.join("..","data","output.txt")
        with open(output_file_path,'r') as f:
            data = f.read()
            print(data)
            final_output.insert(tk.END, f"{data}\n", "final")
        output_text.insert(tk.END, "\U0001F389 Execution completed successfully.\n", "success")
        output_text.see(tk.END)
        run_button.config(state=tk.NORMAL)

    run_button.config(state=tk.DISABLED)
    thread = Thread(target=execute_script)
    thread.start()

def close_app():
    root.destroy()

# Initialize the main window
root = tk.Tk()
root.title("FRUGAL SOT GUI")
root.state('normal')  # Maximize the window
root.resizable(True, True)
root.config(bg="#000000")

# Header Label
header_label = tk.Label(
    root,
    text="FRUGAL SOT GUI",
    font=("Helvetica", 18, "bold"),
    bg="#000000",
    fg="#FFD700",
    padx=20,
    pady=10
)
header_label.pack(fill=tk.X)

# Top Frame for Prompt and Buttons
top_frame = tk.Frame(root, bg="#000000")
top_frame.pack(pady=20)

# Prompt Label and Entry
prompt_label = tk.Label(
    top_frame,
    text="Enter Prompt:",
    font=("Arial", 12, "bold"),
    bg="#000000",
    fg="#FFD700"
)
prompt_label.pack(side=tk.LEFT, padx=10)

prompt_entry = tk.Entry(
    top_frame,
    width=60,
    font=("Arial", 12),
    relief="solid",
    borderwidth=2,
    bg="#333333",
    fg="#FFD700",
    insertbackground="#FFD700"
)
prompt_entry.pack(side=tk.LEFT, padx=10)

# Run and End Buttons
run_button = tk.Button(
    top_frame,
    text="Run Script",
    command=run_script,
    font=("Arial", 12, "bold"),
    bg="#FFD700",
    fg="#000000",
    activebackground="#FFC107",
    activeforeground="#000000",
    width=15,
    relief="raised",
    borderwidth=3
)
run_button.pack(side=tk.LEFT, padx=10)

end_button = tk.Button(
    top_frame,
    text="End",
    command=close_app,
    font=("Arial", 12, "bold"),
    bg="#FFD700",
    fg="#000000",
    activebackground="#FFC107",
    activeforeground="#000000",
    width=15,
    relief="raised",
    borderwidth=3
)
end_button.pack(side=tk.LEFT, padx=10)

# Output Frame (Split into Left and Right)
output_frame = tk.Frame(root, bg="#000000")
output_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

# Left Side: Detailed Output
output_text = scrolledtext.ScrolledText(
    output_frame,
    wrap=tk.WORD,
    width=60,
    height=20,
    font=("Courier", 12),
    bg="#1E1E1E",
    fg="#FFD700",
    relief="solid",
    borderwidth=2,
    insertbackground="#FFD700"
)
output_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))

# Right Side: Final Output
final_output = scrolledtext.ScrolledText(
    output_frame,
    wrap=tk.WORD,
    width=60,
    height=20,
    font=("Courier", 12),
    bg="#1E1E1E",
    fg="#FFD700",
    relief="solid",
    borderwidth=2,
    insertbackground="#FFD700"
)
final_output.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(5, 0))

# Tag Configurations
output_text.tag_config("prompt", foreground="#FFD700", font=("Arial", 12, "italic"))
output_text.tag_config("info", foreground="#32CD32", font=("Arial", 12, "bold"))
output_text.tag_config("status", foreground="#9966CC", font=("Arial", 12, "bold"))
output_text.tag_config("output", foreground="#F4F5F0", font=("Courier", 12))
output_text.tag_config("error", foreground="#FF4500", font=("Arial", 12, "bold"))
output_text.tag_config("success", foreground="#32CD32", font=("Arial", 12, "bold"))

final_output.tag_config("final", foreground="#32CD32", font=("Arial", 14, "bold"))

# Start the main loop
root.mainloop()
