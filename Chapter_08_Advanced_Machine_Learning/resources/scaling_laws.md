<div align="center">

# Scaling Laws and Compute-Optimal Training

</div>

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_08_Main.md)**

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

## Introduction

Scaling laws describe how model performance improves with increases in model size, dataset size, and compute budget. Understanding these laws is crucial for designing efficient training strategies and making informed decisions about resource allocation. This resource explores key scaling laws and compute-optimal training strategies for modern ML systems.

## 1. Fundamental Scaling Laws

### 1.1 Kaplan et al. (2020) - Language Model Scaling Laws

The seminal work on scaling laws established power-law relationships between model performance and key factors:

1. **Model Size Scaling**: Loss scales as a power-law with model parameters
   - $L(N) \approx \alpha N^{-\beta}$
   - Where $N$ is the number of parameters, $\beta \approx 0.076$

2. **Dataset Size Scaling**: Loss scales as a power-law with dataset size
   - $L(D) \approx \alpha D^{-\beta}$
   - Where $D$ is the dataset size, $\beta \approx 0.095$

3. **Compute-Optimal Scaling**: Optimal allocation given a compute budget
   - For a fixed compute budget $C$, there exists an optimal model size $N^*$ and dataset size $D^*$
   - $N^* \propto C^{a}$ and $D^* \propto C^{b}$ where $a \approx 0.73, b \approx 0.27$

```python
import numpy as np
import matplotlib.pyplot as plt

def model_size_scaling(N, alpha=0.4, beta=0.076):
    """Loss as a function of model size in parameters."""
    return alpha * (N ** -beta)

def data_size_scaling(D, alpha=0.5, beta=0.095):
    """Loss as a function of dataset size in tokens."""
    return alpha * (D ** -beta)

def compute_optimal_allocation(C, c_N=6e-10, c_D=6e-11):
    """Compute optimal model and dataset size for compute budget C."""
    a = 0.73
    b = 0.27
    
    # Optimal model size in parameters
    N_star = (a * C / c_N) ** (1 / (1 + a/b))
    
    # Optimal dataset size in tokens
    D_star = (b * C / c_D) ** (1 / (1 + b/a))
    
    return N_star, D_star

# Plot model size scaling
model_sizes = np.logspace(6, 12, 100)  # 1M to 1T parameters
losses = [model_size_scaling(N) for N in model_sizes]

plt.figure(figsize=(10, 6))
plt.loglog(model_sizes, losses)
plt.xlabel('Model Size (Parameters)')
plt.ylabel('Loss')
plt.title('Scaling Law: Loss vs Model Size')
plt.grid(True, which="both", ls="-")
```

### 1.2 Hoffman et al. (2022) - Chinchilla Scaling Laws

Revised scaling laws suggesting more optimal data-to-parameter ratios:

1. **Compute-Optimal Allocation**: For a given compute budget, train a model with:
   - Equal FLOPs spent on processing tokens and on parameter updates
   - Approximately 20 tokens per parameter (vs. previous 5-10)

```python
def chinchilla_optimal_allocation(C):
    """Compute optimal model and dataset size according to Chinchilla laws."""
    # C is compute budget in FLOPs
    
    # Optimal model size in parameters (approximate)
    N_star = (C/67) ** 0.5
    
    # Optimal dataset size in tokens
    D_star = 20 * N_star
    
    return N_star, D_star

# Compare different scaling laws
compute_budgets = np.logspace(20, 26, 10)  # 10^20 to 10^26 FLOPs

kaplan_N = []
kaplan_D = []
chinchilla_N = []
chinchilla_D = []

for C in compute_budgets:
    k_N, k_D = compute_optimal_allocation(C)
    c_N, c_D = chinchilla_optimal_allocation(C)
    
    kaplan_N.append(k_N)
    kaplan_D.append(k_D)
    chinchilla_N.append(c_N)
    chinchilla_D.append(c_D)

plt.figure(figsize=(12, 10))

plt.subplot(2, 1, 1)
plt.loglog(compute_budgets, kaplan_N, label='Kaplan et al.')
plt.loglog(compute_budgets, chinchilla_N, label='Chinchilla')
plt.xlabel('Compute Budget (FLOPs)')
plt.ylabel('Optimal Model Size (Parameters)')
plt.legend()
plt.grid(True, which="both", ls="-")

plt.subplot(2, 1, 2)
plt.loglog(compute_budgets, kaplan_D, label='Kaplan et al.')
plt.loglog(compute_budgets, chinchilla_D, label='Chinchilla')
plt.xlabel('Compute Budget (FLOPs)')
plt.ylabel('Optimal Dataset Size (Tokens)')
plt.legend()
plt.grid(True, which="both", ls="-")

plt.tight_layout()
```

