# 01 · Creator Audit: Alex Davis

**Data pulled:** 2026-11-16. **Source for every number below:** vidIQ public-profile endpoints (Instagram Reels tab, TikTok profile feed) and the connected YouTube channel. Footage notes come from a watch-and-transcribe pass on each video marked "watched".

## 1. Coverage versus the brief (read this first)

| Requirement | Target | Actual | Why |
|---|---|---|---|
| Instagram posts analyzed | 30 | **12** | The public Reels endpoint returns one page: 3 pinned + 9 newest. No pagination. Your Instagram is linked to vidIQ as a manual (inactive) connection, so private Insights were not readable. |
| TikTok posts analyzed | 20 | **9** | See the handle problem below. |
| YouTube Shorts (not requested, added) | 0 | **50** | Channel @itsalexdavis is OAuth-connected, so this was available. |
| Highest performers watched | 15 | **3** IG + metrics on 4 TikTok | Only 3 Instagram posts above 1M are visible. |
| Recent underperformers | 10 | **7** IG (4 watched) + 40 YouTube Shorts under 3K | |
| Follower conversion per post | wanted | **0 posts** | Requires Insights. Not available. |
| Agency site firstmillionviews.com | wanted | **not read** | The host is outside this session's allowed network domains. |

**TikTok handle problem.** The handle in the brief, `@.alex.davis`, resolves to an account with 8.4K followers (not 11K), 0 public videos, no bio, and a football-stadium profile photo. I could not confirm it is yours and it has nothing to analyze. `@itsalexdavis` (1.2K followers, 13 videos) matches your YouTube handle and carries the same Central Park video as your Instagram, so I audited that one. `@alexanderkdavis` on TikTok exists with 0 followers and a Savannah bio. **Action for you:** tell me which TikTok is the 11K account.

**What would close the gaps:** (a) reconnect Instagram to vidIQ with OAuth (unlocks reach, follows, shares, saves, watch time, retention per Reel, including Trial Reels), or (b) export Insights for your last 60 Reels as screenshots or CSV.

## 2. Instagram, all 12 visible Reels (ranked by plays)

Likes/plays and comments/plays are computed from the public counts. Shares, saves and follows are not public on Instagram: `null`.

| # | URL | Posted | Plays | Likes | Cmts | Like rate | Cmt rate | Len | Watched | What it is |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | https://www.instagram.com/reel/DZNp0AutGJJ/ | 2026-06-05 | 13,500,000 | 238,700 | 1,800 | 1.77% | 0.013% | 9s | yes | Green screen. You stand in front of an aerial of Manhattan where Central Park is replaced by a parking lot. Text: "Central Park". No speech. Your face goes from neutral to a slow exaggerated grin. Accordion waltz. One shot. Caption tags @nytimes @nypost. |
| 2 | https://www.instagram.com/reel/DXUVt71pVmI/ | 2026-04-19 | 3,600,000 | 120,600 | 403 | 3.35% | 0.011% | 8s | yes | Selfie on a plane, you lie across an empty 3-seat row. Text: "Travel hack: buy the whole row. It's cheaper than business class". No speech. Pop track. One shot. |
| 3 | https://www.instagram.com/reel/DWwwboOgTD2/ | 2026-04-05 | 2,800,000 | 91,200 | 2,400 | 3.26% | 0.086% | 35s | yes | Whiteboard skit, one shot, no music. "$5,000 client. Money sent. Thanks." then a frantic, scribbling, voiced meltdown as the "$500 client", ending deadpan: "Work with people who have money. Don't do this." Text: "2 Types of Clients". |
| 4 | https://www.instagram.com/reel/DfxTBS1hDBL/ | 2026-11-15 | 35,800 | 1,100 | 13 | 3.07% | 0.036% | 12s | yes | Text: "How I feel waking up to put my Apple Watch on". You touch the watch, hard cut to the Iron Man suit-up clip with "Animals". |
| 5 | https://www.instagram.com/reel/DfqJm4kBfhn/ | 2026-11-12 | 18,400 | 374 | 12 | 2.03% | 0.065% | 8s | yes | Club footage of a man in glasses dancing on a post. Text: "Nvidia's CEO is proof that lack of self control is the downfall of any man's life." |
| 6 | https://www.instagram.com/reel/DftXxKeBvFQ/ | 2026-11-14 | 2,200 | 21 | 2 | 0.95% | 0.091% | 30s | no | Whop "comment the word" tutorial. |
| 7 | https://www.instagram.com/reel/Dfr5srDBSVo/ | 2026-11-13 | 1,900 | 30 | 0 | 1.58% | 0 | 7s | no | Jensen Huang brand-tag meme. |
| 8 | https://www.instagram.com/reel/DfvCPULhc_j/ | 2026-11-14 | 1,800 | 24 | 5 | 1.33% | 0.28% | 10s | yes | In the Lexus drinking coconut water. Text: "If you're talking about GTA VI and don't have $100K liquid you're fried". |
| 9 | https://www.instagram.com/reel/Dfr7Jieh8UA/ | 2026-11-13 | 1,700 | 54 | 0 | 3.18% | 0 | 6s | no | @microsoft brand-tag meme. |
| 10 | https://www.instagram.com/reel/DfzrWo2hlrH/ | 2026-11-16 | 1,400 | 22 | 0 | 1.57% | 0 | 9s | no | "Dang #fyp" (under 24h old at pull). |
| 11 | https://www.instagram.com/reel/Dfz-I_RhDqT/ | 2026-11-16 | 1,300 | 32 | 1 | 2.46% | 0.077% | 12s | no | Running joke (under 24h old at pull). |
| 12 | https://www.instagram.com/reel/Dfx90CVPuaP/ | 2026-11-15 | 115 | 1 | 0 | 0.87% | 0 | 30s | yes | Whop + Claude tutorial. Opens on a "$35,632" graphic, 10 silent screen-tap steps, ends "comment 'WHOP'". |

