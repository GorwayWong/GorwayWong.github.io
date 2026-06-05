---
title: 解析残差网络（ResNet）
date: 2026-06-05
tags: 深度学习, ResNet
excerpt: 从深层网络退化问题讲起，解释残差学习和残差块如何让网络更容易学习恒等映射并训练更深模型。
draft: false
---
# 解析残差网络 (ResNet)
## 一、 问题的根源：网络退化 (Degradation)

在 ResNet 诞生之前，深度学习领域普遍认为，更深的网络能拟合更复杂的函数，从而获得更好的性能。但实践表明，当网络深度增加到一定程度时，会出现一个反直觉的现象：**训练准确率饱和甚至下降**。

值得注意的是，这并非由梯度消失/爆炸或过拟合（Overfitting）导致。梯度问题已通过归一化初始化和中间归一化层（如 Batch Normalization）基本解决；而退化问题即使在训练集上也会出现，说明模型并未达到其应有的拟合能力。

**问题核心**：让一个深度网络去学习一个恒等映射（Identity Mapping，即 `H(x) = x`）都极其困难。如果增加的层是多余的，理想情况下模型应能学会让这些层执行恒等变换，从而不影响性能。但基于非线性激活函数的标准卷积层，很难做到这一点。

## 二、 ResNet 的核心构件：残差块 (Residual Block)

为了解决上述问题，何恺明等研究者提出了**残差学习（Residual Learning）**的概念。其基本思想是，与其让网络层直接学习目标映射 `H(x)`，不如让它学习输入与输出之间的**残差（Residual）** `F(x) = H(x) - x`。

这样，原始的目标映射就变成了 `H(x) = F(x) + x`。这个看似简单的改动，构成了 ResNet 的基石——**残差块 (Residual Block)**。

```
      Input: x
         |
         |-------------------------------\
         |                               | (Shortcut / Identity Connection)
         |                               |
      [ Conv Layer ]                     |
         |                               |
      [ Batch Norm ]                     |
         |                               |
      [ ReLU ]                           |
         |                               |
      [ Conv Layer ]                     |
         |                               |
      [ Batch Norm ]                     |
         |                               |
      Output of Residual Mapping: F(x)   |
         |                               |
         \------------------[ + ]-------/ (Element-wise Addition)
                            |
                         [ ReLU ]
                            |
                       Output: H(x)
```

- **主路径 (Main Path)**：由一系列卷积层、BN层和激活函数构成，用于学习残差映射 `F(x)`。
- **捷径/短路连接 (Shortcut Connection)**：直接将输入 `x` 跨层连接到输出端。这条“捷径”是 ResNet 的精髓。

如果某个新增的层是冗余的，网络只需要将主路径的权重 `W` 学习为零，使得 `F(x) = 0`，那么 `H(x) = x`，一个恒等映射就轻松实现了。网络优化的目标从“拟合一个完美的恒等映射”转变为“将残差推向零”，后者显然更容易。

## 三、 前向传播

我们来分析残差块中的前向传播过程。设 `x_l` 是第 `l` 个残差块的输入，`x_{l+1}` 是其输出。

其数学表达式为：

$$
\mathbf{x}_{l+1} = \text{ReLU}(\mathcal{F}(\mathbf{x}_l, \{W_i\}) + \mathbf{x}_l)
$$

其中：
- `x_l`：第 `l` 个残差块的输入特征图。
- `F(x_l, {W_i})`：残差映射函数，代表主路径中的所有操作（卷积、BN等），`{W_i}` 是这些层的权重。
- `+`：表示逐元素（Element-wise）的加法。
- `ReLU()`：修正线性单元激活函数。

**过程分析**：
1.  输入 `x_l` 兵分两路。
2.  **主路径**：`x_l` 经过一系列复杂的非线性变换，学习一个增量特征 `F(x_l)`。
3.  **捷径**：`x_l` 不经过任何处理，直接传递到加法节点，保持了原始信息的完整性。
4.  **融合**：主路径学习到的残差 `F(x_l)` 与原始信息 `x_l` 逐元素相加。
5.  **激活**：将融合后的结果通过 ReLU 激活，作为下一个块的输入 `x_{l+1}`。

