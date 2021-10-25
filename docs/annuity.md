---
title: Annuity Calulation
---

```python
from sympy import symbols
```

```python
disbursement = symbols('d')
n_repayments = 12

balance = disbursement
principal_repayment = disbursement/n_repayments

per_taka_profits = []

total_profit = 0
for i in range(n_repayments):
  per_taka_profit = symbols('p_' + '%02d' % i)  # p_00, p_01, p_02, ...
  per_taka_profits.append(per_taka_profit)

  total_profit += balance * per_taka_profit
  balance -= principal_repayment

installment_size = (total_profit + disbursement) / n_repayments
installment_size.simplify()
```

$$\frac{d \left(12 p_{00} + 11 p_{01} + 10 p_{02} + 9 p_{03} + 8 p_{04} + 7 p_{05} + 6 p_{06} + 5 p_{07} + 4 p_{08} + 3 p_{09} + 2 p_{10} + p_{11} + 12\right)}{144}$$

```python
def calculate_installment_size(disbursement, per_taka_profits, n_repayments):
  numerator = n_repayments

  for i in range(n_repayments):
    numerator += (n_repayments - i) * per_taka_profits[i]

  denominator = n_repayments * n_repayments

  installment_size = disbursement * numerator / denominator

  return installment_size

calculate_installment_size(disbursement, per_taka_profits, n_repayments).simplify()
```

$$
\frac{d \left(12 p_{00} + 11 p_{01} + 10 p_{02} + 9 p_{03} + 8 p_{04} + 7 p_{05} + 6 p_{06} + 5 p_{07} + 4 p_{08} + 3 p_{09} + 2 p_{10} + p_{11} + 12\right)}{144}
$$

```python
raw = """
0.040983607
0.042349727
0.042349727
0.040983607
0.042349727
0.040983607
0.042450782
0.042465753
0.038356164
0.042465753
0.041095890
0.042465753
"""

per_taka_profits = [ # converting numbers from string to float
  float(per_taka_profit_raw)
  for per_taka_profit_raw in raw.strip().split('\n')
]

n_repayments = len(per_taka_profits)

calculate_installment_size(1, per_taka_profits, n_repayments)
```

```shell
0.1058902498888889
```
