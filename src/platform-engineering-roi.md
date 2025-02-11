---
theme: dashboard
title: Platform Engineering ROI Calculator
toc: false
---

# Platform Engineering ROI Calculator 📈

```js
// Import necessary components and runtime
import { Runtime, Inspector } from "@observablehq/runtime";
import define from "./components/platform-roi.js";

const runtime = new Runtime();
const main = runtime.module(define, Inspector.into(document.body));
```

<!-- Load initial cost data -->
```js
const defaultCosts = {
  infrastructure: {
    underutilizedCompute: 30000,
    overProvisionedStorage: 10000,
    redundantK8sClusters: 20000,
    networkingWaste: 5000
  },
  engineering: {
    wastedEngineeringHours: 160000,
    contextSwitchingCosts: 250000,
    legacySystemEngineers: 45000,
    securityPatches: 20000
  },
  platform: {
    platformEngineers: 75000,
    sreSalaries: 28333,
    dedicatedK8sClusters: 15000,
    toolingCosts: 38000
  }
};
```


<!-- Cost Input Cards -->
<div class="grid grid-cols-3">
  <div class="card">
    <h2>Infrastructure Inefficiencies 🏗️</h2>
    ${Inputs.form([
      Inputs.range([10000, 50000], {label: "Underutilized Compute", value: 30000}),
      Inputs.range([5000, 20000], {label: "Over-Provisioned Storage", value: 10000}),
      Inputs.range([10000, 40000], {label: "Redundant K8s Clusters", value: 20000}),
      Inputs.range([1000, 10000], {label: "Networking & Bandwidth Waste", value: 5000})
    ])}
  </div>
  <div class="card">
    <h2>Engineering Inefficiencies 👩‍💻</h2>
    ${Inputs.form([
      Inputs.range([50000, 250000], {label: "Wasted Engineering Hours", value: 160000}),
      Inputs.range([100000, 400000], {label: "Context Switching Costs", value: 250000}),
      Inputs.range([30000, 60000], {label: "Legacy System Engineers", value: 45000}),
      Inputs.range([5000, 50000], {label: "Security Patches & Compliance", value: 20000})
    ])}
  </div>
  <div class="card">
    <h2>Platform Costs 💰</h2>
    ${Inputs.form([
      Inputs.range([50000, 150000], {label: "Platform Engineers", value: 75000}),
      Inputs.range([10000, 50000], {label: "SRE Salaries", value: 28333}),
      Inputs.range([5000, 30000], {label: "Dedicated K8s Clusters", value: 15000}),
      Inputs.range([1000, 10000], {label: "Service Mesh Overhead", value: 5000}),
      Inputs.range([5000, 20000], {label: "CI/CD Pipeline Infra", value: 10000})
    ])}
  </div>
</div>

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Operational Costs 🛠️</h2>
    ${Inputs.form([
      Inputs.range([2000, 20000], {label: "Incident Response", value: 8000}),
      Inputs.range([5000, 30000], {label: "Refactoring & Improvements", value: 12000}),
      Inputs.range([5000, 50000], {label: "Observability Tools", value: 25000}),
      Inputs.range([1000, 20000], {label: "CI/CD SaaS Tools", value: 8000}),
      Inputs.range([1000, 10000], {label: "Developer Portals & Docs", value: 5000})
    ])}
  </div>
  <div class="card">
    <h2>Optimization Benefits 📈</h2>
    ${Inputs.form([
      Inputs.range([5000, 50000], {label: "Compute Optimization", value: 20000}),
      Inputs.range([5000, 30000], {label: "Networking Optimization", value: 10000}),
      Inputs.range([2000, 20000], {label: "Onboarding Time Reduction", value: 8000}),
      Inputs.range([20000, 150000], {label: "Debug Time Reduction", value: 80000}),
      Inputs.range([5000, 50000], {label: "On-Call Burnout Reduction", value: 20000})
    ])}
  </div>
  <div class="card">
    <h2>Business Impact 💼</h2>
    ${Inputs.form([
      Inputs.range([50000, 300000], {label: "Deploy Frequency Value", value: 200000}),
      Inputs.range([10000, 100000], {label: "Cycle Time Improvement", value: 50000}),
      Inputs.range([100000, 500000], {label: "MTTR Improvement", value: 250000}),
      Inputs.range([20000, 200000], {label: "Failed Deploy Reduction", value: 100000}),
      Inputs.range([50000, 250000], {label: "Developer Time Savings", value: 160000}),
      Inputs.range([1000, 30000], {label: "Support Ticket Reduction", value: 10000})
    ])}
  </div>
