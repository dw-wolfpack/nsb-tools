/**
 * NSB Tools Registry - Single source of truth for tools and categories
 */

const TOOLS = [
  {
    slug: "username-generator",
    name: "Username Generator",
    category: "social",
    tags: ["social", "creator", "username", "profile"],
    description: "Generate platform-safe usernames based on niche, tone, keywords, name.",
    path: "/tools/username-generator/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Username Generator | NSB Tools",
    seoDescription: "Generate platform-safe usernames based on niche, tone, keywords, and name. Free tool for social profiles."
  },
  {
    slug: "hook-generator",
    name: "Hook Generator",
    category: "social",
    tags: ["social", "creator", "hooks", "short-form"],
    description: "Generate grouped short-form hooks (curiosity/contrarian/authority/story) by goal + tone.",
    path: "/tools/hook-generator/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Hook Generator | NSB Tools",
    seoDescription: "Generate short-form hooks in curiosity, contrarian, authority, and story styles. Free creator tool."
  },
  {
    slug: "short-script-writer",
    name: "Short-Form Script Writer",
    category: "social",
    tags: ["social", "creator", "script", "short-form", "video"],
    description: "Generate a timed short-form script with beats + shot list + caption.",
    path: "/tools/short-script-writer/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Short-Form Script Writer | NSB Tools",
    seoDescription: "Generate timed short-form scripts with beats, shot list, and caption. Free video content tool."
  },
  {
    slug: "hashtag-generator",
    name: "Hashtag Generator",
    category: "social",
    tags: ["social", "creator", "hashtags", "instagram", "tiktok"],
    description: "Generate hashtag sets (broad/niche/community) from niche + keywords + content type.",
    path: "/tools/hashtag-generator/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Hashtag Generator | NSB Tools",
    seoDescription: "Generate hashtag sets for broad, niche, and community reach. Free social media tool."
  },
  {
    slug: "caption-generator",
    name: "Caption Generator",
    category: "social",
    tags: ["social", "creator", "caption", "instagram", "engagement"],
    description: "Generate captions + ethical comment prompts based on platform + tone + CTA.",
    path: "/tools/caption-generator/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Caption Generator | NSB Tools",
    seoDescription: "Generate captions and ethical comment prompts for social posts. Free creator tool."
  },
  {
    slug: "content-ideas",
    name: "Content Ideas Generator",
    category: "social",
    tags: ["social", "creator", "ideas", "content"],
    description: "Generate content ideas with angles, hooks, and format suggestions.",
    path: "/tools/content-ideas/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Content Ideas Generator | NSB Tools",
    seoDescription: "Generate content ideas with angles, hooks, and format suggestions. Free creator tool."
  },
  {
    slug: "linkedin-post-builder",
    name: "LinkedIn Post Builder",
    category: "writing",
    tags: ["writing", "linkedin", "professional", "posts"],
    description: "Generate short/medium/long LinkedIn posts + openers based on stance + tone.",
    path: "/tools/linkedin-post-builder/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "LinkedIn Post Builder | NSB Tools",
    seoDescription: "Generate LinkedIn posts (short, medium, long) with openers. Free professional writing tool."
  },
  {
    slug: "newsletter-outline",
    name: "Newsletter Outline Generator",
    category: "writing",
    tags: ["writing", "newsletter", "email", "outline"],
    description: "Generate a newsletter outline with sections, bullets, subject lines, CTAs.",
    path: "/tools/newsletter-outline/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Newsletter Outline Generator | NSB Tools",
    seoDescription: "Generate newsletter outlines with sections, subject lines, and CTAs. Free writing tool."
  },
  {
    slug: "title-headline-generator",
    name: "Title + Headline Generator",
    category: "writing",
    tags: ["writing", "headline", "title", "copy"],
    description: "Generate headline/title options grouped by style (how-to/list/contrarian/story).",
    path: "/tools/title-headline-generator/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Title + Headline Generator | NSB Tools",
    seoDescription: "Generate headlines grouped by style: how-to, list, contrarian, story. Free copywriting tool."
  },
  {
    slug: "resume-bullet-rewriter",
    name: "Resume Bullet Rewriter",
    category: "career",
    tags: ["career", "resume", "job", "bullet"],
    description: "Rewrite a resume bullet into stronger variants with metric placeholders.",
    path: "/tools/resume-bullet-rewriter/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Resume Bullet Rewriter | NSB Tools",
    seoDescription: "Rewrite resume bullets into stronger variants with metric placeholders. Free career tool."
  },
  {
    slug: "star-stories",
    name: "Interview Stories (STAR) Generator",
    category: "career",
    tags: ["career", "interview", "star", "stories"],
    description: "Turn notes into STAR story drafts (concise + detailed) with follow-up Qs.",
    path: "/tools/star-stories/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Interview Stories (STAR) Generator | NSB Tools",
    seoDescription: "Turn notes into STAR interview story drafts with follow-up questions. Free career tool."
  },
  {
    slug: "cold-outreach-email",
    name: "Cold Outreach Email Draft",
    category: "career",
    tags: ["career", "email", "outreach", "recruiter"],
    description: "Draft 2 outreach emails (punchy + formal-ish) for recruiter/hm/broker.",
    path: "/tools/cold-outreach-email/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Cold Outreach Email Draft | NSB Tools",
    seoDescription: "Draft punchy and formal cold outreach emails for recruiters and hiring managers. Free career tool."
  },
  {
    slug: "deal-teaser-analyzer",
    name: "Deal Teaser Analyzer",
    category: "business",
    tags: ["business", "deal", "teaser", "acquisitions"],
    description: "Parse pasted teaser text into key fields + red flags + diligence questions.",
    path: "/tools/deal-teaser-analyzer/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Deal Teaser Analyzer | NSB Tools",
    seoDescription: "Parse deal teaser text into key fields, red flags, and diligence questions. Free business tool."
  },
  {
    slug: "sba-payment-estimator",
    name: "Simple SBA Payment Estimator",
    category: "business",
    tags: ["business", "sba", "loan", "payment", "dscr"],
    description: "Estimate monthly P&I, basic DSCR placeholders, quick scenario toggles.",
    path: "/tools/sba-payment-estimator/",
    isPro: false,
    consumesCredit: false,
    seoTitle: "Simple SBA Payment Estimator | NSB Tools",
    seoDescription: "Estimate monthly SBA loan payments, DSCR, and run quick scenarios. Free business tool."
  },
  {
    slug: "loi-outline",
    name: "Offer / LOI Outline Generator",
    category: "business",
    tags: ["business", "loi", "offer", "acquisitions"],
    description: "Generate LOI outline bullets based on asset + price + financing structure.",
    path: "/tools/loi-outline/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Offer / LOI Outline Generator | NSB Tools",
    seoDescription: "Generate LOI outline bullets for asset, price, and financing structure. Free business tool."
  },
  {
    slug: "repurpose-pack",
    name: "Repurpose Pack Generator",
    category: "repurpose",
    tags: ["repurpose", "content", "hooks", "scripts"],
    description: "Convert a source text into hooks + scripts + captions + visual ideas (heuristics only).",
    path: "/tools/repurpose-pack/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Repurpose Pack Generator | NSB Tools",
    seoDescription: "Convert source text into hooks, scripts, captions, and visual ideas. Free content repurposing tool."
  },
  {
    slug: "content-calendar",
    name: "Content Calendar Generator",
    category: "repurpose",
    tags: ["repurpose", "content", "calendar", "planning"],
    description: "Generate a 1-week calendar table with post types/angles; export CSV.",
    path: "/tools/content-calendar/",
    isPro: false,
    consumesCredit: true,
    seoTitle: "Content Calendar Generator | NSB Tools",
    seoDescription: "Generate a 1-week content calendar with post types and angles. Export to CSV. Free tool."
  }
];

