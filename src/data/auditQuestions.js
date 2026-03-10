export const auditCategories = [
  {
    id: "small-talk",
    name: "Small Talk",
    icon: "💬",
    questions: [
      { id: "st-1", text: "How comfortable are you starting a casual conversation with colleagues?" },
      { id: "st-2", text: "How confident do you feel talking about your weekend or personal life at work?" },
      { id: "st-3", text: "How natural does it feel to greet people with 'How's it going?' instead of formal greetings?" },
    ]
  },
  {
    id: "humour",
    name: "Humour",
    icon: "😄",
    questions: [
      { id: "hu-1", text: "How comfortable are you using light humour in work conversations?" },
      { id: "hu-2", text: "How well do you understand when Australians are being sarcastic or joking?" },
      { id: "hu-3", text: "How comfortable are you laughing at yourself or making self-deprecating jokes?" },
    ]
  },
  {
    id: "meetings",
    name: "Meetings",
    icon: "📋",
    questions: [
      { id: "me-1", text: "How confident do you feel speaking up and sharing ideas in meetings?" },
      { id: "me-2", text: "How comfortable are you disagreeing with someone in a meeting (respectfully)?" },
      { id: "me-3", text: "How natural does it feel to use casual language in meetings rather than formal language?" },
    ]
  },
  {
    id: "social",
    name: "Social Events",
    icon: "🍻",
    questions: [
      { id: "so-1", text: "How comfortable do you feel at work social events (Friday drinks, team lunches)?" },
      { id: "so-2", text: "How confident are you mingling with people you don't know well at work events?" },
      { id: "so-3", text: "How likely are you to suggest or organise a social activity with colleagues?" },
    ]
  },
  {
    id: "feedback",
    name: "Feedback",
    icon: "🔄",
    questions: [
      { id: "fe-1", text: "How comfortable are you giving constructive feedback to a colleague?" },
      { id: "fe-2", text: "How well do you understand indirect feedback (when Australians hint rather than say directly)?" },
      { id: "fe-3", text: "How comfortable are you asking your manager for feedback on your work?" },
    ]
  }
]

export const scaleLabels = [
  "Not at all",
  "A little",
  "Somewhat",
  "Quite comfortable",
  "Very comfortable"
]

export function getRecommendations(scores) {
  const recommendations = []
  const categoryScores = {}

  for (const category of auditCategories) {
    const catScores = category.questions.map(q => scores[q.id] || 0)
    const avg = catScores.reduce((a, b) => a + b, 0) / catScores.length
    categoryScores[category.id] = avg

    if (avg <= 2) {
      recommendations.push({
        category: category.name,
        icon: category.icon,
        level: "focus",
        message: getAdvice(category.id, "low")
      })
    } else if (avg <= 3.5) {
      recommendations.push({
        category: category.name,
        icon: category.icon,
        level: "building",
        message: getAdvice(category.id, "mid")
      })
    } else {
      recommendations.push({
        category: category.name,
        icon: category.icon,
        level: "strong",
        message: getAdvice(category.id, "high")
      })
    }
  }

  const overall = Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.values(categoryScores).length
  return { recommendations, categoryScores, overall }
}

function getAdvice(categoryId, level) {
  const advice = {
    "small-talk": {
      low: "Small talk is your biggest growth area. Module 1 teaches the basics: start with 'How's it going?' and use the Small Talk Formula from Module 2 (Ask, Listen, Share briefly, Move on). Even 'morning!' counts.",
      mid: "You're getting there. Practice the Small Talk Formula daily: Ask, Listen, Share, Move on. Use the Monday opener 'How was your weekend?' from Module 2 to build consistency.",
      high: "You're a natural! Keep using small talk to deepen relationships. Try connecting with people outside your immediate team, like Module 3 suggests."
    },
    "humour": {
      low: "Aussie humour takes time to decode. Module 5 breaks it down: 'taking the piss' means friendly teasing, and sarcasm like 'Living the dream' means the opposite. Start by observing what gets laughs.",
      mid: "You're picking up the vibe. Module 5 teaches that self-deprecating humour is your safest bet. Try 'I definitely need another coffee' and watch the reaction.",
      high: "Your sense of humour is clicking. You're reading the room well. This is a huge sign of cultural confidence, as Module 5 explains."
    },
    "meetings": {
      low: "Meetings can feel intimidating, but Module 2 gives you the phrases: 'Can I jump in here?' and 'Just to add to that...' Start by making one comment per meeting.",
      mid: "You're contributing. Next step from Module 4: volunteer to present something, and try softening disagreement with 'I see it a bit differently...'",
      high: "You're confident in meetings. Great work. Module 4 takes this further with feedback and negotiation frameworks."
    },
    "social": {
      low: "Social events are where real bonds form. Module 3 covers everything from break room chats to Friday drinks. Start small: go to one event, stay for 30 minutes.",
      mid: "You're showing up, which is half the battle. Module 3 teaches 'shouting rounds' and how to exit gracefully: 'Better get back to it.'",
      high: "You're thriving socially. You're building the kind of relationships Module 3 talks about, the ones that make work feel like belonging."
    },
    "feedback": {
      low: "Feedback in Australia is often indirect. Module 4 teaches the 4 steps: Listen, Thank, Ask questions, Take time. 'Thanks for letting me know' is your go-to.",
      mid: "You're getting better at the feedback dance. Module 4's Feedback Sandwich (Positive, Issue, Solution, Support) will take you to the next level.",
      high: "You handle feedback like a pro. Module 4's Ask Structure (Meeting, Request, Reasoning, Listen, Negotiate) can help you push for what you need."
    }
  }
  return advice[categoryId]?.[level] || ""
}
