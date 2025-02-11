---
theme: dashboard
title: Platform Engineering ROI Calculator
toc: false
---

# Platform Engineering ROI Calculator 📈

```js
import { initROICalculator } from "./components/platform-roi-bundle.js";
initROICalculator();
```















<div class="grid grid-cols-1">

 <!-- Metrics Section -->
  <div class="card">
    <h2>Key Metrics</h2>
    <div id="metrics-container"></div>
  </div>
</div>

  <!-- Chart Section -->
  <div class="card">
    <h2>ROI Projection</h2>
    <div id="chart-container"></div>
  </div>
 
  <!-- Inputs Section -->
  <div class="card">
    <h2>Cost & Savings Parameters</h2>
    <div id="inputs-container"></div>
  </div>























<style>
.card {
  padding: 1rem;
  margin-bottom: 1rem;
  background: var(--theme-background-secondary);
  border-radius: 0.5rem;
}

#inputs-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

#chart-container {
  min-height: 400px;
}

#metrics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 1rem;
  min-height: 50px;
}
#metrics-container > div {
  padding: 1.5rem !important; /* Reduce padding */
}
</style> 