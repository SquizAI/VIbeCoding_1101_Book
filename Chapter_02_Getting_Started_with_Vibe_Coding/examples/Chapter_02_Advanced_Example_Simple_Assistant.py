#!/usr/bin/env python3
"""
Title: Chapter 02 - Simple AI Assistant Example
Description: A basic command-line AI assistant that demonstrates prompt engineering concepts
Chapter: 02 - Getting Started with Vibe Coding
"""

import random
import time
import sys
from typing import Dict, List, Optional, Tuple

class SimpleAssistant:
    """
    A simple command-line AI assistant that responds to user input with predefined responses.
    This example demonstrates basic prompt handling and response generation techniques.
    """
    
    def __init__(self, name: str = "Vibe Assistant"):
        """Initialize the assistant with a name and predefined responses."""
        self.name = name
        self.responses: Dict[str, List[str]] = {
            "hello": ["Hi there!", "Hello!", "Greetings, human!"],
            "how are you": ["I'm doing well, thanks!", "I'm great! How are you?", "All systems operational!"],
            "help": ["I can respond to basic greetings and questions.", 
                    "Try saying 'hello', asking how I am, or asking for project ideas."],
            "project ideas": ["How about creating a personal website?", 
                             "You could build a simple weather app!", 
                             "Try making a to-do list application!"],
            "bye": ["Goodbye!", "See you later!", "Until next time!"],
            "default": ["I'm not sure I understand.", 
                       "Could you rephrase that?", 
                       "I'm still learning!"]
        }
        
        # Demonstration of different prompt types
        self.prompt_examples: Dict[str, str] = {
            "simple": "Create a function that calculates the average of a list of numbers",
            "contextual": "I'm working on a weather app. Create a function that converts temperature from Celsius to Fahrenheit",
            "persona-based": "As a senior Python developer, write a function that efficiently handles large dataset processing",
            "step-by-step": "1. Create a class named 'User'\n2. Add properties for name, email, and age\n3. Include validation for email format\n4. Add a method to check if user is an adult"
        }
        
    def respond(self, user_input: str) -> str:
        """Generate a response based on user input."""
        # Simulate "thinking" time
        time.sleep(0.5)
        
        # Process the user input to find matching keywords
        user_input = user_input.lower().strip()
        
        # Check for keyword matches in our responses dictionary
        for keyword, possible_responses in self.responses.items():
            if keyword in user_input:
                return random.choice(possible_responses)
        
        # If no keywords match, return a default response
        return random.choice(self.responses["default"])
        
    def show_prompt_examples(self) -> None:
        """Display examples of different prompt types."""
        print(f"\n{self.name} Prompt Examples:")
        print("-" * 50)
        for prompt_type, example in self.prompt_examples.items():
            print(f"✨ {prompt_type.title()} prompt:")
            print(f"   \"{example}\"")
            print()
        print("-" * 50)
        
    def run(self) -> None:
        """Run the assistant in an interactive loop."""
        print(f"\n{self.name} is ready! Type 'exit' or 'bye' to end the conversation.")
        print("Type 'prompt examples' to see different types of effective prompts.")
        print("-" * 50)
        
        while True:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ["exit", "bye", "quit"]:
                print(f"{self.name}: {random.choice(self.responses['bye'])}")
                break
                
            if user_input.lower() == "prompt examples":
                self.show_prompt_examples()
                continue
                
            response = self.respond(user_input)
            print(f"{self.name}: {response}")

if __name__ == "__main__":
    # Create and run the assistant
    assistant = SimpleAssistant()
    try:
        assistant.run()
    except KeyboardInterrupt:
        print("\nAssistant terminated. Goodbye!")
        sys.exit(0)

# Navigation:
# [⬅️ Return to Chapter](../README.md) | [📚 Main Content](../Chapter_02_Main.md) | [📖 Further Reading](../Further_Reading.md)
