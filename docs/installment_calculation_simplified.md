---
id: installment_calculation_simplified
title: Simplified installment calculation
#sidebar_label: <specify if it is other than title>
#description: <optional>
slug: installment_calculation_simplified
#sidebar_position: <specify after confirming order>
---

> [Installment_size_simplified](https://docs.google.com/spreadsheets/d/1Cyh3Vuoz-VrEsjGJ9WAhaqZPnjEm4GPMFi4-mprMFg8/edit#gid=0)
> google sheet.

Assuming,

$D$ = Disbursement amount

$f$ = Installment frequency in months

$t$ = Tenure in months

$g$ = Gestation tenure in months

$n$ = $\lfloor \frac{t-g}{f} \rfloor$ = Number of installments

$r$ = Rate

$k$ = $\frac{r}{1200} \times f$

$A$ = Installment size

## Installment size calculation for principal first method

For principal first method, $A$ can be expressed as
$\frac{D}{min(m)} + \frac{kg}{n}$ where,

$$m = \frac{n+\frac{kx}{2} (x+1)}{1+k(x+1)}$$

and $x$ is an integer between 1 and $n$ (inclusive).

Assuming, $n$ and $k$ as constant, $m$ is minimum where,

$$
\begin{aligned}
&m'(x) = 0 \\
\Rightarrow& \frac{d}{dx}\left\{\frac{n+\frac{kx}{2} (x+1)}{1+k(x+1)}\right\} = 0 \\
\therefore& \frac{k^2x^2+2k^2x+2kx+k^2+k-2nk}{2\{1+k(x+1)\}^2} = 0
\end{aligned}
$$

Now, we can express $x$ in terms of $n$ and $k$.

$$
\begin{aligned} & \frac{k^2x^2+2k^2x+2kx+k^2+k-2nk}{2\{1+k(x+1)\}^2} = 0 \\
\Rightarrow& k^2x^2+2k^2x+2kx+k^2+k-2nk = 0 \\ \Rightarrow& kx^2+2kx+2x+k+1-2n =
0 \\ \Rightarrow& kx^2+(2k+2)x+(k+1-2n) = 0 \\ \Rightarrow& x = \frac{-(2k+2)
\pm \sqrt{(2k+2)^2-4k(k+1-2n)}}{2k} \\ \Rightarrow& x = \frac{-(2k+2) \pm
\sqrt{4(k+1)^2-4k(k+1-2n)}}{2k} \\ \Rightarrow& x = \frac{-2(k+1) \pm
2\sqrt{(k+1)^2-k(k+1-2n)}}{2k} \\ \Rightarrow& x = \frac{-(k+1) \pm
\sqrt{(k+1)^2-k(k+1-2n)}}{k} \\ \Rightarrow& x = \frac{-(k+1) \pm
\sqrt{k^2+2k+1-k^2-k+2kn}}{k} \\ \Rightarrow& x = \frac{-(k+1) \pm
\sqrt{2k+1-k+2kn}}{k} \\ \Rightarrow& x = \frac{-(k+1) \pm \sqrt{1+k+2kn}}{k} \\
\Rightarrow& x = -\left(1+\frac{1}{k}\right) \pm \frac{\sqrt{1+k+2kn}}{k}
\end{aligned}
$$

With $x$, $k$, and $n$ always positive, we can write,

$$x = \frac{\sqrt{1+k(1+2n)}}{k} - \left(1+\frac{1}{k}\right)$$

Since, $x$ is a positive integer,
$min(m) = min{}\left(\left\{m(\lfloor x \rfloor), m(\lceil x \rceil)\right\}\right)$

$$\therefore A = \frac{D}{min(m)}+\frac{kg}{n}$$

### Javascript code for calculating `m_min`

```javascript
const calculate_x = function (k, n) {
  var x = Math.sqrt(1 + k * (1 + 2 * n)) / k - (1 + 1 / k);
  return x;
};

const calculate_m = function (k, n, x) {
  var m = (n + (k * x * (x + 1)) / 2) / (1 + k * (x + 1));
  return m;
};

const calculate_min_m = function (k, n) {
  var x = calculate_x(k, n);
  var x_floor = Math.floor(x);
  var x_ceil = Math.ceil(x);

  m_x_floor = calculate_m(k, n, x_floor);
  m_x_ceil = calculate_m(k, n, x_ceil);

  var m_min = m_x_floor < m_x_ceil ? m_x_floor : m_x_ceil;

  return m_min;
};
```

## Installment size calculation for reducing method

$$A = D \times \frac{k}{1-\left(1+k\right)^{-n}}+\frac{kg}{n}$$

## Installment size calculation for flat method

$$A = D \times \left(k + \frac{1}{n}\right)+\frac{kg}{n}$$
