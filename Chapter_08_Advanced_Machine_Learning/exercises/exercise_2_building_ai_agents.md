# Exercise 2: Building AI Agent Systems for Complex Tasks

<div align="center">

**[⬅️ Back to Chapter](../Chapter_08_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">
  <h1>Developing Intelligent AI Agents with Planning and Tool Use</h1>
  
  <p><i>"The transition from passive models to active agents represents one of the most significant advances in ML applications."</i></p>
</div>

<hr/>

## Overview

AI agents have transformed from academic concepts to practical tools that can autonomously accomplish complex tasks. In this exercise, you'll build an AI agent system capable of planning, reasoning, and using tools to solve multi-step problems. You'll implement various agent architectures and compare their effectiveness across different task domains.

## Learning Objectives

- Design and implement AI agents with planning capabilities
- Create tool-using agents that can interact with external systems
- Build memory systems for maintaining context across interactions
- Implement evaluation frameworks for agent performance
- Compare different agent architectures and their suitability for various tasks
- Apply techniques to make agents more reliable, transparent, and controllable

## Prerequisites

- Understanding of LLM fundamentals
- Experience with Python programming
- Familiarity with API integration concepts
- Basic understanding of prompt engineering

## Project Requirements

### Part 1: Agent Framework Setup

1. **Choose an Agent Framework**:
   - LangChain
   - Semantic Kernel
   - CrewAI
   - AutoGPT
   - Or build your own minimalist framework

2. **Implement a Basic Agent**:
   ```python
   # Example with LangChain
   from langchain.agents import initialize_agent, Tool
   from langchain.agents import AgentType
   from langchain.llms import OpenAI
   
   # Define tools the agent can use
   tools = [
       Tool(
           name="Search",
           func=lambda x: "Search results for: " + x,
           description="Useful for searching the internet"
       ),
       Tool(
           name="Calculator",
           func=lambda x: eval(x),
           description="Useful for performing calculations"
       )
   ]
   
   # Create agent
   llm = OpenAI(temperature=0)
   agent = initialize_agent(
       tools, 
       llm, 
       agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
       verbose=True
   )
   
   # Test agent
   agent.run("What is the square root of 1764 multiplied by 3?")
   ```

3. **Implement Custom Tools**:
   ```python
   # Example of a custom tool
   class DatabaseQueryTool(BaseTool):
       name = "database_query"
       description = "Use this tool to query a SQL database. Input should be a valid SQL query."
       
       def _run(self, query: str) -> str:
           try:
               # Connect to database
               conn = sqlite3.connect("your_database.db")
               cursor = conn.cursor()
               
               # Execute query
               cursor.execute(query)
               results = cursor.fetchall()
               
               # Format results
               column_names = [description[0] for description in cursor.description]
               formatted_results = [dict(zip(column_names, row)) for row in results]
               
               return json.dumps(formatted_results, indent=2)
           except Exception as e:
               return f"Error querying database: {str(e)}"
           finally:
               conn.close()
       
       def _arun(self, query: str) -> str:
           # Async implementation
           raise NotImplementedError("This tool does not support async")
   ```

### Part 2: Agent Memory and Planning

4. **Implement a Memory System**:
   ```python
   # Example memory implementation
   from langchain.memory import ConversationBufferMemory
   
   memory = ConversationBufferMemory(return_messages=True)
   
   # Create agent with memory
   agent = initialize_agent(
       tools, 
       llm, 
       agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
       verbose=True,
       memory=memory
   )
   ```

5. **Implement a Planning Agent**:
   - Create an agent that breaks complex tasks into subtasks
   - Implement task scheduling and dependency management
   - Add monitoring capabilities for plan execution

   ```python
   # Example planning agent
   def create_planning_agent(llm, tools):
       # Create a planning prompt
       planning_prompt = """
       You are a planning agent. Given a complex task, break it down into subtasks.
       For each subtask, determine:
       1. What needs to be done
       2. What tools might be needed
       3. Dependencies on other subtasks
       
       Task: {task}
       
       Respond with a JSON structure containing the plan.
       """
       
       # Create plan execution agent
       execution_prompt = """
       You are a task execution agent. You've been given a plan and a specific subtask to complete.
       
       Plan: {plan}
       Current Subtask: {subtask}
       Previous Results: {previous_results}
       
       Complete this subtask using the available tools if needed.
       """
       
       # Implementation details omitted for brevity
       return PlanningAgent(llm, planning_prompt, execution_prompt, tools)
   ```

### Part 3: Agent Hierarchy and Specialization

6. **Build Multi-Agent Systems**:
   - Implement specialized agents for different subtasks
   - Create an orchestration mechanism for agent cooperation
   - Design communication protocols between agents

   ```python
   # Example of a multi-agent system
   class AgentTeam:
       def __init__(self, llm):
           # Create specialized agents
           self.researcher = create_agent(llm, research_tools, "researcher")
           self.analyst = create_agent(llm, analysis_tools, "analyst")
           self.writer = create_agent(llm, writing_tools, "writer")
           self.critic = create_agent(llm, evaluation_tools, "critic")
           
           # Create coordination agent
           self.coordinator = create_coordinator_agent(llm, [
               self.researcher, self.analyst, self.writer, self.critic
           ])
       
       def solve_task(self, task):
           # Coordinator breaks down task and assigns to appropriate agents
           return self.coordinator.coordinate_solution(task)
   ```

7. **Implement Feedback Loops**:
   - Add self-evaluation capabilities
   - Create mechanisms for agents to critique and improve their outputs
   - Implement iterative refinement processes

### Part 4: Evaluation and Safety

8. **Develop an Evaluation Framework**:
   - Create objective metrics for assessing agent performance
   - Implement test cases with different difficulty levels
   - Measure success rates, efficiency, and resource usage

9. **Add Safety Guardrails**:
   - Implement content filtering for agent inputs and outputs
   - Add budget constraints for API usage and computation
   - Create oversight mechanisms for high-risk actions
   - Implement explainability features for agent decisions

## Practical Application Scenarios

Implement your agent system for at least one of these scenarios:

1. **Research Assistant Agent**:
   - Gather information on a topic from multiple sources
   - Evaluate credibility and synthesize findings
   - Generate a comprehensive report with proper citations

2. **Data Analysis Agent**:
   - Connect to databases and data sources
   - Clean and process data
   - Perform statistical analysis
   - Generate visualizations and insights

3. **Software Development Assistant**:
   - Analyze requirements and propose architecture
   - Generate code for specified features
   - Write tests and documentation
   - Debug issues and suggest improvements

4. **Personal Productivity Agent**:
   - Manage calendar and schedule
   - Prioritize tasks based on importance and deadlines
   - Draft emails and messages
   - Summarize documents and meetings

## Extension Challenges

1. **Web Navigation**: Enhance your agent to browse and interact with websites

2. **Long-Term Memory**: Implement a sophisticated memory system with retrieval, summarization, and forgetting mechanisms

3. **Autonomous Operation**: Create an agent that can run continuously, handling tasks as they arrive and learning from its experiences

4. **Embodied Agent**: Connect your agent to a virtual environment (like a game) or a physical system (like a home automation setup)

## Evaluation Criteria

Your agent system will be evaluated on:

1. **Autonomy**: How independently it can solve complex tasks
2. **Reliability**: Consistency of results and error handling
3. **Efficiency**: Resource usage and task completion time
4. **Safety**: Adherence to constraints and handling of edge cases
5. **Architecture**: Quality of code organization and system design

## Submission Guidelines

Your submission should include:

1. Complete source code with documentation
2. A system architecture diagram
3. A comprehensive report covering:
   - Design decisions and rationale
   - Implementation details
   - Evaluation results
   - Challenges encountered and solutions
   - Potential improvements
4. Demonstration videos showing your agent solving complex tasks
5. Test cases and evaluation metrics

## Resources

- [LangChain Agents Documentation](https://python.langchain.com/docs/modules/agents/)
- [Microsoft Semantic Kernel](https://github.com/microsoft/semantic-kernel)
- [CrewAI Framework](https://github.com/joaomdmoura/crewAI)
- [Tool-Augmented LLMs Paper](https://arxiv.org/abs/2304.08354)
- [Agent Evaluation Framework](https://github.com/langchain-ai/langgraph/blob/main/examples/evaluation/)

---

<div align="center">

**[⬅️ Back to Chapter](../Chapter_08_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
