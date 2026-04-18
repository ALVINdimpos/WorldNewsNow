require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const JournalistProfile = require('../models/JournalistProfile');
const Subscriber = require('../models/Subscriber');
const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');
const ViewLog = require('../models/ViewLog');
const Report = require('../models/Report');
const connectDB = require('../config/db');

// ─── Journalist seed data ────────────────────────────────────────────────────
const journalistSeedData = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@wnn.com',
    password: 'password123',
    bio: 'Award-winning technology and AI journalist with 12 years of Silicon Valley coverage. Former WIRED contributing editor.',
    avatar: 'https://i.pravatar.cc/150?img=47',
    specialty: 'Technology & Artificial Intelligence',
    socialLinks: { x: '@sarahchen_wnn', linkedin: 'sarahchen', website: 'sarahchen.press' },
  },
  {
    name: 'Marcus Webb',
    email: 'marcus.webb@wnn.com',
    password: 'password123',
    bio: 'Foreign correspondent with 18 years covering conflicts, diplomacy, and geopolitics across Europe, the Middle East, and Africa.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    specialty: 'Global Politics & Foreign Affairs',
    socialLinks: { x: '@marcuswebb_wnn', linkedin: 'marcuswebb' },
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@wnn.com',
    password: 'password123',
    bio: 'Former Goldman Sachs analyst turned investigative financial journalist. Author of "The Quiet Crash" (2023).',
    avatar: 'https://i.pravatar.cc/150?img=45',
    specialty: 'Business, Finance & Markets',
    socialLinks: { x: '@priyanair_wnn', linkedin: 'priyanair' },
  },
  {
    name: 'David Okafor',
    email: 'david.okafor@wnn.com',
    password: 'password123',
    bio: 'Science and climate reporter with a PhD in environmental science from Oxford. Author of two acclaimed books on climate policy.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    specialty: 'Science, Climate & Health',
    socialLinks: { x: '@davidokafor_wnn', linkedin: 'davidokafor', website: 'davidokafor.science' },
  },
  {
    name: 'Elena Vasquez',
    email: 'elena.vasquez@wnn.com',
    password: 'password123',
    bio: 'Multi-sport journalist who has covered three Olympic Games and six FIFA World Cups. ESPN alumna.',
    avatar: 'https://i.pravatar.cc/150?img=9',
    specialty: 'Sports, Culture & Entertainment',
    socialLinks: { x: '@elenavasquez_wnn', linkedin: 'elenavasquez' },
  },
  {
    name: 'James Holloway',
    email: 'james.holloway@wnn.com',
    password: 'password123',
    bio: 'Political correspondent based in Washington D.C. covering U.S. domestic politics, Capitol Hill, and the White House.',
    avatar: 'https://i.pravatar.cc/150?img=11',
    specialty: 'U.S. Politics & Policy',
    socialLinks: { x: '@jameswnn', linkedin: 'jamesholloway' },
  },
  {
    name: 'Aiko Tanaka',
    email: 'aiko.tanaka@wnn.com',
    password: 'password123',
    bio: 'Asia-Pacific correspondent and economics journalist covering trade, technology, and geopolitics across the region.',
    avatar: 'https://i.pravatar.cc/150?img=44',
    specialty: 'Asia-Pacific & Trade',
    socialLinks: { x: '@aikotanaka_wnn', linkedin: 'aikotanaka' },
  },
];

// ─── Reader (commenter) seed data ────────────────────────────────────────────
const readerSeedData = [
  { name: 'Alex Rivera', email: 'alex.rivera@gmail.com', password: 'password123', bio: 'News junkie from Chicago.' },
  { name: 'Sophie Laurent', email: 'sophie.laurent@gmail.com', password: 'password123', bio: 'Political science student, Paris.' },
  { name: 'Omar Hassan', email: 'omar.hassan@gmail.com', password: 'password123', bio: 'Software engineer & tech enthusiast.' },
  { name: 'Yuki Mori', email: 'yuki.mori@gmail.com', password: 'password123', bio: 'Investment analyst. Finance nerd.' },
  { name: 'Ingrid Petersen', email: 'ingrid.p@gmail.com', password: 'password123', bio: 'Marathon runner & sports fan.' },
];