### 1.3 Scaling Across Domains

Recent work has shown similar scaling laws across different modalities:

```python
def cross_modal_scaling(N, domain="language", alpha=0.4, beta=0.076):
    """Generalized scaling function for different domains."""
    # Adjust beta for different domains
    domain_betas = {
        "language": 0.076,
        "vision": 0.064,
        "multimodal": 0.070,
        "reinforcement_learning": 0.059
    }
    
    beta = domain_betas.get(domain, beta)
    return alpha * (N ** -beta)
```

## 2. Compute-Optimal Training Strategies

### 2.1 Optimal Model and Dataset Sizing

Python function to determine optimal model and dataset size based on compute budget:

```python
def compute_optimal_model(compute_budget, tokens_per_param=20, overhead_factor=1.1):
    """
    Determine optimal model size and dataset size for a given compute budget.
    
    Args:
        compute_budget: Compute budget in FLOPs
        tokens_per_param: Target tokens per parameter ratio (Chinchilla: 20)
        overhead_factor: Factor to account for optimization overhead
    
    Returns:
        dict: Optimal model configuration
    """
    # Apply Chinchilla scaling law
    adjusted_budget = compute_budget / overhead_factor
    
    # Model size in parameters
    model_size = (adjusted_budget / (6 * tokens_per_param)) ** 0.5
    
    # Dataset size in tokens
    dataset_size = tokens_per_param * model_size
    
    # Training steps
    batch_size = 2 ** round(np.log2(min(model_size / 6e5, 2e6)))
    training_steps = dataset_size / batch_size
    
    return {
        "model_size_params": model_size,
        "dataset_size_tokens": dataset_size,
        "batch_size": batch_size,
        "training_steps": training_steps,
        "tokens_per_param": tokens_per_param,
        "estimated_compute_flops": overhead_factor * 6 * model_size * dataset_size
    }
```

Example model configurations for different compute budgets:

| Compute Budget | Model Size | Dataset Size | Tokens/Param |
|----------------|------------|--------------|--------------|
| 10^22 FLOPs    | 1.8B       | 36B tokens   | 20           |
| 10^23 FLOPs    | 5.8B       | 116B tokens  | 20           |
| 10^24 FLOPs    | 18B        | 360B tokens  | 20           |
| 10^25 FLOPs    | 58B        | 1.16T tokens | 20           |
| 10^26 FLOPs    | 180B       | 3.6T tokens  | 20           |

### 2.2 Optimal Learning Rate Schedules

```python
def compute_optimal_lr_schedule(model_size, training_steps, 
                               warmup_fraction=0.01, 
                               final_fraction=0.1,
                               lr_factor=0.1):
    """
    Generate an optimal learning rate schedule based on model size.
    
    Args:
        model_size: Model size in parameters
        training_steps: Total training steps
        warmup_fraction: Fraction of steps for warmup
        final_fraction: Fraction of max LR for final step
        lr_factor: Parameter to scale base LR (default: 0.1)
    
    Returns:
        function: Learning rate schedule function
    """
    # Base learning rate scaled by model size
    base_lr = lr_factor / (model_size ** 0.5)
    
    # Warmup steps
    warmup_steps = int(training_steps * warmup_fraction)
    
    def lr_schedule(step):
        if step < warmup_steps:
            # Linear warmup
            return base_lr * (step / warmup_steps)
        else:
            # Cosine decay
            decay_ratio = (step - warmup_steps) / (training_steps - warmup_steps)
            decay = 0.5 * (1 + np.cos(np.pi * decay_ratio))
            # Decay from base_lr to final_lr
            return base_lr * (final_fraction + (1 - final_fraction) * decay)
    
    return lr_schedule

# Example usage
model_size = 1e9  # 1B parameters
training_steps = 300000

lr_schedule = compute_optimal_lr_schedule(model_size, training_steps)

# Plot the schedule
steps = np.arange(0, training_steps, 1000)
lrs = [lr_schedule(step) for step in steps]

plt.figure(figsize=(10, 5))
plt.plot(steps, lrs)
plt.xlabel('Training Step')
plt.ylabel('Learning Rate')
plt.title('Optimal Learning Rate Schedule')
plt.grid(True)
```

