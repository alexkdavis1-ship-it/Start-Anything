// Bogdan / Email Kong: 90 videos. Every number comes from the Email Kong Content Bank or the onboarding brief.
// f = format key (see FORMATS), h = hook (word for word), p = talking points, s = send us, c = CTA key, x = watch-out note
const CTA = {
  B: 'Comment "BFCM" and I\'ll send you the playbook.',
  V: 'Comment "VAULT" for the full Flow Vault.',
  A: 'Comment "AUDIT" for a free Klaviyo audit.',
  L: 'Link in bio: we\'ll build your flows for free.',
  F: 'Follow for more.'
};

const FORMATS = {
  talk:   {name:'Talk + proof', min:8,  how:'Talk to camera. Leave the top third empty. We put the screenshot there.'},
  steal:  {name:'Steal this email', min:10, how:'Screen record a slow scroll of the email first. Then film yourself talking about it.'},
  wb:     {name:'Whiteboard', min:12, how:'Stand at the whiteboard. Draw it as you explain it. Phone on a tripod, whole board in frame.'},
  rank:   {name:'Ranking', min:12, how:'For each item: say the name, the tier (S to D), and one sentence why. We build the tier chart.'},
  team:   {name:'Team asks, you answer', min:12, how:'A team member reads each line off camera. You answer, then give one sentence why.'},
  bbb:    {name:'Bad, Better, Best', min:5, how:'Sit low in frame. Look up and point left "Bad", middle "Better", right "Best". 3 times, then "Follow for more." Film it 3 times.'},
  follow: {name:'Follow these people', min:5, how:'Sit low in frame. "If you suck at ___..." point up "...follow these people." We put the accounts above your head.'},
  pov:    {name:'POV skit', min:12, how:'No talking. Act out each beat and exaggerate it. We add the POV text and any voices.'},
  skit:   {name:'Two-character skit', min:15, how:'You play both characters. Swap jacket or seat between characters. Film all of A\'s lines, then all of B\'s.'},
  news:   {name:'Green screen news', min:8, how:'We put the news headline behind you. Talk to camera like you\'re telling a friend what just happened.'},
  borrow: {name:'Borrowed credibility', min:10, how:'We send you the clip. Play it on a laptop, film yourself watching, then give your reaction to camera.'},
  list:   {name:'Listicle', min:5, how:'No talking. Film 60 seconds of calm B-roll with space at the top. We add the list on screen.'},
  street: {name:'Street interview', min:30, how:'One person films, you hold the mic. "Quick question for you, would you be up for being in a video?" Then ask.'},
  live:   {name:'Day in the life', min:0, how:'Film short clips throughout the day. We cut it together.'}
};

const SESSIONS = [
  {n:1, day:'Week 1 · Friday', name:'Black Friday', note:'Film this one first. Black Friday is on the clock.'},
  {n:2, day:'Week 1 · Sunday', name:'Team + quick hits', note:'Bring a team member for videos 16–23. They read from this PDF.'},
  {n:3, day:'Week 2 · Friday', name:'Emails nobody else sends', note:'Screen recordings first, then all the talking. Blur brand names.'},
  {n:4, day:'Week 2 · Sunday', name:'How you think', note:'Your opinions. Whiteboard needed for 46, 50, 55 and 58.'},
  {n:5, day:'Week 3 · Friday', name:'Flows, pop-ups, subscriptions', note:'Have the Klaviyo screens open before you start.'},
  {n:6, day:'Week 3 · Sunday', name:'Audits, agencies, skits', note:'89 and 90 are filmed when they happen, not in this session.'}
];

