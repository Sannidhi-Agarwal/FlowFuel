import tkinter as tk
from tkinter import messagebox
from groq import Groq

def analyze_image():
    try:
        client = Groq()
        completion = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyse how nutritious the meal in this image is for a woman in the luteal phase"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": "https://plus.unsplash.com/premium_photo-1669742928112-19364a33b530?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVsaWNpb3VzJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D"
                            }
                        }
                    ]
                }
            ],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )

        # Extract the AI response
        ai_response = completion.choices[0].message['content']
        
        # Display the response in the label
        response_label.config(text=ai_response)
        response_frame.pack(fill="both", expand=True)

    except Exception as e:
        messagebox.showerror("Error", f"Error while analyzing image: {str(e)}")


# Create the main window
root = tk.Tk()
root.title("Meal Analysis")
root.geometry("600x400")  # Adjust the size to your liking

# Frame for displaying the analysis results
response_frame = tk.Frame(root, padx=20, pady=20, bg="white")
response_frame.place(relx=0.5, rely=0.5, anchor="center")

# Label to show the response
response_label = tk.Label(
    response_frame,
    text="Analysis will be shown here...",
    font=("Arial", 12),
    wraplength=500,
    justify="left",
    bg="white"
)
response_label.pack()

# Button to trigger analysis
analyze_button = tk.Button(
    root,
    text="Analyze Meal",
    font=("Arial", 14),
    bg="#FF69B4",
    fg="white",
    command=analyze_image
)
analyze_button.pack(pady=20)

# Run the application
root.mainloop()