const CATEGORIES = [
  { slug: "social", name: "Social / Creator", description: "Tools for social media creators: usernames, hooks, scripts, hashtags, captions, and content ideas." },
  { slug: "writing", name: "Writing", description: "Professional writing tools: LinkedIn posts, newsletter outlines, headlines, and titles." },
  { slug: "career", name: "Career", description: "Career tools: resume bullets, STAR interview stories, and cold outreach emails." },
  { slug: "business", name: "Business / Finance", description: "Business tools: deal analyzers, SBA payment estimates, and LOI outlines." },
  { slug: "repurpose", name: "Repurpose", description: "Content repurposing tools: repurpose packs and content calendars." }
];

const FEATURED_TOOLS = ["username-generator", "hook-generator", "content-calendar", "resume-bullet-rewriter"];

const BASE_URL = "https://tools.nextstepsbeyond.online";
const OG_IMAGE = BASE_URL + "/assets/img/og-default.png";

/**
 * Per-tool page content: What it does, How to use, Examples, FAQ.
 * Used by tool-page-sections.js to render consistent scaffolding.
 */
const TOOL_PAGE_CONTENT = {
  "username-generator": {
    whatItDoes: "This tool generates platform-safe usernames (letters, numbers, underscores) from your niche, optional keywords, and name. Outputs are designed to work on Instagram, TikTok, Twitter, and similar platforms.",
    howToUse: ["Enter your niche (e.g. fitness, tech, cooking).", "Add keywords for more targeted results.", "Optionally add part of your name for a personal touch.", "Click Generate, then Regenerate for more options.", "Copy or save any username you like."],
    examples: ["Niche: fitness. Results: boldflow, swiftcraft42, thekeenpulse", "Niche: tech, keywords: dev. Results: lucidpath_dev, clearmind89"],
    faq: [
      { q: "Are these usernames available?", a: "We do not check availability. Always verify on the platform before committing." },
      { q: "Why only letters, numbers, underscores?", a: "Most platforms restrict usernames to these characters for consistency and compatibility." },
      { q: "Can I use my real name?", a: "Yes. Add it in the name field to blend it with the generated patterns." },
      { q: "How many can I generate at once?", a: "The default is 8; you can request 3 to 20 per run." }
    ],
    relatedSlugs: ["hook-generator", "hashtag-generator", "caption-generator", "content-ideas"]
  },
  "hook-generator": {
    whatItDoes: "Generates short-form video hooks grouped by style: curiosity, contrarian, authority, and story. Each type is designed to stop the scroll and draw viewers in.",
    howToUse: ["Enter your topic or niche.", "Choose which hook types you want (curiosity, contrarian, authority, story).", "Set how many per type.", "Click Generate, then Regenerate for more options.", "Copy and adapt for your script."],
    examples: ["Topic: productivity. Curiosity: Nobody talks about this. Contrarian: Stop doing productivity. Do this instead.", "Topic: morning routine. Authority: After 10 years in morning routines, here is what I learned."],
    faq: [
      { q: "Which platforms work best?", a: "TikTok, Reels, and Shorts all benefit from strong hooks in the first 3 seconds." },
      { q: "Can I mix types?", a: "Yes. Use one hook per video; vary types across your content." },
      { q: "What is a contrarian hook?", a: "A hook that challenges common beliefs to spark curiosity." },
      { q: "How many hooks per type?", a: "You can generate 1 to 6 per type per run." }
    ],
    relatedSlugs: ["username-generator", "short-script-writer", "caption-generator", "content-ideas"]
  },
  "short-script-writer": {
    whatItDoes: "Generates a 30-second short-form script with hook, problem, solution, CTA, shot list, and caption. Designed for Reels, TikToks, and Shorts.",
    howToUse: ["Enter your topic.", "Click Generate.", "Replace placeholders with your content.", "Use the shot list for filming.", "Copy the caption for your post."],
    examples: ["Topic: morning routine. Hook: Nobody talks about this. Problem: Why most people fail at morning routines.", "Topic: productivity. CTA: Follow for more. Shot list: Hook B-roll, talking head, demo."],
    faq: [
      { q: "What length is this for?", a: "Optimized for 15 to 60 second Reels, TikToks, and Shorts." },
      { q: "Can I edit the output?", a: "Yes. Use it as a draft and tweak for your voice." },
      { q: "What is the shot list?", a: "A simple list of visual shots to film for each beat." },
      { q: "Is the caption included?", a: "Yes. A short caption suggestion is included at the end." }
    ],
    relatedSlugs: ["hook-generator", "caption-generator", "content-ideas", "content-calendar"]
  },
  "hashtag-generator": {
    whatItDoes: "Generates hashtags in broad, niche, and community categories to balance reach and relevance. Use a mix of all three groups in your posts.",
    howToUse: ["Enter your niche.", "Add keywords (comma-separated) for better targeting.", "Set total hashtag count.", "Click Generate, then Regenerate for variety.", "Copy all or export to CSV."],
    examples: ["Niche: fitness. Broad: #explore #creator. Niche: #creatorlife #contenttips.", "Niche: tech, keywords: dev, code. Results include niche and community tags."],
    faq: [
      { q: "How many hashtags should I use?", a: "Instagram allows up to 30; 10 to 15 is often a good balance." },
      { q: "What is the difference between broad and niche?", a: "Broad tags have high volume; niche tags target your specific audience." },
      { q: "Can I export the hashtags?", a: "Yes. Use Export CSV to download by category." },
      { q: "Do these work for TikTok?", a: "Yes. Adapt as needed; TikTok tends to use fewer hashtags." }
    ],
    relatedSlugs: ["caption-generator", "content-ideas", "username-generator", "content-calendar"]
  },
  "caption-generator": {
    whatItDoes: "Generates caption drafts and ethical comment prompts to encourage genuine engagement. Prompts are designed to invite real replies, not generic reactions.",
    howToUse: ["Enter your topic.", "Select platform (Instagram, TikTok, LinkedIn).", "Click Generate.", "Copy the caption and comment prompt.", "Paste into your post and use the prompt to encourage replies."],
    examples: ["Topic: morning routine. Caption: Today's post is about morning routine matters more than you think. CTA: Drop a comment below.", "Topic: productivity. Comment prompt: What is your go-to tip?"],
    faq: [
      { q: "What are ethical comment prompts?", a: "Prompts that invite genuine, specific replies instead of generic emoji reactions." },
      { q: "Can I use these on any platform?", a: "Yes. Adapt tone and length per platform." },
      { q: "How do I improve engagement?", a: "Use the comment prompt in your caption or first comment to guide replies." },
      { q: "Are the CTAs customizable?", a: "Pro will unlock more CTA options; for now, edit the output as needed." }
    ],
    relatedSlugs: ["hashtag-generator", "hook-generator", "content-ideas", "short-script-writer"]
  },
  "content-ideas": {
    whatItDoes: "Generates content ideas with angle, hook, and format suggestions tailored to your niche. Each idea includes a suggested format (carousel, reel, thread, etc.).",
    howToUse: ["Enter your niche.", "Set number of ideas (3 to 12).", "Click Generate.", "Browse angles and formats.", "Copy or export to CSV."],
    examples: ["Niche: productivity. Myth busting. The one thing productivity. Carousel.", "Niche: fitness. Step-by-step. How I fitness. Reel."],
    faq: [
      { q: "What is an angle?", a: "The perspective or approach for the content (e.g. myth busting, step-by-step)." },
      { q: "Can I filter by format?", a: "Formats are suggested per idea; Pro may add format filters." },
      { q: "How do I use these ideas?", a: "Pick one, expand the hook, and create the content in your chosen format." },
      { q: "Are ideas unique each time?", a: "Yes. Regenerate for new combinations." }
    ],
    relatedSlugs: ["hook-generator", "content-calendar", "repurpose-pack", "caption-generator"]
  },
  "linkedin-post-builder": {
    whatItDoes: "Generates LinkedIn post drafts in short, medium, or long format with opener variants. Uses stance, topic, tone, stance style, and optional audience to create professional, scroll-stopping posts.",
    howToUse: ["Enter your stance or take.", "Enter the topic.", "Choose length (short, medium, long).", "Pick tone (clean, professional, edgy, funny) and stance style (agree or contrarian).", "Optionally add audience (e.g. engineering leaders, founders).", "Click Generate.", "Copy and edit for your voice."],
    examples: ["Stance: remote work boosts productivity. Tone: clean. Result: Quick thought opener, body, CTA.", "Stance: meetings drain focus. Stance style: contrarian. Result: Hot take or Unpopular opinion opener, punchy body.", "Audience: engineering leaders. Result: Topic tailored for that audience."],
    faq: [
      { q: "What length should I use?", a: "Short for quick takes; medium for thought leadership; long for deep dives." },
      { q: "Are the openers varied?", a: "Yes. Each generation uses different opener styles." },
      { q: "Can I use this for Twitter?", a: "Yes. Short format works well; adapt for character limits." },
      { q: "How do I make it sound like me?", a: "Edit the output. Replace placeholders with your examples and tone." }
    ],
    relatedSlugs: ["newsletter-outline", "title-headline-generator", "caption-generator"]
  },
  "newsletter-outline": {
    whatItDoes: "Generates newsletter outlines with section structure, subject line ideas, and CTA suggestions. Use as a starting point for your next issue.",
    howToUse: ["Enter your topic.", "Click Generate.", "Use the outline to structure your draft.", "Pick a subject line.", "Add your CTA."],
    examples: ["Topic: productivity tips. Outline: Lead, context, main points, story, CTA.", "Topic: weekly roundup. Subject: The one thing about weekly roundup."],
    faq: [
      { q: "How many sections are included?", a: "Typically 5: lead, context, main points, story/example, CTA." },
      { q: "Can I get multiple subject lines?", a: "Regenerate for more options." },
      { q: "What is a good CTA?", a: "The tool suggests CTAs like Reply with your take or Share with a friend." },
      { q: "Is this for email or blog?", a: "Designed for email newsletters; adapt for blogs as needed." }
    ],
    relatedSlugs: ["linkedin-post-builder", "content-calendar", "title-headline-generator"]
  },
  "title-headline-generator": {
    whatItDoes: "Generates headline options in how-to, list, contrarian, and story styles for blog posts, videos, and social content.",
    howToUse: ["Enter your topic.", "Choose styles (how-to, list, contrarian, story).", "Click Generate.", "Pick the best fit for your content."],
    examples: ["Topic: productivity. How-to: How to productivity in 5 steps. List: 5 Ways to productivity.", "Topic: morning routine. Contrarian: Stop morning routine. Start This."],
    faq: [
      { q: "Which style gets the most clicks?", a: "It depends on your audience. Test how-to and list for educational content." },
      { q: "Can I combine styles?", a: "Use one per piece; vary across your content." },
      { q: "What is a contrarian headline?", a: "One that challenges common beliefs to spark curiosity." },
      { q: "How many headlines per style?", a: "One per selected style per run; regenerate for more." }
    ],
    relatedSlugs: ["hook-generator", "linkedin-post-builder", "caption-generator"]
  },
  "resume-bullet-rewriter": {
    whatItDoes: "Rewrites resume bullets using stronger action verbs and metric placeholders. Replace placeholders with your real numbers before submitting.",
    howToUse: ["Paste your original bullet.", "Set number of variants (2 to 6).", "Click Generate.", "Pick the strongest version.", "Replace placeholders with your metrics."],
    examples: ["Original: Managed project timelines. Result: Led project timelines X% growth, resulting in outcome.", "Original: Coordinated with stakeholders. Result: Streamlined stakeholder coordination by X%."],
    faq: [
      { q: "What are metric placeholders?", a: "Placeholders like X% or X users that you replace with real numbers." },
      { q: "Which verbs are strongest?", a: "Led, Managed, Increased, Developed, Achieved, Streamlined, and similar." },
      { q: "How many variants should I request?", a: "3 to 5 gives you options without overwhelming." },
      { q: "Should I use these verbatim?", a: "No. Always add your real metrics and tailor to the role." }
    ],
    relatedSlugs: ["star-stories", "cold-outreach-email", "linkedin-post-builder"]
  },
  "star-stories": {
    whatItDoes: "Structures your notes into Situation, Task, Action, Result format for behavioral interviews. Includes follow-up questions to prepare for.",
    howToUse: ["Paste your notes (situation, task, action, result).", "Choose concise or detailed format.", "Click Generate.", "Expand each section with your specifics.", "Practice with the follow-up questions."],
    examples: ["Notes: Led project behind. Coordinated 3 teams. Delivered on time. Result: Full STAR structure with placeholders.", "Format: Detailed. Result: Expanded guidance for each section."],
    faq: [
      { q: "What is STAR?", a: "Situation, Task, Action, Result. A framework for answering behavioral interview questions." },
      { q: "Concise vs detailed?", a: "Concise is shorter; detailed includes expansion tips per section." },
      { q: "How long should my answer be?", a: "Aim for 2 to 3 minutes. Practice to stay within that." },
      { q: "What are follow-up questions?", a: "Common questions interviewers ask after your initial answer." }
    ],
    relatedSlugs: ["resume-bullet-rewriter", "cold-outreach-email", "linkedin-post-builder"]
  },
  "cold-outreach-email": {
    whatItDoes: "Generates two email variants: punchy (short, direct) and formal (traditional). Use the one that fits the recipient and context.",
    howToUse: ["Enter context (role, company, or opportunity).", "Click Generate.", "Choose punchy or formal.", "Edit with your specifics.", "Copy and send."],
    examples: ["Context: Product Manager role at Acme. Punchy: Quick note. Reaching out. Formal: I hope this email finds you well.", "Recipient: recruiter. Use punchy for speed; formal for senior contacts."],
    faq: [
      { q: "When to use punchy vs formal?", a: "Punchy for recruiters and time-pressed contacts; formal for senior leaders." },
      { q: "How do I personalize?", a: "Replace placeholders with the role, company, and your background." },
      { q: "What if I am emailing a hiring manager?", a: "Formal often works better; adapt the opener as needed." },
      { q: "Can I use this for brokers?", a: "Yes. Adapt the context for broker outreach." }
    ],
    relatedSlugs: ["resume-bullet-rewriter", "star-stories", "linkedin-post-builder"]
  },
  "deal-teaser-analyzer": {
    whatItDoes: "Extracts dollar amounts, percentages, and flags potential red-flag language from pasted deal teaser text. Suggests diligence questions. Not a substitute for professional review.",
    howToUse: ["Paste the deal teaser text.", "Click Analyze.", "Review extracted fields and red flags.", "Use diligence questions as a checklist.", "Copy or save the output."],
    examples: ["Teaser with $2M price. Result: PriceRange $2M. Red flags if any found in text.", "Teaser with as-is language. Result: Red flags include as-is, no warranty."],
    faq: [
      { q: "What is a deal teaser?", a: "A brief summary of a business or asset for sale, used in M&A and acquisitions." },
      { q: "What are red flags?", a: "Language that may signal risk, such as as-is or seller financing required." },
      { q: "Is this legal or financial advice?", a: "No. Use output as a starting point; consult professionals." },
      { q: "What if nothing is extracted?", a: "Paste more context. The tool uses simple heuristics." }
    ],
    relatedSlugs: ["sba-payment-estimator", "loi-outline", "linkedin-post-builder"]
  },
  "sba-payment-estimator": {
    whatItDoes: "Estimates monthly principal and interest for a loan. If you enter NOI, it calculates DSCR. Ballpark only; consult a lender for actual terms.",
    howToUse: ["Enter loan amount.", "Enter annual rate.", "Set term in years.", "Optionally enter annual NOI for DSCR.", "Review the results. Inputs update live."],
    examples: ["$500k, 9.5%, 10 years. Result: Monthly P&I, annual debt service.", "$500k, 9.5%, 10 years, NOI $75k. Result: Includes DSCR."],
    faq: [
      { q: "What is DSCR?", a: "Debt service coverage ratio. NOI divided by annual debt service." },
      { q: "Is this accurate?", a: "It is a ballpark. Lenders use their own terms and fees." },
      { q: "Does it include fees?", a: "No. Only principal and interest." },
      { q: "What loan types does this support?", a: "Designed for SBA-style amortizing loans; adapt for others." }
    ],
    relatedSlugs: ["deal-teaser-analyzer", "loi-outline"]
  },
  "loi-outline": {
    whatItDoes: "Generates a bullet-point outline for a Letter of Intent (LOI) or offer. Fill in the placeholders with your specifics before submitting.",
    howToUse: ["Enter asset type or description.", "Enter purchase price.", "Enter financing structure.", "Set number of bullets.", "Click Generate.", "Edit placeholders with your details."],
    examples: ["Asset: SaaS business. Price: $1.5M. Financing: SBA 7a. Result: Full bullet outline.", "Asset: Property. Result: Purchase price, earnest money, contingencies bullets."],
    faq: [
      { q: "What is an LOI?", a: "Letter of Intent. A non-binding document outlining key terms of an offer." },
      { q: "Are these legally binding?", a: "LOIs are typically non-binding; consult an attorney." },
      { q: "What bullets are included?", a: "Asset, price, financing, earnest money, timeline, contingencies, diligence." },
      { q: "Can I add custom bullets?", a: "Yes. Edit the output and add your own." }
    ],
    relatedSlugs: ["deal-teaser-analyzer", "sba-payment-estimator", "cold-outreach-email"]
  },
  "repurpose-pack": {
    whatItDoes: "Extracts key ideas from your source and generates hooks, script beats, captions, and visual ideas for repurposing one piece into many.",
    howToUse: ["Paste your source text (blog, transcript).", "Click Generate.", "Review hooks, script, captions, and visual ideas.", "Use each for a different format."],
    examples: ["Source: blog on productivity. Result: Hooks, script outline, 2 captions, 3 visual ideas.", "Source: video transcript. Result: Key phrase extracted, turned into hooks and captions."],
    faq: [
      { q: "What is a repurpose pack?", a: "A set of content pieces (hooks, scripts, captions, visuals) from one source." },
      { q: "How long can the source be?", a: "Up to about 2000 characters for best results." },
      { q: "What are visual ideas?", a: "Suggestions for graphics, such as before/after or list graphics." },
      { q: "Can I use this for podcasts?", a: "Yes. Paste transcript; get hooks and captions for clips." }
    ],
    relatedSlugs: ["content-calendar", "hook-generator", "content-ideas", "caption-generator"]
  },
  "content-calendar": {
    whatItDoes: "Generates a 7-day content calendar with post type and angle per day. Export to CSV for use in spreadsheets or planning tools.",
    howToUse: ["Enter your niche or theme.", "Click Generate.", "Review the week.", "Export CSV if needed.", "Copy or save."],
    examples: ["Niche: productivity. Mon: Educational, How-to. Tue: Behind the scenes, List.", "Niche: fitness. Export: CSV with Day, Post Type, Angle columns."],
    faq: [
      { q: "How many days are included?", a: "One week (7 days) per generation." },
      { q: "Can I export to Google Sheets?", a: "Yes. Export CSV, then import into Sheets." },
      { q: "What post types are used?", a: "Educational, behind the scenes, tip, story, Q&A, repost." },
      { q: "Can I get a longer calendar?", a: "Pro may unlock 2-week and monthly calendars." }
    ],
    relatedSlugs: ["repurpose-pack", "content-ideas", "hook-generator", "short-script-writer"]
  }
};


