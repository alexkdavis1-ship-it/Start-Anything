#!/usr/bin/env python3
"""Assemble the deliverables from the per-video script JSON files.

Inputs : scripts/draft/*.json (one per reference key), research/ALL_candidates.json
Outputs: scripts/V0xx.json, 02_viral_reference_database.csv, 03_production_masterlist.md,
         04_filming_scripts.md, 06_trial_reel_tracker.csv, 07_seven_day_production_calendar.md
"""
import csv, glob, json, os, sys
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
DRAFT = os.path.join(HERE, "scripts", "draft")
OUT = os.path.join(HERE, "scripts")
CAND = os.path.join(HERE, "research", "ALL_candidates.json")

BATCH_NAMES = OrderedDict([
    ("A", "Desk and whiteboard, solo"),
    ("B", "Desk phone skits with wardrobe changes"),
    ("D", "Home: bed, kitchen, couch silent gags"),
    ("C", "Car (Lexus) and parking lot"),
    ("E", "Green screen and screen breakdowns"),
    ("G", "Voiceover + b-roll and straight-to-camera"),
    ("F", "Out in public, street, collaborator"),
])
DAY_SIZES = [7, 7, 7, 7, 7, 7, 8]
WEIGHTS = [("reference_evidence_quality", 25), ("fit_with_alex_historical_winners", 20),
           ("follower_conversion_potential", 20), ("creative_execution_quality", 15),
           ("ease_of_production", 10), ("repeatability", 10)]


def evidence_score(ref):
    """Rule-based, 0-25. Same rule for every video."""
    s = 12  # direct URL + indexed view count + footage watched end to end
    v = ref.get("views") or 0
    s += 6 if v >= 10e6 else 5 if v >= 5e6 else 3 if v >= 2e6 else 2 if v >= 1e6 else 0
    m = ref.get("outlier_multiple") or 0
    s += 5 if m >= 200 else 4 if m >= 50 else 3 if m >= 20 else 2 if m >= 10 else 0
    f = ref.get("creator_followers")
    if f is not None and f < 50000:
        s += 2  # small account: the video, not the audience, did the work
    return min(s, 25)


def fmt_views(v):
    if v is None:
        return "n/a"
    return f"{v/1e6:.1f}M" if v >= 1e6 else f"{v/1e3:.0f}K"


def esc(s):
    return str(s if s is not None else "").replace("|", "\\|").replace("\n", " ")


