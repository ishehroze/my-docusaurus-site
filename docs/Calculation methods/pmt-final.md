---
id: pmt-final
title: PMT with extra payment
#sidebar_label: <specify if it is other than title>
#description: <optional>
slug: pmt-final
#sidebar_position: <specify after confirming order>
---

Let,

$P =$ Principal balance

$x =$ Principal repayment for the first installment

$m =$ Number of repayments

$q' =$ Total earlier profit

| Description | Principal Payment | Profit Payment | Installment                       | Principal Balance |
| ----------- | ----------------- | -------------- | --------------------------------- | ----------------- |
| ...         | ???               | ???            | ???                               | $P$               |
| Repayment 1 | $x$               | $q'$           | $x + q'$                          | $P - x$           |
| Repayment 2 | ???               | ???            | $PMT(\frac{r}{12}, m - 1, P - x)$ | ???               |
| Repayment 3 | ???               | ???            | $PMT(\frac{r}{12}, m - 1, P - x)$ | ???               |
| ...         | ...               | ...            | ...                               | ...               |
| Repayment m | ???               | ???            | $PMT(\frac{r}{12}, m - 1, P - x)$ | $0$               |

---

Please note that for any $r$, $n$, and $z$,

$$
PMT(\frac{r}{12}, n, z) = z \times PMT(\frac{r}{12}, n, 1)
$$

Here,

$$
\begin{aligned}
x + q' &= PMT(\frac{r}{12}, m - 1, P - x) \\
\Rightarrow x + q' &= (P - x) \times PMT(\frac{r}{12}, m - 1, 1) \\
\Rightarrow x + q' &= P \times PMT(\frac{r}{12}, m - 1, 1) - x \times PMT(\frac{r}{12}, m - 1, 1) \\
\Rightarrow x + x \times PMT(\frac{r}{12}, m - 1, 1) &= P \times PMT(\frac{r}{12}, m - 1, 1) - q' \\
\Rightarrow x \times \{1 + PMT(\frac{r}{12}, m - 1, 1)\} &= P \times PMT(\frac{r}{12}, m - 1, 1) - q' \\
\Rightarrow x &= \frac{PMT(\frac{r}{12}, m - 1, P) - q'}{PMT(\frac{r}{12}, m - 1, 1) + 1}
\end{aligned}
$$

If $q' > P \times PMT(\frac{r}{12}, m - 1, 1)$, $x$ will become negative which
isn't acceptable. The max profit amount for which x is non-negative (which is
$x \ge 0$),

$$
q' \le q'_{max} = PMT(\frac{r}{12}, m-1, P) = A_{max}
$$

Hence,

$$
x = \frac{q'_{max} - q'}{PMT(\frac{r}{12}, m - 1, 1) + 1}
$$

---

If $q' > P \times PMT(\frac{r}{12}, m - 1, 1)$, $x$ will become negative which
isn't acceptable. The max profit amount for which x is non-negative (which is
$x \ge 0$),

$$
q' \le q'_{max} = PMT(\frac{r}{12}, m-1, P) = A_{max}
$$

## Algorithm

```python
def pmt(rate, nper, principal):
  rate /= 100
  return principal * rate / (1 - (1 + rate) ** (-nper))
```

```python
P = 1000000
r = 12
m = 12

q_prime_max = pmt(r/12, m-1, P)
q_prime_max
```

```python
def calculate_installments(q_prime, P, r, m):
  q_prime_max = pmt(r/12, m-1, P)

  x = (q_prime_max - q_prime) / (pmt(r/12, m-1, 1) + 1) if q_prime < q_prime_max else 0

  first_repayment = x + q_prime
  A = x + q_prime if q_prime < q_prime_max else q_prime_max

  return (first_repayment, A)
```

```python
q_prime = 90000   # q_prime < q_prime_max

calculate_installments(q_prime, P, r, m)
```

```python
q_prime = 100000  # q_prime > q_prime_max

calculate_installments(q_prime, P, r, m)
```

## Generalized ($q' > q_{max}$)

Given,

$n$ = Total number of installments

$m$ = Number of installments before

$r$ = Rate

$f$ = Repayment frequency (which is for monthly, $f$ = 1, and for quarterly, $f$
= 3)

$P$ = Principal balance after $m$ installments

$q'$ = Profit accrued before

$q_{l-1}$ = Accrued profit during profit-only installments

---

Let,

$l$ = Number of repayments required for adjusting profit accrued before

$x$ = Principal repayment amount at $(m + l)$th repayment

And,

$$
M = n - m
$$

$$
R = \frac{r \times f}{100 \times 12}
$$

---

Extra profit accrued during profit-only repayments

$$= q_{l-1}$$

Total repayment during repayments for previous profit adjustment = principal
repayment + previous profit repayment + profit accrued during profit only
repayments

Which is

$$x + q + q_{l-1}$$

Hence, installment size during previous profit adjustment repayments
$$= \frac{x + q + q_{l-1}}{l}$$

This should be equal to the installment size after previous profit adjustment
repayments which is $$PMT(R, M-l, P-x)$$

---

Assuming, $A$ is the installment size, we can write,

$$
\begin{aligned}
\frac{x + q + q_{l-1}}{l} &= PMT(R, M-l, P-x) = A \\
\Rightarrow x + q + q_{l-1} &= l \times PMT(R, M-l, P-x) \\
\Rightarrow x + q + q_{l-1} &= Pl \times PMT(R, M-l, 1) - lx \times PMT(R, M-l, 1)  \\
\Rightarrow x + lx \times PMT(R, M-l, 1) &= Pl \times PMT(R, M-l, 1) - q - q_{l-1} \\
\Rightarrow x\{1 + l \times PMT(R, M-l, 1)\} &= Pl \times PMT(R, M-l, 1) - q - q_{l-1} \\
\therefore x &= \frac{Pl \times PMT(R, M-l, 1) - q - q_{l-1}}{l \times PMT(R, M-l, 1) + 1} \\
\end{aligned}
$$

For $l = 1$,

$$
x = \frac{PMT(\frac{r}{12}, m - 1, P) - q}{PMT(\frac{r}{12}, m - 1, 1) + 1}
$$

---