</div>

<!-- ROI Calculation -->
```js
function calculateROI(costs, months) {
  return Array.from({ length: months }, (_, month) => {
    // Platform Costs
    const platformCosts = Object.values(costs.platform).reduce((a, b) => a + b, 0);
    const operationalCosts = Object.values(costs.operational).reduce((a, b) => a + b, 0);
    const totalCost = platformCosts + operationalCosts;
    
    // Benefits & Savings
    const optimizationSavings = Object.values(costs.optimization).reduce((a, b) => a + b, 0);
    const businessImpact = Object.values(costs.business).reduce((a, b) => a + b, 0);
    const inefficienciesReduced = Object.values(costs.infrastructure).reduce((a, b) => a + b, 0) +
                                 Object.values(costs.engineering).reduce((a, b) => a + b, 0);
    
    // Apply monthly improvement factor
    const monthlyGrowthRate = 0.05; // 5% monthly improvement
    const totalSavings = (optimizationSavings + businessImpact + inefficienciesReduced) * 
                        (1 + month * monthlyGrowthRate);
    
    return {
      month: month + 1,
      cost: totalCost,
      savings: totalSavings,
      roi: ((totalSavings - totalCost) / totalCost) * 100
    };
  });
}
```

<!-- ROI Visualization -->
```js
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => {
      const data = calculateROI(defaultCosts, 24);
      return roiChart(data, {width});
    })}
  </div>
</div>
```

```js
function calculateBreakEven(costs) {
  const monthlyInvestment = costs.platform.platformEngineers + 
                           costs.platform.sreSalaries + 
                           costs.platform.dedicatedK8sClusters;
  
  const monthlySavings = costs.infrastructure.underutilizedCompute + 
                        costs.infrastructure.overProvisionedStorage +
                        costs.engineering.wastedEngineeringHours;
  
  return Math.ceil(monthlyInvestment / monthlySavings * 12);
}
```

```js
function launchTimeline(data, {width} = {}) {
  return Plot.plot({
    title: "Launches over the years",
    width,
    height: 300,
    y: {grid: true, label: "Launches"},
    color: {...color, legend: true},
    marks: [
      Plot.rectY(data, Plot.binX({y: "count"}, {x: "date", fill: "state", interval: "year", tip: true})),
      Plot.ruleY([0])
    ]
  });
}
```


<!-- Key Metrics Cards -->
<div class="grid grid-cols-4">
  <div class="card">
    <h2>Monthly Investment</h2>
    <span class="big">$${(defaultCosts.platform.platformEngineers + 
                         defaultCosts.platform.sreSalaries).toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>Monthly Savings</h2>
    <span class="big">$${(defaultCosts.infrastructure.underutilizedCompute + 
                         defaultCosts.engineering.wastedEngineeringHours).toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>Break-even (months)</h2>
    <span class="big">${calculateBreakEven(defaultCosts)}</span>
  </div>
  <div class="card">
    <h2>1-Year ROI</h2>
    <span class="big">${calculateROI(defaultCosts, 12)[11].roi.toFixed(1)}%</span>
  </div>
</div>

<!-- After your input sliders and before the metrics -->

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => main.value("chart"))}
  </div>
</div>

<style>
.big {
  font-size: 2em;
  font-weight: bold;
  color: var(--theme-foreground-focus);
}

.card h2 {
  margin-top: 0;
  font-size: 1.1em;
  font-weight: 600;
  color: var(--theme-foreground-muted);
}
</style> 