### 2.3 Compute-Efficient Architectures

Different architectures have different compute efficiency profiles:

```python
def architecture_efficiency_comparison(model_size, architectures=None):
    """Compare the compute efficiency of different architectures."""
    if architectures is None:
        architectures = {
            "Dense Transformer": 1.0,  # baseline
            "Mixture of Experts": 2.4,
            "Sparse Transformer": 1.7,
            "Structured State Space": 2.1,
            "Linear Attention": 1.5
        }
    
    results = {}
    for arch, efficiency in architectures.items():
        # Effective parameter count (accounting for sparsity/efficiency)
        effective_params = model_size * efficiency
        results[arch] = {
            "actual_params": model_size,
            "effective_params": effective_params,
            "relative_efficiency": efficiency
        }
    
    return results
```

## 3. Practical Scaling Strategies

### 3.1 Scaling Strategy Selection Framework

```python
def select_scaling_strategy(compute_budget, business_constraints=None):
    """
    Select the appropriate scaling strategy based on compute budget and constraints.
    
    Args:
        compute_budget: Available compute in FLOPs
        business_constraints: Dict of constraints like max_deployment_size, training_deadline
    
    Returns:
        dict: Recommended scaling strategy
    """
    if business_constraints is None:
        business_constraints = {}
    
    max_deployment_size = business_constraints.get('max_deployment_size', float('inf'))
    max_training_time = business_constraints.get('max_training_time', float('inf'))
    inference_latency_req = business_constraints.get('max_inference_latency', float('inf'))
    
    # Get optimal configuration based on compute
    config = compute_optimal_model(compute_budget)
    
    # Check constraints
    strategies = []
    
    if config['model_size_params'] > max_deployment_size:
        # Model too large for deployment
        strategies.append({
            "approach": "Mixture of Experts",
            "rationale": "Reduces deployed parameters while maintaining capacity",
            "tradeoff": "More complex implementation and routing overhead"
        })
        strategies.append({
            "approach": "Distillation",
            "rationale": "Train optimal model, then distill to smaller deployable model",
            "tradeoff": "Two-phase training and some performance loss"
        })
    
    if inference_latency_req < 100 and config['model_size_params'] > 10e9:
        # Strict latency requirements
        strategies.append({
            "approach": "Quantization + Distillation",
            "rationale": "Reduce model size and precision for faster inference",
            "tradeoff": "Some quality degradation"
        })
    
    if max_training_time < (config['training_steps'] * 0.5 / 3600) and compute_budget > 1e23:
        # Training time constraints
        strategies.append({
            "approach": "Data Parallelism + Large Batch",
            "rationale": "Scale to more accelerators with larger batch sizes",
            "tradeoff": "Diminishing returns on scaling efficiency"
        })
    
    # Default strategy if no constraints are violated
    if not strategies:
        strategies.append({
            "approach": "Standard Chinchilla Scaling",
            "rationale": "Optimal compute allocation without constraints",
            "tradeoff": "None"
        })
    
    return {
        "optimal_config": config,
        "recommended_strategies": strategies
    }
```

### 3.2 Training Efficiency Optimizations

Techniques to improve training efficiency:

