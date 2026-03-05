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
      low: "Small talk is your biggest growth area. Start with Week 1 actions. Even 'morning!' counts. You don't need perfect conversations, just small connections.",
      mid: "You're getting there with small talk. Push yourself to initiate one conversation per day. The weekend question is your secret weapon.",
      high: "You're a natural! Keep using small talk to deepen relationships. Try connecting with people outside your immediate team."
    },
    "humour": {
      low: "Aussie humour takes time to decode. Don't pressure yourself. Start by observing when others joke and what gets laughs. Self-deprecating humour is your safest starting point.",
      mid: "You're picking up the vibe. Try one light comment per day. Remember, Australians respect people who don't take themselves too seriously.",
      high: "Your sense of humour is clicking. You're reading the room well. This is a huge sign of cultural confidence."
    },
    "meetings": {
      low: "Meetings can feel intimidating, but your ideas matter. Start by making one comment per meeting. Even 'I agree with that' shows you're engaged.",
      mid: "You're contributing in meetings. Next step: volunteer to present something, even a small update. Casual language is fine here.",
      high: "You're confident in meetings. Great work. This is where career growth happens in Australian workplaces."
    },
    "social": {
      low: "Social events are where real bonds form. Start small. Go to one event, stay for 30 minutes. You don't need to be the life of the party.",
      mid: "You're showing up, which is half the battle. Try initiating a coffee catch-up with a colleague this week.",
      high: "You're thriving socially at work. You're building the kind of relationships that make work feel like belonging."
    },
    "feedback": {
      low: "Feedback in Australia is often indirect. 'Maybe you could try...' usually means 'Please change this.' Learning to read between the lines is a superpower here.",
      mid: "You're getting better at the feedback dance. Practice the 'sandwich' approach and remember, asking for feedback shows strength, not weakness.",
      high: "You handle feedback like a pro. This skill sets you apart and builds deep trust with your team."
    }
  }
  return advice[categoryId]?.[level] || ""
}