Rows 10 to 12 were under 48 hours old at the pull, so their totals are not final. Rows 4 to 12 may be Trial Reels; the public data does not say.

**Median of the 9 recent Reels: about 1,800 plays.** Two of nine cleared your 10K promotion line.

## 3. TikTok @itsalexdavis, 9 visible videos (ownership inferred, not confirmed)

| URL | Posted | Views | Likes | Cmts | Shares | Saves | Share rate | Len | Caption |
|---|---|---|---|---|---|---|---|---|---|
| https://www.tiktok.com/@itsalexdavis/video/7647623185218702605 | 2026-06-04 | 1,500,000 | 106,300 | 1,200 | 1,500 | 5,600 | 0.10% | 9s | Central Park green screen |
| https://www.tiktok.com/@itsalexdavis/video/7617502198481603870 | 2026-03-15 | 573,800 | 4,000 | 318 | 5,300 | 970 | **0.92%** | 8s | "@apple is this true?!" AirPods Max |
| https://www.tiktok.com/@itsalexdavis/video/7702478785408486686 | 2026-10-30 | 250,200 | 6,900 | 105 | 784 | 380 | 0.31% | 38s | "@Binance sorry guys" |
| https://www.tiktok.com/@itsalexdavis/video/7646530562903035166 | 2026-06-01 | 240,800 | 9,200 | 97 | 117 | 542 | 0.05% | 8s | "Do you get the joke?!" Central Park |
| https://www.tiktok.com/@itsalexdavis/video/7617449132952702222 | 2026-03-15 | 190,000 | 7,000 | 21 | 64 | 291 | 0.03% | 8s | "You never know why someone is on a plane" |
| https://www.tiktok.com/@itsalexdavis/video/7682873420786289933 | 2026-09-07 | 84,000 | 3,800 | 118 | 377 | 644 | 0.45% | 6s | "@apple sound about right?!" |
| https://www.tiktok.com/@itsalexdavis/video/7633523042588642591 | 2026-04-27 | 55,100 | 914 | 11 | 22 | 82 | 0.04% | 11s | "David Goggins spotted" |
| https://www.tiktok.com/@itsalexdavis/video/7579957716601376013 | 2025-12-04 | 44,500 | 89 | 0 | 4 | 9 | 0.01% | 12s | Yellow font |
| https://www.tiktok.com/@itsalexdavis/video/7640669371551010079 | 2026-05-17 | 34,500 | 2,100 | 37 | 82 | 89 | 0.24% | 32s | Alarms |

None of these were watched (credits were spent on references instead), so there are no hook or structure claims for them.

## 4. YouTube Shorts @itsalexdavis, last 50 public Shorts (2026-07-02 to 2026-10-21)