```python
def estimate_training_speedup(model_size, optimizations=None):
    """
    Estimate training speedup from various optimizations.
    
    Args:
        model_size: Model size in parameters
        optimizations: Dict of optimizations to apply
    
    Returns:
        dict: Estimated speedups and resulting training time
    """
    if optimizations is None:
        optimizations = {
            "mixed_precision": True,
            "gradient_checkpointing": False,
            "gradient_accumulation": 1,
            "zero_redundancy_optimizer": 0,  # ZeRO stage
            "pipeline_parallelism": False,
            "tensor_parallelism": False,
            "sequence_parallelism": False,
            "activation_recomputation": False
        }
    
    # Baseline training throughput (tokens/second) on a single GPU
    # This is a very simplified model and would need to be calibrated
    base_throughput = 1e6 * (1e9 / model_size) ** 0.5
    
    # Calculate speedups
    speedups = {}
    
    # Mixed precision training
    if optimizations.get("mixed_precision", False):
        speedups["mixed_precision"] = 1.5 if model_size < 1e10 else 1.3
    
    # Gradient checkpointing (saves memory but recomputes activations)
    if optimizations.get("gradient_checkpointing", False):
        speedups["gradient_checkpointing"] = 0.8  # 20% slowdown but enables larger models
    
    # ZeRO optimizer stages
    zero_stage = optimizations.get("zero_redundancy_optimizer", 0)
    if zero_stage > 0:
        # Diminishing communication overhead with model size
        comm_factor = min(0.3, 0.1 * (model_size / 1e9) ** 0.2)
        if zero_stage == 1:
            speedups["zero_stage_1"] = 1.0 - comm_factor * 0.2
        elif zero_stage == 2:
            speedups["zero_stage_2"] = 1.0 - comm_factor * 0.4
        elif zero_stage == 3:
            speedups["zero_stage_3"] = 1.0 - comm_factor * 0.6
    
    # Pipeline parallelism
    if optimizations.get("pipeline_parallelism", False):
        # Effectiveness scales with model size due to reduced bubble overhead
        pipe_efficiency = 0.7 + 0.2 * min(1.0, (model_size / 1e10) ** 0.5)
        speedups["pipeline_parallelism"] = pipe_efficiency
    
    # Tensor parallelism
    if optimizations.get("tensor_parallelism", False):
        # Communication overhead increases with model size
        tp_efficiency = 0.9 - 0.1 * min(0.5, (model_size / 1e10) ** 0.3)
        speedups["tensor_parallelism"] = tp_efficiency
    
    # Sequence parallelism
    if optimizations.get("sequence_parallelism", False):
        # Better for longer sequences
        speedups["sequence_parallelism"] = 1.1
    
    # Activation recomputation
    if optimizations.get("activation_recomputation", False):
        speedups["activation_recomputation"] = 0.85  # 15% slowdown but saves memory
    
    # Gradient accumulation (affects batch size)
    grad_accum = optimizations.get("gradient_accumulation", 1)
    if grad_accum > 1:
        # Minimal overhead for accumulation
        speedups["gradient_accumulation"] = 0.98
    
    # Calculate total speedup
    total_speedup = 1.0
    for technique, speedup in speedups.items():
        total_speedup *= speedup
    
    return {
        "baseline_throughput_tokens_per_second": base_throughput,
        "optimized_throughput_tokens_per_second": base_throughput * total_speedup,
        "individual_speedups": speedups,
        "total_speedup_factor": total_speedup
    }
```

### 3.3 Staged Training Approaches

Multi-stage training can be more compute-efficient than single-stage training:

