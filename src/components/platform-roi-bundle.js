import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// Export a function to initialize the ROI calculator
export function initROICalculator() {
  const inputsContainer = document.getElementById("inputs-container");
  const chartContainer = document.getElementById("chart-container");
  const metricsContainer = document.getElementById("metrics-container");

  // Initial state - only define each category once
  const state = {
    infrastructure: {
      underutilizedCompute: 45000,
      overProvisionedStorage: 10000,
      redundantK8sClusters: 20000,
      networkingWaste: 5000
    },
    engineering: {
      wastedEngineeringHours: 240000,
      contextSwitchingCosts: 250000,
      legacySystemEngineers: 45000,
      securityPatches: 20000
    },
    platform: {
      platformEngineers: 75000,
      sreSalaries: 28333,
      dedicatedK8sClusters: 15000,
      toolingCosts: 38000
    },
    operational: {
      incidentResponse: 8000,
      refactoring: 12000,
      observabilityTools: 25000,
      cicdTools: 8000,
      devPortals: 5000
    }
  };

  // Clear existing content
  inputsContainer.innerHTML = '';
  
  // Create input sliders
  createInputSliders(inputsContainer, state);
  
  // Create initial chart
  updateChart(chartContainer, state);
  
  // Update metrics
  updateMetrics(metricsContainer, state);
}

function createInputSliders(container, state) {
  // Helper function to get slider color based on position
  const getSliderColor = (currentValue, minValue, maxValue) => {
    // Calculate position percentage (0 to 1)
    const range = maxValue - minValue;
    const midPoint = minValue + (range / 2);
    const position = (currentValue - midPoint) / (range / 2); // -1 to 1

    if (position < 0) {
      // Left side - green to white
      const intensity = Math.abs(position); // 0 to 1
      return `rgb(${Math.round(255 * (1 - intensity))}, 255, ${Math.round(255 * (1 - intensity))})`;
    } else {
      // Right side - white to red
      const intensity = position; // 0 to 1
      return `rgb(255, ${Math.round(255 * (1 - intensity))}, ${Math.round(255 * (1 - intensity))})`;
    }
  };
  
  // Create sliders for each category
  Object.entries(state).forEach(([category, values]) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `<h3 class="text-lg font-bold mb-2">${category}</h3>`;
    
    Object.entries(values).forEach(([key, value]) => {
      const sliderContainer = document.createElement("div");
      sliderContainer.className = "mb-4";
      
      const label = document.createElement("label");
      label.className = "block text-sm mb-1";
      label.textContent = key.replace(/([A-Z])/g, ' $1').trim();
      
      const slider = document.createElement("input");
      slider.type = "range";
      const minValue = value * 0.5;
      const maxValue = value * 1.5;
      slider.min = minValue;
      slider.max = maxValue;
      slider.value = value;
      slider.className = "w-full";
      
      // Add initial color styling
      slider.style.accentColor = getSliderColor(value, minValue, maxValue);
      
      const valueDisplay = document.createElement("span");
      valueDisplay.className = "text-sm text-gray-600";
      valueDisplay.textContent = `$${value.toLocaleString()}`;
      
      slider.addEventListener("input", (e) => {
        const newValue = Number(e.target.value);
        state[category][key] = newValue;
        valueDisplay.textContent = `$${newValue.toLocaleString()}`;
        
        // Update slider color based on current value
        slider.style.accentColor = getSliderColor(newValue, minValue, maxValue);
        
        updateChart(document.getElementById("chart-container"), state);
        updateMetrics(document.getElementById("metrics-container"), state);
      });
      
      sliderContainer.appendChild(label);
      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(valueDisplay);
      categoryDiv.appendChild(sliderContainer);
    });
    
    container.appendChild(categoryDiv);
  });
}

function updateChart(container, state) {
  // Calculate ROI data
  const months = 24; // 2 years projection
  const monthlyGrowthRate = 0.05; // 5% monthly growth in savings
  
  const roiData = Array.from({ length: months }, (_, month) => {
    const platformCosts = Object.values(state.platform).reduce((a, b) => a + b, 0);
    const operationalCosts = Object.values(state.operational).reduce((a, b) => a + b, 0);
    const totalCost = platformCosts + operationalCosts;
    
    const inefficiencies = Object.values(state.infrastructure).reduce((a, b) => a + b, 0) +
                          Object.values(state.engineering).reduce((a, b) => a + b, 0);
    const totalSavings = inefficiencies * (1 + month * monthlyGrowthRate);
    
    return {
      month: month + 1,
      cost: totalCost,
      savings: totalSavings,
      roi: ((totalSavings - totalCost) / totalCost) * 100
    };
  });

  // Create chart using Plot
  const chart = Plot.plot({
    width: container.clientWidth,
    height: 400,
    y: { label: "Amount ($)", grid: true },
    x: { label: "Months", grid: true },
    marks: [
      Plot.line(roiData, {
        x: "month",
        y: "cost",
        stroke: "red",
        strokeWidth: 2,
        label: "Platform Cost"
      }),
      Plot.line(roiData, {
        x: "month",
        y: "savings",
        stroke: "green",
        strokeWidth: 2,
        label: "Projected Savings"
      }),
      Plot.ruleY([0])
    ],
    color: {
      legend: true
    }
  });
  
  container.innerHTML = "";
  container.appendChild(chart);
}

function updateMetrics(container, state) {
  const platformCosts = Object.values(state.platform).reduce((a, b) => a + b, 0);
  const operationalCosts = Object.values(state.operational).reduce((a, b) => a + b, 0);
  const totalCost = platformCosts + operationalCosts;
  
  const inefficiencies = Object.values(state.infrastructure).reduce((a, b) => a + b, 0) +
                        Object.values(state.engineering).reduce((a, b) => a + b, 0);
  
  const monthlySavings = inefficiencies;
  const yearlyROI = ((monthlySavings * 12 - totalCost) / totalCost) * 100;
  const breakEvenMonths = Math.ceil(totalCost / monthlySavings);
  
  const metrics = [
    { label: "Monthly Investment", value: `$${totalCost.toLocaleString()}` },
    { label: "Monthly Savings", value: `$${monthlySavings.toLocaleString()}` },
    { label: "Year 1 ROI", value: `${yearlyROI.toFixed(1)}%` },
    { label: "Break-even", value: `${breakEvenMonths} months` }
  ];
  
  container.innerHTML = metrics.map(metric => `
    <div class="p-2 bg-white rounded-lg shadow">
      <h3 class="text-xs text-gray-600 mb-1">${metric.label}</h3>
      <div class="text-lg font-bold">${metric.value}</div>
    </div>
  `).join("");
} 