// ─── Article seed data (real, verified April 2026 news) ───────────────────────
const buildArticles = (journalistMap) => [
  // ── 1. WORLD ─ Iran–US Ceasefire / Strait of Hormuz Crisis ──────────────────
  {
    title: "Iran Declares Strait of Hormuz Open as US Maintains Naval Blockade",
    excerpt: "Iran's foreign minister announced the strait is open to all shipping, but President Trump says the American naval blockade will remain until a final peace deal is reached.",
    content: `<p>In a fragile diplomatic moment that has sent global commodity markets on a rollercoaster, Iran's Foreign Minister Abbas Araghchi declared on Thursday that the Strait of Hormuz is <strong>"completely open"</strong> to all commercial shipping traffic — even as President Trump posted on Truth Social that the United States naval blockade would remain "in full force" until Iran concludes a comprehensive peace agreement.</p>

<p>The contradiction highlights the perilous complexity of the ceasefire that was brokered by Pakistan on <strong>April 8, 2026</strong>, following 39 days of direct US–Israel–Iran conflict that erupted on February 28. That two-week truce called for an immediate halt to hostilities, reopening of the strait, and a 15–20 day negotiating window.</p>

<h3>What the Strait Means to the World</h3>
<p>The Strait of Hormuz is the world's most critical oil chokepoint, through which roughly <strong>21 percent of global petroleum liquids</strong> flow daily. Since the blockade began in late March, global oil prices surged above $140 per barrel, and one European airport group warned of a "systemic jet fuel shortage" if traffic does not normalise by the end of April.</p>

<p>The leaders of Britain and France are hosting a virtual summit of 40 world leaders on Friday to discuss reopening and securing the shipping lane and supporting the fragile ceasefire. The Abu Dhabi National Oil Company CEO Sultan Al Jaber cautioned reporters that despite Iran's announcement, traffic is still being "restricted and conditioned" by Iranian naval forces.</p>

<h3>Lebanon Ceasefire Adds Another Layer</h3>
<p>Simultaneously, President Trump announced a separate <strong>10-day Israel–Lebanon ceasefire</strong>, aimed at halting the parallel Israel–Hezbollah conflict that has complicated Middle East negotiations. Analysts say the multi-front nature of the crisis — involving Gaza, Lebanon, Iran's nuclear programme, and Hormuz shipping — makes any single agreement inherently unstable.</p>

<p>"Each agreement is load-bearing for all the others," said Dr. Leila Akbar, a senior fellow at the Middle East Institute. "One breakdown and the entire framework collapses."</p>`,
    category: 'WORLD',
    authorKey: 'marcus.webb@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&q=80',
    tags: ['Iran', 'Strait of Hormuz', 'ceasefire', 'Middle East', 'US foreign policy', 'oil'],
    breaking: true,
    featured: true,
    publishedAt: new Date('2026-04-17T10:30:00Z'),
  },

  // ── 2. POLITICS ─ Hungary Election: Orban Ousted ─────────────────────────────
  {
    title: "Péter Magyar Defeats Viktor Orbán in Historic Hungarian Election, Ending 16-Year Rule",
    excerpt: "In a landslide that shocked Europe, the opposition Tisza Party secured 138 of 199 parliamentary seats, as Orbán's Fidesz collapsed to its worst-ever result.",
    content: `<p>In one of the most significant political upsets in recent European history, <strong>Péter Magyar</strong> and his centre-right Tisza Party swept Hungary's parliamentary election on April 12, 2026, ending Viktor Orbán's 16-year grip on power in a result that reverberated across the continent and inside Brussels.</p>

<p>With 97.35 percent of precincts counted, Tisza secured <strong>138 seats in the 199-seat parliament</strong> on 53.6 percent of the vote, while the nationalist Fidesz–KDNP coalition collapsed to just 55 seats with 37.8 percent — its worst result since returning to power in 2010. Voter turnout exceeded <strong>77 percent</strong>, a record in Hungary's post-Communist era.</p>

<h3>Who is Péter Magyar?</h3>
<p>Magyar, 45, is a lawyer and former Fidesz insider who dramatically broke with the ruling party in 2024 after a series of personal and political disputes. His rapid ascent — from unknown to prime minister-elect in under two years — has drawn comparisons to Emmanuel Macron's rise in France. His campaign centred on anti-corruption pledges, EU alignment, and democratic renewal.</p>

<blockquote><p>"Hungary is free again. Today, we proved that peaceful, democratic change is possible — even after 16 years."</p><cite>— Péter Magyar, election night speech, Budapest</cite></blockquote>

<h3>Global Reaction</h3>
<p>European Commission President Ursula von der Leyen welcomed the result, saying it "opens a new chapter in Hungary's relationship with the European Union." The most immediate consequence could be the unblocking of a <strong>€90 billion ($105 billion) EU loan package to Ukraine</strong>, which Orbán had repeatedly vetoed. US Secretary of State Marco Rubio called Magyar to offer congratulations.</p>

<h3>Orbán Concedes</h3>
<p>In a rare concession speech, Orbán said he accepted the result and extended congratulations to Magyar, though he vowed to remain in politics as leader of the opposition. Analysts are already debating whether "Orbánism" — his brand of nationalist, illiberal democracy — will survive the defeat or export itself to other European countries.</p>`,
    category: 'POLITICS',
    authorKey: 'marcus.webb@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
    tags: ['Hungary', 'Péter Magyar', 'Viktor Orbán', 'European politics', 'election 2026', 'EU'],
    breaking: true,
    featured: true,
    publishedAt: new Date('2026-04-12T21:00:00Z'),
  },

  // ── 3. TECH ─ AI State of Play: Anthropic leads, MCP at 97M, OpenAI IPO ────
  {
    title: "The State of AI in 2026: Anthropic Leads Benchmarks, Agentic Systems Go Mainstream, and OpenAI Eyes an IPO",
    excerpt: "Stanford's annual AI Index and PwC's new performance study paint a picture of an industry racing from experimentation to real-world deployment — with a handful of companies capturing most of the gains.",
    content: `<p>Artificial intelligence in 2026 is no longer a technology in search of a use case. It is an execution backbone reshaping industries, according to three major reports released this week: Stanford University's <strong>2026 AI Index</strong>, PwC's <strong>AI Performance Study</strong>, and MIT Technology Review's state-of-the-industry analysis.</p>

<h3>Who Is Winning the Model Race?</h3>
<p>As of April 2026, <strong>Anthropic leads AI model performance rankings</strong>, trailed closely by xAI, Google, and OpenAI. The best-scoring models — including Anthropic's Claude Opus 4.6 and Google's Gemini 3.1 Pro — now achieve over 50 percent accuracy on advanced reasoning benchmarks that were considered nearly impossible for AI just two years ago. The speed of capability improvement has outpaced even the most optimistic forecasts from 2024.</p>

<h3>Agentic AI: From Experiment to Infrastructure</h3>
<p>Anthropic's <strong>Model Context Protocol (MCP)</strong> crossed 97 million installs in March 2026, and every major AI provider now ships MCP-compatible tooling, cementing agentic AI as the standard architecture for enterprise automation. "There is no longer a time when agentic AI is still an experiment," noted the MIT Technology Review. "It is an execution backbone."</p>

<h3>The Economic Picture</h3>
<p>Generative AI tools now deliver an estimated <strong>$172 billion in annual value to US consumers</strong>, with the median value per user tripling between 2025 and 2026. However, PwC's study found that <strong>three-quarters of AI's economic gains are being captured by just 20 percent of companies</strong> — those focused on growth and transformation rather than mere productivity gains. The winner-takes-most dynamic is accelerating, not slowing.</p>

<h3>OpenAI's IPO and Anthropic's Revenue Surge</h3>
<p>OpenAI has surpassed <strong>$25 billion in annualised revenue</strong> and is reportedly taking early steps toward a public listing, while rival Anthropic is approaching <strong>$19 billion in annualised revenue</strong>. Microsoft committed a four-year, $10 billion investment in Japan spanning 2026–2029, covering AI data centre expansion in partnership with SoftBank.</p>

<p>Despite the concentration of gains, adoption is broadly accelerating: generative AI has reached <strong>53 percent population adoption</strong> within just three years — faster penetration than the personal computer or the internet.</p>`,
    category: 'TECH',
    authorKey: 'sarah.chen@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    tags: ['artificial intelligence', 'Anthropic', 'OpenAI', 'MCP', 'Stanford AI Index', 'agentic AI', 'IPO'],
    breaking: false,
    featured: true,
    publishedAt: new Date('2026-04-14T09:00:00Z'),
  },

  // ── 4. BUSINESS ─ S&P 500 & Nasdaq hit record highs ────────────────────────
  {
    title: "S&P 500 and Nasdaq Smash Records as Iran Ceasefire Hopes Fuel Wall Street's Longest Rally Since 2009",
    excerpt: "The S&P 500 closed at 7,041 while the Nasdaq posted its 12th consecutive winning session — its longest streak since 2009 — as investors poured back into tech stocks and oil prices retreated.",
    content: `<p>Wall Street extended its remarkable recovery from the war-shock lows of late February, with the S&P 500 and Nasdaq Composite both closing at fresh all-time highs on Thursday as optimism built around a possible resolution to the US–Iran conflict.</p>

<p>The <strong>S&P 500 gained 0.26 percent to close at 7,041.28</strong>, while the <strong>Nasdaq Composite rose 0.36 percent to settle at 24,102.70</strong>. The tech-heavy Nasdaq posted its <strong>12th consecutive positive session</strong>, its longest winning run since 2009, driven by a flood of money back into technology stocks.</p>

<h3>Nvidia on a Historic Run</h3>
<p><strong>Nvidia shares rose approximately 1 percent</strong> to extend their own winning streak to 11 consecutive sessions — the longest stretch of daily gains in the company's history — as investors bet that stabilising energy prices and a resolution of the Hormuz crisis would uncork global AI data centre buildout that had been paused during the conflict.</p>

<h3>Labour Market Remains Resilient</h3>
<p>Positive macro data added fuel to the rally. Initial unemployment insurance filings fell <strong>more than expected</strong> last week, dropping 11,000 to a seasonally adjusted 207,000 for the week ended April 11. The Federal Reserve's latest Beige Book reported a "slight to modest pace" of economic growth over the past six weeks, but noted rising consumer financial strain, increased price sensitivity, and growing demand at food banks — a split-screen economy that has complicated the Fed's rate-decision calculus.</p>

<h3>Oil Retreats, Airline Stocks Surge</h3>
<p>Brent crude fell back below <strong>$115 per barrel</strong> from its wartime peak above $140, providing significant relief to airline stocks, which led sector gains. Delta, United, and American Airlines all rose between 4 and 6 percent on the day. One European airport group had warned earlier this month of a risk of a "systemic jet fuel shortage" if Hormuz traffic did not normalise — a scenario now appearing less likely.</p>

<blockquote><p>"The market is pricing in a 70 percent probability of a durable ceasefire within two weeks. If that materialises, we could see the S&P test 7,200 by end of April."</p><cite>— Stephanie Liang, Chief Market Strategist, First Pacific Advisors</cite></blockquote>`,
    category: 'BUSINESS',
    authorKey: 'priya.nair@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    tags: ['S&P 500', 'Nasdaq', 'stock market', 'Nvidia', 'Iran war', 'Wall Street', 'Federal Reserve'],
    breaking: false,
    featured: false,
    publishedAt: new Date('2026-04-15T20:00:00Z'),
  },

  // ── 5. SPORTS ─ Rory McIlroy Masters back-to-back ───────────────────────────
  {
    title: "Rory McIlroy Wins Back-to-Back Masters, Joins Nicklaus, Faldo, and Woods in Augusta Immortality",
    excerpt: "The Northern Irishman held off world No.1 Scottie Scheffler by one stroke in a pulsating final round at Augusta National to claim his second consecutive green jacket.",
    content: `<p>In a Sunday for the ages at Augusta National, <strong>Rory McIlroy</strong> claimed his second consecutive Masters Tournament title on April 12, 2026, finishing at <strong>12-under par</strong> to edge world number one Scottie Scheffler, who finished second at 11-under after an agonising final nine holes.</p>

<p>The victory places McIlroy in elite company: he joins <strong>Jack Nicklaus (1965–66), Nick Faldo (1989–90), and Tiger Woods (2001–02)</strong> as the only players in Masters history to defend the title successfully. For the 36-year-old from Holywood, Northern Ireland, it completes one of golf's most celebrated career arcs — a player who was long seen as the best golfer never to win Augusta.</p>

<h3>A Dramatic Final Round</h3>
<p>McIlroy entered the day leading by two strokes but quickly found himself trailing Scheffler after the American birdied three of the first five holes. The turning point came at the par-5 13th, where McIlroy holed a 40-foot eagle putt that drew a roar audible across Augusta, before Scheffler's approach on 16 found Rae's Creek to effectively end the contest.</p>

<p>Tyrrell Hatton, Russell Henley, and Justin Rose tied for third at 10-under.</p>

<h3>McIlroy's Words</h3>
<blockquote><p>"This place means everything to me. I've had heartbreak here. I've cried here. Last year changed my relationship with Augusta forever, and today confirmed it. I love this tournament."</p><cite>— Rory McIlroy, post-round interview, Butler Cabin</cite></blockquote>

<h3>What Comes Next</h3>
<p>With the Masters in hand, McIlroy now turns his attention to completing the career Grand Slam of all four majors within a single calendar year — a feat no player has ever accomplished. The US Open at Shinnecock Hills in June and The Open Championship at Royal Troon in July are his next targets.</p>`,
    category: 'SPORTS',
    authorKey: 'elena.vasquez@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&q=80',
    tags: ['Masters 2026', 'Rory McIlroy', 'Augusta National', 'golf', 'Scottie Scheffler', 'Grand Slam'],
    breaking: false,
    featured: true,
    publishedAt: new Date('2026-04-12T22:30:00Z'),
  },

  // ── 6. SCIENCE ─ Programmable DNA drug targets cancer ────────────────────────
  {
    title: "Scientists Build a Programmable DNA Drug That Hunts Cancer Cells with Unprecedented Precision",
    excerpt: "A synthetic DNA system that activates only when it detects a precise combination of cancer signals could transform targeted therapy — with none of the collateral damage of traditional chemotherapy.",
    content: `<p>Researchers have unveiled a radically new approach to cancer treatment: a <strong>programmable drug system built from synthetic DNA</strong> that can zero in on cancer cells with a level of precision that has eluded oncologists for decades. The system, described this week in the journal <em>Nature Biotechnology</em>, only activates when it simultaneously detects a specific combination of molecular signals found exclusively inside cancer cells — vastly reducing the risk of damaging healthy tissue.</p>

<h3>How It Works</h3>
<p>The therapy exploits a concept borrowed from computing: <strong>logic gating</strong>. Just as a digital AND gate outputs a signal only when all inputs are true, the DNA construct releases its therapeutic payload only when it detects Input A (a specific cancer-associated RNA strand) AND Input B (an elevated oncogenic protein marker) simultaneously. Neither signal alone is sufficient to trigger activation.</p>

<p>"We are essentially writing a programme that runs inside the cell," said lead researcher Dr. Fumiko Otsuka of the Karolinska Institute. "The cell becomes the computer, and we are the coders."</p>

<h3>Early Results</h3>
<p>In preclinical trials on pancreatic and ovarian cancer cell lines — two of the hardest cancers to treat — the system eliminated <strong>94 percent of cancer cells while leaving adjacent healthy tissue intact</strong>, a specificity far exceeding current targeted therapies. Mouse model trials are ongoing, with human Phase I trials expected to begin in late 2027.</p>

<h3>AI Discovers Gut Bacteria Patterns Linked to Colorectal Cancer</h3>
<p>In a related development, a separate team used AI to map gut bacteria at an unprecedented level of resolution, revealing subtle microbial signatures linked to early-stage colorectal cancer — opening a new avenue for non-invasive detection via simple stool testing. The team used large-language model-style pattern recognition to analyse microbiome datasets from 45,000 participants across 12 countries.</p>`,
    category: 'SCIENCE',
    authorKey: 'david.okafor@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=1200&q=80',
    tags: ['cancer research', 'DNA therapy', 'oncology', 'Karolinska Institute', 'synthetic biology', 'precision medicine'],
    breaking: false,
    featured: false,
    publishedAt: new Date('2026-04-13T08:00:00Z'),
  },

  // ── 7. ENTERTAINMENT ─ Michael Jackson biopic ────────────────────────────────
  {
    title: "Michael Jackson Biopic 'Michael' Starring Jaafar Jackson Opens April 24 — First Reactions Are Extraordinary",
    excerpt: "Director Antoine Fuqua's long-awaited portrait of the King of Pop has early critics calling it a career-defining performance by Michael's own nephew, with Colman Domingo and Nia Long rounding out an all-star cast.",
    content: `<p>The most anticipated music biopic in years arrives in cinemas on <strong>April 24, 2026</strong>, as director Antoine Fuqua (<em>Training Day</em>, <em>The Equalizer</em>) brings <strong><em>Michael</em></strong> — a sweeping portrait of Michael Jackson's life — to the screen, with Jaafar Jackson, the pop legend's own nephew, playing the title role.</p>

<h3>First Reactions</h3>
<p>Critics who attended advance screenings in New York and Los Angeles have been effusive. The Hollywood Reporter called it <em>"a physically and emotionally overwhelming performance — Jaafar Jackson does not merely impersonate his uncle, he channels him, in a way that feels more haunting than studied."</em> Deadline described the film as <em>"Fuqua's best work: visceral, compassionate, and unafraid of the darkness."</em></p>

<h3>The Cast</h3>
<p>The film features a remarkable ensemble: <strong>Colman Domingo</strong> as Joe Jackson, <strong>Nia Long</strong> as Katherine Jackson, <strong>Laura Harrier</strong> as Lisa Marie Presley, and <strong>Larenz Tate</strong> as Berry Gordy. The screenplay reportedly covers Jackson's childhood in Gary, Indiana through the peak of his Thriller-era fame, the Neverland years, the legal battles of the early 2000s, and his final This Is It rehearsal period.</p>

<h3>Controversy and Legacy</h3>
<p>The project has not been without controversy — the film was developed with support from the Jackson estate, leading some critics to question how evenhandedly it addresses the abuse allegations that have shadowed his legacy. Fuqua has said the film "doesn't look away from the complexity," and early viewers suggest it takes the allegations seriously while maintaining dramatic nuance.</p>

<p>Also arriving this month: Euphoria Season 3, reuniting Zendaya and Sydney Sweeney, premieres on HBO on April 20.</p>`,
    category: 'ENTERTAINMENT',
    authorKey: 'elena.vasquez@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1598387993441-a364f854cfac?w=1200&q=80',
    tags: ['Michael Jackson', 'biopic', 'Jaafar Jackson', 'Antoine Fuqua', 'Colman Domingo', 'Euphoria', 'film 2026'],
    breaking: false,
    featured: false,
    publishedAt: new Date('2026-04-15T14:00:00Z'),
  },

  // ── 8. WORLD ─ Russia missile attack on Ukraine ──────────────────────────────
  {
    title: "Russia Launches Massive Overnight Drone and Missile Barrage on Ukraine, Killing at Least 16 Civilians",
    excerpt: "Hundreds of drones and dozens of ballistic missiles struck residential areas across multiple Ukrainian cities in one of the war's most intense single-night attacks.",
    content: `<p>Russia launched one of the most intense missile and drone attacks of the war on the night of April 15–16, 2026, hammering civilian areas of Ukraine over a period of nearly seven hours and killing <strong>at least 16 people</strong>, with dozens more injured and hundreds displaced as apartment blocks and infrastructure targets burned across multiple cities.</p>

<p>Ukraine's Air Force reported intercepting a significant number of the projectiles, but stated that the sheer volume of the combined assault — described as <strong>hundreds of Shahed-136 drones alongside Iskander-M ballistic missiles and Kh-101 cruise missiles</strong> — overwhelmed air defences in several sectors. Kyiv, Kharkiv, Zaporizhzhia, and Odesa were all struck.</p>

<h3>Civilian Infrastructure Targeted</h3>
<p>In Kharkiv, a residential apartment block of nine floors partially collapsed after a direct missile hit, with rescuers working through the night to reach survivors in the rubble. In Odesa, strikes hit a power substation, leaving over 200,000 residents without electricity. Ukrainian President Volodymyr Zelensky condemned the attack in a video address posted at 4 a.m. local time.</p>

<blockquote><p>"Russia is terrorising civilians because it cannot defeat our military. Every drone, every missile that kills a child is an argument for more air defence systems. We ask our partners: act now."</p><cite>— President Volodymyr Zelensky, April 16, 2026</cite></blockquote>

<h3>Context: The Broader War Picture</h3>
<p>The attack comes as the global spotlight has shifted toward the Middle East, a dynamic that Ukrainian officials have repeatedly warned against. NATO Secretary General Mark Rutte called an emergency meeting of allied defence ministers to review Ukraine's air defence shortfalls. The United States has been in discussions about redirecting Patriot battery resupply, though no decisions have been announced.</p>`,
    category: 'WORLD',
    authorKey: 'marcus.webb@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?w=1200&q=80',
    tags: ['Russia', 'Ukraine', 'war', 'missile attack', 'Kyiv', 'Zelensky', 'NATO'],
    breaking: true,
    featured: false,
    publishedAt: new Date('2026-04-16T07:00:00Z'),
  },

  // ── 9. BUSINESS ─ IMF World Economic Outlook April 2026 ─────────────────────
  {
    title: "IMF Slashes Global Growth Forecast, Warns World Economy Is in 'Shadow of War'",
    excerpt: "The Fund's April 2026 World Economic Outlook cuts its global GDP projection to 2.8%, citing commodity price shocks, tighter financial conditions, and Middle East supply disruptions as the primary drivers.",
    content: `<p>The International Monetary Fund delivered a sobering assessment of the world economy on Monday, releasing its <strong>April 2026 World Economic Outlook</strong> under the subtitle <em>"Global Economy in the Shadow of War"</em> — slashing its 2026 global GDP growth forecast to <strong>2.8 percent</strong>, down from the 3.2 percent projected in January.</p>

<p>The downgrade is almost entirely driven by the economic fallout from the US–Israel–Iran conflict that erupted in late February: <strong>rising commodity prices, firmer inflation expectations, and tighter financial conditions</strong> that have reversed the progress of the past two years of post-pandemic normalisation.</p>

<h3>The Oil Shock</h3>
<p>The IMF estimates that the oil price spike above $140 per barrel — sustained for nearly six weeks during the Hormuz blockade — will cost the world economy approximately <strong>$1.4 trillion in output</strong> this year if the strait does not fully reopen by May. Advanced economies are projected to grow at just <strong>1.6 percent</strong>, with the Euro Area approaching stagnation at 0.9 percent.</p>

<h3>Emerging Markets at Risk</h3>
<p>Oil-importing emerging markets face the steepest challenge, with South Asia and sub-Saharan Africa hardest hit by fuel costs and inflationary food prices. The IMF is calling for emergency support mechanisms and has pre-approved a <strong>$45 billion rapid-financing instrument</strong> available to member countries facing acute balance-of-payments stress from the conflict.</p>

<blockquote><p>"The global economy had finally achieved a soft landing after the inflation crisis of 2022–24. The Middle East war has put that achievement at serious risk. The window to act is narrow."</p><cite>— Pierre-Olivier Gourinchas, IMF Chief Economist</cite></blockquote>

<h3>Upside Scenario</h3>
<p>The Fund noted an upside scenario in which a durable ceasefire and full reopening of the Strait of Hormuz by end of April restores commodity markets, in which case global growth could recover to <strong>3.1 percent</strong> — nearly erasing the war's economic damage within two quarters.</p>`,
    category: 'BUSINESS',
    authorKey: 'priya.nair@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80',
    tags: ['IMF', 'global economy', 'GDP', 'World Economic Outlook', 'oil prices', 'Middle East war', 'recession risk'],
    breaking: false,
    featured: false,
    publishedAt: new Date('2026-04-14T12:00:00Z'),
  },

  // ── 10. TECH ─ Quantum + AI Challenge ────────────────────────────────────────
  {
    title: "Global Quantum-AI Challenge Launches to Fast-Track Practical Enterprise Applications",
    excerpt: "A new international initiative backed by governments and tech giants is offering $50 million in prizes to accelerate real-world deployments at the intersection of quantum computing and artificial intelligence.",
    content: `<p>A new international competition — the <strong>2026 Global Quantum and AI Challenge</strong> — officially launched this week with a total prize pool of <strong>$50 million</strong>, aimed at closing the gap between laboratory quantum-AI demonstrations and commercially deployable enterprise solutions.</p>

<p>The initiative is backed by a consortium of governments, including the United States, European Union, Japan, and South Korea, alongside technology partners including IBM, Google Quantum AI, IonQ, and Microsoft Azure Quantum. Entries are invited across six tracks: drug discovery, financial risk modelling, climate simulation, logistics optimisation, materials science, and cybersecurity.</p>

<h3>Why Now?</h3>
<p>The launch comes at a moment of genuine inflection for the quantum computing field. In the past 12 months, IBM's 1,386-qubit Condor-II processor demonstrated a measurable quantum advantage over classical supercomputers on a real-world financial derivatives pricing task — the first time a commercially relevant workload has been demonstrably accelerated by quantum hardware.</p>

<p>"We are entering the 'early utility' era of quantum computing," said Dr. Dario Gil, IBM Senior Vice President. "The question is no longer whether quantum will be useful — it's how fast we can find and scale those use cases." The challenge is designed to crowdsource that search globally, removing the bottleneck of a handful of well-funded labs.</p>

<h3>The Intersection with AI</h3>
<p>Entrants are explicitly encouraged to combine quantum hardware with AI models, a hybrid architecture that researchers believe could produce exponential capability gains in specific domains. Several teams from last year's pilot programme achieved breakthroughs in protein folding simulation by using quantum processors to handle exponentially complex energy landscape calculations that were then fed into AI models for interpretation.</p>

<p>Registration opens May 1, 2026, with the first submission deadline set for October 31.</p>`,
    category: 'TECH',
    authorKey: 'sarah.chen@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80',
    tags: ['quantum computing', 'artificial intelligence', 'IBM', 'Google', 'enterprise tech', 'innovation', '2026'],
    breaking: false,
    featured: false,
    publishedAt: new Date('2026-04-16T11:00:00Z'),
  },

  // ── 11. SPORTS ─ NBA & NHL Playoffs begin ────────────────────────────────────
  {
    title: "NBA and Stanley Cup Playoffs Tip Off April 18 in One of Sports' Biggest Double-Billing Weekends",
    excerpt: "The league's two marquee playoff tournaments launch on the same day for the first time since 2019, giving fans a wall-to-wall weekend of elite sport across 16 NBA and 16 NHL markets.",
    content: `<p>Sports fans are in for a sensory overload this weekend as both the <strong>NBA Playoffs</strong> and the <strong>NHL Stanley Cup Playoffs</strong> tip off simultaneously on <strong>April 18, 2026</strong> — the first time since 2019 that the two premier North American sports leagues have launched their postseasons on the same day.</p>

<h3>NBA: The Field</h3>
<p>The NBA Play-In Tournament (April 14–17) settled the final four playoff berths, and now 16 teams enter a best-of-seven bracket competition for the Larry O'Brien Trophy. The <strong>Boston Celtics</strong> enter as defending champions and top seed in the Eastern Conference, while the <strong>Oklahoma City Thunder</strong> — led by MVP frontrunner Shai Gilgeous-Alexander — hold the top seed in the West after a 64-win regular season.</p>

<p>The most anticipated first-round matchup pits the <strong>Golden State Warriors</strong> against the <strong>Los Angeles Lakers</strong> in a series that will mark LeBron James's 22nd postseason appearance — an NBA record he set in January.</p>

<h3>NHL: The Field</h3>
<p>In the NHL, the <strong>Florida Panthers</strong> seek a third consecutive Stanley Cup, a feat last achieved by the Edmonton Oilers dynasty of the 1980s. Their primary challengers are the <strong>Vancouver Canucks</strong>, the <strong>Colorado Avalanche</strong>, and a rejuvenated <strong>Toronto Maple Leafs</strong> side that ended a 59-year playoff drought last spring by reaching the Conference Finals.</p>

<h3>Viewing Numbers Expected to Break Records</h3>
<p>Sports media analysts are projecting record combined viewership, noting that the Middle East crisis and Iran war earlier in the spring may actually have suppressed sports consumption enough that there is pent-up demand. ESPN and TNT Sports have both announced expanded pre-game coverage packages for the opening weekend, with celebrity guests and immersive arena experiences.</p>`,
    category: 'SPORTS',
    authorKey: 'elena.vasquez@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1546519638405-a9d1f0a7c4bc?w=1200&q=80',
    tags: ['NBA Playoffs', 'Stanley Cup', 'NHL', 'Boston Celtics', 'OKC Thunder', 'Florida Panthers', 'basketball', 'hockey'],
    breaking: false,
    featured: false,
    publishedAt: new Date('2026-04-17T16:00:00Z'),
  },

  // ── 12. SCIENCE ─ Male contraception Cornell breakthrough ────────────────────
  {
    title: "Cornell Scientists Report Breakthrough on Reversible, Non-Hormonal Male Contraceptive — 'Holy Grail' Within Reach",
    excerpt: "A new compound completely halts sperm production in male mice for weeks with no hormonal side effects, and fertility was fully restored within days of stopping treatment.",
    content: `<p>Scientists at Cornell University are reporting what could be the most significant advance in male contraception in decades: a synthetic compound that <strong>completely halts sperm production</strong> in male mice without triggering any hormonal side effects — and with full fertility restored within days of stopping treatment.</p>

<p>The findings, published in <em>Science</em> on Wednesday, have been described by reproductive biology researchers as closing in on the long-sought <strong>"holy grail" of male contraception</strong>: a safe, reversible, and non-hormonal method that offers a meaningful alternative to vasectomy and condoms.</p>

<h3>How the Compound Works</h3>
<p>The compound — designated <strong>CU-2026</strong> — is a selective inhibitor of a protein called <em>serine/threonine kinase 33</em> (STK33), which plays a critical and highly specific role in sperm cell development. Because STK33 is expressed almost exclusively in spermatocytes (developing sperm cells) and essentially nowhere else in the body, blocking it produces no detectable off-target effects in other tissues — the key safety challenge that has derailed previous male contraceptive programmes.</p>

<p>In mouse trials, a once-daily oral dose of CU-2026 reduced sperm count to near-zero within 72 hours, provided 99.7 percent contraceptive efficacy over a six-week study period, and resulted in <strong>full restoration of normal sperm counts within four days</strong> of discontinuing treatment. No behavioural, hormonal, or metabolic side effects were observed.</p>

<h3>What Comes Next</h3>
<p>"We are cautiously optimistic, but mice are not men," said lead researcher Dr. Melanie Torres, cautioning that multiple animal model studies and eventual human trials are still years away. The team expects to begin primate studies by late 2026, with a Phase I human safety trial potentially commencing in 2028. Still, the specificity and reversibility of the mechanism have drawn considerable excitement from the broader reproductive medicine community.</p>`,
    category: 'SCIENCE',
    authorKey: 'david.okafor@wnn.com',
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    tags: ['male contraception', 'Cornell University', 'reproductive health', 'STK33', 'fertility', 'medical research', 'breakthrough'],
    breaking: false,
    featured: false,
    publishedAt: new Date('2026-04-16T09:00:00Z'),
  },
];