**维度匹配**：如果 `F(x_l)` 和 `x_l` 的维度不一致（例如，卷积步长为2导致空间尺寸减半，或通道数增加），捷径上的 `x_l` 需要通过一个线性投影（通常是 `1x1` 的卷积 `W_s`）来匹配维度：

$$
\mathbf{x}_{l+1} = \text{ReLU}(\mathcal{F}(\mathbf{x}_l, \{W_i\}) + W_s \cdot \mathbf{x}_l)
$$

## 四、 反向传播：无阻塞的梯度流

ResNet 的真正威力体现在反向传播中。它有效解决了深度网络中的梯度消失问题。

我们来推导从更深层 `L` 到浅层 `l` 的梯度。根据链式法则，损失函数 `Loss` 对 `x_l` 的梯度 `∂Loss/∂x_l` 可以表示为：

$$
\frac{\partial \text{Loss}}{\partial \mathbf{x}_l} = \frac{\partial \text{Loss}}{\partial \mathbf{x}_L} \frac{\partial \mathbf{x}_L}{\partial \mathbf{x}_l}
$$

我们重点关注 `∂x_L / ∂x_l`。利用前向传播的公式 `x_{l+1} = F(x_l) + x_l`（为简化分析，暂时忽略ReLU），我们可以得到：

$$
\frac{\partial \mathbf{x}_{l+1}}{\partial \mathbf{x}_l} = \frac{\partial \mathcal{F}(\mathbf{x}_l)}{\partial \mathbf{x}_l} + \frac{\partial \mathbf{x}_l}{\partial \mathbf{x}_l} = \frac{\partial \mathcal{F}(\mathbf{x}_l)}{\partial \mathbf{x}_l} + 1
$$

将这个关系从 `l` 到 `L-1` 递归展开：

$$
\begin{aligned}
\frac{\partial \mathbf{x}_L}{\partial \mathbf{x}_l} &= \frac{\partial \mathbf{x}_L}{\partial \mathbf{x}_{L-1}} \frac{\partial \mathbf{x}_{L-1}}{\partial \mathbf{x}_{L-2}} \cdots \frac{\partial \mathbf{x}_{l+1}}{\partial \mathbf{x}_l} \\
&= \prod_{i=l}^{L-1} \frac{\partial \mathbf{x}_{i+1}}{\partial \mathbf{x}_i} \\
&= \prod_{i=l}^{L-1} \left( \frac{\partial \mathcal{F}(\mathbf{x}_i)}{\partial \mathbf{x}_i} + 1 \right)
\end{aligned}
$$

最终，我们得到完整的梯度公式：

$$
\frac{\partial \text{Loss}}{\partial \mathbf{x}_l} = \frac{\partial \text{Loss}}{\partial \mathbf{x}_L} \left( 1 + \frac{\partial}{\partial \mathbf{x}_l} \sum_{i=l}^{L-1} \mathcal{F}(\mathbf{x}_i) \right)
$$

**公式解读与深刻含义**：
1.  **梯度由两部分组成**： `∂Loss/∂x_L` 直接传递的部分，和 `∂Loss/∂x_L` 经过所有中间残差块主路径传递的部分。
2.  **`+1` 的魔力**：关键在于 `+1` 这一项。在传统的深度网络中，梯度是连乘的形式 `Π(∂F/∂x)`。如果任何一个中间层的梯度 `∂F/∂x` 趋近于0，整个梯度流就会被“掐断”（梯度消失）。
3.  **梯度高速公路**：在 ResNet 中，即使主路径的梯度 `∂F/∂x` 非常小（例如接近 -1）， `(1 + ∂F/∂x)` 依然可以保证梯度信号的存在。这个 `+1` 确保了无论网络多深，梯度总是有一个“保底”的通道可以直接从深层传播回浅层，就像一条**永不堵塞的梯度高速公路**。

这保证了即使在非常深的网络中，浅层网络的权重也能接收到有效的梯度信号进行更新，从而根本上解决了网络退化问题。