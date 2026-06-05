---
title: 理解 Inverted Dropout 的每一步
date: 2026-06-05
tags: 深度学习, 正则化
excerpt: 按前向传播和反向传播逐步拆解 Inverted Dropout，说明 mask、keep_prob 和缩放因子如何影响激活值与梯度。
draft: false
---
# 理解Inverted Dropout的每一步

Dropout是一种强大的神经网络正则化技术。为了真正掌握它，我们必须清晰地追踪数据在网络中每一步的变化，尤其是在加入了Dropout之后。

本文将分解带有 Inverted Dropout 的神经网络层在前向和反向传播中的完整流程。

### 符号约定

- `L`：表示神经网络的第 `L` 层。
- `W[L]`, `b[L]`：第 `L` 层的权重和偏置。
- `A[L-1]`：第 `L-1` 层传递给第 `L` 层的**最终激活输出**。
- `Z[L]`：第 `L` 层的**线性输出**， `Z[L] = W[L]A[L-1] + b[L]`。
- `A[L]`：第 `L` 层经过激活函数 `g` 后的**原始激活值**，`A[L] = g(Z[L])`。
- `D[L]`：在第 `L` 层生成的**随机蒙版 (mask)**。
- `A_drop[L]`：原始激活值 `A[L]` 应用蒙版 `D[L]` 后，**被“丢弃”部分神经元的激活值**。
- `A_scaled[L]`：`A_drop[L]` 经过放大（缩放）后，得到的**最终激活输出**。这个值将作为 `A[L]` 传递给下一层。
- `d` (例如 `dW[L]`)：表示损失函数对该变量的梯度。
- `keep_prob`：Dropout中一个神经元被保留的概率。
- `*`：表示逐元素乘积 (Element-wise Product)。

---

## 一、前向传播 (Forward Propagation)

在第 `L` 层，数据流清晰地分为以下几步：

1.  **线性计算**
    使用来自上一层的最终输出 `A[L-1]` 来计算本层的线性部分。
    `Z[L] = W[L]A[L-1] + b[L]`

2.  **激活计算**
    将线性结果通过激活函数，得到原始激活值。
    `A[L] = g(Z[L])`

3.  **【Dropout步骤1】生成并应用蒙版**
    - 创建一个与 `A[L]` 形状相同的随机蒙版 `D[L]`。
    - 将蒙版应用到 `A[L]` 上，得到一部分神经元被置零的 `A_drop[L]`。
  
      `A_drop[L] = A[L] * D[L]`

4.  **【Dropout步骤2】缩放 (Inverted Dropout)**
    为了保持激活值的期望（均值）不变，我们将被保留的激活值进行放大，得到该层的最终输出 `A_scaled[L]`。
  
    `A_scaled[L] = A_drop[L] / keep_prob`
  
    这个 `A_scaled[L]` 就是将要传递给下一层（`L+1`层）的输入。

> **核心链接**：传递给第 `L+1` 层的是 `A_scaled[L]`。因此，在下一层的计算中，`Z[L+1] = W[L+1]A_scaled[L] + b[L+1]`。这个明确的公式是推导反向传播的基础。

---

## 二、反向传播 (Backward Propagation)

反向传播是链式法则的逆向应用。我们的目标是根据后一层的梯度，计算出当前层的梯度。

假设我们已经从 `L+1` 层计算得到了 `dZ[L+1]`，现在开始回传到 `L` 层。

1.  **计算梯度 `dA_scaled[L]`**
    根据前向传播的公式 `Z[L+1] = W[L+1]A_scaled[L] + b[L+1]`，损失对 `A_scaled[L]` 的梯度为：
  
    `dA_scaled[L] = (W[L+1])^T * dZ[L+1]`
  
    我们得到了损失对“缩放后激活值”的梯度。

2.  **【Dropout反向步骤1】梯度穿过“缩放”操作**
    前向时是 `A_scaled[L] = A_drop[L] / keep_prob`。根据链式法则，我们需要将梯度乘以该操作的导数，即 `1 / keep_prob`。
  
    `dA_drop[L] = dA_scaled[L] * (1 / keep_prob)`
  
    现在我们得到了损失对“被丢弃后激活值”的梯度。

3.  **【Dropout反向步骤2】梯度穿过“蒙版”操作**
    前向时是 `A_drop[L] = A[L] * D[L]`。根据链式法则，我们需要将梯度乘以该操作的导数，即蒙版 `D[L]` 本身。
  
    `dA[L] = dA_drop[L] * D[L]`
  
    **这一步至关重要**：它确保了在前向传播中被“杀死”的神经元（`D[L]`中对应位置为0），其回传的梯度也为0。
  
    > **高效实现**：步骤2和3可以合并。将 `dA_drop[L]` 的表达式代入，得到：
    > `dA[L] = (dA_scaled[L] * (1 / keep_prob)) * D[L]`
    > `dA[L] = dA_scaled[L] * (D[L] / keep_prob)`
    > 这条公式简洁且高效，与我们上一版的结论一致，但现在的推导路径更加清晰。

4.  **计算梯度 `dZ[L]`**
    梯度 `dA[L]` 已经完全穿过了Dropout层，到达了原始激活值。现在，我们将其传过激活函数。
  
    `dZ[L] = dA[L] * g'(Z[L])`
  
    其中 `g'(Z[L])` 是激活函数的导数。

5.  **计算参数梯度 `dW[L]` 和 `db[L]`**
    有了 `dZ[L]`，我们就可以计算当前层参数的梯度了。
  
    `dW[L] = (1/m) * dZ[L] * (A[L-1])^T`
    `db[L] = (1/m) * sum(dZ[L])`
  
    （`m` 是样本数，`sum` 沿样本轴求和）

### 总结

整合后的算法流程如下（以伪代码形式）：

**前向传播 (Layer L):**
1.  `Z[L] = W[L]A[L-1] + b[L]`
2.  `A[L] = g(Z[L])`
3.  `D[L] = np.random.rand(A[L].shape) < keep_prob`
4.  `A_drop[L] = A[L] * D[L]`
5.  `A_scaled[L] = A_drop[L] / keep_prob`
6.  缓存 `A[L-1]`, `A[L]`, `Z[L]`, 和 `D[L]` 以备反向传播使用。
7.  将 `A_scaled[L]` 作为输出传递给下一层。

**反向传播 (Layer L):**
1.  `dA_scaled[L] = (W[L+1])^T * dZ[L+1]`
2.  `dA[L] = dA_scaled[L] * (D[L] / keep_prob)`
3.  `dZ[L] = dA[L] * g'(Z[L])`
4.  `dW[L] = (1/m) * dZ[L] * (A[L-1])^T`
5.  `db[L] = (1/m) * np.sum(dZ[L], axis=1, keepdims=True)`
6.  `dA[L-1] = (W[L])^T * dZ[L]` (为上一层计算梯度)