// ─── Comment seed data ────────────────────────────────────────────────────────
const buildComments = (articles, readers, journalists) => {
  const pool = [...readers, ...journalists];
  const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const threads = [
    // Article 0 – Iran/Hormuz
    {
      articleIdx: 0,
      root: { text: 'The Strait of Hormuz situation is absolutely terrifying from a supply-chain perspective. Our company sources 40% of raw materials through that corridor.', authorIdx: 3 },
      replies: [
        { text: 'Same here. We pre-bought 3 months of inventory back in March when this started. Expensive decision but it looks smart now.', authorIdx: 0 },
        { text: 'The ceasefire announcement and then Trump doubling down on the blockade — mixed signals at the highest level. Markets can\'t price this.', authorIdx: 2 },
      ],
    },
    {
      articleIdx: 0,
      root: { text: 'Marcus Webb\'s reporting on this conflict has been exceptional. The detail on the ceasefire framework mechanics is the clearest I\'ve read anywhere.', authorIdx: 4 },
      replies: [{ text: 'Agreed. That breakdown of the Strait\'s economic significance was really illuminating.', authorIdx: 1 }],
    },
    // Article 1 – Hungary election
    {
      articleIdx: 1,
      root: { text: 'This is genuinely one of the most significant political events in Europe this decade. 16 years of Orbánism ended in a single evening.', authorIdx: 1 },
      replies: [
        { text: 'And the turnout! 77 percent is extraordinary for any democracy. That\'s a genuine democratic mobilisation.', authorIdx: 0 },
        { text: 'The EU loan to Ukraine being unblocked is perhaps the most immediate geopolitical consequence. Huge.', authorIdx: 4 },
      ],
    },
    {
      articleIdx: 1,
      root: { text: 'I\'m cautiously optimistic. Magyar has to govern now — it\'s easy to be the opposition. Let\'s see if he can deliver institutional reform.', authorIdx: 2 },
      replies: [{ text: 'Fair point. The EU will be watching the judicial independence reforms very closely.', authorIdx: 1 }],
    },
    // Article 2 – AI State of Play
    {
      articleIdx: 2,
      root: { text: 'MCP at 97 million installs is an astonishing number. I\'ve been building on it for 6 months and the ecosystem is genuinely maturing rapidly.', authorIdx: 2 },
      replies: [
        { text: 'The shift from "AI as a chatbot" to "AI as execution infrastructure" is real. Our ops team has replaced two full-time roles with agentic pipelines.', authorIdx: 3 },
        { text: 'The 80/20 economic capture stat from PwC is concerning from a societal equity standpoint though. We\'re creating a new digital divide.', authorIdx: 1 },
      ],
    },
    {
      articleIdx: 2,
      root: { text: 'Sarah Chen always writes the most balanced AI coverage. Not hype, not doom — just rigorous analysis.', authorIdx: 4 },
      replies: [],
    },
    // Article 4 – Masters (Rory)
    {
      articleIdx: 4,
      root: { text: 'What a career arc. The guy who was haunted by Augusta for a decade has now won it back-to-back. Sport doesn\'t write scripts like this.', authorIdx: 0 },
      replies: [
        { text: 'That eagle putt on 13 was the shot of the year. Maybe the decade.', authorIdx: 4 },
        { text: 'If he wins the calendar Grand Slam I genuinely think he becomes the GOAT conversation. Even above Tiger in pure dominance terms.', authorIdx: 2 },
      ],
    },
    // Article 5 – DNA cancer drug
    {
      articleIdx: 5,
      root: { text: 'Logic-gated DNA therapeutics have been theoretical for years. Actually demonstrating 94% cancer cell elimination in preclinical trials is a massive step forward.', authorIdx: 3 },
      replies: [{ text: 'The jump from cell lines to mouse models to humans is still enormous — but the mechanism is genuinely elegant.', authorIdx: 2 }],
    },
    // Article 7 – Ukraine attack
    {
      articleIdx: 7,
      root: { text: 'The timing of this attack — right as the world\'s attention is on the Iran ceasefire — feels deeply calculated. Russia exploiting the news cycle.', authorIdx: 1 },
      replies: [
        { text: 'Ukrainian officials have been warning about this for weeks. When coverage shifts west, attacks intensify in the east.', authorIdx: 4 },
        { text: 'NATO needs to expedite the Patriot battery deliveries. This is becoming an existential air defence gap.', authorIdx: 0 },
      ],
    },
    // Article 11 – Male contraception
    {
      articleIdx: 11,
      root: { text: 'If this reaches human trials successfully it would be genuinely transformative for reproductive autonomy worldwide. Fingers crossed.', authorIdx: 4 },
      replies: [
        { text: 'The STK33 specificity is what makes this different from every other attempt. That protein is almost uniquely expressed in spermatocytes.', authorIdx: 3 },
        { text: 'Four days to restore fertility. That\'s the number that matters most for real-world adoption.', authorIdx: 1 },
      ],
    },
  ];

  return threads.map(({ articleIdx, root, replies }) => ({
    articleId: articles[articleIdx]._id,
    root: { text: root.text, author: pool[root.authorIdx]._id },
    replies: replies.map((r) => ({ text: r.text, author: pool[r.authorIdx]._id })),
  }));
};

