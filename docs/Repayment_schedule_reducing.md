# Excel version
Click [this link](https://docs.google.com/spreadsheets/d/1AaSD19o-dI1REw9l3x5lsZEPcyw6mDpOwNxdAr5d2xI/edit#gid=0) to view an excel version of the following calculations


```python
# Importing libraries

from datetime import date, timedelta              # Date data type and date difference
from dateutil.relativedelta import relativedelta  # Adding/substracting month, week etc. from date

import pandas as pd                               # Spreadsheet-like calculation
                                                  
from sympy.core.symbol import var                 # Symbolic variable
from sympy import expand                          # Simplifying terms for understanding
```

# Algebra


Let,

$D$ = Disbursement

$A$ = Installment size

$r$ = Profit rate

$P_i$ = Principal balance after i-th installment

$p_i$ = Profit repayment for i-th installment

$m_i$ = Day difference between i-th installment and (i - 1)-th installment/disbursement

$n$ = Number of installments

$q$ = residual profit

**Note**: $i$ starts at $0$ and ends at $n - 1$ to maintain consistancy with programming conventions



```python
disbursement = var('D')            # Let, D = disbursement
installment_size = var('A')        #      A = installment size
n = 5                              #      n = number of installments = 5
residual_profit = var('q')
```

Now,

$$p_i = \frac{m_i \times r}{365 \times 100} \times P_{i-1}$$

Let, Per taka profit,

$$k_i = \frac{m_i \times r}{365 \times 100}$$ 

Hence, we can write,

$$p_i = k_i \times P_{i-1}$$


```python
per_taka_profits = []       # Empty list of per taka profit

for i in range(n):          # range(n) -> 0, 1, 2, ..., n-1
  per_taka_profits.append(var('k_' + ('%d' % i)))
                                          #      k_i = per taka profit for
                                          #            i-th installment

per_taka_profits            # Populated list of per taka profit
```




    [k_0, k_1, k_2, k_3, k_4]



Now,

Principal repayment for first installment, $p_0 = A - k_0 \times D$

Therefore, principal balance after first installment, $P_0 = D - p_0$

Subsequently,

$$
P_1 = P_0 - p_1 = P_0 - (A - k_0 \times P_0) \\
P_2 = P_1 - p_2 = P_1 - (A - k_1 \times P_1) \\
    ... \\
P_{n-1} = P_{n-2} - p_{n-1} = P_{n-1} - (A - k_{n-1} \times P_{n-2})
$$




```python
def calculate_balance(previous_balance, installment_size, per_taka_profit, residual_profit=0):
  profit_repayment = per_taka_profit * previous_balance + residual_profit
  # print("::profit repayment", profit_repayment)
  principal_repayment = installment_size - profit_repayment
  # print("::principal repayment", principal_repayment)
  current_balance = previous_balance - principal_repayment

  return current_balance
```


```python
principal_balance = calculate_balance(previous_balance=disbursement,
                                      installment_size=installment_size,
                                      per_taka_profit=per_taka_profits[0],
                                      residual_profit=residual_profit)
print(principal_balance)

for i in range(1, len(per_taka_profits)):
  principal_balance = calculate_balance(previous_balance=principal_balance,
                                        installment_size=installment_size,
                                        per_taka_profit=per_taka_profits[i],
                                        residual_profit=0)
  print(principal_balance)

final_balance = principal_balance
```

    -A + D*k_0 + D + q
    -2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q
    -3*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + k_2*(-2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q) + q
    -4*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + k_2*(-2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q) + k_3*(-3*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + k_2*(-2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q) + q) + q
    -5*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + k_2*(-2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q) + k_3*(-3*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + k_2*(-2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q) + q) + k_4*(-4*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + k_2*(-2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q) + k_3*(-3*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + k_2*(-2*A + D*k_0 + D + k_1*(-A + D*k_0 + D + q) + q) + q) + q) + q
    


```python
final_balance.expand().as_ordered_terms()
```




    [-A*k_1*k_2*k_3*k_4,
     -A*k_1*k_2*k_3,
     -A*k_1*k_2*k_4,
     -A*k_1*k_2,
     -A*k_1*k_3*k_4,
     -A*k_1*k_3,
     -A*k_1*k_4,
     -A*k_1,
     -2*A*k_2*k_3*k_4,
     -2*A*k_2*k_3,
     -2*A*k_2*k_4,
     -2*A*k_2,
     -3*A*k_3*k_4,
     -3*A*k_3,
     -4*A*k_4,
     -5*A,
     D*k_0*k_1*k_2*k_3*k_4,
     D*k_0*k_1*k_2*k_3,
     D*k_0*k_1*k_2*k_4,
     D*k_0*k_1*k_2,
     D*k_0*k_1*k_3*k_4,
     D*k_0*k_1*k_3,
     D*k_0*k_1*k_4,
     D*k_0*k_1,
     D*k_0*k_2*k_3*k_4,
     D*k_0*k_2*k_3,
     D*k_0*k_2*k_4,
     D*k_0*k_2,
     D*k_0*k_3*k_4,
     D*k_0*k_3,
     D*k_0*k_4,
     D*k_0,
     D*k_1*k_2*k_3*k_4,
     D*k_1*k_2*k_3,
     D*k_1*k_2*k_4,
     D*k_1*k_2,
     D*k_1*k_3*k_4,
     D*k_1*k_3,
     D*k_1*k_4,
     D*k_1,
     D*k_2*k_3*k_4,
     D*k_2*k_3,
     D*k_2*k_4,
     D*k_2,
     D*k_3*k_4,
     D*k_3,
     D*k_4,
     D,
     k_1*k_2*k_3*k_4*q,
     k_1*k_2*k_3*q,
     k_1*k_2*k_4*q,
     k_1*k_2*q,
     k_1*k_3*k_4*q,
     k_1*k_3*q,
     k_1*k_4*q,
     k_1*q,
     k_2*k_3*k_4*q,
     k_2*k_3*q,
     k_2*k_4*q,
     k_2*q,
     k_3*k_4*q,
     k_3*q,
     k_4*q,
     q]



For $n$ = $5$,
$$\begin{aligned}
P_{n-1} =
  &-A \times k_1k_2k_3k_4 \\
  &-A \times k_1k_2k_3\\
  &-A \times k_1k_2k_4\\
  &-A \times k_1k_2\\
  &-A \times k_1k_3k_4\\
  &-A \times k_1k_3\\
  &-A \times k_1k_4\\
  &-A \times k_1\\
  &-2 \times A \times k_2k_3k_4\\
  &-2 \times A \times k_2k_3\\
  &-2 \times A \times k_2k_4\\
  &-2 \times A \times k_2\\
  &-3 \times A \times k_3k_4\\
  &-3 \times A \times k_3\\
  &-4 \times A \times k_4\\
  &-5 \times A\\
  &+D \times k_0k_1k_2k_3k_4\\
  &+D \times k_0k_1k_2k_3\\
  &+D \times k_0k_1k_2k_4\\
  &+D \times k_0k_1k_2\\
  &+D \times k_0k_1k_3k_4\\
  &+D \times k_0k_1k_3\\
  &+D \times k_0k_1k_4\\
  &+D \times k_0k_1\\
  &+D \times k_0k_2k_3k_4\\
  &+D \times k_0k_2k_3\\
  &+D \times k_0k_2k_4\\
  &+D \times k_0k_2\\
  &+D \times k_0k_3k_4\\
  &+D \times k_0k_3\\
  &+D \times k_0k_4\\
  &+D \times k_0\\
  &+D \times k_1k_2k_3k_4\\
  &+D \times k_1k_2k_3\\
  &+D \times k_1k_2k_4\\
  &+D \times k_1k_2\\
  &+D \times k_1k_3k_4\\
  &+D \times k_1k_3\\
  &+D \times k_1k_4\\
  &+D \times k_1\\
  &+D \times k_2k_3k_4\\
  &+D \times k_2k_3\\
  &+D \times k_2k_4\\
  &+D \times k_2\\
  &+D \times k_3k_4\\
  &+D \times k_3\\
  &+D \times k_4\\
  &+D \\
  &+q \times k_1k_2k_3k_4\\
  &+q \times k_1k_2k_3\\
  &+q \times k_1k_2k_4\\
  &+q \times k_1k_2\\
  &+q \times k_1k_3k_4\\
  &+q \times k_1k_3\\
  &+q \times k_1k_4\\
  &+q \times k_1\\
  &+q \times k_2k_3k_4\\
  &+q \times k_2k_3\\
  &+q \times k_2k_4\\
  &+q \times k_2\\
  &+q \times k_3k_4\\
  &+q \times k_3\\
  &+q \times k_4\\
  &+q \\
  &=-A \times &(k_1k_2k_3k_4 \\
  &&+ k_1k_2k_3\\
  &&+ k_1k_2k_4\\
  &&+ k_1k_2\\
  &&+ k_1k_3k_4\\
  &&+ k_1k_3\\
  &&+ k_1k_4\\
  &&+ k_1\\
  &&+ 2 \times k_2k_3k_4\\
  &&+ 2 \times k_2k_3\\
  &&+ 2 \times k_2k_4\\
  &&+ 2 \times k_2\\
  &&+ 3 \times k_3k_4\\
  &&+ 3 \times k_3\\
  &&+ 4 \times k_4\\
  &&+ 5) \\
&+D \times &(k_0k_1k_2k_3k_4\\
  &&+ k_0k_1k_2k_3\\
  &&+ k_0k_1k_2k_4\\
  &&+ k_0k_1k_2\\
  &&+ k_0k_1k_3k_4\\
  &&+ k_0k_1k_3\\
  &&+ k_0k_1k_4\\
  &&+ k_0k_1\\
  &&+ k_0k_2k_3k_4\\
  &&+ k_0k_2k_3\\
  &&+ k_0k_2k_4\\
  &&+ k_0k_2\\
  &&+ k_0k_3k_4\\
  &&+ k_0k_3\\
  &&+ k_0k_4\\
  &&+ k_0\\
  &&+ k_1k_2k_3k_4\\
  &&+ k_1k_2k_3\\
  &&+ k_1k_2k_4\\
  &&+ k_1k_2\\
  &&+ k_1k_3k_4\\
  &&+ k_1k_3\\
  &&+ k_1k_4\\
  &&+ k_1\\
  &&+ k_2k_3k_4\\
  &&+ k_2k_3\\
  &&+ k_2k_4\\
  &&+ k_2\\
  &&+ k_3k_4\\
  &&+ k_3\\
  &&+ k_4\\
  &&+ 1) \\
&+q \times &(k_1k_2k_3k_4\\
  &&+ k_1k_2k_3\\
  &&+ k_1k_2k_4\\
  &&+ k_1k_2\\
  &&+ k_1k_3k_4\\
  &&+ k_1k_3\\
  &&+ k_1k_4\\
  &&+ k_1\\
  &&+ k_2k_3k_4\\
  &&+ k_2k_3\\
  &&+ k_2k_4\\
  &&+ k_2\\
  &&+ k_3k_4\\
  &&+ k_3\\
  &&+ k_4\\
  &&+ 1) \\
  &= -A \times C_A + D \times C_D + q \times C_q
\end{aligned}$$

We can extrapolate that final principal balance for any given $n$, final principal balance can be expressed as
$ -A \times C_A + D \times C_D + q \times C_q$

Rewriting as a function of $D$, $A$ and $q$, the final principal balance,
$$P_{n-1} = f(D,A,q) = D \times C_D - A \times C_A + q \times C_q$$


```python
def calculate_final_balance(disbursement,
                            installment_size,
                            per_taka_profits,
                            residual_profit=0):
  
  principal_balance = calculate_balance(previous_balance=disbursement,
                                        installment_size=installment_size,
                                        per_taka_profit=per_taka_profits[0],
                                        residual_profit=residual_profit)

  for i in range(1, len(per_taka_profits)):
    principal_balance = calculate_balance(previous_balance=principal_balance,
                                          installment_size=installment_size,
                                          per_taka_profit=per_taka_profits[i])

  final_balance = principal_balance
  return final_balance
```

Putting $D$ = $1$, $A$ = $0$, and $q$ = $0$,
$$
f(1,0,0) = 1 \times C_D - 0 \times C_A + 0 \times C_q \\
\Rightarrow C_D = f(1,0,0) ...(i)
$$


```python
final_balance_1_0_0 = calculate_final_balance(1, 0, per_taka_profits)

final_balance_1_0_0.expand().as_ordered_terms()
```




    [k_0*k_1*k_2*k_3*k_4,
     k_0*k_1*k_2*k_3,
     k_0*k_1*k_2*k_4,
     k_0*k_1*k_2,
     k_0*k_1*k_3*k_4,
     k_0*k_1*k_3,
     k_0*k_1*k_4,
     k_0*k_1,
     k_0*k_2*k_3*k_4,
     k_0*k_2*k_3,
     k_0*k_2*k_4,
     k_0*k_2,
     k_0*k_3*k_4,
     k_0*k_3,
     k_0*k_4,
     k_0,
     k_1*k_2*k_3*k_4,
     k_1*k_2*k_3,
     k_1*k_2*k_4,
     k_1*k_2,
     k_1*k_3*k_4,
     k_1*k_3,
     k_1*k_4,
     k_1,
     k_2*k_3*k_4,
     k_2*k_3,
     k_2*k_4,
     k_2,
     k_3*k_4,
     k_3,
     k_4,
     1]



Putting $D$ = $0$, $A$ = $1$, and $q$ = $0$,
$$
f(0,1,0) = 0 \times C_D - 1 \times C_A + 0 \times C_q \\
\Rightarrow C_A = -f(0,1,0) ...(ii)
$$


```python
final_balance_0_1_0 = calculate_final_balance(0, 1, per_taka_profits)

final_balance_0_1_0.expand().as_ordered_terms()
```




    [-k_1*k_2*k_3*k_4,
     -k_1*k_2*k_3,
     -k_1*k_2*k_4,
     -k_1*k_2,
     -k_1*k_3*k_4,
     -k_1*k_3,
     -k_1*k_4,
     -k_1,
     -2*k_2*k_3*k_4,
     -2*k_2*k_3,
     -2*k_2*k_4,
     -2*k_2,
     -3*k_3*k_4,
     -3*k_3,
     -4*k_4,
     -5]



Putting $D$ = $0$, $A$ = $0$, and $q$ = $1$,
$$
f(0,0,1) = 0 \times C_D - 0 \times C_A - 1 \times C_q \\
\Rightarrow C_q = f(0,0,1) ...(ii)
$$


```python
final_balance_0_0_1 = calculate_final_balance(0, 0, per_taka_profits, 1)

final_balance_0_0_1.expand().as_ordered_terms()
```




    [k_1*k_2*k_3*k_4,
     k_1*k_2*k_3,
     k_1*k_2*k_4,
     k_1*k_2,
     k_1*k_3*k_4,
     k_1*k_3,
     k_1*k_4,
     k_1,
     k_2*k_3*k_4,
     k_2*k_3,
     k_2*k_4,
     k_2,
     k_3*k_4,
     k_3,
     k_4,
     1]



We know that after the last installment, the principal balance, $P_{n-1}$ is $0$. Hence, we can write,

$$
\begin{aligned}
0 &= D \times C_D - A \times C_A + q \times C_q\\
\Rightarrow  C_A \times A &= D \times C_D + q \times C_q\\
\therefore  A &= \frac{D \times C_D + q \times C_q}{C_A}\\
              &= -\frac{D \times f(1,0,0) + q \times f(0,0,1)}{f(0,1,0)}
\end{aligned}
$$

# Algorithm


```python
# balance_after_first_repayment
# = initial_balance - (installment - profit_repayment - residual_profit)

cd = 1 - (0 - per_taka_profits[0] * 1 - 0) # cd => f(1, 0, 0) =  C_D
ca = 0 - (1 - per_taka_profits[0] * 0 - 0) # ca => f(0, 1, 0) = -C_A
cq = 0 - (0 - per_taka_profits[0] * 0 - 1) # cq => f(0, 0, 1) =  C_q

for k in per_taka_profits[1:]:
    # balance_after_subsequent_repayments
    # = balance_bf - (installment - profit_repayment)
    cd = cd - (0 - k * cd)
    ca = ca - (1 - k * ca)
    cq = cq - (0 - k * cq)

A = -(D * cd + q * cq) / ca

# Max installment size
q_max = -D * (cd + ca * ks[0]) / (cq + ca)
A_max = q_max + D * ks[0]
```
