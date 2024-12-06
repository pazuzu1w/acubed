import config from '../config.js';

class FortuneTeller {
    constructor() {
        this.apiKey = config.OPENAI_API_KEY;
    }

    async interpretReading(cards) {
        const prompt = this.createPrompt(cards);
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "You are a mystical fortune teller with deep knowledge of tarot. Provide insightful, thoughtful interpretations that connect with the querent's spiritual journey. Be encouraging but honest, mysterious yet clear."
                    }, {
                        role: "user",
                        content: prompt
                    }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error interpreting reading:', error);
            return "The spirits are unclear at this moment. Please try again later.";
        }
    }

    createPrompt(cards) {
        return `Interpret this tarot spread:
            ${cards.map((card, index) => `
                Card ${index + 1}: ${card.name} (${card.isReversed ? 'Reversed' : 'Upright'})
                Traditional meaning: ${card.isReversed ? card.reversedMeaning : card.meaning}
            `).join('\n')}
            
            Please provide a cohesive interpretation that connects these cards and their meanings into a meaningful narrative for the querent.`;
    }
}

export default FortuneTeller;
