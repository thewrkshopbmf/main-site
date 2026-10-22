// One source for TheWrkShop's six response patterns, used by:
//   /patterns/ (library index), /patterns/<id>/ (landing pages),
//   /tools/pattern-finder/ (assessment) and /tools/interruption-lab/ (practice).
// Edit here, then run:  node scripts/patterns/build-patterns.mjs  and commit the output.
//
// Fields come from Steven's three source files:
//   library: theme, search, insight, question, replacement, verse, nuance, days, scenarios
//   finder:  desc, questions, threat, reaction, after, pauseQuestion, tryInstead
//   lab:     instinct, need, pauseThought, response, labVerse
// The 7-day practice and main Scripture are the library's, so a man sees the same plan everywhere.

export const PATTERNS = [
  {
    id: 'protector', name: 'The Protector', theme: 'Defensiveness',
    search: 'Why do I get defensive when criticized?',
    desc: 'Defensiveness under pressure',
    insight: 'A correction can feel like a verdict on your worth, even when it is simply information.',
    question: 'What am I afraid this feedback says about me?',
    replacement: 'Listen, clarify, then decide what is true.',
    verse: 'James 1:19–20', nuance: 'Quick to hear does not mean required to agree.',
    days: ['Ask one clarifying question before explaining.', 'Separate the observation from your interpretation.', 'Notice physical signs of defensiveness.', 'Acknowledge one valid point without a counterargument.', 'Practice saying: “I need to think about that.”', 'Repair one conversation where you became defensive.', 'Review what changed and what still feels hard.'],
    scenarios: ['A colleague questions your proposal in a meeting. You interrupt to defend every decision.', 'Your partner says they felt unheard. You immediately list everything you have done.', 'Your child says you were unfair. You treat the comment as disrespect instead of curiosity.'],
    questions: ['When someone questions my decision, I immediately feel the need to defend it.', 'I replay criticism and mentally build a case for why I was right.'],
    threat: ['Being misunderstood', 'Appearing incompetent', 'Being disrespected', 'Feeling unsafe or unfairly treated'],
    reaction: ['Explain or justify immediately', 'Argue or counterattack', 'Go quiet and withdraw', 'Gather evidence to prove my point'],
    after: ['Regret my tone', 'Feel resentful', 'Repair the conversation', 'Repeat the same conflict'],
    pauseQuestion: 'Can I hear the whole concern before deciding what it means?',
    tryInstead: 'Ask: “Can you help me understand what you mean?” Listen, then respond thoughtfully.',
    instinct: 'I need to prove why I am right.', need: 'Feeling respected or fairly understood',
    pauseThought: 'I can listen without surrendering my perspective.',
    response: '“I want to understand what you mean. Can you tell me what you noticed?”', labVerse: 'James 1:19'
  },
  {
    id: 'controller', name: 'The Controller', theme: 'Control and uncertainty',
    search: 'Why do I need to control everything?',
    desc: 'Seeking certainty when things feel uncertain',
    insight: 'Uncertainty can invite overmanagement, even when involvement costs trust and peace.',
    question: 'What outcome am I treating as mine to guarantee?',
    replacement: 'Name what is yours to do, then release what is not.',
    verse: 'Matthew 6:25–34', nuance: 'Responsible planning and anxious control are not the same thing.',
    days: ['List what is and is not within your control.', 'Delegate one low-risk decision.', 'Ask before offering an unsolicited correction.', 'Notice the story you tell yourself about uncertainty.', 'Choose a reasonable standard rather than perfection.', 'Practice a pause when plans change.', 'Review whether trust improved.'],
    scenarios: ['Your team uses a different method and you redo their work.', 'A family plan changes and you become rigid about details.', 'Your child makes an age-appropriate decision and you rush to intervene.'],
    questions: ['I struggle to relax when others handle important tasks differently.', 'When plans change unexpectedly, I feel compelled to regain control.'],
    threat: ['An uncertain outcome', 'Letting others down', 'Feeling powerless', 'Fear of preventable mistakes'],
    reaction: ['Micromanage details', 'Demand immediate answers', 'Take over the task', 'Mentally rehearse worst cases'],
    after: ['Feel exhausted', 'Create tension with others', 'Find temporary relief', 'Keep checking or intervening'],
    pauseQuestion: 'What is truly mine to influence, and what must I release?',
    tryInstead: 'Name one controllable next step and allow another person room to act.',
    instinct: 'I need to take charge and fix this now.', need: 'Certainty, predictability, or safety',
    pauseThought: 'Uncertainty is uncomfortable, but I do not need to control every response.',
    response: '“I have concerns. Can we clarify what matters most and decide on a next step together?”', labVerse: 'Proverbs 3:5–6'
  },
  {
    id: 'pleaser', name: 'The Pleaser', theme: 'Approval and boundaries',
    search: 'Why is it so hard to say no?',
    desc: 'Seeking acceptance by minimizing your own needs',
    insight: 'Keeping everyone happy can quietly turn into neglecting honest commitments and limits.',
    question: 'Whose disappointment am I trying to prevent?',
    replacement: 'Offer a respectful answer that is true, not merely agreeable.',
    verse: 'Galatians 1:10', nuance: 'Kindness and people-pleasing are not identical.',
    days: ['Notice one automatic yes.', 'Delay a response before committing.', 'Write a kind but clear no.', 'Allow someone to feel disappointed without rescuing them.', 'Express a respectful disagreement.', 'Ask what a faithful yes would require you to decline.', 'Review the boundary you kept.'],
    scenarios: ['You agree to extra work while already overwhelmed.', 'You hide a disagreement to avoid tension with your spouse.', 'You give your child permission because you fear being disliked.'],
    questions: ['I agree to things because I worry about disappointing others.', 'I change what I say depending on whose approval I want.'],
    threat: ['Someone being disappointed', 'Being excluded', 'A difficult disagreement', 'Being seen as selfish'],
    reaction: ['Say yes too quickly', 'Hide my real opinion', 'Apologize unnecessarily', 'Overextend myself'],
    after: ['Feel resentful', 'Feel relieved briefly', 'Lose time or energy', 'Avoid future honesty'],
    pauseQuestion: 'Would I still choose this if I were not afraid of disapproval?',
    tryInstead: 'Use: “I need to think about that before I commit.”',
    instinct: 'I should agree so they will not be upset.', need: 'Acceptance, harmony, or belonging',
    pauseThought: 'I can be kind and truthful at the same time.',
    response: '“I hear your perspective. I need a moment to consider what I can genuinely agree to.”', labVerse: 'Galatians 1:10'
  },
  {
    id: 'avoider', name: 'The Avoider', theme: 'Avoidance and discomfort',
    search: 'Why do I avoid difficult conversations?',
    desc: 'Escaping discomfort or difficult decisions',
    insight: 'Avoidance can provide short-term relief while leaving important issues unresolved.',
    question: 'What discomfort am I postponing, and at what cost?',
    replacement: 'Take one small, safe step toward the necessary conversation.',
    verse: 'Ephesians 4:25–32', nuance: 'Truthful speech should be joined with kindness and wisdom.',
    days: ['Name the conversation you are postponing.', 'Write the first sentence you need to say.', 'Choose a safe time and setting.', 'Practice the opening aloud.', 'Have the conversation or seek support if unsafe.', 'Reflect on what you learned without self-attack.', 'Choose the next constructive step.'],
    scenarios: ['You postpone feedback until resentment builds.', 'You stop responding after a disagreement with a friend.', 'You avoid discussing a recurring household issue.'],
    questions: ['I postpone difficult conversations even when waiting makes things worse.', 'When uncomfortable, I distract myself rather than address the issue.'],
    threat: ['Conflict escalating', 'Feeling overwhelmed', 'Making a wrong decision', 'Facing painful emotions'],
    reaction: ['Procrastinate', 'Distract myself', 'Withdraw from contact', 'Tell myself it can wait'],
    after: ['Feel temporary relief', 'Experience growing stress', 'Miss an opportunity', 'Eventually address it'],
    pauseQuestion: 'What is the smallest safe step I can take toward this?',
    tryInstead: 'Choose a ten-minute first step instead of waiting for complete readiness.',
    instinct: 'I should get out of this conversation.', need: 'Relief from discomfort or conflict',
    pauseThought: 'I can take a short break without disappearing.',
    response: '“This matters, and I want to respond thoughtfully. Can we return to it in 20 minutes?”', labVerse: 'Ephesians 4:25–26'
  },
  {
    id: 'prover', name: 'The Prover', theme: 'Performance and worth',
    search: 'Why do I never feel good enough?',
    desc: 'Connecting personal worth to achievement',
    insight: 'Achievement can become an exhausting substitute for a stable sense of worth.',
    question: 'What would it mean about me if I did not excel today?',
    replacement: 'Measure faithfulness and learning, not only applause.',
    verse: 'Luke 10:38–42', nuance: 'Jesus addresses disordered attention, not the value of diligent work.',
    days: ['Notice when accomplishment controls your mood.', 'Name one value not dependent on achievement.', 'Take a brief rest without earning it.', 'Celebrate effort and learning in someone else.', 'Complete a task without seeking recognition.', 'Practice receiving feedback without global self-judgment.', 'Review where your worth felt conditional.'],
    scenarios: ['You take on every project to prove you deserve promotion.', 'You turn family time into another performance metric.', 'Your child struggles and you treat it as a reflection of your success.'],
    questions: ['I feel less valuable when I am not accomplishing something.', 'I need my success to be noticed to feel satisfied.'],
    threat: ['Being overlooked', 'Not measuring up', 'Being ordinary', 'Failing publicly'],
    reaction: ['Work harder immediately', 'Compare myself with others', 'Seek reassurance or recognition', 'Hide mistakes'],
    after: ['Feel briefly validated', 'Stay dissatisfied', 'Become exhausted', 'Set a higher standard'],
    pauseQuestion: 'If no one applauded this, would it still be worth doing?',
    tryInstead: 'Choose one meaningful action without measuring your value by the response.',
    instinct: 'I need to demonstrate that I am competent and valuable.', need: 'Recognition, worth, or reassurance',
    pauseThought: 'My worth does not depend on winning this moment.',
    response: '“That is difficult to hear. What is one specific thing I could improve?”', labVerse: 'Romans 12:3'
  },
  {
    id: 'reactor', name: 'The Reactor', theme: 'Anger and impulsivity',
    search: 'Why do I get angry so quickly?',
    desc: 'Responding impulsively to frustration or perceived disrespect',
    insight: 'A fast emotional surge can narrow the space between interpretation and response.',
    question: 'What did I assume the other person intended?',
    replacement: 'Slow the moment, verify the meaning, and respond proportionately.',
    verse: 'James 1:19–20', nuance: 'Anger is not automatically sin; harmful expression and retaliation matter.',
    days: ['Notice early physical cues.', 'Practice a ten-second pause when safe.', 'Name the feeling without blaming someone.', 'Ask what facts you actually know.', 'Use one non-accusing statement.', 'Repair a sharp response where appropriate.', 'Review which interruption helped.'],
    scenarios: ['You hear a disagreement as an insult and raise your voice.', 'A partner forgets something and you assume they do not care.', 'Your child disobeys and you respond more harshly than intended.'],
    questions: ['When I feel disrespected, I respond before considering the consequences.', 'My frustration comes out more sharply than I intended.'],
    threat: ['Feeling disrespected', 'Feeling unheard', 'A violated expectation', 'Fear of losing influence'],
    reaction: ['Raise my voice or sharpen my tone', 'Interrupt or accuse', 'Send a reactive message', 'Shut down abruptly'],
    after: ['Regret my words', 'Justify my reaction', 'Experience relational distance', 'Make amends'],
    pauseQuestion: 'What happened, and what story did I immediately tell myself about it?',
    tryInstead: 'Pause, breathe, name the feeling, and ask one clarifying question before acting.',
    instinct: 'I want to respond sharply right now.', need: 'Dignity, fairness, or being heard',
    pauseThought: 'A strong feeling does not require an immediate strong response.',
    response: '“I am frustrated. I want to address this without saying something harmful. Give me a moment.”', labVerse: 'Proverbs 15:1'
  }
];

// Interruption Lab settings (from the Lab file).
export const SETTINGS = {
  work: { label: 'Work & leadership', setup: 'During a team meeting, a colleague says, “I don’t think your approach is working.” Others go quiet.', challenge: 'A colleague questions your approach publicly.' },
  relationship: { label: 'Marriage & relationships', setup: 'Someone close to you says, “I feel like you never really listen when I bring something up.”', challenge: 'Someone close to you says they do not feel heard.' },
  family: { label: 'Family & parenting', setup: 'A family member ignores a plan you thought everyone had agreed to, then says, “You’re making too big a deal of this.”', challenge: 'A family member dismisses your concern after changing a plan.' },
  friend: { label: 'Friendships', setup: 'A friend cancels plans at the last minute for the second time and responds, “It’s not that serious.”', challenge: 'A friend dismisses your disappointment after cancelling.' }
};
