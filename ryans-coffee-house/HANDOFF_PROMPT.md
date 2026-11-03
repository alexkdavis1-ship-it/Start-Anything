Build a production-ready, mobile-first marketing website for Ryan's Coffee House, a family-owned coffee shop in Parrish, Florida. It must feel premium and cinematic (a real-time 3D hero, layered parallax, scroll-driven motion) while staying fast and perfectly organized on phones. A working reference build is attached as index.html: match it or improve on it.

## 1. Business facts (use exactly; do not invent others)
- Name: Ryan's Coffee House. Owners: Ryan & Krista Lose. Family-run.
- Address: 8231 US-301, Parrish, FL 34219 (an easy drive from Palmetto, Ellenton and Bradenton).
- Phone: (440) 537-6152. Email: ryan.lose@ryanscoffeehouse.com
- Hours: Mon–Sat 7am–7pm, Sun 8am–1pm. Show a live "Open now · until 7pm" / "Closed · opens 7am tomorrow" badge computed in America/New_York time, and highlight today in the hours table.
- Story: started as a mobile coffee trailer in Parrish. Opened the brick-and-mortar shop on January 1, 2026, in the former Cherry Ice Cream and Coffee Shop space. The trailer still does weekend pop-ups and can be booked for events.
- Quote (opening announcement): "Opening a permanent shop in Parrish isn't just an expansion for us – it's a homecoming."
- Taglines: "Start with Coffee" · "Sip, Drink, Relax" · "Support your local caffeine dealer" (front-window decal).
- Proof: 4.9★ Google (150+ reviews), 5.0★ App Store (75 ratings), Instagram @ryans_coffee_house (3.2K followers, verified).
- App (Per Diem): order ahead, Apple Pay / Google Pay, rewards called "beans".
  - App Store: https://apps.apple.com/us/app/ryans-coffee-house/id6760023451
  - Google Play: https://play.google.com/store/apps/details?id=com.tryperdiem.wh.ryanscoffeehouse
- Links: Instagram https://www.instagram.com/ryans_coffee_house/ · Facebook https://www.facebook.com/ryanscoffeehouse · Yelp https://www.yelp.com/biz/ryans-coffee-house-parrish-2
- Directions: https://www.google.com/maps/dir/?api=1&destination=Ryan%27s%20Coffee%20House%2C%208231%20US-301%2C%20Parrish%2C%20FL%2034219

## 2. Menu
- Signatures: Caramel Apple Macchiato, Bananas Foster ("Rich espresso blended with creamy white mocha and sweet banana, finished with a hint of cinnamon."), Salted Caramel Mocha, Lavender Haze, Raspberry White Mocha, S'more Cold Brew, Coffee Cake, Ryan's Special (house signature).
- Espresso & coffee: Double Espresso, Americano, Cappuccino, Latte, Caramel Macchiato, Cold Brew.
- Chai, matcha & more: Matcha, Chai Latte, Dirty Chai, Hot Cocoa, Lemonade, Bubble Tea.
- Don't show prices until the client confirms them (listings show signatures at $5.84–$6.54).

## 3. Brand system
Colors, sampled from their website, Instagram, storefront sign and shop interior:
| Token | Hex | Use |
|---|---|---|
| Navy | #002858 | Logo ink, headlines and buttons on light |
| Night | #001b3d | Dark sections |
| Instagram teal | #409098 | Primary brand fill (marquee, booking section, order buttons) |
| Deep teal | #34747c | Stats band, highlight tiles |
| Wall teal | #1b4756 | Shop interior walls; story section background |
| Bright teal | #30b8b8 | Window decal; small accents on dark only |
| Light teal | #7dd9d6 | Accent text on teal or dark |
| Denim | #4c78a4 | Accent words on light |
| Sage / light sage | #c8d4c4 / #e9eee7 | Storefront sign; menu section background |
| Sky / paper / white | #ecf0f8 / #f7f9fc / #ffffff | Light backgrounds |

- Type: headlines in "Special Elite" (typewriter, matches their current site); body in "DM Sans"; nav wordmark in serif capitals like the storefront sign ("RYAN'S" over spaced "COFFEE HOUSE").
- Accent words: on light, denim text with a teal highlighter swipe that animates in; on dark, light-teal text.
- Logo: coffee-ring stamp with "RYAN'S COFFEE HOUSE" around the ring, a star at the bottom, a "305 / Willow" street sign in the center, drips at the lower left and "Sip, Drink, Relax" along the bottom right. Two versions: navy on white (website) and black ink on teal (Instagram).

## 4. Assets (attached)
- logo-navy.svg and logo-instagram-teal.svg: vector redraws of the logo; swap in the originals if the client provides them.
- owners-ryan-krista.jpg: the owners in front of the shop window.
- ryan-behind-the-bar.jpg and merch-tee.jpg: Instagram posts.
- Use only these photos. No stock photos of other cafés.

