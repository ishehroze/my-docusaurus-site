```python
from datetime import date
from dateutil.relativedelta import relativedelta
 
# Inputs
principal = 10000000
rate = 9
disburse_date = date(2020, 2, 5)
first_installment_date = date(2020, 3, 5)
n_installments = 156
residual_profit = 100000
 
def calculate_principal_first_emi(principal, rate, disburse_date, first_installment_date, n_installments):
  pass
 
def calculate_installment_dates(first_installment_date, n_installments):
  pass
 
def calculate_per_taka_profits(rate, installment_dates):
  pass 
# Use multi-rate, monthly_product etc. version if needed. This is the simplified
# version for profit calculation
def calculate_profit(principal, rate, from_date, to_date):
  n_days = (to_date - from_date).days
  divisor = (date(from_date.year + 1, 1, 1) - date(from_date.year, 1, 1)).days
  return principal * rate * n_days / (divisor * 100)
 
# Monthly installment dates for simplification. Can be quarterly, weekly also.
installment_dates = [
  first_installment_date + relativedelta(months=i) 
  for i in range(n_installments)
]
 
"""
We do not know what the profits will be before calculating the installment size
since the balance will change based on installment size. However, we do know
the rate information and schedule dates. We can use this information to
calculate the profit for 1 taka principal upto each schedule date.
"""
from_date = disburse_date
per_taka_profits = []
 
for to_date in installment_dates:
  per_taka_profit = calculate_profit(1, rate, from_date, to_date)
  per_taka_profits.append(per_taka_profit)
  from_date = to_date
 
"""
The following loop calculates `m` (or the minimum `m` to be more accurate) which
is the heart of calculating installment size for principal first schedules. `m`
is a fraction number representing number of principal payment (considering the
last payment to be partial/fraction of 1). Therefore, `installment size * m`
equals the disburse amount and `installment size * (number of installments - m)`
equals total profit payment.   
"""
 
numerator_sum = n_installments
denominator_sum = 1 + residual_profit / principal
m = n_installments

print("*ptp = per taka profit")                            # DEMO PURPOSE
print("*n = number of installments\n")
print("   i  1 + SUM(ptp[i])  SUM(ptp[i] * i) + n             m")  # DEMO PURPOSE
print("----  ---------------  -------------------   -----------")  # DEMO PURPOSE
 
for i in range(n_installments): # for (int i=0; i<n_installments; i++) {}
  numerator_sum += i * per_taka_profits[i]
  denominator_sum += per_taka_profits[i]
 
  temp_m = numerator_sum / denominator_sum
  
  print(("%4d"                                             # DEMO PURPOSE
       + 2 * " " + "%15.4f"                                # DEMO PURPOSE
       + 2 * " "  +  "%17.4f"                              # DEMO PURPOSE
       + 3 * " " + "%10.7f") % (                           # DEMO PURPOSE
         i,                                                # DEMO PURPOSE
         denominator_sum,                                  # DEMO PURPOSE
         numerator_sum,                                    # DEMO PURPOSE
         temp_m                                            # DEMO PURPOSE
       ), end="")                                          # DEMO PURPOSE
  
  if temp_m > m:
    print(" " + ">" + " %.6f" % m)                         # DEMO PURPOSE
    continue             # should be `break`. continuing for DEMO PURPOSE
  else:
    print("")                                              # DEMO PURPOSE
    m = temp_m
 
print("\nMin(m): %.6f" % m)
print("Installment size: %.2f = principal / Min(m)" % (principal / m))
```


```python
from datetime import date
from dateutil.relativedelta import relativedelta
 
# Inputs
principal = 10000000
rate = 9
disburse_date = date(2020, 2, 5)
first_installment_date = date(2020, 3, 5)
n_installments = 156
 
def calculate_installment_dates(first_installment_date, n_installments):
  installment_dates = [
    first_installment_date + relativedelta(months=i) 
    for i in range(n_installments)
  ]
 
  return installment_dates
 
def calculate_profit(principal, rate, from_date, to_date):
  n_days = (to_date - from_date).days
  divisor = (date(from_date.year + 1, 1, 1) - date(from_date.year, 1, 1)).days
 
  return principal * rate * n_days / (divisor * 100)
 
def calculate_per_taka_profits(rate, disburse_date, installment_dates):
  from_date = disburse_date # This may not be true if there is 
  per_taka_profits = []
 
  for to_date in installment_dates:
    per_taka_profit = calculate_profit(1, rate, from_date, to_date)
    per_taka_profits.append(per_taka_profit)
    from_date = to_date
 
  return per_taka_profits
 
def calculate_principal_repayment_count(per_taka_profits):
  n_installments = len(per_taka_profits)
  numerator_sum = n_installments
  denominator_sum = 1
 
  m = numerator_sum / denominator_sum
 
  for i in range(n_installments):
    numerator_sum += i * per_taka_profits[i]
    denominator_sum += per_taka_profits[i]
 
    temp_m = numerator_sum / denominator_sum
 
    if temp_m > m:
      return m
    else:
     m = temp_m
 
  return m
 
def calculate_profit_first_emi(principal, rate, disburse_date, first_installment_date, n_installments):
  installment_dates = calculate_installment_dates(first_installment_date, n_installments)
  per_taka_profits = calculate_per_taka_profits(rate, disburse_date, installment_dates)
  m = calculate_principal_repayment_count(per_taka_profits)
 
  return principal / m
 
calculate_profit_first_emi(principal, rate, disburse_date, first_installment_date, n_installments)
```

