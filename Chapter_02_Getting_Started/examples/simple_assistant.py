#!/usr/bin/env python3
"""
Simple AI Assistant Demo
This example shows how to create a basic command-line AI assistant
that responds to user input with predefined responses.
"""

import random
import time

class SimpleAssistant:
    def __init__(self, name="Vibe Assistant"):
        self.name = name
        self.responses = {
            "hello": ["Hi there!", "Hello!", "Greetings, human!"],
            "how are you": ["I'm doing well, thanks!", "I'm great! How are you?", "All systems operational!"],
            "help": ["I can respond to basic greetings and questions.", 
                    "Try saying 'hello', asking how I am, or asking for project ideas."],
            "project ideas": ["How about creating a personal website?", 
                             "You could build a simple weather app!", 
                             "Try making a to-do list application!"],
            "bye": ["Goodbye!", "See you later!", "Until next time!"]
        }
        
    def respond(self, user_input):
        """Generate a response based on the user's input"""
        user_input = user_input.lower().strip()
        
        # Simulate "thinking" with dots
        print("Thinking", end="")
        for _ in range(3):
            time.sleep(0.3)
            print(".", end="", flush=True)
        print("\n")
        
        # Check for keywords in the input
        for keyword, replies in self.responses.items():
            if keyword in user_input:
                return f"{self.name}: {random.choice(replies)}"
        
        # Default response if no keywords match
        return f"{self.name}: I'm not sure how to respond to that. Try asking for 'help'."

def main():
    assistant = SimpleAssistant()
    print(f"=== {assistant.name} ===")
    print("Type 'bye' to exit")
    
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "bye":
            print(assistant.respond(user_input))
            break
        
        response = assistant.respond(user_input)
        print(response)

if __name__ == "__main__":
    main()
