<div align="center">

# Advanced Attention Mechanisms

</div>

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_08_Main.md)**

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

## Introduction

Attention mechanisms have revolutionized machine learning, especially in natural language processing and computer vision. This resource provides a deep dive into advanced attention architectures that have emerged since the original Transformer model.

## 1. Self-Attention Fundamentals

The core computation in attention mechanisms is weighted information aggregation:

```python
def self_attention(queries, keys, values, mask=None):
    """Basic self-attention mechanism.
    
    Args:
        queries: Tensor of shape [batch_size, seq_len, d_model]
        keys: Tensor of shape [batch_size, seq_len, d_model]
        values: Tensor of shape [batch_size, seq_len, d_model]
        mask: Optional mask tensor
        
    Returns:
        Attention output tensor
    """
    # Calculate attention scores
    scores = torch.matmul(queries, keys.transpose(-2, -1)) / math.sqrt(d_model)
    
    # Apply mask if provided
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    
    # Apply softmax to get attention weights
    attention_weights = F.softmax(scores, dim=-1)
    
    # Apply attention weights to values
    output = torch.matmul(attention_weights, values)
    
    return output, attention_weights
```

## 2. Advanced Attention Architectures

### 2.1 Multi-Head Attention

Multi-head attention allows the model to attend to information from different representation subspaces:

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        assert d_model % num_heads == 0
        
        self.depth = d_model // num_heads
        
        self.wq = nn.Linear(d_model, d_model)
        self.wk = nn.Linear(d_model, d_model)
        self.wv = nn.Linear(d_model, d_model)
        
        self.dense = nn.Linear(d_model, d_model)
        
    def split_heads(self, x):
        """Split the last dimension into (num_heads, depth)."""
        batch_size = x.shape[0]
        x = x.view(batch_size, -1, self.num_heads, self.depth)
        return x.permute(0, 2, 1, 3)
        
    def forward(self, q, k, v, mask=None):
        batch_size = q.shape[0]
        
        # Linear projections
        q = self.wq(q)  # (batch_size, seq_len, d_model)
        k = self.wk(k)  # (batch_size, seq_len, d_model)
        v = self.wv(v)  # (batch_size, seq_len, d_model)
        
        # Split heads
        q = self.split_heads(q)  # (batch_size, num_heads, seq_len, depth)
        k = self.split_heads(k)  # (batch_size, num_heads, seq_len, depth)
        v = self.split_heads(v)  # (batch_size, num_heads, seq_len, depth)
        
        # Scaled dot-product attention
        scaled_attention, attention_weights = self.scaled_dot_product_attention(
            q, k, v, mask)
        # (batch_size, num_heads, seq_len, depth)
        
        # Transpose and reshape
        scaled_attention = scaled_attention.permute(0, 2, 1, 3)
        # (batch_size, seq_len, num_heads, depth)
        
        concat_attention = scaled_attention.reshape(batch_size, -1, self.d_model)
        # (batch_size, seq_len, d_model)
        
        output = self.dense(concat_attention)
        # (batch_size, seq_len, d_model)
        
        return output, attention_weights
