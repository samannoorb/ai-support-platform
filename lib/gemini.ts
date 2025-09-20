import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY!

export const genAI = new GoogleGenerativeAI(apiKey)

// Initialize the model
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

// AI service functions
export class AIService {
  static async classifyTicket(title: string, description: string): Promise<{
    priority: 'low' | 'medium' | 'high' | 'urgent'
    category: string
    estimatedResolutionTime: string
  }> {
    try {
      const prompt = `
        Classify this customer support ticket:
        Title: ${title}
        Description: ${description}
        
        Respond with JSON format:
        {
          "priority": "low|medium|high|urgent",
          "category": "technical|billing|general|account|product",
          "estimatedResolutionTime": "1-2 hours|4-8 hours|1-2 days|3-5 days"
        }
        
        Base priority on urgency indicators like "urgent", "critical", "broken", "not working", "immediately", etc.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        return JSON.parse(text)
      } catch {
        // Fallback if JSON parsing fails
        return {
          priority: 'medium',
          category: 'general',
          estimatedResolutionTime: '1-2 days'
        }
      }
    } catch (error) {
      console.error('Error classifying ticket:', error)
      return {
        priority: 'medium',
        category: 'general',
        estimatedResolutionTime: '1-2 days'
      }
    }
  }

  static async generateResponse(
    conversation: Array<{ role: 'user' | 'agent'; content: string }>,
    ticketContext: { title: string; description: string; category: string }
  ): Promise<string> {
    try {
      const conversationHistory = conversation
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')

      const prompt = `
        You are a helpful customer support agent. Generate a professional, empathetic response based on:
        
        Ticket: ${ticketContext.title}
        Description: ${ticketContext.description}
        Category: ${ticketContext.category}
        
        Conversation history:
        ${conversationHistory}
        
        Provide a helpful, professional response as a customer support agent. Be concise but thorough.
        If you cannot resolve the issue, suggest next steps or escalation.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating response:', error)
      return "I apologize, but I'm having trouble generating a response right now. Please try again or contact our support team directly."
    }
  }

  static async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative'
    score: number
    keywords: string[]
  }> {
    try {
      const prompt = `
        Analyze the sentiment of this customer message:
        "${text}"
        
        Respond with JSON format:
        {
          "sentiment": "positive|neutral|negative",
          "score": 0.0-1.0,
          "keywords": ["word1", "word2", "word3"]
        }
        
        Score: 0.0 = very negative, 0.5 = neutral, 1.0 = very positive
        Keywords: Extract 3-5 most important words/phrases
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text_response = response.text()
      
      try {
        return JSON.parse(text_response)
      } catch {
        return {
          sentiment: 'neutral',
          score: 0.5,
          keywords: []
        }
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error)
      return {
        sentiment: 'neutral',
        score: 0.5,
        keywords: []
      }
    }
  }

  static async suggestAgent(
    ticketCategory: string,
    priority: string,
    description: string
  ): Promise<{ suggestedDepartment: string; reasoning: string }> {
    try {
      const prompt = `
        Based on this ticket information, suggest the best department/agent type:
        Category: ${ticketCategory}
        Priority: ${priority}
        Description: ${description}
        
        Available departments: Technical Support, Billing, Customer Success, Product Support
        
        Respond with JSON format:
        {
          "suggestedDepartment": "department_name",
          "reasoning": "brief explanation"
        }
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        return JSON.parse(text)
      } catch {
        return {
          suggestedDepartment: 'Customer Success',
          reasoning: 'Default assignment for general inquiries'
        }
      }
    } catch (error) {
      console.error('Error suggesting agent:', error)
      return {
        suggestedDepartment: 'Customer Success',
        reasoning: 'Default assignment due to processing error'
      }
    }
  }
}
