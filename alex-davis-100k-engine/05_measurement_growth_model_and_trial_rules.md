# 05 · Growth Model, Trial Reel Rules, Measurement and Iteration

## 1. The goal, stated honestly

- Pulled 2026-11-16: **42,700 followers**. Target 100,000 by 2026-12-31.
- That is **57,300 net new followers in 45 days = 1,273 per day.**
- This package was requested on Nov 16. The 7-day production sprint ends about Nov 23, leaving about 38 days of publishing.

### What your own numbers say about the size of the ask

The only conversion fact available from public data: your three pinned Reels total **19.9M plays**, and your whole account has 42,700 followers. Even if every follower you have came from those three videos, that is **at most 2.15 followers per 1,000 plays**. The true figure is lower, because other posts and your pre-2026 history also contributed. I do not have your real follow counts per Reel, so everything below uses **illustrative assumptions, not benchmarks**.

| Assumed followers per 1,000 plays | Plays needed for +57,300 | What that means in 45 days |
|---|---|---|
| 0.3 (illustrative low) | 191M | About 14 Central Park-sized videos |
| 0.8 (illustrative base) | 72M | About 5 Central Park-sized videos |
| 2.0 (near your lifetime ceiling) | 29M | About 2 Central Park-sized videos, all converting at your best-ever rate |

Visible history: 3 videos above 1M in roughly the last 7 months.

### Scenarios for Dec 31 (illustrative, labeled assumptions)

| Scenario | Assumed outcome over 38 publishing days | Assumed conv. | Net new | Dec 31 |
|---|---|---|---|---|
| Low | No video above 1M. ~250 trials near the current 1.8K median, 10% reach ~30K. ~1.2M plays | 0.8 /1K | ~1,000 | ~43.7K |
| Base | Two videos at 2 to 3M, ten at ~100K. ~6M plays | 0.8 /1K | ~4,800 | ~47.5K |
| High | One 10M+, three at 2 to 3M, twenty at 100K. ~20M plays | 1.0 /1K | ~20,000 | ~63K |
| 100K | ~57M plays at 1.0/1K, or ~29M at 2.0/1K | | 57,300 | 100K |

**Read:** 100K by Dec 31 requires out-performing your best seven months, in six weeks, at your best conversion rate. It is possible only if one or two formats hit at Central Park scale *and* convert. Plan for it, do not bank on it. The lever you control that the old content ignored is **conversion**: a meme with 5M plays and no reason to follow adds fewer followers than a 500K skit that shows who you are. That is why the primary KPI is follows per 1,000 non-follower accounts reached.

**Replace these assumptions with real data after 30 trials:** compute your actual median and top-quartile follows per 1,000 reached, and redo this table.

## 2. Trial Reels: what is confirmed and what is not (checked 2026-11-16)

Official Instagram help pages did not surface in search; the points below come from Instagram statements reported by trade press and third-party guides. Where sources disagree it is marked.

| Point | Status |
|---|---|
| A trial reel is shown to non-followers only and stays off your grid and followers' feeds until shared | Consistent across sources |
| Eligibility: public account, 1,000+ followers | Reported as confirmed by Adam Mosseri; you qualify |
| Insights (views, likes, comments, shares) populate about 24 hours after posting; dashboards also show saves, accounts reached, watch time | Consistent |
| "Share to everyone" can be tapped manually from the trial's insights | Consistent |
| Optional auto-share after 72 hours if the trial "performs well" | Reported; Instagram has not published the threshold |
| Daily cap on trial reels | **Unconfirmed.** Reports range from 5 to about 20 per day, and Instagram has tested "almost reached the limit" notices. At 4 to 10 per day you may hit a cap; if you see the notice, stop for the day |
| Scheduling trial reels in advance (reported Feb 2026) | Third-party report only |

**Settings to use**
1. Turn **off** automatic sharing after 72 hours. Your promotion decision should be yours, made on the scorecard below, not on an unpublished threshold.
2. Because a trial is served only to non-followers, "accounts reached" on a trial **is** non-follower reach until you share it. Record it at 48 hours, before promoting.
3. Do not assume a trial gets broad distribution. A trial at 300 views after 48 hours is a normal outcome, not a bug.

