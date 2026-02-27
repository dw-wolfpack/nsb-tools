/**
 * NSB Tools - Glossary (single source of truth for tooltips and glossary page)
 */
(function () {
  "use strict";

  window.NSB_GLOSSARY = {
    terms: [
      { key: "cac", term: "CAC", aka: ["Customer acquisition cost"], short: "What you spend to get one new customer.", long: "CAC is the total cost to acquire one customer. That can include ads, tools, contractors, and your own time. If you pay $500 to get one customer, your CAC is $500.", example: "Example: Spend $1,000 on ads and get 2 customers. CAC = $500.", usedIn: ["/tools/saas-roi-deal-analyzer/"] },
      { key: "ltv", term: "LTV", aka: ["Lifetime value"], short: "How much gross profit one customer generates before they churn.", long: "LTV is the total value you get from a customer over their lifetime. Good versions of LTV use gross profit, not revenue, because costs matter. If a customer pays $50/month and stays 20 months, that is $1,000 revenue. With 80% gross margin, that is $800 gross profit LTV.", example: "Example: $50/mo x 20 months x 80% margin = $800 LTV.", usedIn: ["/tools/saas-roi-deal-analyzer/"] },
      { key: "arpa", term: "ARPA", aka: ["ARPU", "Average revenue per account", "Average revenue per user"], short: "Average monthly revenue per customer.", long: "ARPA is the average amount one customer pays you per month. If you have tiers, ARPA is the blended average across customers.", example: "Example: 10 customers at $30 and 10 at $70. ARPA = $50.", usedIn: ["/tools/saas-roi-deal-analyzer/", "/tools/break-even-calculator/"] },
      { key: "gross-margin", term: "Gross margin", aka: ["Gross profit margin"], short: "What percentage of revenue you keep after direct costs.", long: "Gross margin is revenue minus direct costs, divided by revenue. For software, direct costs might be hosting and support. For ecommerce, it includes product costs and shipping. Higher margin means each customer is worth more.", example: "Example: $100 revenue, $20 direct cost. Gross margin = 80%.", usedIn: ["/tools/saas-roi-deal-analyzer/", "/tools/break-even-calculator/"] },
      { key: "churn", term: "Churn", aka: ["Monthly churn"], short: "The percent of customers who cancel each month.", long: "Churn is how fast customers leave. A 5% monthly churn means you lose about 5 out of every 100 customers per month. Lower churn usually beats almost everything else because it lifts lifetime and LTV.", example: "Example: 100 customers and 5 cancel this month. Churn = 5%.", usedIn: ["/tools/saas-roi-deal-analyzer/"] },
      { key: "payback", term: "CAC payback period", aka: ["Payback period"], short: "How long it takes to earn back your CAC.", long: "CAC payback is how many months it takes for gross profit from a customer to cover what you spent to acquire them. Shorter payback is safer and easier to scale.", example: "Example: CAC $500, gross profit $40/mo. Payback = 12.5 months.", usedIn: ["/tools/saas-roi-deal-analyzer/"] },
      { key: "roi", term: "ROI", aka: ["Return on investment"], short: "How much you get back compared to what you put in.", long: "ROI compares the gain to the cost. If you spend $500 to get $800 of gross profit back, the gain is $300 and ROI is 60%.", example: "Example: (LTV - CAC) / CAC = ($800 - $500)/$500 = 60%.", usedIn: ["/tools/saas-roi-deal-analyzer/"] },
      { key: "utilization", term: "Utilization rate", aka: ["Billable utilization"], short: "The percent of your working time you can actually bill.", long: "As a freelancer, you do sales, admin, context switching, and delivery. Utilization is the slice that is billable. 70% is often optimistic. If you assume 100%, your rate will be too low.", example: "Example: 30 hours/week working, 20 billable. Utilization = 67%.", usedIn: ["/tools/freelance-rate-calculator/", "/tools/salary-vs-freelance-comparator/"] },
      { key: "buffer", term: "Buffer", aka: ["Risk buffer", "Contingency"], short: "Extra padding for reality: scope creep, delays, and unknowns.", long: "A buffer is a percentage you add to protect the quote. If you quote exactly the estimate, you lose money the first time anything changes. A buffer is not greed. It is insurance.", example: "Example: 40 hours estimate with 20% buffer = 48 hours billed.", usedIn: ["/tools/freelance-rate-calculator/", "/tools/project-pricing-calculator/"] },
      { key: "fixed-costs", term: "Fixed costs", aka: ["Overhead"], short: "Costs that stay the same even if you sell nothing.", long: "Fixed costs are recurring costs like rent, software subscriptions, payroll, or minimum hosting. They do not scale directly with units sold.", example: "Example: Rent $2,000/mo is fixed even if sales are $0.", usedIn: ["/tools/break-even-calculator/", "/tools/burn-rate-runway-calculator/"] },
      { key: "variable-cost", term: "Variable cost", aka: ["Cost per unit"], short: "The cost that happens each time you sell one unit.", long: "Variable cost grows with volume. For ecommerce it includes product cost and shipping. For services it might be contractor hours per project.", example: "Example: If each unit costs $20 to make, variable cost = $20.", usedIn: ["/tools/break-even-calculator/"] },
      { key: "contribution-margin", term: "Contribution margin", aka: [], short: "How much each sale contributes toward fixed costs and profit.", long: "Contribution margin is price minus variable cost. It is the cash each unit produces to cover fixed costs. If your price is $30 and variable cost is $20, contribution margin is $10 per unit.", example: "Example: Price $30 minus variable $20 = $10 contribution.", usedIn: ["/tools/break-even-calculator/"] },
      { key: "break-even", term: "Break-even point", aka: [], short: "The point where profit is zero because revenue covers costs.", long: "Break-even is where you have covered fixed costs. Past that point, each additional sale is profit (after variable costs).", example: "Example: Fixed costs $2,000 and contribution $10. Break-even = 200 units.", usedIn: ["/tools/break-even-calculator/"] },
      { key: "burn-rate", term: "Burn rate", aka: [], short: "How much cash you lose per month.", long: "Burn rate is expenses minus revenue. If you spend $30k and make $20k, you burn $10k per month. The goal is to reduce burn or grow revenue to extend runway.", example: "Example: Expenses $30k, revenue $20k. Net burn = $10k.", usedIn: ["/tools/burn-rate-runway-calculator/"] },
      { key: "runway", term: "Runway", aka: [], short: "How many months you can survive before cash hits zero.", long: "Runway is cash on hand divided by net burn. It is the clock on your decisions. Short runway forces urgency. Long runway buys flexibility.", example: "Example: $120k cash and $10k burn. Runway = 12 months.", usedIn: ["/tools/burn-rate-runway-calculator/"] },
      { key: "principal", term: "Principal", aka: [], short: "The amount you borrowed (or still owe), not counting interest.", long: "Principal is the base loan balance. Payments typically cover interest first, then reduce principal. Extra payments usually reduce principal directly.", example: "Example: Borrow $320k. Principal starts at $320k.", usedIn: ["/tools/loan-debt-payoff-calculator/"] },
      { key: "interest-rate", term: "Interest rate", aka: ["APR"], short: "The cost of borrowing money, expressed as a percent.", long: "Interest rate tells you how much you pay per year to borrow. Many loans compound monthly, so the monthly rate is annual rate divided by 12.", example: "Example: 6.9% APR is about 0.575% per month.", usedIn: ["/tools/loan-debt-payoff-calculator/"] },
      { key: "amortization", term: "Amortization", aka: ["Amortization schedule"], short: "A table showing each payment, interest, and remaining balance over time.", long: "Amortization breaks a loan into monthly steps. Early payments are mostly interest. Later payments are mostly principal. This is why extra payments early matter a lot.", example: "Example: Month 1 interest is higher because balance is highest.", usedIn: ["/tools/loan-debt-payoff-calculator/"] },
      { key: "benefits-load", term: "Benefits load", aka: ["Benefits percent"], short: "The extra cost on top of salary for benefits.", long: "Benefits load includes health insurance, retirement match, payroll tools, and other perks. It is a percentage added to salary to estimate true cost.", example: "Example: $100k salary with 20% benefits load costs about $120k.", usedIn: ["/tools/employee-vs-contractor-calculator/"] },
      { key: "payroll-tax", term: "Payroll tax", aka: [], short: "Taxes an employer pays on wages.", long: "Payroll taxes are additional costs on top of salary. They vary by location and situation. This tool uses a rough percentage so you can compare employee vs contractor.", example: "Example: 8% payroll tax on $100k is $8k.", usedIn: ["/tools/employee-vs-contractor-calculator/"] },
      { key: "overhead", term: "Overhead", aka: [], short: "Extra costs to support work that are not salary.", long: "Overhead includes software, equipment, desk space, management time, and anything else required to support the role. Even remote roles have overhead.", example: "Example: Laptop, tools, and licenses can be 5% to 15% overhead.", usedIn: ["/tools/employee-vs-contractor-calculator/"] },
      { key: "deposit", term: "Deposit", aka: ["Upfront payment"], short: "Money paid upfront to start a project.", long: "A deposit protects your time and prevents clients from disappearing mid-scope. It also aligns incentives so work starts cleanly.", example: "Example: 40% deposit on a $5k project is $2k upfront.", usedIn: ["/tools/project-pricing-calculator/"] }
    ],

    get: function (key) {
      if (!key) return null;
      var k = String(key).toLowerCase().trim();
      for (var i = 0; i < this.terms.length; i++) {
        if (this.terms[i].key === k) return this.terms[i];
      }
      return null;
    },

    list: function () {
      return this.terms.slice();
    },

    slugToLabel: {
      "saas-roi-deal-analyzer": "SaaS ROI Deal Analyzer",
      "break-even-calculator": "Break-even Calculator",
      "burn-rate-runway-calculator": "Burn Rate / Runway Calculator",
      "loan-debt-payoff-calculator": "Loan / Debt Payoff Calculator",
      "employee-vs-contractor-calculator": "Employee vs Contractor Cost Calculator",
      "freelance-rate-calculator": "Freelance Rate Calculator",
      "project-pricing-calculator": "Project Pricing Calculator",
      "salary-vs-freelance-comparator": "Salary vs Freelance Comparator"
    },

    toolLabel: function (path) {
      if (!path) return path;
      var slug = path.replace(/^\/tools\//, "").replace(/\/$/, "").split("/")[0];
      return this.slugToLabel[slug] || slug;
    }
  };
})();