const V = [
// ---------------- SESSION 1: BLACK FRIDAY ----------------
{s:1,f:'talk',t:'7 Emails, 3 Texts, $119k',h:'Seven emails and three texts made a pet brand $119,000 on Black Friday.',p:['That was 37% of the store\'s revenue that day.','The texts alone made $34,404.','Walk through what went out and when.'],s2:'The campaign list and revenue for that day. Brand hidden.',c:'B'},
{s:1,f:'talk',t:'Black Friday Starts in October',h:'If your Black Friday starts in November, you\'ve already lost it.',p:['We start 3 months out.','Prime Day and Halloween warm the list up for the big day.','The 10 waves, from Prime Big Deal Days to New Year.'],c:'B'},
{s:1,f:'wb',t:'11 Sends in One Day',h:'This is every email and text we send on Black Friday. All eleven.',p:['6am VIP email, 7am VIP text, 9am launch.','11am social proof, 1pm gift guide, 3pm text, 4pm bonus reveal.','6pm price anchor, 8pm founder plain text, 10pm final hours, 10:30pm closing text to clickers who didn\'t buy.'],c:'B'},
{s:1,f:'talk',t:'Don\'t Send 3 Emails on Black Friday',h:'Never send just three emails on Black Friday.',p:['The competition is dire. Every inbox is full that day.','A sale isn\'t one email. It\'s a series of emails.','What a real day looks like: 8 emails and 3 texts.'],c:'B'},
{s:1,f:'talk',t:'Reply to Get Early Access',h:'One line in your Black Friday email does two jobs at once.',p:['"Hit reply with: Yes, I want early access."','You get a VIP list.','Replies tell Gmail people want your emails. Better inboxing.'],c:'B'},
{s:1,f:'talk',t:'Keep the Sale Open',h:'Don\'t end your Black Friday sale on Friday.',p:['Every brand we run extends over the weekend.','"We\'re keeping it open." It always pays.','Then Cyber Monday is its own wave.'],c:'B'},
{s:1,f:'talk',t:'40% Off Is a Trap',h:'Stop putting 40% off everything for Black Friday.',p:['Deep discounts halve revenue. Merchandising beats depth.','Gifts, bundles, spend thresholds.','Lead with mid and clearance stock, then shift to bestsellers.'],c:'B'},
{s:1,f:'talk',t:'The Gift Card Nobody Uses',h:'The best Black Friday offer costs you almost nothing.',p:['A free gift card over a spend threshold.','It lifts order value.','Most of them are never redeemed.'],c:'B'},
{s:1,f:'steal',t:'RE: and FWD: Subject Lines',h:'Our best Black Friday emails all start the same way.',p:['"RE: Our previous message": 50% opens, $11.6k.','"FWD: Our Most Important Announcement": $10.4k.','Why it works: it looks like a conversation, not an ad.'],s2:'Screenshots of those sends, brand hidden.',c:'B'},
{s:1,f:'steal',t:'Your Account Could Be Deleted',h:'Send this email before Black Friday. It wakes up everyone who\'s gone quiet.',p:['Subject: "❌ Your account could be deleted."','Founder plain text. Click to stay and get 10% off.','Do nothing and you\'re really removed. A real deadline.'],s2:'The email, full scroll.',c:'V'},
{s:1,f:'talk',t:'142 Emails and 26 Texts',h:'This is how many emails one brand is getting from us this Q4.',p:['142 emails and 26 texts, 11 named sales.','November alone: 62 emails, 13 texts.','Why this doesn\'t burn the list.'],s2:'The Q4 calendar, blurred.',c:'B',x:'Never say "send fewer". Never show unsubscribes as a win.'},
{s:1,f:'rank',t:'Black Friday by Niche, Ranked',h:'Ranking which stores make the most from email on Black Friday.',r:['Cleaning: 39%','Art kits: 38%','Pet: 37%','Jewellery: 20%'],p:['Share of that day\'s store revenue that came from email.','What the top ones do that jewellery didn\'t.'],c:'B'},
{s:1,f:'talk',t:'Your Black Friday Sale Isn\'t Real',h:'If your prices aren\'t back to full by mid-October, your Black Friday sale isn\'t real.',p:['Customers notice.','Full price first, then the sale means something.'],c:'B'},
{s:1,f:'talk',t:'Give Your List More Than the Site',h:'Your email list should never get the same Black Friday deal as everyone else.',p:['An extra 10–20% for subscribers on top of the site offer.','That\'s the reason to sign up in October.','It builds the list before the big day.'],c:'B'},
{s:1,f:'bbb',t:'Bad, Better, Best: Black Friday Subject Lines',c:'F',s2:'Nothing. We pick the subject lines from your real sends and you approve.'},

// ---------------- SESSION 2: TEAM + QUICK HITS ----------------
{s:2,f:'team',t:'Hire or Fire Your Agency&nbsp;#1',q:'"Hire" or "Fire"',l:[['Your agency only sends to 30-day engaged.','Fire'],['They built you a 10-day welcome flow.','Fire'],['They resend to everyone who didn\'t buy, with a new subject line.','Hire'],['Their monthly report leads with open rates.','Fire'],['The senior who sold you is never seen again.','Fire']],c:'A'},
{s:2,f:'team',t:'Hire or Fire Your Agency&nbsp;#2',q:'"Hire" or "Fire"',l:[['They promised 30% more revenue before opening your account.','Fire'],['They run three pop-ups, not one.','Hire'],['They turned off Smart Sending and use a 3-in-24-hours rule.','Hire'],['Every flow email is A/B tested.','Hire'],['They told you to calm down your sending before Q4.','Fire']],c:'A'},
{s:2,f:'team',t:'Hire or Fire Your Agency&nbsp;#3',q:'"Hire" or "Fire"',l:[['They use the same Canva template as 500 other brands.','Fire'],['40% off everything for Black Friday.','Fire'],['They never sell to someone whose parcel hasn\'t arrived.','Hire'],['They give vouchers for reviews.','Fire'],['They ask for a review after order 2.','Hire']],c:'A'},
{s:2,f:'team',t:'Myth or Truth: Email Basics',q:'"Myth" or "Truth"',l:[['Sending more emails burns your list.','Myth'],['Only 5% of your list is ready to buy right now.','Truth'],['Open rate is the number to watch.','Myth'],['Most welcome flow sales happen in the first 24 hours.','Truth'],['You need hundreds of segments.','Myth']],c:'A'},
{s:2,f:'team',t:'Myth or Truth: Getting to the Inbox',q:'"Myth" or "Truth"',l:[['You need a dedicated IP.','Myth'],['Replies help you land in the inbox.','Truth'],['You should resend to people who didn\'t open.','Myth'],['A copied swipe-file layout can get you flagged.','Truth'],['The Promotions tab is a disaster.','Myth']],c:'A'},
{s:2,f:'team',t:'Myth or Truth: Black Friday',q:'"Myth" or "Truth"',l:[['Black Friday prep starts in November.','Myth'],['Deeper discounts make more money.','Myth'],['Extending the sale over the weekend pays.','Truth'],['Three emails is enough for the day.','Myth'],['Most free gift cards never get used.','Truth']],c:'B'},
{s:2,f:'team',t:'Send It or Delete It&nbsp;#1',q:'"Send it" or "Delete it"',l:[['"$6.44 credit on your account."','Send'],['An email that only teaches. No discount.','Send'],['"We saw you looking..."','Delete'],['A sale email to someone whose order hasn\'t arrived.','Delete'],['"We need a BIG favour." Just asking for a reply.','Send']],c:'V'},
{s:2,f:'team',t:'Send It or Delete It&nbsp;#2',q:'"Send it" or "Delete it"',l:[['A resend to people who didn\'t open.','Delete'],['The founder forwarding a real customer email.','Send'],['"❌ Your account could be deleted."','Send'],['A National Donut Day promo.','Delete'],['A plain "thank you" after purchase. No offer.','Send']],c:'V'},
{s:2,f:'bbb',t:'Bad, Better, Best: Pop-up Offers',c:'F',s2:'Nothing. We build the pop-up examples.'},
{s:2,f:'bbb',t:'Bad, Better, Best: Welcome Emails',c:'F',s2:'Nothing. We build the examples.'},
{s:2,f:'bbb',t:'Bad, Better, Best: Post-Purchase Emails',c:'F',s2:'Nothing. We build the examples.'},
{s:2,f:'follow',t:'If You Suck at Email, Follow These People',h:'If you suck at subject lines... follow these people.',p:['Repeat with: pop-ups, retention, Black Friday.','We\'ll agree the accounts with you before posting.'],c:'F'},
{s:2,f:'news',t:'Klaviyo Is Going Headless',h:'Klaviyo just announced AI agents. We\'ve been running ours for months.',p:['You were in Boston for K:BOS when they announced it.','What headless means for a store owner, in one sentence.','What we already do with agents: calendar, copy, subject lines, designs.'],c:'F'},
{s:2,f:'pov',t:'POV: Your Agency\'s Monthly Report',beats:['You on a video call, nodding.','Off-screen voice: "Open rates are up 4%!" You give a thumbs up.','You open Shopify. Revenue is flat. Slow look to camera.','You close the laptop.'],c:'A'},
{s:2,f:'pov',t:'POV: You Sent One Email on Black Friday',beats:['Black Friday morning. You hit send once and lean back, proud.','You check your own inbox: 40 brands have emailed you since 6am.','You refresh Shopify. Then again. Then again.','Stare at camera.'],c:'B'},

// ---------------- SESSION 3: EMAILS NOBODY ELSE SENDS ----------------
{s:3,f:'steal',t:'The $6.44 Email',h:'This email made $28,000 and it\'s two lines long.',p:['"$6.44 credit on your account": $16,647. "Your $6.44 credit expires tonight": $11,511.','A men\'s skincare brand.','Odd amounts feel real. Round numbers feel like marketing.'],s2:'Both emails, full scroll.',c:'V'},
{s:3,f:'steal',t:'The 5-Day Credit Countdown',h:'Five emails, one tiny credit, $24,000.',p:['A teeth-whitening brand. 47% opens.','Credit added, extended, "Don\'t forget this", "£0 at midnight".','Read the subject lines out.'],s2:'The 5 subject lines.',c:'V'},
{s:3,f:'steal',t:'We\'re Refunding 3 Orders',h:'We told customers we\'d refund three random orders. It wasn\'t a discount.',p:['Every order that month gets entered. A few get fully refunded.','42% opens on 228,000 people.','No code, no minimum.'],c:'V'},
{s:3,f:'steal',t:'We Need a BIG Favour',h:'This email has no offer and no product, and it made $10,866.',p:['It just asks people to reply.','Replies are one of the strongest signals to inbox providers.','Another version, "Quick favor?", hit 62.6% opens.'],c:'V'},
{s:3,f:'steal',t:'Can You See This?',h:'Send this email if your emails keep landing in Promotions.',p:['Asks people to reply "got it".','Replies push you toward the Primary tab.','54% opens for an oral care brand.'],c:'V'},
{s:3,f:'steal',t:'Fwd: Had to Share This',h:'The best salesperson for your brand is a customer email you already have.',p:['The founder forwards a real customer email with 2 lines on top.','$8.9k from one send, 43.7% opens.','The customer\'s words do the selling. Never invented.'],c:'V'},
{s:3,f:'steal',t:'The Code Leaked',h:'"An internal code leaked." Here\'s why that subject line works.',p:['A wholesale code got out, so the brand leaves it up until it\'s shut down.','Three sends: launch, still live, shutting down.','Read the subject lines out.'],c:'V'},
{s:3,f:'steal',t:'We\'re Closing the Store',h:'Three plain-text emails from a founder made $31,000.',p:['A clearance story told across 3 emails.','$10.4k, $11.9k, $8.8k.','A story people want to see the end of.'],c:'V'},
{s:3,f:'steal',t:'You Have a £10 Voucher',h:'One voucher and one word made $7,300.',p:['A voucher notice.','The next day: "Unredeemed."','Two sends.'],c:'V'},
{s:3,f:'steal',t:'Plain Text From the Founder',h:'No design, one link, 45.8% opens.',p:['A plain-text email written by the founder himself.','Looks like a person, not a brand.','When it needs design, we turn plain text into a designed version in 40 seconds.'],c:'V'},
{s:3,f:'steal',t:'Guess What Changed?',h:'Three words and a box emoji made $154,595.',p:['A supplement brand\'s product update.','81,244 people, 59.8% opens.','Curiosity beats a discount.'],c:'V'},
{s:3,f:'steal',t:'$133k From 6,000 People',h:'This email made $22 for every person who got it.',p:['A wall-panelling brand: "Ditch The Echo, Upgrade The Look".','5,953 recipients.','The best revenue per person anywhere we\'ve looked.'],c:'V'},
{s:3,f:'steal',t:'You\'re Applying It Wrong',h:'Telling customers they\'re doing it wrong made $112,679.',p:['A fragrance brand: "You\'re applying it at the wrong time."','374,647 people.','Teach them something they didn\'t know about your product.'],c:'V'},
{s:3,f:'steal',t:'The Review Ask That Made $99k',h:'A review request made more money than most sales.',p:['Subject: "Request for {first_name}".','A supplement brand, $99,049.','Ask after order 2. Never bribe with vouchers.'],c:'V'},
{s:3,f:'rank',t:'Top 10 Emails That Made the Most Money',h:'Ranking the 10 emails that made the most money across every brand we run.',r:['2pm crash: $171k','Guess what changed?: $155k','Most people stop at the same point: $134k','Ditch The Echo: $134k','Wrong time: $113k','Request for {first_name}: $99k','What your liver does while you sleep: $88k','Re: did you see?: $86k','Tonight at midnight, it ends: $85k','8 AM to 11 PM, one application: $81k'],p:['Count down from 10 to 1.','The point: almost none of them are discounts.'],c:'V'},

// ---------------- SESSION 4: HOW YOU THINK ----------------
{s:4,f:'wb',t:'Only 5% of Your List Is Ready to Buy',h:'95% of your email list isn\'t ready to buy today. That\'s why you email them more.',p:['Draw 100 people. Circle 5.','The other 95 buy later, if you stay in front of them.','Silence makes you forgettable.'],c:'A'},
{s:4,f:'talk',t:'Unsubscribes Don\'t Pay the Bills',h:'You know what will kill your brand? Being forgotten.',p:['Net list growth is the score, not unsubscribe rate.','"I am yet to find an account under the 0.1% unsubscribe rate."','You\'re one of hundreds of brands in their inbox.'],c:'A'},
{s:4,f:'talk',t:'Open Rates Are Vanity',h:'Stop looking at your open rate.',p:['Since Apple\'s privacy change and bot opens, it\'s unreliable.','Clicks show intent. Our average click rate: 9.5%.','Opens only matter under 10%, as a deliverability alarm.'],c:'A'},
{s:4,f:'talk',t:'Your Klaviyo Revenue % Is Lying',h:'If Klaviyo says it makes 44% of your revenue, don\'t celebrate yet.',p:['Consistently over 30–35% usually means over-attribution.','Fix: shorten the attribution window to 1-day click.','Then you see the real number.'],c:'A'},
{s:4,f:'wb',t:'Plan Email Like Ad Spend',h:'Never start the month asking "what should I send?"',p:['Start with "how much revenue do we need?"','Work back to sends: 3–4 a week minimum.','Never plan fewer sends than last month.'],c:'A'},
{s:4,f:'talk',t:'Random Acts of Marketing',h:'A calendar built on National Donut Day is not a strategy.',p:['We plan around 6 pillars: content, product, loyalty, promo, data, winback.','Every send has a job.'],c:'A'},
{s:4,f:'talk',t:'Your Pretty Template Is Hurting You',h:'That Canva email template you love? 500 other brands are sending it too.',p:['Gmail fingerprints layouts it sees everywhere.','Copied swipe files can get you flagged.','Inspiration, never paste-and-send.'],c:'A'},
{s:4,f:'talk',t:'Never Send to Non-Openers',h:'Never, ever, ever resend to people who didn\'t open.',p:['It tells Gmail you keep emailing people who don\'t care.','Like telling Meta "show this to people unlikely to buy".','Resend to everyone who didn\'t buy, with a new subject and new hero image.'],c:'A'},
{s:4,f:'talk',t:'Turn Off Smart Sending',h:'Smart Sending is blocking your best customers from your best emails.',p:['Turn it off.','Use a "got 3 emails in 24 hours" exclusion instead.'],c:'A'},
{s:4,f:'wb',t:'The Parcel Still in the Van',h:'Never try to sell to someone whose order hasn\'t arrived yet.',p:['The 4 exclusions on every send:','Converted by a campaign in the last 10 days. Spam or bounced.','Got 3 emails in 24 hours. Recent customer, not yet delivered.'],c:'V'},
{s:4,f:'talk',t:'More Sends, More Money',h:'One brand doubled its weekly email revenue by sending more.',p:['6+ sends a week: $11.9k a week. 1–3 sends: $6.3k.','Revenue per send falls. Revenue per week rises.','Always finish the sum.'],s2:'The weekly revenue comparison, blurred.',c:'A'},
{s:4,f:'talk',t:'The 30-Day Engaged Lie',h:'If you only email your 30-day engaged, you\'re ignoring 80% of your list.',p:['30-day engaged is about 20% of a list.','The rest can still buy.'],c:'A'},
{s:4,f:'wb',t:'3 Buckets, Not 300 Segments',h:'Stop building hundreds of segments.',p:['Hyper-segmenting is vanity.','High, medium, low frequency: three buckets.','A wide net and still in control.'],c:'A'},
{s:4,f:'rank',t:'Email Best Practices, Ranked',h:'Ranking email "best practices" from worst to best.',r:['10-day welcome flow','Only sending to 30-day engaged','Hyper-segmenting','Chasing open rates','More design','3–4 sends a week','Resend to non-buyers'],p:['Best practices are compliance tactics, not growth strategies.'],c:'A'},
{s:4,f:'rank',t:'Klaviyo Metrics, Ranked by How Much They Lie',h:'Ranking Klaviyo metrics by how much they lie to you.',r:['Open rate','Klaviyo revenue %','Revenue per send','Click rate','Repeat rate','Time to 2nd order','Net list growth'],p:['Open rate at the top, net list growth at the bottom.','"Torture data long enough and it will confess to anything."'],c:'A'},

// ---------------- SESSION 5: FLOWS, POP-UPS, SUBSCRIPTIONS ----------------
{s:5,f:'wb',t:'2 Flows Make 80% of Flow Revenue',h:'Two flows make 80% of your flow revenue. Most brands get both wrong.',p:['Welcome and checkout abandonment.','80% of results from 20% of flows.'],c:'V'},
{s:5,f:'talk',t:'Kill Your 10-Day Welcome Flow',h:'Most of your welcome flow sales happen in the first 24 hours.',p:['"I dare you to go and look at that data." Over 90% convert in 24 hours.','Day 1: 2 emails and 1 text.'],c:'V'},
{s:5,f:'talk',t:'The Most Overlooked Flow in Klaviyo',h:'Nobody builds this flow, and it\'s sitting on money.',p:['Subscribed, no order, 10 days.','The people who wanted you enough to sign up.'],c:'V'},
{s:5,f:'talk',t:'Your Tracking Emails Are Gold',h:'Your most-opened emails are the ones you\'ve never thought about.',p:['Shipping and tracking emails get 60–80% opens.','Use a branded tracking page.','"You don\'t ship products. You ship brand experiences."'],c:'V'},
{s:5,f:'rank',t:'Every Flow, Ranked by $ Per Person',h:'Ranking every Klaviyo flow by how much it makes per person.',r:['Winback: $8.46','Welcome: $6.18','Checkout: $5.15','Browse','Post-purchase'],p:['Best in our fleet, not averages.','Most brands\' winback makes close to nothing.'],c:'V'},
{s:5,f:'talk',t:'229 Emails Never Tested',h:'We found 229 flow emails that had never been A/B tested. Not once.',p:['Every flow email we run gets tested.','We launched 140 tests in under 10 minutes.'],c:'A'},
{s:5,f:'talk',t:'Upsell 10 Minutes After Checkout',h:'Stop waiting for delivery to upsell.',p:['10–15 minutes after checkout is the highest trust and excitement you\'ll ever get.','Even better: let them add to the same order before it ships.'],c:'V'},
{s:5,f:'wb',t:'One Pop-up Is Not a Strategy',h:'If you only have one pop-up, you don\'t have a pop-up strategy.',p:['Homepage: 5–8 seconds or exit intent.','Product page: 40 seconds or 50% scroll.','Returning visitor in 7–14 days with a stronger offer. Subscribers on product page get pushed to SMS.'],c:'V'},
{s:5,f:'talk',t:'10% Off Beat 60% Off',h:'The tool said 60% off won. You overruled it. 10% off converted at double.',p:['A scratch-card pop-up test.','Bigger isn\'t better.'],c:'A'},
{s:5,f:'talk',t:'SMS Sign-ups Went 5x',h:'A sleep brand went from 153 SMS sign-ups a week to 781.',p:['A pop-up rebuild, done in weeks.','Plus about 1,300 extra email sign-ups a week.','About $8–10k a month in extra sales.'],c:'A'},
{s:5,f:'talk',t:'You Don\'t Have Enough Pop-ups',h:'Think you have too many pop-ups? You don\'t.',p:['Top brands catch 8–12% of visitors.','Most stores catch a fraction of that.','2–3 minimum.'],c:'A'},
{s:5,f:'talk',t:'$80k a Year From the Cancel Button',h:'The cheapest money in your business is behind the cancel button.',p:['A pet brand\'s cancel screens, rebuilt and tested.','Saves went from 6% to 12.5% in 14 days.','About $80k a year.'],c:'A'},
{s:5,f:'talk',t:'75% Off Didn\'t Beat 50% Off',h:'We gave lapsed subscribers 75% off. It didn\'t work any better than 50%.',p:['Supplement brand winback test: 18 vs 19 back per 10,000.','Deeper discounts don\'t buy more saves.'],c:'A'},
{s:5,f:'talk',t:'Never Advertise "Cancel and Get 50%"',h:'Never tell subscribers they\'ll get 50% off if they cancel.',p:['It teaches savable customers to cancel.','Pause, skip, swap first. Max 30% at cancel.','50% only for people lapsed 30+ days, by flow, never advertised.'],c:'A'},
{s:5,f:'talk',t:'Failed Payments Are Free Money',h:'Your failed payments are money you\'ve already earned.',p:['Men\'s skincare brand: recovery went from 52% to 67%.','Retry ladders, card-update emails, quick actions.','A 30% offer got 51.6% of cards updated vs 36.6% with a plain reminder.'],c:'A'},

// ---------------- SESSION 6: AUDITS, AGENCIES, SKITS ----------------
{s:6,f:'talk',t:'Half Your List Has Never Opened',h:'Half your email list has never opened a single email.',p:['Our audits keep finding it.','102,532 of 208,179 at one brand.','What to do with them before Black Friday.'],c:'A'},
{s:6,f:'talk',t:'9,199 Emails to 93 People',h:'One brand sent 9,199 emails to 93 people. In one day.',p:['A browse flow with no re-entry filter, firing at bots.','About 200,000 sends in total.','The fix takes 2 minutes.'],c:'A'},
{s:6,f:'talk',t:'A Post-Purchase Flow Making $0',h:'This store does A$891,000 a year and its post-purchase flow made $0.',p:['A lighting brand.','Customers buy once and vanish. This is why.'],c:'L'},
{s:6,f:'talk',t:'638,100 Junk Profiles',h:'This brand was paying for 638,100 email contacts. 99.5% were junk.',p:['Pixel-captured contacts nobody signed up as.','You pay Klaviyo for every one.'],c:'A'},
{s:6,f:'talk',t:'Email Under 20% Is the Problem',h:'If email makes under 20% of your Shopify revenue, you\'re leaving money on the table.',p:['Our clients sit at 25–35%.','The gap we find in audits: $20k to $146k a month.'],c:'A'},
{s:6,f:'talk',t:'Agencies Are a Copy-Paste Machine',h:'The person who sold you your email agency isn\'t the person running your account.',p:['Seniors sell, juniors run it.','Same template, every brand.','"$50k or you don\'t pay" flow promises are nonsense. Anyone can build a flow.'],c:'A',x:'No agency names.'},
{s:6,f:'talk',t:'Don\'t Hire an Agency (Yet)',h:'I run an email agency, and I\'m telling you not to hire one.',p:['Under $50–100k a month, fix your setup first.','Deliverability, list growth, the basics.','Advanced work pays later.'],c:'V'},
{s:6,f:'talk',t:'140 A/B Tests in 10 Minutes',h:'We launched 140 A/B tests in under 10 minutes.',p:['Our tool launches tests across every brand at once.','The rule for picking a winner: 1,000 per version, a 10% lead, revenue has a veto.'],c:'A'},
{s:6,f:'list',t:'What Our AI Does Before You Wake Up',p:['Film: you arriving at the office, laptop opening, screens, coffee.','We add the list: calendar, copy, subject lines, designs into Klaviyo drafts; one scan of every flow on every account; a senior strategist signs off every send.'],c:'A'},
{s:6,f:'skit',t:'The Agency Report Call',lines:[['AGENCY','"Great month! Open rates hit 48%."'],['OWNER','"What did email make?"'],['AGENCY','"Opens are a really strong signal..."'],['OWNER','"Since Apple\'s privacy change, opens don\'t mean much. Clicks show intent. What did it make?"'],['AGENCY','"...I\'ll get back to you."']],c:'A'},
{s:6,f:'skit',t:'Gmail the Bouncer',lines:[['GMAIL','"Name?"'],['YOUR EMAIL','"BLACK FRIDAY 50% OFF!!!"'],['GMAIL','"Same template as 500 brands tonight. Promotions. Next."'],['PLAIN-TEXT EMAIL','"Quick favour?"'],['GMAIL','"People actually reply to you? Go on in."']],c:'V'},
{s:6,f:'borrow',t:'React: "Email Is Dead"',h:'People keep saying email is dead. Here\'s what it made one store in a day.',p:['We send you a clip of a well-known creator saying email or retention doesn\'t matter.','Watch it, then answer with a real number: 37% of a pet brand\'s Black Friday.'],c:'A'},
{s:6,f:'talk',t:'Here\'s How I Can Help',h:'If you run a Shopify brand doing over a million a year, here\'s how I can help.',p:['Email and SMS on Klaviyo, all in-house. No templates, no outsourcing.','Free Klaviyo audit in 48 hours. I do it myself.','For $3M+ brands, we build the flows for free.'],c:'A',x:'This becomes the pinned video. No prices.'},
{s:6,f:'street',t:'What % of Your Revenue Is Email?',h:'What percentage of your revenue comes from email?',p:['Film at the next ecommerce or Klaviyo event in London.','Ask 5–10 founders. After each answer, give yours: healthy is 25–30%.'],c:'A',x:'Filmed when it happens, not in Session 6.'},
{s:6,f:'live',t:'Black Friday, Live',h:'It\'s 6am on Black Friday. The first email just went out.',p:['Film a 10-second clip at every send: 6am, 7am, 9am, 11am, 1pm, 3pm, 4pm, 6pm, 8pm, 10pm, 10:30pm.','Say the time and what just went out.','End of night: the number, brand hidden.'],c:'B',x:'Filmed on Black Friday itself.'}
];
