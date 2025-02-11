export default function define(runtime, observer) {
  const main = runtime.module();

  // Define initial state
  main.variable(observer("state")).define("state", [], () => ({
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
    },
    operational: {
      incidentResponse: 8000,
      refactoring: 12000,
      observabilityTools: 25000,
      cicdTools: 8000,
      devPortals: 5000
    },
    optimization: {
      computeOpt: 20000,
      networkingOpt: 10000,
      onboarding: 8000,
      debugging: 80000,
      onCallReduction: 20000
    },
    business: {
      deployFrequency: 200000,
      cycleTime: 50000,
      mttr: 250000,
      failedDeploys: 100000,
      devTimeSavings: 160000,
      supportTickets: 10000
    }
  }));

  // Update the input form definition to properly track changes
  main.variable(observer("viewof inputs")).define("viewof inputs", ["Inputs", "state"], (Inputs, state) => {
    return Inputs.form({
      infrastructure: {
        underutilizedCompute: Inputs.range([10000, 50000], {label: "Underutilized Compute", value: state.infrastructure.underutilizedCompute}),
        overProvisionedStorage: Inputs.range([5000, 20000], {label: "Over-Provisioned Storage", value: state.infrastructure.overProvisionedStorage}),
        redundantK8sClusters: Inputs.range([10000, 40000], {label: "Redundant K8s Clusters", value: state.infrastructure.redundantK8sClusters}),
        networkingWaste: Inputs.range([1000, 10000], {label: "Networking Waste", value: state.infrastructure.networkingWaste})
      },
      engineering: {
        wastedEngineeringHours: Inputs.range([50000, 250000], {label: "Wasted Engineering Hours", value: state.engineering.wastedEngineeringHours}),
        contextSwitchingCosts: Inputs.range([100000, 400000], {label: "Context Switching Costs", value: state.engineering.contextSwitchingCosts}),
        legacySystemEngineers: Inputs.range([30000, 60000], {label: "Legacy System Engineers", value: state.engineering.legacySystemEngineers}),
        securityPatches: Inputs.range([5000, 50000], {label: "Security Patches & Compliance", value: state.engineering.securityPatches})
      },
      platform: {
        platformEngineers: Inputs.range([50000, 150000], {label: "Platform Engineers", value: state.platform.platformEngineers}),
        sreSalaries: Inputs.range([10000, 50000], {label: "SRE Salaries", value: state.platform.sreSalaries}),
        dedicatedK8sClusters: Inputs.range([5000, 30000], {label: "Dedicated K8s Clusters", value: state.platform.dedicatedK8sClusters}),
        toolingCosts: Inputs.range([5000, 50000], {label: "Tooling Costs", value: state.platform.toolingCosts})
      }
    });
  });

  // Create derived value from inputs
  main.variable(observer("inputs")).define("inputs", ["viewof inputs"], inputs => inputs);

  // Update ROI calculation to handle null values
  main.variable(observer("calculateROI")).define("calculateROI", [], function() {
    return function calculateROI(state, months = 12) {
      if (!state) return Array(months).fill({ month: 0, cost: 0, savings: 0, roi: 0 });
      
      return Array.from({ length: months }, (_, month) => {
        try {
          const platformCosts = Object.values(state.platform || {}).reduce((a, b) => a + b, 0);
          const operationalCosts = Object.values(state.operational || {}).reduce((a, b) => a + b, 0);
          const totalCost = platformCosts + operationalCosts;
          
          const optimizationSavings = Object.values(state.optimization || {}).reduce((a, b) => a + b, 0);
          const businessImpact = Object.values(state.business || {}).reduce((a, b) => a + b, 0);
          const inefficienciesReduced = Object.values(state.infrastructure || {}).reduce((a, b) => a + b, 0) +
                                      Object.values(state.engineering || {}).reduce((a, b) => a + b, 0);
          
          const monthlyGrowthRate = 0.05;
          const totalSavings = (optimizationSavings + businessImpact + inefficienciesReduced) * 
                             (1 + month * monthlyGrowthRate);
          
          return {
            month: month + 1,
            cost: totalCost || 0,
            savings: totalSavings || 0,
            roi: totalCost ? ((totalSavings - totalCost) / totalCost) * 100 : 0
          };
        } catch (e) {
          console.error('Error calculating ROI:', e);
          return { month: month + 1, cost: 0, savings: 0, roi: 0 };
        }
      });
    };
  });

  // Update metrics calculations
  main.variable(observer("metrics")).define("metrics", ["inputs", "calculateROI"], (inputs, calculateROI) => {
    const monthlyInvestment = Object.values(inputs?.platform || {}).reduce((a, b) => a + b, 0);
    const monthlySavings = Object.values(inputs?.optimization || {}).reduce((a, b) => a + b, 0) +
                          Object.values(inputs?.business || {}).reduce((a, b) => a + b, 0);
    const roiData = calculateROI(inputs, 12);
    const yearROI = roiData[11]?.roi || 0;
    const breakEven = Math.ceil(monthlyInvestment / (monthlySavings || 1));

    return {
      monthlyInvestment,
      monthlySavings,
      breakEven,
      yearROI
    };
  });

  // Define chart (keep existing roiChart code)
  main.variable(observer("chart")).define("chart", ["Plot", "inputs", "calculateROI"], 
    (Plot, inputs, calculateROI) => {
      const data = calculateROI(inputs, 24);
      return roiChart(data, {width: 800});
    }
  );

  // Define the ROI chart visualization
  main.variable(observer("roiChart")).define("roiChart", ["Plot"], function(Plot) {
    return function(data, {width} = {}) {
      // Find the break-even point
      const breakEvenMonth = data.findIndex(d => d.savings >= d.cost);
      
      return Plot.plot({
        width,
        height: 500,
        marginLeft: 60,
        marginRight: 60,
        title: "Platform Engineering ROI Over Time",
        x: {
          label: "Months",
          grid: true,
          tickFormat: d => `Month ${d}`
        },
        y: {
          label: "Amount ($)",
          grid: true,
          tickFormat: d => `$${d.toLocaleString()}`
        },
        marks: [
          // Investment period shading
          Plot.rect([{
            x1: 0, 
            x2: breakEvenMonth,
            y1: 0,
            y2: Math.max(...data.map(d => Math.max(d.cost, d.savings)))
          }], {
            fill: "#ff000015",
            title: "Investment Period"
          }),
          
          // ROI period shading
          Plot.rect([{
            x1: breakEvenMonth,
            x2: data.length,
            y1: 0,
            y2: Math.max(...data.map(d => Math.max(d.cost, d.savings)))
          }], {
            fill: "#00ff0015",
            title: "ROI Period"
          }),
          
          // Cost line
          Plot.line(data, {
            x: "month",
            y: "cost",
            stroke: "red",
            strokeWidth: 3,
            label: "Platform Cost"
          }),
          
          // Savings line
          Plot.line(data, {
            x: "month",
            y: "savings",
            stroke: "green",
            strokeWidth: 3,
            label: "Projected Savings"
          }),
          
          // Break-even point marker
          Plot.dot([data[breakEvenMonth]], {
            x: "month",
            y: "savings",
            fill: "blue",
            r: 8,
            title: d => `Break-even at Month ${d.month}`
          }),
          
          // Legend
          Plot.ruleY([0])
        ],
        color: {
          legend: true,
          scheme: "spectral"
        }
      });
    };
  });

  // Add a helper to calculate break-even point
  main.variable(observer("calculateBreakEven")).define("calculateBreakEven", [], function() {
    return function(costs) {
      const monthlyInvestment = Object.values(costs.platform).reduce((a, b) => a + b, 0);
      const monthlySavings = Object.values(costs.optimization).reduce((a, b) => a + b, 0) +
                            Object.values(costs.business).reduce((a, b) => a + b, 0);
      return Math.ceil(monthlyInvestment / monthlySavings * 12);
    };
  });

  return main;
} 