# In progress documentation


```python
from sympy import symbols
 
k_list = []
 
ln  = 10
 
for i in range(10):
  k_list.append(symbols('k' + str(i)))
 
k_list
```


```python
m = symbols('m')
n = symbols('n')
d = symbols('d')
q = symbols('q')
 
profits = []
balance = d
 
for i, k in enumerate(k_list):
  balance -= d/m
  profit = k * balance
  profits.append(profit)
  print(profit.simplify())
```


```python
km = (m/d * sum(profits)).simplify()
km
```


```python
# Adding residual profit
kmq = km + q * m/d
kmq.expand()
```


```python
alt_kmq = m * sum([q/d] + k_list) - sum([i * k_list[i] for i in range(ln)])
alt_kmq
```


```python
(kmq - alt_kmq).simplify()
```


```python
total_profit = d/m * (n - m)
total_profit * m/d
```

$$
\begin{aligned}
-m + n =& - k_{1} - 2 k_{2} - 3 k_{3} - 4 k_{4} - 5 k_{5} - 6 k_{6} - 7 k_{7} - 8 k_{8} - 9 k_{9} \\
& + m \left(k_{0} + k_{1} + k_{2} + k_{3} + k_{4} + k_{5} + k_{6} + k_{7} + k_{8} + k_{9} + \frac{q}{d}\right) \\
\Rightarrow n + k_{1} + 2 k_{2} + 3 k_{3} + 4 k_{4} + 5 k_{5} + 6 k_{6} + 7 k_{7} + 8 k_{8} + 9 k_{9} =& m + m \left(k_{0} + k_{1} + k_{2} + k_{3} + k_{4} + k_{5} + k_{6} + k_{7} + k_{8} + k_{9} + \frac{q}{d}\right) \\
\Rightarrow m \left(k_{0} + k_{1} + k_{2} + k_{3} + k_{4} + k_{5} + k_{6} + k_{7} + k_{8} + k_{9} + \frac{q}{d} + 1\right) =& n + k_{1} + 2 k_{2} + 3 k_{3} + 4 k_{4} + 5 k_{5} + 6 k_{6} + 7 k_{7} + 8 k_{8} + 9 k_{9} \\
\Rightarrow m =& \frac{n + k_{1} + 2 k_{2} + 3 k_{3} + 4 k_{4} + 5 k_{5} + 6 k_{6} + 7 k_{7} + 8 k_{8} + 9 k_{9}}{\frac{q}{d} + 1 + k_{0} + k_{1} + k_{2} + k_{3} + k_{4} + k_{5} + k_{6} + k_{7} + k_{8} + k_{9}}\\
=& \frac{n + (0\times k_0 + 1 \times k_{1} + 2 k_{2} + 3 k_{3} + 4 k_{4} + 5 k_{5} + 6 k_{6} + 7 k_{7} + 8 k_{8} + 9 k_{9})}{\frac{q}{d} + 1 + (k_{0} + k_{1} + k_{2} + k_{3} + k_{4} + k_{5} + k_{6} + k_{7} + k_{8} + k_{9})}
\end{aligned}
$$

# Algorithm


```python
# Inputs
d = principal
per_taka_profits = calculate_per_taka_profits(rate,
                                              disburse_date,
                                              installment_dates)
q = 100000
n_installments = len(per_taka_profits)
```


```python
numerator_sum = n_installments
denominator_sum = 1 + q/d

m = numerator_sum / denominator_sum

for i, k in enumerate(per_taka_profits):
  numerator_sum += i * k
  denominator_sum += k

  m = numerator_sum / denominator_sum

  if m < i:
    break
m
```
