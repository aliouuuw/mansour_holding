# Creative direction brief - Mansour Motors public layer

## What this document is

A briefing for an agent or designer picking up the redesign of the Mansour Motors public
layer. It is assembled **exclusively from the client's own prompts** in the session dated
2026-09-17/18. It deliberately excludes the client's answers to multiple-choice questions
asked by the previous agent, so that the direction is not shaped by that agent's framing.

Anything below marked **[inference]** is the writer's reading, not the client's words.
Everything else is either a direct quote or a plain restatement of one.

Companion documents in this repo: `.impeccable.md` (existing design context) and
`PRODUCT.md` (product truth). See "Unresolved tensions" for a conflict between
`.impeccable.md` and the direction stated in these prompts.

---

## 1. The ask, in the client's words

Chronological. Quoted verbatim, including typos.

**Opening brief**

> "I'm thinking about redesign the public layer of mansour motors, giving it a fresh,
> unique and advanced design. Something that could appear in awwwards.com or
> codrops(https://tympanus.net/codrops/). @.impeccable.md (bolder, overdrive).
> What options do you propose? No changes yet we're planning the creative direction"

**On prototyping**

> "prototype this idea with html, css and js in a prototype directory so I can quickly
> validate it or not"

**Second direction**

> "Leave me with the verifications (aliouwade@mac prototype % bunx serve -p 3008)...
> After checking, its fine this is an alright idea. Not quite convinced yet. Let's take
> another direction, this time think neo-futurism, soft-ui, with scroll triggered
> animations (micro-animations), slight glassmorphism , luxurious-tech fonts,... that
> match well with the brand colors. Let's add another prototype"

**Pushing that direction**

> "Like I said ealier live me for the verifications when the build is done, don't take
> screenshots or do anything else.... I just checked the direction is alright but I'd
> like a much more immersive IA, UX and UI. Scroll-triggered animations shoulde make
> sense, neo-futurism and soft-ui should be pushed further"

**Adding UI references**

> "Change the IA and the UX, in terms of UI also think like CleanMyMac's UI and also
> chinese/asian tech automotive UIs"

**Rejecting the result**

> "no this new dahsboard like direction isn't the innovative, unique look we were looking
> for, this can't be on awwwards or codrops. try something better, delightful .
> @.impeccable (delight, bolder, overdrive)"

**Rejecting the next result**

> "not quite satisfied with the outcome"

No reason was given for this last rejection. That absence is itself important: the brief
does not yet contain a positive, testable definition of what would satisfy.

---

## 2. The brief distilled

### Scope

The **public layer** of Mansour Motors. Not the holding company pages and not the
authenticated dashboard, unless the client extends the scope.

### Ambition and benchmark

The quality bar is named twice and used both as a goal and as a rejection test:

- "Something that could appear in awwwards.com or codrops"
- "this can't be on awwwards or codrops"

Adjectives the client applied to the goal: **fresh, unique, advanced, innovative,
delightful**. Adjectives applied to failure: **dashboard like**.

The client twice invoked the `impeccable` skill with escalating modes: `bolder`,
`overdrive`, then `delight, bolder, overdrive`. Read as a standing instruction to work at
the top of the ambition range and not to hedge.

### Aesthetic vocabulary the client named

Stated directly, and then reinforced with "pushed further":

1. **Neo-futurism**
2. **Soft-UI**
3. **Slight glassmorphism** - the qualifier "slight" is the client's, and should be kept
4. **Luxurious-tech fonts**
5. **Scroll-triggered animations (micro-animations)**
6. Must **match well with the brand colors**

### The motion rule

> "Scroll-triggered animations shoulde make sense"

Read as: motion must be motivated and legible, not decorative. This is a quality bar on
animation, not a request for more of it.

### UI references

- **CleanMyMac's UI** (MacPaw)
- **Chinese / Asian tech automotive UIs**

These were given as UI references specifically ("in terms of UI also think like"), added
on top of the neo-futurism and soft-UI direction, not as a replacement for it.

### The IA and UX demand

Stated twice, and escalating:

- "a much more **immersive** IA, UX and UI"
- "**Change the IA and the UX**"

"Immersive" is applied to information architecture and UX, not only to visual surface.
The client is asking for structural invention, not a restyle.

---

## 3. What the client rejected, and in what terms

| Direction built | Client's verdict | Exact words |
|---|---|---|
| A road-book / rally carnet concept | Lukewarm, kept | "its fine this is an alright idea. Not quite convinced yet" |
| A neo-futurist scroll sequence | Accepted in principle, wanted more | "the direction is alright but I'd like a much more immersive IA, UX and UI" |
| A dock-and-workspace console (CleanMyMac + automotive HMI) | Rejected | "this new dahsboard like direction isn't the innovative, unique look we were looking for, this can't be on awwwards or codrops" |
| A WebGL heat-haze / driving concept | Rejected | "not quite satisfied with the outcome" |

**The clearest signal in the whole brief:** applying the CleanMyMac and automotive-HMI
references literally produced an app-like dashboard, and the client rejected it by name.
The references describe a *feeling and a finish level*, not a layout to reproduce.
**[inference]**

---

## 4. How the client wants to work

These are process constraints, stated plainly and repeated.

1. **Plan before building.** "No changes yet we're planning the creative direction".
2. **Prototype to validate.** Plain "html, css and js in a prototype directory", so a
   direction can be accepted or killed quickly.
3. **The client verifies, not the agent.** Stated twice, the second time with visible
   impatience: "Leave me with the verifications", then "live me for the verifications when
   the build is done, **don't take screenshots or do anything else**".
   Deliver the build plus a verification list. Do not narrate your own inspection.
4. **Local serving command:** `bunx serve -p 3008`, run from the `prototype/` directory.
5. **Iterate by addition.** "Let's add another prototype" rather than always replacing.
6. Directions are judged fast and bluntly. Expect a one-line verdict and be ready to
   discard work.

---

## 5. Unresolved tensions the next agent must settle

**[inference throughout this section]**

### 5.1 The central contradiction

The ambition (awwwards, Codrops, unique, delightful) and the UI references (CleanMyMac,
Asian automotive HMIs) pull in opposite directions.

- awwwards and Codrops reward **experiential** work: one signature idea, a technical or
  compositional risk, a site that could only belong to this brand.
- CleanMyMac and in-car HMIs are **product UI** languages: dock, modules, meters, panels,
  sticky action bars. Excellent craft, but by nature generic across products.

Following the second set faithfully produced the result the client rejected as "dashboard
like". The next agent should treat those references as a **finish and materiality**
reference (precision, tonal depth, confident numerals, control feel), and take the
**structure** from somewhere else entirely.

### 5.2 Saturated vocabulary

Neo-futurism, soft-UI and glassmorphism are the default aesthetic of a very large amount
of 2020s work. The brief asks for "unique" using a vocabulary that mostly produces the
familiar. Resolving this is the actual design problem. A distinctive result probably needs
one idea that is specific to this brand, this city or these vehicles, with the neo-futurist
finish applied to that idea rather than substituting for it.

### 5.3 Conflict with `.impeccable.md`

The existing design-context file in this repo specifies a different world:

- "Sovereign luxury", "Cinematic editorial", "like a high-end magazine spread"
- Typography: Playfair Display plus Plus Jakarta Sans
- Motion: Lenis smooth scroll, parallax, reveal-on-scroll, magnetic hover

The prompts instead ask for neo-futurism, soft-UI, glassmorphism and luxurious-tech fonts.
These are not the same brand world. Someone must decide whether `.impeccable.md` is now
superseded, or whether the new direction has to reconcile with it.

### 5.4 No stated definition of "delightful"

"Delightful" is requested but never defined for this audience. A Dakar buyer spending
between 28 and 98 million FCFA on a 4x4 is not obviously served by playfulness. Delight
here probably has to come from confidence, precision or a single memorable moment, but the
brief does not say. **This is the most important gap.**

---

## 6. Questions the brief does not answer

Worth asking before the next build:

1. **Reference sites.** Which specific awwwards or Codrops pieces does the client admire?
   Three URLs would settle more than three paragraphs of adjectives.
2. **Experience or tool?** Should the site behave like a showpiece a visitor explores, or
   like a catalogue they use to find a vehicle and call? The two lead to different IA.
3. **What "delightful" means** for this brand and this buyer.
4. **Photography.** Every direction so far has been limited by stock imagery. Will a real
   shoot be commissioned? This changes what is buildable more than any stylistic choice.
5. **Success measure.** Inquiries and showroom visits, or prestige and differentiation?
6. **Which of the four attempts came closest, and which single element in it worked?**
   All four were judged as wholes. A part-level signal would be far more actionable.

---

## 7. What was deliberately left out

Per the client's instruction, this document excludes the client's answers to the previous
agent's multiple-choice questions. Those answers covered redesign scope, which brand
elements are locked, the imagery situation, what the site must prove to a buyer, and the
choice of technical signature. They exist in the original session transcript and contain
real constraints. Retrieve them from there if the next agent wants them, rather than
treating this document as the complete record.

---

## 8. One-paragraph summary for a new agent

Redesign the public layer of Mansour Motors, a premium 4x4 dealership in Dakar, to a
standard that could be published on awwwards or Codrops. The client wants neo-futurism,
soft-UI, slight glassmorphism, luxurious-tech typography and scroll-triggered
micro-animations that are motivated rather than decorative, all on the existing brand
colours. The information architecture and UX must be immersive and genuinely restructured,
not restyled. CleanMyMac and Chinese and Asian automotive interfaces are the reference for
finish and control feel, but an app-like dashboard has already been built and rejected by
name. Four directions have been tried and none has satisfied. Plan the direction before
building, prototype it as plain HTML, CSS and JavaScript under `prototype/`, and hand over
a verification list instead of inspecting the result yourself.