function getToolBySlug(slug) {
  return TOOLS.find(t => t.slug === slug) || null;
}

function getToolsByCategory(categorySlug) {
  return TOOLS.filter(t => t.category === categorySlug);
}

function getRelatedTools(slug, limit = 4) {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return TOOLS.filter(t => t.slug !== slug && (t.category === tool.category || t.tags.some(tag => tool.tags.includes(tag))))
    .slice(0, limit);
}

function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug) || null;
}

function getAllUrlsForSitemap() {
  const urls = [BASE_URL + "/"];
  CATEGORIES.forEach(c => urls.push(BASE_URL + "/categories/" + c.slug + "/"));
  TOOLS.forEach(t => urls.push(BASE_URL + t.path));
  urls.push(BASE_URL + "/about/");
  urls.push(BASE_URL + "/privacy/");
  urls.push(BASE_URL + "/terms/");
  urls.push(BASE_URL + "/changelog/");
  urls.push(BASE_URL + "/faq/");
  return urls;
}

window.NSB_REGISTRY = {
  TOOLS,
  CATEGORIES,
  FEATURED_TOOLS,
  BASE_URL,
  OG_IMAGE,
  TOOL_PAGE_CONTENT,
  getToolBySlug,
  getToolsByCategory,
  getRelatedTools,
  getCategoryBySlug,
  getAllUrlsForSitemap
};