def main():
    drafts = []
    for p in sorted(glob.glob(os.path.join(DRAFT, "*.json"))):
        d = json.load(open(p))
        d["_file"] = os.path.basename(p)
        drafts.append(d)
    if not drafts:
        sys.exit("no drafts")

    for d in drafts:
        r = d["rubric"]
        r["reference_evidence_quality"] = evidence_score(d["original_reference"])
        d["_total"] = sum(r[k] for k, _ in WEIGHTS)
    ranked = sorted(drafts, key=lambda d: (-d["_total"], d["ref_key"]))
    for i, d in enumerate(ranked, 1):
        d["_rank"] = i

    # Order for production: by batch (location), best first inside a batch.
    order = []
    for b in BATCH_NAMES:
        order += sorted([d for d in drafts if d["batch_hint"] == b], key=lambda d: d["_rank"])
    leftovers = [d for d in drafts if d["batch_hint"] not in BATCH_NAMES]
    order += leftovers
    day, used = 1, 0
    for i, d in enumerate(order, 1):
        d["_vid"] = f"V{i:03d}"
        d["_day"] = day
        used += 1
        if day <= len(DAY_SIZES) and used == DAY_SIZES[day - 1] and day < len(DAY_SIZES):
            day, used = day + 1, 0

    # ---- final per-video JSON in the requested schema
    for old in glob.glob(os.path.join(OUT, "V*.json")):
        os.remove(old)
    finals = []
    for d in order:
        ref = dict(d["original_reference"])
        t = dict(d["testing"])
        fin = OrderedDict()
        fin["video_id"] = d["_vid"]
        fin["priority_rank"] = d["_rank"]
        fin["scheduled_day"] = d["_day"]
        fin["production_batch"] = f"Batch {d['batch_hint']}: {BATCH_NAMES.get(d['batch_hint'], '')}"
        fin["content_pillar"] = d["content_pillar"]
        fin["working_title"] = d["working_title"]
        fin["original_reference"] = ref
        fin["research_analysis"] = d["research_analysis"]
        fin["alex_adaptation"] = d["alex_adaptation"]
        fin["production"] = d["production"]
        fin["testing"] = t
        fin["creative_confidence"] = OrderedDict([
            ("score_out_of_100", d["_total"]),
            ("score_type", "Subjective production-priority score, not predicted viral probability"),
            ("score_breakdown", OrderedDict((k, d["rubric"][k]) for k, _ in WEIGHTS)),
            ("rationale", d["creative_confidence"].get("rationale", "")),
            ("uncertainties", d["creative_confidence"].get("uncertainties", [])),
        ])
        fin["research_key"] = d["ref_key"]
        finals.append(fin)
        json.dump(fin, open(os.path.join(OUT, f"{d['_vid']}.json"), "w"), indent=1, ensure_ascii=False)

    # ---- 02 reference database
    cands = json.load(open(CAND))
    sel = {f["original_reference"]["direct_video_url"].rstrip("/"): f["video_id"] for f in finals}
    cols = ["status", "selected_video_id", "platform", "creator_handle", "url", "posted_date", "views",
            "creator_median_views", "outlier_multiple", "creator_followers", "duration_s", "likes",
            "comments", "shares", "caption", "concept", "hook_visual", "hook_text", "hook_audio",
            "format_template", "search_category", "search_query", "metrics_source", "metrics_checked_at"]
    cands.sort(key=lambda r: -(r.get("views") or 0))
    with open(os.path.join(HERE, "02_viral_reference_database.csv"), "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(cols)
        for r in cands:
            u = (r.get("url") or "").rstrip("/")
            vid = sel.get(u, "")
            status = ("selected: footage reviewed" if vid else
                      "footage reviewed, not selected" if r.get("watched") else
                      "candidate: indexed metrics only, footage not reviewed")
            row = {**r, "status": status, "selected_video_id": vid}
            w.writerow(["" if row.get(c) is None else row.get(c) for c in cols])

    # ---- 03 masterlist
    L = ["# 03 · 50-Video Production Masterlist", "",
         "Ranked by the weighted rubric. **The score is a production-priority score, not a predicted probability of going viral.**", "",
         "| Component | Max | How it was scored |", "|---|---|---|",
         "| Reference evidence quality | 25 | Rule-based, identical for all: 12 for a direct URL with an indexed view count and footage watched end to end; +2 to +6 for views (1M / 2M / 5M / 10M); +2 to +5 for the outlier multiple over the creator's own median (10x / 20x / 50x / 200x); +2 if the creator had under 50K followers |",
         "| Fit with Alex's historical winners | 20 | 16-20 if it uses the grammar of a proven Alex hit (silent one-shot gag under 12s, or one-man acted business skit) |",
         "| Follower conversion potential | 20 | High only if a stranger learns who Alex is and has a reason to want the next video |",
         "| Creative execution quality | 15 | Strength of the written payoff |",
         "| Ease of production | 10 | One location, one take, under 15 minutes scores 9-10 |",
         "| Repeatability | 10 | Can he make ten more by swapping one variable |", "",
         "Reference views are the vidIQ outlier-index figure on 2026-11-16. Likes, comments and shares were not available for any external reference and are recorded as null.", "",
         "| Rank | ID | Day | Title | Pillar | Reference | Ref views | x median | Len | Score | Ev | Fit | Conv | Exec | Ease | Rep |",
         "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for f in sorted(finals, key=lambda f: f["priority_rank"]):
        ref, b = f["original_reference"], f["creative_confidence"]["score_breakdown"]
        mult = ref.get("outlier_multiple")
        L.append(f"| {f['priority_rank']} | {f['video_id']} | {f['scheduled_day']} | {esc(f['working_title'])} | {esc(f['content_pillar'].split(' ')[0])} | "
                 f"[{esc(ref['creator_handle'])}]({ref['direct_video_url']}) | {fmt_views(ref.get('views'))} | {('%.0fx' % mult) if mult else 'n/a'} | "
                 f"{f['alex_adaptation']['estimated_duration_seconds']}s | **{f['creative_confidence']['score_out_of_100']}** | "
                 + " | ".join(str(b[k]) for k, _ in WEIGHTS) + " |")
    pc = Counter(f["content_pillar"] for f in finals)
    L += ["", "## Pillar distribution", ""] + [f"- {k}: {v}" for k, v in pc.items()]
    open(os.path.join(HERE, "03_production_masterlist.md"), "w").write("\n".join(L) + "\n")

    # ---- 04 scripts
    S = ["# 04 · 50 Complete Filming Scripts", "",
         "Ordered by video ID, which is production order (grouped by location). `{{REAL: ...}}` marks a fact only Alex knows; fill it with the true value or cut the line.", ""]
    for f in finals:
        ref, ra, ad, pr, te, cc = (f["original_reference"], f["research_analysis"], f["alex_adaptation"],
                                   f["production"], f["testing"], f["creative_confidence"])
        mult = ref.get("outlier_multiple")
        S += [f"---", "", f"## {f['video_id']} · {f['working_title']}", "",
              f"**Rank {f['priority_rank']} of 50 · Score {cc['score_out_of_100']}/100 · Day {f['scheduled_day']} · {f['production_batch']} · {f['content_pillar']} · {ad['estimated_duration_seconds']}s**", "",
              "### Reference",
              f"- {ref['platform']} · {ref['creator_handle']} · {ref['direct_video_url']}",
              f"- Posted {ref.get('publication_date')} · {fmt_views(ref.get('views'))} views"
              + (f" · {mult:g}x the creator's median" if mult else "")
              + (f" · creator had {ref['creator_followers']:,} followers" if ref.get("creator_followers") is not None else "")
              + f" · checked {ref.get('metrics_checked_at')} ({ref.get('metrics_source')})",
              f"- Footage reviewed: {'yes' if ref.get('footage_reviewed') else 'no'} · Not available: {', '.join(ref.get('missing_data') or []) or 'none'}", "",
              "### Why the reference worked",
              f"- **Observed hook:** {ra['exact_observed_hook']}",
              f"- **First frame:** {ra['visual_hook']}",
              f"- **Structure:** {ra['narrative_structure']}",
              f"- **Mechanism:** {ra['viral_mechanism']}",
              f"- **Observed evidence:** {ra['observed_evidence']}",
              f"- **{ra['performance_hypothesis']}**" if not ra['performance_hypothesis'].startswith("Hypothesis") else f"- **Hypothesis (not observed):** {ra['performance_hypothesis'].split(':',1)[1].strip()}",
              f"- **Why it fits Alex:** {ra['why_this_format_fits_alex']}",
              f"- **What is borrowed vs new:** {ra['originality_changes']}", "",
              "### Alex's version",
              f"- **Concept:** {ad['concept']}",
              f"- **Audience:** {ad['target_audience']} · **Emotion:** {ad['primary_emotion']}",
              f"- **First frame:** {ad['first_frame']}",
              f"- **First spoken line:** {ad['first_spoken_line']}", "",
              "| Time | Speaker | Dialogue | Action and acting | Camera | On-screen text | Edit | Audio |",
              "|---|---|---|---|---|---|---|---|"]
        for b in ad["full_script"]:
            S.append(f"| {b['start_second']}-{b['end_second']}s | {esc(b.get('speaker'))} | {esc(b.get('dialogue'))} | {esc(b.get('action'))} | {esc(b.get('camera'))} | {esc(b.get('on_screen_text'))} | {esc(b.get('editing'))} | {esc(b.get('audio'))} |")
        S += ["", "**Alternate hooks**"] + [f"{i}. {h}" for i, h in enumerate(ad["alternate_hooks"], 1)]
        S += ["", "**Alternate endings**"] + [f"{i}. {h}" for i, h in enumerate(ad["alternate_endings"], 1)]
        S += ["", f"**Caption:** {ad['caption']}", "", f"**CTA:** {ad.get('call_to_action') or 'None'}", "",
              "### Production",
              f"- **Location:** {pr['location']} · **People:** {pr['people_required']} · **Film:** {pr['filming_minutes_estimate']} min · **Edit:** {pr['editing_minutes_estimate']} min · **Difficulty:** {pr['difficulty']} · **Batchable:** {'yes' if pr.get('can_batch_film') else 'no'}",
              f"- **Props:** {', '.join(pr.get('props') or []) or 'none'}",
              f"- **Wardrobe:** {pr.get('wardrobe')}",
              "- **Shot list:**"] + [f"  {i}. {s}" for i, s in enumerate(pr.get("shot_list") or [], 1)]
        if pr.get("b_roll"):
            S += ["- **B-roll:** " + "; ".join(pr["b_roll"])]
        S += [f"- **Editor:** {pr.get('editor_instructions')}", "",
              "### Test plan",
              f"- **Variants:** {'; '.join(te['variants_to_test'])}",
              f"- **Brand fit:** {te.get('brand_fit')} of 3 · **Read at:** 24h and 48h · **Primary:** {te['primary_metric']}",
              f"- **Promotion rule:** {te['promotion_decision']}",
              "- **If it wins, make:** " + " / ".join(te["follow_up_variations_if_successful"] if isinstance(te["follow_up_variations_if_successful"], list) else [str(te["follow_up_variations_if_successful"])]),
              f"- **Why this score:** {cc['rationale']}",
              "- **Uncertainties:** " + ("; ".join(cc.get("uncertainties") or []) or "none"), ""]
    open(os.path.join(HERE, "04_filming_scripts.md"), "w").write("\n".join(S) + "\n")

    # ---- 06 tracker
    hdr = ["video_id", "working_title", "content_pillar", "reference_url", "trial_reel_url", "variant", "date_posted",
           "time_posted", "views_24h", "views_48h", "non_follower_accounts_reached_48h", "likes_48h", "comments_48h",
           "shares_48h", "saves_48h", "avg_watch_time_s", "video_length_s", "watch_pct", "retention_3s_pct",
           "profile_visits_48h", "follows_48h", "follows_per_1000_nonfollower_reach", "shares_per_1000_reach",
           "profile_visit_to_follow_pct", "brand_fit_1to3", "decision_PROMOTE_REMAKE_HOLD_KILL",
           "promoted_to_main_audience", "promoted_date", "final_views_7d", "final_follows_7d", "next_iteration", "notes"]
    with open(os.path.join(HERE, "06_trial_reel_tracker.csv"), "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(hdr)
        for n, f in enumerate(finals, 2):
            row = [""] * len(hdr)
            row[0], row[1], row[2] = f["video_id"], f["working_title"], f["content_pillar"]
            row[3], row[5] = f["original_reference"]["direct_video_url"], "Original"
            row[16] = f["alex_adaptation"]["estimated_duration_seconds"]
            row[17] = f'=IF(AND(P{n}<>"",Q{n}>0),P{n}/Q{n},"")'
            row[21] = f'=IF(AND(U{n}<>"",K{n}>0),U{n}/K{n}*1000,"")'
            row[22] = f'=IF(AND(N{n}<>"",K{n}>0),N{n}/K{n}*1000,"")'
            row[23] = f'=IF(AND(U{n}<>"",T{n}>0),U{n}/T{n},"")'
            row[24] = f["testing"].get("brand_fit", "")
            w.writerow(row)

    # ---- 07 calendar
    C = ["# 07 · Seven-Day Production Calendar", "",
         "Video IDs are in production order: each day is built around one or two setups so you are not moving location mid-day. "
         "The schedule is a filming target. If a video is not right, hold it; do not post it unfinished.", ""]
    tot_f = tot_e = 0
    all_props = Counter()
    for day in range(1, 8):
        vids = [f for f in finals if f["scheduled_day"] == day]
        if not vids:
            continue
        fm = sum(f["production"]["filming_minutes_estimate"] for f in vids)
        em = sum(f["production"]["editing_minutes_estimate"] for f in vids)
        tot_f += fm
        tot_e += em
        batches = Counter(f["production_batch"] for f in vids)
        collab = [f["video_id"] for f in vids if f["production"]["people_required"] > 1]
        props = Counter()
        for f in vids:
            for p in f["production"].get("props") or []:
                props[p.strip()] += 1
                all_props[p.strip().lower()] += 1
        C += [f"## Day {day} · {vids[0]['video_id']} to {vids[-1]['video_id']} · {len(vids)} videos", "",
              f"- **Setups:** " + "; ".join(f"{k} ({v})" for k, v in batches.items()),
              f"- **Workload:** {fm} min filming ({fm/60:.1f} h) + {em} min editing ({em/60:.1f} h)",
              f"- **Needs a second person:** {', '.join(collab) if collab else 'none'}",
              f"- **Props today:** {', '.join(sorted(props)) or 'none'}", "",
              "| ID | Rank | Title | Location | Wardrobe | People | Film | Edit | Difficulty |", "|---|---|---|---|---|---|---|---|---|"]
        for f in vids:
            p = f["production"]
            C.append(f"| {f['video_id']} | {f['priority_rank']} | {esc(f['working_title'])} | {esc(p['location'])} | {esc(p.get('wardrobe'))} | {p['people_required']} | {p['filming_minutes_estimate']}m | {p['editing_minutes_estimate']}m | {p['difficulty']} |")
        C.append("")
    C += ["## Week totals", "", f"- Filming: {tot_f} min ({tot_f/60:.1f} h). Editing: {tot_e} min ({tot_e/60:.1f} h). Total: {(tot_f+tot_e)/60:.1f} h, about {(tot_f+tot_e)/60/7:.1f} h per day.",
          f"- Videos needing a second person: {sum(1 for f in finals if f['production']['people_required']>1)}. Book that person for the days listed above.",
          "- Equipment for the whole week: phone, tripod with phone mount, clip-on or wireless lav mic, a second phone or laptop for playback of pre-recorded voice lines, a ring or key light for indoor setups, green screen or a plain wall plus the app's green-screen effect.",
          "", "## Consolidated prop list", ""]
    C += [f"- {p}" + (f" (used in {n} videos)" if n > 1 else "") for p, n in sorted(all_props.items())]
    open(os.path.join(HERE, "07_seven_day_production_calendar.md"), "w").write("\n".join(C) + "\n")

    print(len(finals), "videos;", Counter(f["content_pillar"] for f in finals))
    print("days", Counter(f["scheduled_day"] for f in finals))
    print("batches", Counter(d["batch_hint"] for d in drafts))
    for f in sorted(finals, key=lambda f: f["priority_rank"])[:12]:
        print(f["priority_rank"], f["video_id"], f["creative_confidence"]["score_out_of_100"], f["research_key"], f["working_title"])


if __name__ == "__main__":
    main()