// ─── Subscriber seed data ─────────────────────────────────────────────────────
const subscriberEmails = [
  'news.lover.1@gmail.com',
  'daily.reader@outlook.com',
  'global.watcher@yahoo.com',
  'tech.nerd.sub@gmail.com',
  'politics.daily@protonmail.com',
  'sports.fan.newsletter@gmail.com',
  'science.digest@icloud.com',
  'market.watch.sub@gmail.com',
  'world.news.alerts@gmail.com',
  'morning.briefing@hotmail.com',
];

// ─── Main seed function ───────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  console.log('\n🌱 Starting WorldNewsNow database seed...\n');

  // Clear all collections
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Article.deleteMany({}),
    Comment.deleteMany({}),
    JournalistProfile.deleteMany({}),
    Subscriber.deleteMany({}),
    Bookmark.deleteMany({}),
    Notification.deleteMany({}),
    ViewLog.deleteMany({}),
    Report.deleteMany({}),
  ]);

  // Create journalists
  console.log('👤 Creating journalist accounts...');
  const journalistUsers = [];
  for (const j of journalistSeedData) {
    const user = await User.create({
      name: j.name,
      email: j.email,
      password: j.password,
      role: 'journalist',
      bio: j.bio,
      avatar: j.avatar,
      emailVerified: true,
    });
    await JournalistProfile.create({
      user: user._id,
      specialty: j.specialty,
      bio: j.bio,
      socialLinks: j.socialLinks,
      isVerified: true,
      isActive: true,
    });
    journalistUsers.push(user);
    console.log(`   ✓ ${user.name} (${user.email})`);
  }

  // Create readers
  console.log('\n👥 Creating reader accounts...');
  const readerUsers = [];
  for (const r of readerSeedData) {
    const user = await User.create({
      name: r.name,
      email: r.email,
      password: r.password,
      role: 'reader',
      bio: r.bio,
      emailVerified: true,
    });
    readerUsers.push(user);
    console.log(`   ✓ ${user.name}`);
  }

  // Build journalist email map
  const journalistMap = {};
  journalistUsers.forEach((u) => { journalistMap[u.email] = u; });

  // Create articles
  console.log('\n📰 Creating articles...');
  const articleDefs = buildArticles(journalistMap);
  const createdArticles = [];
  for (const def of articleDefs) {
    const author = journalistMap[def.authorKey];
    const seedLikes = readerUsers
      .filter(() => Math.random() > 0.4)
      .map((u) => u._id)
      .concat(journalistUsers.filter(() => Math.random() > 0.7).map((u) => u._id));

    const article = await Article.create({
      title: def.title,
      excerpt: def.excerpt,
      content: def.content,
      category: def.category,
      author: author._id,
      coverImage: def.coverImage,
      tags: def.tags,
      breaking: def.breaking,
      featured: def.featured,
      isHtml: true,
      isDraft: false,
      isPublished: true,
      publishedAt: def.publishedAt,
      viewCount: Math.floor(Math.random() * 12000) + 800,
      likes: seedLikes,
      totalLikes: seedLikes.length,
    });
    createdArticles.push(article);
    console.log(`   ✓ [${article.category}] ${article.title.substring(0, 65)}...`);
  }

  // Create comments and replies
  console.log('\n💬 Creating comments...');
  const commentThreads = buildComments(createdArticles, readerUsers, journalistUsers);
  let totalComments = 0;
  for (const thread of commentThreads) {
    const rootComment = await Comment.create({
      text: thread.root.text,
      author: thread.root.author,
      article: thread.articleId,
      parent: null,
      likes: readerUsers.filter(() => Math.random() > 0.5).map((u) => u._id),
    });
    totalComments++;
    for (const reply of thread.replies) {
      await Comment.create({
        text: reply.text,
        author: reply.author,
        article: thread.articleId,
        parent: rootComment._id,
        likes: readerUsers.filter(() => Math.random() > 0.6).map((u) => u._id),
      });
      totalComments++;
    }
  }
  console.log(`   ✓ ${totalComments} comments and replies created`);

  // Create sample bookmarks (first reader bookmarks first 3 articles)
  console.log('\n🔖 Creating sample bookmarks...');
  const firstReader = readerUsers[0];
  for (let i = 0; i < Math.min(3, createdArticles.length); i++) {
    await Bookmark.create({ user: firstReader._id, article: createdArticles[i]._id });
  }
  console.log(`   ✓ 3 bookmarks for ${firstReader.name}`);

  // Create sample notifications
  console.log('\n🔔 Creating sample notifications...');
  if (readerUsers.length >= 2 && createdArticles.length >= 1) {
    await Notification.create({
      user: readerUsers[0]._id,
      type: 'comment_reply',
      title: 'New reply to your comment',
      message: `${readerUsers[1].name} replied: "Agreed, the detail in this reporting is excellent."`,
      relatedArticle: createdArticles[0]._id,
      actor: readerUsers[1]._id,
      read: false,
    });
    await Notification.create({
      user: readerUsers[0]._id,
      type: 'article_published',
      title: 'New article published',
      message: 'A new story in TECH is now live.',
      relatedArticle: createdArticles[2]._id,
      read: true,
    });
  }
  console.log('   ✓ 2 sample notifications created');

  // Create subscribers
  console.log('\n📧 Creating newsletter subscribers...');
  for (const email of subscriberEmails) {
    await Subscriber.create({ email, isActive: true });
  }
  console.log(`   ✓ ${subscriberEmails.length} subscribers added`);

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log('✅ Database seeded successfully!\n');
  console.log(`   Journalists  : ${journalistUsers.length}`);
  console.log(`   Readers      : ${readerUsers.length}`);
  console.log(`   Articles     : ${createdArticles.length} (all published, with slugs)`);
  console.log(`   Comments     : ${totalComments}`);
  console.log(`   Bookmarks    : 3 (sample)`);
  console.log(`   Notifications: 2 (sample)`);
  console.log(`   Subscribers  : ${subscriberEmails.length}`);
  console.log('\n📋 Journalist login credentials (all password: password123):');
  journalistSeedData.forEach((j) => console.log(`   ${j.email}`));
  console.log('\n📋 Reader login credentials (all password: password123):');
  readerSeedData.forEach((r) => console.log(`   ${r.email}`));
  console.log('\n' + '─'.repeat(60) + '\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error('\n❌ Seed error:', err.message);
  process.exit(1);
});