```

### 2.2 Sparse Attention Mechanisms

Sparse attention reduces the quadratic complexity of standard attention:

#### Sparse Transformer

```python
def sparse_attention(q, k, v, block_size, mask=None):
    """Sparse attention that attends to local neighborhood and fixed strides."""
    seq_len = q.shape[1]
    
    # Local attention within blocks
    local_mask = torch.zeros(seq_len, seq_len, device=q.device)
    for i in range(seq_len):
        start = max(0, i - block_size // 2)
        end = min(seq_len, i + block_size // 2 + 1)
        local_mask[i, start:end] = 1
    
    # Add fixed stride attention
    stride = block_size
    for i in range(seq_len):
        for j in range(0, seq_len, stride):
            local_mask[i, j] = 1
    
    # Apply sparse mask
    if mask is not None:
        local_mask = local_mask * mask
    
    # Calculate attention with sparse pattern
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(q.size(-1))
    scores = scores.masked_fill(local_mask.unsqueeze(0) == 0, -1e9)
    
    attention_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attention_weights, v)
    
    return output, attention_weights
```

#### Longformer Attention

```python
def longformer_attention(query, key, value, window_size=512, global_tokens=None):
    """Longformer attention with sliding window and global tokens."""
    batch_size, seq_len, hidden_size = query.size()
    
    # Create sliding window attention mask
    window_mask = torch.zeros(seq_len, seq_len, device=query.device)
    for i in range(seq_len):
        window_start = max(0, i - window_size // 2)
        window_end = min(seq_len, i + window_size // 2 + 1)
        window_mask[i, window_start:window_end] = 1
    
    # Add global tokens if specified
    if global_tokens is not None:
        for g in global_tokens:
            window_mask[g, :] = 1  # Global tokens attend to all positions
            window_mask[:, g] = 1  # All positions attend to global tokens
    
    # Calculate attention scores
    scores = torch.matmul(query, key.transpose(-2, -1)) / math.sqrt(hidden_size)
    
    # Apply sliding window mask
    scores = scores.masked_fill(window_mask.unsqueeze(0) == 0, -1e9)
    
    # Apply softmax and get output
    attention_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attention_weights, value)
    
    return output, attention_weights
```

### 2.3 Linear Attention

Linear attention mechanisms reduce the O(n²) complexity to O(n):

```python
def linear_attention(q, k, v):
    """Linear attention with kernel feature maps."""
    # Apply feature map to queries and keys
    q_prime = torch.exp(q - torch.max(q, dim=-1, keepdim=True)[0])
    k_prime = torch.exp(k - torch.max(k, dim=-1, keepdim=True)[0])
    
    # Linear attention computation
    kv = torch.einsum("bld,blm->bdm", k_prime, v)
    qkv = torch.einsum("bld,bdm->blm", q_prime, kv)
    
    # Normalization factor
    normalizer = torch.einsum("bld,bl->bd", k_prime, torch.ones(k_prime.shape[0], k_prime.shape[1], device=k_prime.device))
    normalizer = torch.einsum("bld,bd->bl", q_prime, normalizer).unsqueeze(-1)
    
    # Normalize output
    output = qkv / (normalizer + 1e-6)
    
    return output
```

### 2.4 Rotary Position Embeddings (RoPE)

```python
def apply_rotary_embeddings(x, freq):
    """Apply Rotary Position Embeddings to input tensor."""
    batch_size, seq_len, num_heads, head_dim = x.shape
    
    # Create position indices
    position = torch.arange(seq_len, device=x.device).unsqueeze(1)
    # Create frequencies
    indices = torch.arange(head_dim//2, device=x.device).unsqueeze(0)
    angles = position * freq ** (2 * indices / head_dim)
    
    # Create rotation matrices
    cos = torch.cos(angles).view(1, seq_len, 1, head_dim//2)
    sin = torch.sin(angles).view(1, seq_len, 1, head_dim//2)
    
    # Reshape x for rotation
    x_reshaped = x.view(batch_size, seq_len, num_heads, 2, head_dim//2)
    x1, x2 = x_reshaped[..., 0, :], x_reshaped[..., 1, :]
    
    # Apply rotation
    out1 = x1 * cos - x2 * sin
    out2 = x1 * sin + x2 * cos
    
    # Combine and reshape back
    out = torch.stack([out1, out2], dim=-2)
    out = out.view(batch_size, seq_len, num_heads, head_dim)
    
    return out
```

## 3. Attention in Different Domains

### 3.1 Vision Transformers

```python
class VisionTransformerAttention(nn.Module):
    def __init__(self, dim, num_heads=8, qkv_bias=True, attn_drop=0., proj_drop=0.):
        super().__init__()
        self.num_heads = num_heads
        head_dim = dim // num_heads
        self.scale = head_dim ** -0.5

        # Combined QKV projection
        self.qkv = nn.Linear(dim, dim * 3, bias=qkv_bias)
        self.attn_drop = nn.Dropout(attn_drop)
        self.proj = nn.Linear(dim, dim)
        self.proj_drop = nn.Dropout(proj_drop)

    def forward(self, x):
        B, N, C = x.shape
        qkv = self.qkv(x).reshape(B, N, 3, self.num_heads, C // self.num_heads).permute(2, 0, 3, 1, 4)
        q, k, v = qkv[0], qkv[1], qkv[2]  # make torchscript happy (cannot use tensor as tuple)

        attn = (q @ k.transpose(-2, -1)) * self.scale
        attn = attn.softmax(dim=-1)
        attn = self.attn_drop(attn)

        x = (attn @ v).transpose(1, 2).reshape(B, N, C)
        x = self.proj(x)
        x = self.proj_drop(x)
        return x
```

### 3.2 Cross-Attention for Multimodal Models

```python
class CrossAttention(nn.Module):
    def __init__(self, query_dim, context_dim, heads=8, dim_head=64, dropout=0.):
        super().__init__()
        inner_dim = dim_head * heads
        self.scale = dim_head ** -0.5
        self.heads = heads

        # Query, Key, Value projections
        self.to_q = nn.Linear(query_dim, inner_dim, bias=False)
        self.to_k = nn.Linear(context_dim, inner_dim, bias=False)
        self.to_v = nn.Linear(context_dim, inner_dim, bias=False)

        self.to_out = nn.Sequential(
            nn.Linear(inner_dim, query_dim),
            nn.Dropout(dropout)
        )

    def forward(self, x, context):
        """
        Args:
            x: Tensor of shape [batch, seq_len_q, query_dim]
            context: Tensor of shape [batch, seq_len_k, context_dim]
        """
        h = self.heads

        # Project query, key, value and reshape
        q = self.to_q(x).reshape(*x.shape[:2], h, -1).permute(0, 2, 1, 3)  # [B, h, N_q, d]
        k = self.to_k(context).reshape(*context.shape[:2], h, -1).permute(0, 2, 1, 3)  # [B, h, N_k, d]
        v = self.to_v(context).reshape(*context.shape[:2], h, -1).permute(0, 2, 1, 3)  # [B, h, N_k, d]

        # Scaled dot-product attention
        attn_scores = torch.matmul(q, k.transpose(-1, -2)) * self.scale  # [B, h, N_q, N_k]
        attn = F.softmax(attn_scores, dim=-1)
        
        # Apply attention to values
        out = torch.matmul(attn, v)  # [B, h, N_q, d]
        out = out.permute(0, 2, 1, 3).reshape(*x.shape[:2], -1)  # [B, N_q, h*d]
        
        return self.to_out(out)
```

## 4. Attention Optimizations

### 4.1 Flash Attention

Fast and memory-efficient attention implementation:

```python
def flash_attention(q, k, v, sm_scale=1.0, block_size=1024):
    """Implementation sketch of Flash Attention."""
    # Real Flash Attention uses CUDA kernels for even more efficiency
    # This is a simplified Python implementation that shows the algorithm
    
    batch_size, seq_len_q, num_heads, head_dim = q.shape
    _, seq_len_k, _, _ = k.shape
    
    # Prepare output
    o = torch.zeros_like(q)
    
    # Block sizes for tiling
    block_q = min(block_size, seq_len_q)
    block_k = min(block_size, seq_len_k)
    
    # Loop over blocks of the output
    for start_q in range(0, seq_len_q, block_q):
        end_q = min(start_q + block_q, seq_len_q)
        q_block = q[:, start_q:end_q, :, :]
        
        # Initialize scaling factors
        l = torch.zeros((batch_size, num_heads, end_q - start_q), device=q.device)
        m = torch.ones((batch_size, num_heads, end_q - start_q), device=q.device) * -float('inf')
        
        # Process key-value blocks
        for start_k in range(0, seq_len_k, block_k):
            end_k = min(start_k + block_k, seq_len_k)
            k_block = k[:, start_k:end_k, :, :]
            v_block = v[:, start_k:end_k, :, :]
            
            # Compute attention scores for this block
            s = torch.matmul(q_block, k_block.transpose(-1, -2)) * sm_scale
            
            # Update max values
            m_block = torch.max(m, torch.max(s, dim=-1)[0])
            
            # Update output and scaling
            o_block = torch.exp(s - m_block.unsqueeze(-1)) @ v_block
            l_block = torch.sum(torch.exp(s - m_block.unsqueeze(-1)), dim=-1)
            
            # Scale old output
            o[:, start_q:end_q] = o[:, start_q:end_q] * torch.exp(m.unsqueeze(-1) - m_block.unsqueeze(-1))
            l = l * torch.exp(m - m_block)
            
            # Add new output contribution
            o[:, start_q:end_q] = o[:, start_q:end_q] + o_block
            l = l + l_block
            
            # Update m for next iteration
            m = m_block
        
        # Normalize output
        o[:, start_q:end_q] = o[:, start_q:end_q] / l.unsqueeze(-1)
    
    return o
```

### 4.2 Memory-Efficient Attention

```python
def memory_efficient_attention(q, k, v, mask=None, dropout=0.0):
    """Memory-efficient implementation of attention."""
    # Calculate attention scores one chunk at a time
    batch_size, num_heads, seq_len, head_dim = q.shape
    
    # Output and normalization accumulator
    output = torch.zeros_like(q)
    normalizer = torch.zeros((batch_size, num_heads, seq_len, 1), device=q.device)
    
    # Process in chunks to avoid materializing the full attention matrix
    chunk_size = min(1024, seq_len)
    for i in range(0, seq_len, chunk_size):
        j = min(i + chunk_size, seq_len)
        
        # Get key-value chunk
        k_chunk = k[:, :, i:j]
        v_chunk = v[:, :, i:j]
        
        # Calculate attention scores for this chunk
        scores = torch.matmul(q, k_chunk.transpose(-1, -2)) / math.sqrt(head_dim)
        
        # Apply mask if provided
        if mask is not None:
            chunk_mask = mask[:, :, :, i:j]
            scores = scores.masked_fill(chunk_mask == 0, -1e9)
        
        # Apply softmax
        attn_chunk = F.softmax(scores, dim=-1)
        if dropout > 0:
            attn_chunk = F.dropout(attn_chunk, p=dropout)
        
        # Update output and normalization factor
        output += torch.matmul(attn_chunk, v_chunk)
        normalizer += attn_chunk.sum(dim=-1, keepdim=True)
    
    # Normalize output
    return output / normalizer
```

## 5. Attention Visualization and Interpretation

```python
def visualize_attention(model, text, tokenizer, layer_index=-1, head_index=None):
    """Visualize attention weights from a transformer model."""
    # Tokenize input text
    inputs = tokenizer(text, return_tensors="pt")
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    
    # Forward pass with output_attentions=True
    outputs = model(**inputs, output_attentions=True)
    
    # Get attention weights from specified layer
    attention = outputs.attentions[layer_index]  # [batch, num_heads, seq_len, seq_len]
    
    # If head_index specified, select just that head
    if head_index is not None:
        attention = attention[:, head_index:head_index+1]
        title = f"Attention Weights (Layer {layer_index}, Head {head_index})"
    else:
        # Average across heads
        attention = attention.mean(dim=1)
        title = f"Attention Weights (Layer {layer_index}, Averaged across Heads)"
    
    # Squeeze batch dimension
    attention = attention.squeeze(0)  # [num_heads or 1, seq_len, seq_len]
    
    # Create visualization
    plt.figure(figsize=(10, 10))
    
    for head in range(attention.shape[0]):
        plt.subplot(1, attention.shape[0], head + 1)
        plt.imshow(attention[head].detach().numpy(), cmap="viridis")
        plt.xticks(range(len(tokens)), tokens, rotation=90)
        plt.yticks(range(len(tokens)), tokens)
        if attention.shape[0] > 1:
            plt.title(f"Head {head}")
    
    plt.suptitle(title)
    plt.tight_layout()
    return plt
```

## 6. Future Directions in Attention

### 6.1 Mixture of Experts Attention

```python
class MoEAttention(nn.Module):
    def __init__(self, d_model, num_heads, num_experts=4):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.num_experts = num_experts
        
        # Create expert attention modules
        self.experts = nn.ModuleList([
            MultiHeadAttention(d_model, num_heads) 
            for _ in range(num_experts)
        ])
        
        # Router network to determine expert weights
        self.router = nn.Linear(d_model, num_experts)
        
    def forward(self, x, mask=None):
        batch_size, seq_len = x.shape[:2]
        
        # Calculate routing probabilities
        router_logits = self.router(x.mean(dim=1))  # [batch_size, num_experts]
        router_probs = F.softmax(router_logits, dim=-1)  # [batch_size, num_experts]
        
        # Apply each expert
        expert_outputs = []
        for i, expert in enumerate(self.experts):
            expert_output, _ = expert(x, x, x, mask)  # [batch_size, seq_len, d_model]
            expert_outputs.append(expert_output)
        
        # Combine expert outputs weighted by router probabilities
        expert_outputs = torch.stack(expert_outputs, dim=1)  # [batch_size, num_experts, seq_len, d_model]
        combined_output = torch.sum(
            expert_outputs * router_probs.unsqueeze(-1).unsqueeze(-1), 
            dim=1
        )  # [batch_size, seq_len, d_model]
        
        return combined_output
```

### 6.2 Structured State Space Models

```python
class S4Layer(nn.Module):
    """Simplified Structured State Space Sequence model layer."""
    def __init__(self, d_model, n_states=64, dropout=0.0):
        super().__init__()
        self.d_model = d_model
        self.n_states = n_states
        
        # Parameters of the SSM
        self.A = nn.Parameter(torch.randn(d_model, n_states, n_states))
        self.B = nn.Parameter(torch.randn(d_model, n_states, 1))
        self.C = nn.Parameter(torch.randn(d_model, 1, n_states))
        self.D = nn.Parameter(torch.randn(d_model))
        
        # Make A stable
        self.register_buffer("A_log_scales", torch.zeros(d_model))
        
        # Layer norm and dropout
        self.norm = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x):
        """
        Args:
            x: Tensor of shape [batch, seq_len, d_model]
        Returns:
            output: Tensor of shape [batch, seq_len, d_model]
        """
        batch, seq_len, d_model = x.shape
        x_norm = self.norm(x)
        
        # Discretize SSM parameters
        A_discrete = self._discretize_A()
        B_discrete = self._discretize_B()
        
        # Parallel scan for efficient computation
        u = x_norm.transpose(1, 2)  # [batch, d_model, seq_len]
        
        # Initialize state
        x_k = torch.zeros(batch, d_model, self.n_states, device=x.device)
        
        # Initialize output
        y = torch.zeros(batch, d_model, seq_len, device=x.device)
        
        # Manual scan (would be implemented as a parallel scan in practice)
        for k in range(seq_len):
            # Update state
            x_k = torch.matmul(A_discrete, x_k.unsqueeze(-1)).squeeze(-1) + \
                  B_discrete * u[:, :, k:k+1].transpose(1, 2)
            
            # Compute output
            y_k = torch.sum(self.C * x_k.unsqueeze(-2), dim=-1) + \
                  self.D.unsqueeze(0).unsqueeze(-1) * u[:, :, k]
            
            # Store output
            y[:, :, k] = y_k.squeeze(-1)
        
        # Final output
        output = y.transpose(1, 2)  # [batch, seq_len, d_model]
        
        # Skip connection
        output = x + self.dropout(output)
        
        return output
    
    def _discretize_A(self):
        """Discretize A parameter for stability."""
        # Convert A to diagonal plus low-rank form
        A_diag = -torch.exp(self.A_log_scales).unsqueeze(-1).unsqueeze(-1) * \
                torch.eye(self.n_states, device=self.A.device).unsqueeze(0)
        A_stable = A_diag + self.A
        
        # Discretize using Euler method (simplified)
        A_discrete = A_stable
        return A_discrete
    
    def _discretize_B(self):
        """Discretize B parameter."""
        # Simplified discretization
        return self.B
```

## Conclusion

Advanced attention mechanisms continue to drive progress in machine learning. From the original Transformer architecture to specialized variants like sparse attention, linear attention, and state space models, these mechanisms provide the foundation for today's most powerful AI systems.

The most effective practitioners understand both the mathematical foundations of attention and the engineering optimizations that make these models practical at scale.

---

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_08_Main.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