- 47 of 50 are under 6,000 views. Median is roughly 1,350.
- **Only three broke out:** "Learning Saxophone in 1 day" 41,882 views, 1,225 likes, 111 comments (61s, a real challenge with a visible outcome). "Not in Minecraft?! Don't eat" 11,432 (7s). "Solo Table Theory" 7,401 (10s).
- **Consistently dead topics (each under 2,500, many attempts):** "How to make $10K / $100K", "Best path to wealth", "read these books", "best guru", "use these AI tools", ranked lists of billionaire apps / purchases / credit cards / business models. That is about 30 of the 50.
- The YouTube repost of the client skit ("Every type of client", 1,690; "Clients be like", 1,547 and 1,415) did not travel there. The same idea did 2.8M on Instagram, so this is a platform/distribution difference, not a verdict on the format.

## 5. Ranked findings

Evidence-backed first, hypotheses labeled.

1. **Your ceiling format is a single silent visual gag under 10 seconds with one line of text.** Rows 1 and 2 (13.5M and 3.6M) and the TikTok AirPods clip (highest share rate, 0.92%) all share: one shot, no speech, text of 2 to 12 words, the joke is fully legible with sound off. *Observed.* Hypothesis on why: completion rate on a 9-second clip is near 100% and rewatches stack, and the Central Park image provokes "is this real" in comments and sends.
2. **Your acting is the differentiator that also earns comments.** The client skit has a comment rate 6 to 8 times higher than the two silent hits (0.086% vs 0.011 to 0.013%) on 2.8M plays. It is the only top post that shows what you do for work. *Observed.* Hypothesis: it is the best of the three at converting a viewer into a follower because it tells them what the account is about. This cannot be confirmed without follow data.
3. **Brand-tag jokes work only when the visual is the joke.** Apple Watch into Iron Man (35.8K) and AirPods (573.8K on TikTok) beat Microsoft, Jensen and Nvidia-CEO text memes (1.7K to 18.4K). The losers are captions over unrelated footage. *Observed on a small sample.*
4. **Anything that looks like a money pitch dies.** Whop tutorials (115 and 2.2K), "$100K liquid" (1.8K), and about 30 YouTube wealth/guru/books Shorts (about 1 to 2K each). *Observed, large sample on YouTube.*
5. **Real challenges with an outcome beat advice.** Saxophone in 1 day did 30 times your YouTube median. *Observed, n=1.*
6. **The feed does not currently say who you are.** Of the 9 recent Reels, zero show the agency, a client, a result, or a personal story. The bio promises "Helping brands get 1M views". A visitor arriving from a meme sees memes. *Observed.* Hypothesis: this caps profile-visit-to-follow conversion.

### Answers to the audit questions

| Question | Answer | Confidence |
|---|---|---|
| Formats that consistently outperform | Silent one-shot visual gag under 10s; acted character skit about clients | Medium (3 hits, but they are 100x the median) |
| Videos that attract followers vs passive views | **Unknown.** No follow data. Best guess is the client skit | Low |
| Hooks that generate curiosity | A visual that looks wrong ("Central Park" as a parking lot); a claim that sounds too simple ("buy the whole row") | Medium |
| Videos that generate shares | TikTok only: AirPods @apple (0.92%), "@apple sound about right" (0.45%), Binance (0.31%) | Medium |
| Formats that exploit acting | Only one exists: the whiteboard client skit. It is under-used | High |
| Business topics that entertain | Client behavior. Nothing else has been tried in a comedic frame | Medium |
| Lifestyle videos with narrative appeal | None found in the visible set. The France Short did 2,184 on YouTube | Low |
| Winners that can become series | "2 Types of ___" whiteboard; "[Place/brand], but wrong" green screen; "Travel hack:" one-liners | Medium |
| Formats to discontinue | Comment-keyword Whop tutorials; wealth/guru/book list Shorts; text memes over unrelated footage; income-number openers | High |

## 6. Compliance flag

Reel 12 opens on "$35,632" beside the Whop and Claude logos and ends on a dashboard showing $299.85. A viewer will read $35,632 as earnings from that method. If that figure is not your documented result from that exact method, remove it: it is the kind of income claim the FTC treats as deceptive, and your bio says "Partnered with @whop", so these posts also need a clear paid-partnership disclosure. None of the 50 scripts in this package use an income number.

## 7. What this audit changes in the plan

- 60%+ of the 50 scripts are built to work with sound off and to land in under 20 seconds, because that is where your three largest results came from.
- Character skits are the largest pillar (18) because the client skit is your only proven acted format and the only top post tied to your business.
- No script is a tips list, a ranking of gurus, or a comment-keyword funnel.
- Every script puts either your job, your age, or your move/rebuild on screen, so a profile visitor can tell what the account is.
