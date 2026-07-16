-- MD Studios Modules - Clean Insert
-- Product ID: ff96b809-b25c-4e12-abeb-4eae32bc86bb

INSERT INTO modules (product_id, stage_group, title, teaching_text, focus_items, enabled, sort_order) VALUES

-- Foundation Stage
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Foundation',
  'Studio Vision & Mission',
  'Define what MD Studios stands for. Your vision guides every service, every client interaction, and every creative decision.',
  '["What is the core purpose of MD Studios?","What problems do you solve for clients?","What makes your studio unique?","What values drive your creative process?"]'::jsonb,
  true,
  1
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Foundation',
  'Service Offerings',
  'Clarify what services MD Studios provides. Brand Identity, Website Design, Graphic Design, Social Media, Digital Products, AI Creative, and Creative Resources.',
  '["Which service categories will you focus on initially?","What specific services fit your expertise?","Which services could you expand into later?","What are your top 3 revenue-generating services?"]'::jsonb,
  true,
  2
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Foundation',
  'Target Market',
  'Know who you serve. Understanding your ideal clients shapes how you market, price, and deliver your services.',
  '["What type of businesses do you serve best?","What size are your ideal clients (startup, SMB, enterprise)?","What industries do you specialize in?","What do your ideal clients struggle with most?"]'::jsonb,
  true,
  3
),

-- Services Stage
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Services',
  'Brand Identity Services',
  'Design and positioning services: logo design, brand strategy, guidelines, naming, palettes, typography, refreshes, kits.',
  '[{"prompt":"Which brand identity services will you offer?","guidance":"Logo design, brand strategy, guidelines, naming, palettes, typography, refreshes, kits"},{"prompt":"What is your process for brand projects?","guidance":"Define workflow from discovery to delivery"},{"prompt":"What samples or case studies do you have?","guidance":"Document your best brand work"}]'::jsonb,
  true,
  4
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Services',
  'Website & Digital Design',
  'Web design and digital experience: websites, landing pages, e-commerce, UI/UX, audits, wireframes.',
  '[{"prompt":"Which website services are you offering?","guidance":"Business sites, landing pages, portfolios, stores, audits, UI/UX, wireframes"},{"prompt":"What tech stack do you use?","guidance":"List platforms and tools you specialize in"},{"prompt":"What is your web design process?","guidance":"Discovery, wireframes, design, development, testing, launch"}]'::jsonb,
  true,
  5
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Services',
  'Graphic & Marketing Design',
  'Print and digital graphic design: brochures, flyers, posters, presentations, infographics, pitch decks, company profiles.',
  '[{"prompt":"Which graphic design services matter most?","guidance":"Brochures, flyers, posters, presentations, infographics, pitch decks, profiles"},{"prompt":"What design tools do you master?","guidance":"Adobe Suite, Canva, Figma, etc."},{"prompt":"What visual style defines your work?","guidance":"Describe your design aesthetic and how clients recognize it"}]'::jsonb,
  true,
  6
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Services',
  'Social Media & Content Design',
  'Social branding and content design: kits, post templates, story templates, covers, campaign graphics.',
  '[{"prompt":"Which social platforms do you design for?","guidance":"Instagram, TikTok, LinkedIn, Twitter, YouTube, Facebook, etc."},{"prompt":"What social design services do you offer?","guidance":"Kits, post templates, story templates, covers, campaign graphics, social branding"},{"prompt":"How do you approach social content strategy?","guidance":"Visual consistency, brand voice, posting cadence, content themes"}]'::jsonb,
  true,
  7
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Services',
  'Digital Products & Systems',
  'Digital products and business systems: planners, templates, starter kits, productivity systems.',
  '[{"prompt":"What digital products are you planning?","guidance":"Planners, templates, kits, systems, downloadables"},{"prompt":"What business problems do they solve?","guidance":"Organization, productivity, planning, launch"},{"prompt":"How will you deliver and support them?","guidance":"PDF, web-based, email sequences, customer service"}]'::jsonb,
  true,
  8
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Services',
  'AI & Creative Resources',
  'AI-powered creative tools: prompt libraries, branding tools, resource collections, icons, mockups, templates, fonts.',
  '[{"prompt":"How do you use AI in your creative work?","guidance":"Prompt engineering, content ideation, design tools, productivity"},{"prompt":"What AI prompt libraries could you build?","guidance":"Branding, marketing, productivity, business"},{"prompt":"What other creative resources could you offer?","guidance":"Icons, mockups, templates, fonts, colour libraries, design assets"}]'::jsonb,
  true,
  9
),

