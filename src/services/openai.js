import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key not found. AI features will use mock responses.')
}

// Initialize OpenAI client
const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
}) : null

// AI service for generating scripts and content
export const aiService = {
  async generateScript(scenario, stateCode, userContext = {}) {
    if (!openai) {
      return this.getMockScript(scenario, stateCode)
    }

    try {
      const prompt = this.buildScriptPrompt(scenario, stateCode, userContext)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal rights advisor helping people understand their rights during police interactions. Provide clear, accurate, and legally sound advice. Always emphasize constitutional rights and de-escalation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })

      const response = completion.choices[0]?.message?.content
      return this.parseScriptResponse(response, scenario)
    } catch (error) {
      console.error('Error generating script:', error)
      return this.getMockScript(scenario, stateCode)
    }
  },

  async generateSummaryCard(incidentData, stateCode) {
    if (!openai) {
      return this.getMockSummaryCard(incidentData, stateCode)
    }

    try {
      const prompt = this.buildSummaryPrompt(incidentData, stateCode)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are creating a concise summary card for a police interaction incident. Focus on key rights, important details, and actionable information. Keep it brief and clear."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      })

      const response = completion.choices[0]?.message?.content
      return this.parseSummaryResponse(response, incidentData)
    } catch (error) {
      console.error('Error generating summary card:', error)
      return this.getMockSummaryCard(incidentData, stateCode)
    }
  },

  async improveScript(originalScript, feedback, context = {}) {
    if (!openai) {
      return this.getMockImprovedScript(originalScript, feedback)
    }

    try {
      const prompt = `
        Original script: "${originalScript}"
        User feedback: "${feedback}"
        Context: ${JSON.stringify(context)}
        
        Please improve this script based on the feedback while maintaining legal accuracy and effectiveness.
      `
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are improving legal scripts for police interactions. Maintain accuracy while incorporating user feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.3
      })

      return completion.choices[0]?.message?.content
    } catch (error) {
      console.error('Error improving script:', error)
      return this.getMockImprovedScript(originalScript, feedback)
    }
  },

  // Helper methods
  buildScriptPrompt(scenario, stateCode, userContext) {
    return `
      Generate a script for a ${scenario} scenario in ${stateCode}.
      User context: ${JSON.stringify(userContext)}
      
      Please provide:
      1. What to say (exact phrases)
      2. What NOT to say
      3. Key actions to take
      4. State-specific considerations
      
      Keep it practical and easy to remember under stress.
    `
  },

  buildSummaryPrompt(incidentData, stateCode) {
    return `
      Create a summary card for this police interaction:
      
      Location: ${incidentData.location || 'Not specified'}
      Time: ${incidentData.timestamp || 'Not specified'}
      State: ${stateCode}
      Type: ${incidentData.type || 'General interaction'}
      Notes: ${incidentData.notes || 'No additional notes'}
      
      Include key rights that apply and important details for sharing with trusted contacts.
    `
  },

  parseScriptResponse(response, scenario) {
    // Parse the AI response into structured format
    const sections = response.split('\n\n')
    
    return {
      scenario,
      whatToSay: this.extractSection(response, 'what to say') || [],
      whatNotToSay: this.extractSection(response, 'what not to say') || [],
      keyActions: this.extractSection(response, 'actions') || [],
      stateSpecific: this.extractSection(response, 'state-specific') || [],
      fullText: response
    }
  },

  parseSummaryResponse(response, incidentData) {
    return {
      summary: response,
      timestamp: incidentData.timestamp,
      location: incidentData.location,
      keyPoints: this.extractKeyPoints(response),
      generatedAt: new Date().toISOString()
    }
  },

  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n|$)`, 'i')
    const match = text.match(regex)
    
    if (match) {
      return match[1]
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
    }
    
    return []
  },

  extractKeyPoints(text) {
    const sentences = text.split(/[.!?]+/)
    return sentences
      .filter(sentence => sentence.trim().length > 20)
      .slice(0, 3)
      .map(sentence => sentence.trim())
  },

  // Mock responses for development/fallback
  getMockScript(scenario, stateCode) {
    const mockScripts = {
      'traffic-stop': {
        whatToSay: [
          "I am exercising my right to remain silent",
          "I do not consent to any searches",
          "Am I free to leave?",
          "I would like to speak with an attorney"
        ],
        whatNotToSay: [
          "Don't admit guilt or fault",
          "Don't argue or resist",
          "Don't provide information beyond required ID",
          "Don't consent to searches"
        ],
        keyActions: [
          "Keep hands visible",
          "Follow lawful orders",
          "Document the interaction if possible",
          "Ask for badge numbers and names"
        ],
        stateSpecific: [
          `In ${stateCode}, you are required to provide ID during traffic stops`,
          "State laws may vary on recording permissions"
        ]
      },
      'questioning': {
        whatToSay: [
          "I am invoking my Fifth Amendment right to remain silent",
          "I want to speak with an attorney",
          "I do not consent to any searches",
          "Am I under arrest or am I free to go?"
        ],
        whatNotToSay: [
          "Don't answer questions without an attorney",
          "Don't make statements about your activities",
          "Don't lie or provide false information",
          "Don't resist or argue"
        ],
        keyActions: [
          "Remain calm and polite",
          "Ask if you're free to leave",
          "Request an attorney immediately",
          "Document badge numbers and names"
        ],
        stateSpecific: [
          `${stateCode} stop-and-identify laws may apply`,
          "Know your state's recording laws"
        ]
      }
    }

    return {
      scenario,
      ...mockScripts[scenario] || mockScripts['questioning'],
      fullText: `Mock script for ${scenario} in ${stateCode}`
    }
  },

  getMockSummaryCard(incidentData, stateCode) {
    return {
      summary: `Police interaction summary for ${stateCode}. Key rights: Right to remain silent, right to refuse searches, right to an attorney. Interaction occurred at ${incidentData.location || 'unspecified location'} on ${new Date(incidentData.timestamp).toLocaleDateString()}.`,
      timestamp: incidentData.timestamp,
      location: incidentData.location,
      keyPoints: [
        "Constitutional rights were invoked",
        "Interaction was documented",
        "Legal protections were observed"
      ],
      generatedAt: new Date().toISOString()
    }
  },

  getMockImprovedScript(originalScript, feedback) {
    return `Improved script based on your feedback: "${feedback}"\n\n${originalScript}\n\n[This script has been enhanced to address your specific concerns while maintaining legal accuracy.]`
  }
}