```python
def design_staged_training(target_model_size, target_tokens, compute_budget):
    """
    Design a multi-stage training strategy that may be more efficient.
    
    Args:
        target_model_size: Target final model size in parameters
        target_tokens: Target dataset size in tokens
        compute_budget: Available compute in FLOPs
    
    Returns:
        dict: Multi-stage training plan
    """
    # Calculate single-stage cost (baseline)
    single_stage_cost = 6 * target_model_size * target_tokens
    
    # If budget is already less than single-stage, we can't do full training
    if compute_budget < single_stage_cost:
        scaling_factor = (compute_budget / single_stage_cost) ** 0.5
        return {
            "approach": "Scaled-down single stage",
            "stages": [{
                "model_size": target_model_size * scaling_factor,
                "tokens": target_tokens * scaling_factor,
                "compute": compute_budget
            }],
            "total_compute": compute_budget,
            "compute_savings": 0
        }
    
    # Design three-stage approach
    # Stage 1: Small model, moderate data
    s1_model_size = target_model_size * 0.1
    s1_tokens = target_tokens * 0.3
    s1_compute = 6 * s1_model_size * s1_tokens
    
    # Stage 2: Medium model, more data
    s2_model_size = target_model_size * 0.3
    s2_tokens = target_tokens * 0.6
    s2_compute = 6 * s2_model_size * s2_tokens
    
    # Stage 3: Full model, full data
    s3_model_size = target_model_size
    s3_tokens = target_tokens * 0.4  # The remaining data
    s3_compute = 6 * s3_model_size * s3_tokens
    
    total_compute = s1_compute + s2_compute + s3_compute
    savings = single_stage_cost - total_compute
    
    # If multi-stage uses less compute, recommend it
    if total_compute < single_stage_cost:
        return {
            "approach": "Multi-stage progressive training",
            "stages": [
                {
                    "stage": 1,
                    "model_size": s1_model_size,
                    "tokens": s1_tokens,
                    "compute": s1_compute
                },
                {
                    "stage": 2,
                    "model_size": s2_model_size,
                    "tokens": s2_tokens,
                    "compute": s2_compute
                },
                {
                    "stage": 3,
                    "model_size": s3_model_size,
                    "tokens": s3_tokens,
                    "compute": s3_compute
                }
            ],
            "total_compute": total_compute,
            "compute_savings": savings,
            "savings_percentage": (savings / single_stage_cost) * 100
        }
    else:
        return {
            "approach": "Single-stage training",
            "stages": [{
                "model_size": target_model_size,
                "tokens": target_tokens,
                "compute": single_stage_cost
            }],
            "total_compute": single_stage_cost,
            "compute_savings": 0
        }
```

## 4. Real-World Examples and Cost Analysis

### 4.1 Example Models and Their Scaling Properties

| Model       | Parameters | Training Tokens | Tokens/Param | Training Compute |
|-------------|------------|-----------------|--------------|------------------|
| GPT-3       | 175B       | 300B            | 1.7          | ~3.14e23 FLOPs   |
| Chinchilla  | 70B        | 1.4T            | 20           | ~5.76e23 FLOPs   |
| PaLM        | 540B       | 780B            | 1.4          | ~2.52e24 FLOPs   |
| Gopher      | 280B       | 300B            | 1.1          | ~5.04e23 FLOPs   |
| LLaMA       | 65B        | 1.4T            | 21.5         | ~5.46e23 FLOPs   |
| GPT-4       | ~1.7T*     | ~13T*           | ~7.6*        | ~1.7e25 FLOPs*   |

*Estimates based on available information

### 4.2 Compute Cost Optimization