-- Pricing & Operations Stage
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Pricing & Operations',
  'Service Pricing Strategy',
  'Set pricing that reflects your value and sustains your business. Balance market rates with expertise and costs.',
  '[{"prompt":"How will you price each service category?","guidance":"Hourly, project-based, retainer, package pricing"},{"prompt":"What is your cost structure?","guidance":"Software, tools, materials, labor, overhead"},{"prompt":"What is your target profit margin?","guidance":"Consider industry standards and business goals"},{"prompt":"What packages or bundles will you offer?","guidance":"Combined services that provide better value"}]'::jsonb,
  true,
  10
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Pricing & Operations',
  'Client Process & Delivery',
  'Design a smooth client experience from discovery through delivery. Clear processes build trust and efficiency.',
  '[{"prompt":"What is your project intake process?","guidance":"Inquiry, brief, questionnaire, kick-off meeting"},{"prompt":"How do you communicate with clients?","guidance":"Tools, frequency, responsiveness"},{"prompt":"What is your revision and approval process?","guidance":"How many rounds, feedback method, change requests"},{"prompt":"How do you deliver final deliverables?","guidance":"File formats, documentation, training, ongoing support"}]'::jsonb,
  true,
  11
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Pricing & Operations',
  'Portfolio & Case Studies',
  'Build and showcase your best work. A strong portfolio is your most powerful marketing tool.',
  '[{"prompt":"What are your top 3-5 best projects to showcase?","guidance":"Projects that demonstrate range, quality, and impact"},{"prompt":"What is the story behind each project?","guidance":"Challenge, solution, result, client feedback"},{"prompt":"Where will you display your portfolio?","guidance":"Website, Instagram, Behance, social media"},{"prompt":"What metrics show your impact?","guidance":"Client results, traffic, engagement, conversions"}]'::jsonb,
  true,
  12
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Pricing & Operations',
  'Marketing & Growth',
  'Promote MD Studios and attract ideal clients. Your marketing should reflect your creative excellence.',
  '[{"prompt":"What are your 3 main marketing channels?","guidance":"Social media, website, referrals, partnerships, ads, content"},{"prompt":"How will you build your personal/studio brand?","guidance":"Design your own brand, social presence, thought leadership"},{"prompt":"What is your content strategy?","guidance":"Blog, tutorials, case studies, behind-the-scenes, tips"},{"prompt":"How will you generate leads and referrals?","guidance":"Outreach, networking, partnerships, client incentives"}]'::jsonb,
  true,
  13
),
(
  'ff96b809-b25c-4e12-abeb-4eae32bc86bb',
  'Pricing & Operations',
  'Growth & Expansion',
  'Plan the evolution of MD Studios. How will you scale without losing quality or burning out?',
  '[{"prompt":"What does success look like for MD Studios in 1 year?","guidance":"Revenue, client base, team, services, reputation"},{"prompt":"What services will you add next?","guidance":"Based on demand, expertise, profitability"},{"prompt":"Will you hire a team or stay solo?","guidance":"Pros/cons of each, timeline, hiring plan"},{"prompt":"What could limit your growth?","guidance":"Time, expertise, resources, market demand"}]'::jsonb,
  true,
  14
);
