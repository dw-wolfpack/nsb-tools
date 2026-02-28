/**
 * NSB Tools - AI Hub navigation map
 * Used by components/next-related.js to render "Next up" and "Related" blocks.
 */
(function () {
  "use strict";

  window.NSB_AI_NAV = {
    nextByPath: {
      "/ai/": {
        next: { title: "AI Playbooks", href: "/ai/playbooks/" },
        related: [
          { title: "AI Checklists", href: "/ai/checklists/" },
          { title: "AI Toolkit", href: "/ai/toolkit/" }
        ]
      },
      "/ai/playbooks/": {
        next: { title: "Job Search AI Workflow", href: "/ai/playbooks/job-search-ai-workflow/" },
        related: [
          { title: "AI Checklists", href: "/ai/checklists/" },
          { title: "Founder Ops Workflow", href: "/ai/playbooks/founder-ops-ai-workflow/" }
        ]
      },
      "/ai/checklists/": {
        next: { title: "AI Vendor Evaluation Scorecard", href: "/ai/checklists/vendor-eval-scorecard/" },
        related: [
          { title: "Resume ATS Checklist", href: "/ai/checklists/resume-ats-checklist/" },
          { title: "AI Playbooks", href: "/ai/playbooks/" }
        ]
      },
      "/ai/toolkit/": {
        next: { title: "AI Vendor Evaluation Scorecard", href: "/ai/checklists/vendor-eval-scorecard/" },
        related: [
          { title: "Founder Ops Workflow", href: "/ai/playbooks/founder-ops-ai-workflow/" },
          { title: "AI Playbooks", href: "/ai/playbooks/" }
        ]
      },
      "/ai/playbooks/job-search-ai-workflow/": {
        next: { title: "Founder Ops AI Workflow", href: "/ai/playbooks/founder-ops-ai-workflow/" },
        related: [
          { title: "Resume ATS Checklist", href: "/ai/checklists/resume-ats-checklist/" },
          { title: "AI Playbooks", href: "/ai/playbooks/" }
        ]
      },
      "/ai/playbooks/founder-ops-ai-workflow/": {
        next: { title: "Small Business AI Adoption", href: "/ai/playbooks/small-business-ai-adoption/" },
        related: [
          { title: "AI Vendor Evaluation Scorecard", href: "/ai/checklists/vendor-eval-scorecard/" },
          { title: "AI Playbooks", href: "/ai/playbooks/" }
        ]
      },
      "/ai/playbooks/rag-readiness-checklist/": {
        next: { title: "LLM Safety Review Checklist", href: "/ai/checklists/llm-safety-review/" },
        related: [
          { title: "AI Toolkit", href: "/ai/toolkit/" },
          { title: "AI Playbooks", href: "/ai/playbooks/" }
        ]
      },
      "/ai/playbooks/small-business-ai-adoption/": {
        next: { title: "AI Vendor Evaluation Scorecard", href: "/ai/checklists/vendor-eval-scorecard/" },
        related: [
          { title: "AI Meeting Notes Workflow", href: "/ai/checklists/ai-meeting-notes-workflow/" },
          { title: "AI Playbooks", href: "/ai/playbooks/" }
        ]
      },
      "/ai/checklists/vendor-eval-scorecard/": {
        next: { title: "LLM Safety Review Checklist", href: "/ai/checklists/llm-safety-review/" },
        related: [
          { title: "Founder Ops AI Workflow", href: "/ai/playbooks/founder-ops-ai-workflow/" },
          { title: "AI Checklists", href: "/ai/checklists/" }
        ]
      },
      "/ai/checklists/llm-safety-review/": {
        next: { title: "RAG Readiness Playbook", href: "/ai/playbooks/rag-readiness-checklist/" },
        related: [
          { title: "AI Toolkit", href: "/ai/toolkit/" },
          { title: "AI Checklists", href: "/ai/checklists/" }
        ]
      },
      "/ai/checklists/resume-ats-checklist/": {
        next: { title: "Job Search AI Workflow", href: "/ai/playbooks/job-search-ai-workflow/" },
        related: [
          { title: "Freelance Rate Calculator", href: "/tools/freelance-rate-calculator/" },
          { title: "AI Checklists", href: "/ai/checklists/" }
        ]
      },
      "/ai/checklists/ai-meeting-notes-workflow/": {
        next: { title: "Founder Ops AI Workflow", href: "/ai/playbooks/founder-ops-ai-workflow/" },
        related: [
          { title: "AI Toolkit", href: "/ai/toolkit/" },
          { title: "AI Checklists", href: "/ai/checklists/" }
        ]
      }
    }
  };
})();