```python
def calculate_training_cost(model_size, tokens, hardware="a100", 
                           optimizations=None, provider="cloud"):
    """
    Calculate the financial cost of training a model with given parameters.
    
    Args:
        model_size: Model size in parameters
        tokens: Training dataset size in tokens
        hardware: Hardware type (a100, h100, tpu-v4, etc.)
        optimizations: Dict of optimizations to apply
        provider: Cloud provider or 'on-prem'
    
    Returns:
        dict: Cost breakdown and training time estimates
    """
    # Hardware specifications and costs
    hw_specs = {
        "a100": {
            "tflops": 312,  # FP16 TFLOPS
            "memory": 80,   # GB
            "cost_per_hour": 4.1  # Cloud cost per GPU hour
        },
        "h100": {
            "tflops": 989,  # FP16 TFLOPS
            "memory": 80,   # GB
            "cost_per_hour": 8.4  # Cloud cost per GPU hour
        },
        "a6000": {
            "tflops": 309,
            "memory": 48,
            "cost_per_hour": 2.5
        },
        "tpu-v4": {
            "tflops": 275,
            "memory": 32,
            "cost_per_hour": 3.6
        }
    }
    
    # Get hardware specs
    hw = hw_specs.get(hardware, hw_specs["a100"])
    
    # Calculate compute required (in FLOPS)
    compute_flops = 6 * model_size * tokens
    
    # Apply optimizations if provided
    speedup_info = estimate_training_speedup(model_size, optimizations)
    total_speedup = speedup_info["total_speedup_factor"]
    
    # Calculate throughput per device (tokens/second)
    base_throughput = hw["tflops"] * 1e12 / (6 * model_size)
    optimized_throughput = base_throughput * total_speedup
    
    # Memory requirements per device
    model_memory_gb = model_size * 12 / 1e9  # Assuming 12 bytes per parameter with optimizer states
    
    # Number of devices needed for model parallelism
    num_devices_for_memory = max(1, int(np.ceil(model_memory_gb / hw["memory"])))
    
    # Training time with model parallelism (in hours)
    training_time_hours = compute_flops / (3600 * hw["tflops"] * 1e12 * num_devices_for_memory)
    
    # Cost calculation
    total_cost = training_time_hours * hw["cost_per_hour"] * num_devices_for_memory
    
    # On-premise vs cloud adjustment
    if provider == "on-prem":
        # Assume 50% utilization and 3-year amortization
        utilization_factor = 0.5
        amortization_years = 3
        annual_hours = 365 * 24 * utilization_factor
        amortized_cost_per_hour = hw["cost_per_hour"] * 0.4  # 60% discount for on-prem
        total_cost = training_time_hours * amortized_cost_per_hour * num_devices_for_memory
    
    return {
        "model_size": model_size,
        "training_tokens": tokens,
        "compute_required_flops": compute_flops,
        "hardware": hardware,
        "devices_required": num_devices_for_memory,
        "training_time_hours": training_time_hours,
        "optimized_throughput_tokens_per_second": optimized_throughput * num_devices_for_memory,
        "total_cost_usd": total_cost,
        "cost_per_parameter_usd": total_cost / model_size,
        "cost_per_token_usd": total_cost / tokens
    }
```

## 5. Future Scaling Directions

### 5.1 Emerging Scaling Trends

- **Mixture of Experts (MoE)**: Conditional computation allows scaling model capacity with sub-linear compute
- **Multimodal Scaling**: Different modalities may have different optimal scaling properties
- **Sparsity and Pruning**: Targeted parameter reduction maintains performance while reducing compute
- **Continual Learning**: Efficient adaptation to new data with minimal retraining
- **Energy-Aware Scaling**: Optimizing for carbon footprint in addition to compute efficiency

### 5.2 Estimated Scaling Limits

```python
def estimate_scaling_limits():
    """Estimate theoretical and practical limits to scaling."""
    limits = {
        "physical_limits": {
            "atoms_universe": 10**80,
            "transistors_earth_resources": 10**33,
            "annual_global_energy": 5 * 10**20  # joules
        },
        "practical_limits": {
            "largest_feasible_model_2025": 10**13,  # 10 trillion parameters
            "largest_feasible_dataset_2025": 10**14,  # 100 trillion tokens
            "largest_feasible_compute_2025": 10**26,  # zettaFLOPs
            "annual_ml_energy_budget_2025": 10**18  # joules
        },
        "efficiency_improvements": {
            "compute_per_parameter": "Declining 2x every 1.5 years",
            "energy_per_flop": "Declining 2x every 2.5 years",
            "algorithm_efficiency": "Improving 2x every 16 months"
        }
    }
    return limits
```

## Conclusion

Understanding scaling laws is essential for developing cost-effective training strategies for ML models. The empirical relationships between model size, dataset size, and compute allow practitioners to make informed decisions about resource allocation.

As the field continues to advance, new architectures and training methods may modify these scaling laws, but the fundamental trade-offs between compute, data, and model capacity will remain central to ML system design.

---

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_08_Main.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