## 5. Page structure (in this order)
1. Loader (1.2s max): logo with spinning ring text, "Sip, Drink, Relax." typed out, then a wipe up.
2. Nav: logo + wordmark left; Menu, Story, Trailer, Visit; "Order ahead" button. White over the dark hero, frosted white bar after it. Hides on scroll down, returns on scroll up. Mobile: burger opens a full-screen navy menu.
3. 3D hero (pinned for about 3 screens on desktop, 2.7 on mobile): see section 6.
4. Two crossing marquee bands (teal and navy, rotated ±3°): drink names, and "Support your local caffeine dealer ★ Sip ★ Drink ★ Relax ★ Parrish, FL ★ On the 301". Speed and skew react to scroll velocity; direction flips with scroll direction.
5. Zoom section (pinned): top-down latte on night with outlined "Sip, Drink, Relax." drifting apart. Scrolling zooms into the latte art until it fills the screen, then it dissolves into a cream panel with the owners' polaroid (teal tape, caption "Ryan & Krista") and "Every cup made by hand, by the family who owns the place."
6. Signature drinks: pinned horizontal scroll of 8 cards (gradient per drink, illustrated glass with layers, ice, whip and drizzle; 3D tilt and shine on hover; parallax art) with a progress bar.
7. Story (wall teal): 3 chapters with illustrated scenes and big outlined numbers (01 The trailer, 02 The pop-ups, 03 The house), then the homecoming quote.
8. "Support / your / local / caffeine / dealer.": giant typewriter lines that slide in from alternating sides and lock into alignment mid-scroll; "caffeine" in bright teal; caption "As seen on the front window at 8231 US-301".
9. Full menu board (light sage, like the sign): three columns, dashed rules, hover nudge with a teal dot, link to order in the app.
10. Order-ahead app section (navy): benefit bullets, App Store and Google Play buttons, "5.0★ on the App Store from 75 ratings". A 3D-tilted phone mockup straightens up as you scroll while its menu list scrolls inside; an "Order ready" toast slides in; floating chips (Earn rewards · Apple Pay / Google Pay · Pickup at 8231 US-301).
11. Book the trailer (teal): huge "Book the trailer." with call and email CTAs; an illustrated trailer drives in, parks and drives off with its wheels turning.
12. Instagram "Follow the drops": copy, follower and post counts, Instagram and Facebook buttons; a 2×2 tile grid in offset parallax columns (behind-the-bar photo, highlights tile, verified profile tile with the teal logo, merch photo).
13. Stats band (deep teal): count-up numbers for 4.9★ Google, 5.0★ App Store, 3.2K followers, 2026 opened.
14. Visit (night): address, live status, hours table, call and email, directions and Instagram buttons, embedded Google Map with a US-301 shield badge.
15. Footer: teal Instagram-style logo with rotating ring text, "See you on the 301.", links, and a giant "Ryan's" wordmark that rises into place at the very bottom.
16. Mobile sticky bar (only after the hero): Order · Directions · Call. "Order" deep-links to the App Store on iPhone and Google Play on Android.

## 6. 3D hero spec (Three.js or React Three Fiber)
- Layout: "Start with Coffee." top-center, the cup dead center, a one-line sub plus two CTAs bottom-center ("Order ahead", "See the menu"). Equal side padding (16px on phones) and safe-area insets respected. Desktop: a steps list (01 Pour · 02 Splash · 03 Sip) on the left and proof stats on the right. Mobile: the steps become 3 chips under the cup.
- Scene: glossy white ceramic cup (lathe geometry, clearcoat) printed with the navy logo on both sides, plus navy and teal rings and a handle; latte surface inside; soft contact shadow; teal rim lights; transparent canvas over a radial gradient (teal → wall teal → dark), with a giant outlined "RYAN'S" behind it that slides with scroll.
- Framing: fit the cup to the middle layout row so it's always centered whatever the screen size.
- Choreography by scroll progress p:
  - 0–0.30 Pour: the cup spins slowly; a wobbling milk stream pours from the upper right into the cup with a milk-crown splash; latte art (stacked hearts) blooms.
  - 0.30–0.75 Splash: the cup tilts toward the viewer; latte pours over the front rim; the spin sprays droplets off the rim; a burst on entering the phase; coffee beans orbiting the cup (40 on desktop, 22 on mobile) blast outward, some flying at the camera.
  - 0.75–1 Sip: the cup settles upright and rises; caption "Sip. Drink. Relax."
- Scroll speed adds spin and scrolling up reverses it; pointer movement adds slight parallax.
- Performance: pause rendering off-screen; cap pixel ratio at 1.5 on mobile; fall back to an SVG cup without WebGL; render a static frame with prefers-reduced-motion.

## 7. Motion system
Word-by-word headline reveals, fade-up reveals, magnetic buttons, a custom cursor ring with a "Sip" label over drink cards (desktop only), a scroll progress bar, subtle film grain, and logo ring text that rotates with scroll. Animate only transforms and opacity. Respect prefers-reduced-motion everywhere: disable pins and parallax but keep all content.

## 8. Technical requirements
- Mobile-first. Test at 360, 390 and 430 px wide and at 1440 desktop. No horizontal scroll at any width.
- CafeOrCoffeeShop JSON-LD (address, phone, hours, sameAs links), title, meta description and Open Graph tags, semantic heading order.
- Lighthouse mobile: 85+ performance, 95+ accessibility. Lazy-load the map and below-the-fold images. AA text contrast.
- Every CTA is a real link: tel:, mailto:, Google Maps, App Store, Google Play, Instagram, Facebook.

## 9. Confirm with the client before launch
Hours (public listings disagree), drink descriptions other than Bananas Foster, signature prices, original logo files, and full-resolution photos (the attached photos come from phone screenshots).