Sources: [Buffer](https://buffer.com/resources/instagram-trial-reels/), [Planoly: which trial metrics matter](https://www.planoly.com/blog/which-trial-reel-metrics-matter), [Social Media Today](https://socialmediatoday.com/news/instagram-expands-access-trial-reels/752895/), [The Keyword](https://www.thekeyword.co/news/instagram-expands-trial-reels-to-all-public-creators-with-1k-or-more-followers), [Lindsey Gamble: daily limit test](https://www.lindseygamble.com/blog/instagram-tests-a-daily-limit-on-how-many-trial-reels-creators-can-share), [Metricool](https://metricool.com/instagram-trial-reels/), [Storrito: 72 hours](https://storrito.com/resources/how-instagram-trial-reels-work-72-hours/), [9to5Mac launch coverage](https://9to5mac.com/2024/12/10/instagrams-new-trial-reels-feature-lets-creators-test-content-with-non-followers).

## 3. Your 10K-views rule, evaluated

**What it gets right:** it is simple and it filters out the ~80% of trials that go nowhere (7 of your 9 recent Reels were under 2,500).

**What it gets wrong, with your own examples:**
- It would promote the Nvidia-CEO club meme (18.4K). That post says nothing about you and gives a follower no reason to stay. Promoting it trains your 42.7K followers to expect memes.
- It has no time window. 10K at hour 20 and 10K at day 6 are different videos.
- It ignores the only number tied to your goal. A 6K-view skit that produced 40 follows (6.7 per 1,000) is a better asset than a 60K meme that produced 30 (0.5 per 1,000).

### Replacement: 48-hour scorecard

Read every trial at **24h and 48h after posting**, same clock for every video. Log the 48h numbers in `06_trial_reel_tracker.csv`.

Definitions:
- **F/1K** = follows ÷ non-follower accounts reached × 1,000
- **S/1K** = shares ÷ accounts reached × 1,000
- **Watch %** = average watch time ÷ video length
- **Brand fit** (you score it before posting): 3 = shows your job, your age/stage, or your story. 2 = your face and humor, no business context. 1 = could be on any meme page.

| Decision | Rule at 48h |
|---|---|
| **PROMOTE** (Share to everyone) | Brand fit ≥ 2 **and** views ≥ 3× your trailing-30-trial median **and** (F/1K in your top quartile **or** S/1K in your top quartile) |
| **REMAKE** (do not promote yet; film 3 new hooks) | F/1K ≥ 2× your median **at any view count above 500 reached**, including far below 10K. This is the high-conversion outlier rule |
| **PROMOTE AS-IS, LOW PRIORITY** | Brand fit 3, views ≥ 3× median, F/1K near median. Promote at most one of these per day |
| **HOLD** | Brand fit 1 at any view count. Leave it as a trial. If it passes 1M on its own, share it, but do not make sequels |
| **KILL FORMAT** | Three consecutive scripts in the same format all below median views **and** below median F/1K |

**Until you have 30 trials logged** (about day 5), use these provisional lines, and treat them as placeholders, not benchmarks: views ≥ 6,000 at 48h (3× the 1.8K median observed on Nov 16), and rank F/1K and S/1K within each day's batch, promoting only the top two per day.

Cap promotion at **2 Reels per day** to the main audience so followers are not flooded.

## 4. Iteration loop (run every Sunday, 30 minutes)

1. Sort the tracker by F/1K. Top 5 = "converters". Sort by S/1K. Top 5 = "spreaders". A video in both lists is a series.
2. For each series candidate write 3 new videos: same mechanism, new subject. Example: if the whiteboard skit wins, the next three are different pairs, not the same pair re-shot.
3. For each REMAKE flag: keep the body, re-film only the first 3 seconds with the alternate hooks in the script file.
4. Drop any format that met the KILL rule.
5. Do not draw a conclusion from fewer than 3 videos of a format, and do not credit a posting time, hashtag or audio for a result from a single post.
6. Recompute the trailing median and quartiles. Update section 1's table with real conversion.

## 5. Tracker columns

`06_trial_reel_tracker.csv` has one row per video ID, pre-filled with title, pillar and reference URL, and blank cells for: Trial Reel URL, variant, date/time posted, 24h views, 48h views, non-follower accounts reached, likes, comments, shares, saves, average watch time, video length, watch %, profile visits, follows, F/1K, S/1K, profile-visit-to-follow %, brand fit, decision, promoted (y/n), promoted date, 7-day views, 7-day follows, next iteration, notes. Add a row per variant (V001-B, V001-C) when you test alternate hooks.
