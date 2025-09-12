# Voice Agent with Journey to the West Characters

> **Original OpenAI Project:** [openai/openai-realtime-agents](https://github.com/openai/openai-realtime-agents) - Check the original README for detailed technical documentation.

A custom implementation of OpenAI Realtime Voice Agents featuring characters from the classic Chinese novel "Journey to the West" (西游记). Experience immersive conversations with 孙悟空 (Sun Wukong, the Monkey King) and 白骨精 (White Bone Demon) using advanced voice AI technology.

## ✨ Features

### 🐒 孙悟空 (Sun Wukong) - The Monkey King
- **Authentic personality**: Brave, intelligent, loyal to his master Tang Seng
- **Classic speech patterns**: Uses "俺老孙" (I, Old Sun) and signature phrases like "哈哈！有趣有趣！" (Haha! Interesting!)
- **Voice characteristics**: 
  - Fast-paced, energetic speech reflecting his agile nature
  - High enthusiasm for adventures and challenges
  - Respectful tone when speaking about his master
  - Playful yet righteous demeanor

### 👻 白骨精 (White Bone Demon)
- **Deceptive nature**: Master of disguise, can transform into innocent villagers
- **Cunning personality**: Obsessed with eating Tang Seng's flesh for immortality
- **Voice characteristics**:
  - Slow, seductive speech patterns like a serpent
  - False kindness when in disguise
  - Sudden tempo changes when revealing true nature
  - Mysterious and calculating tone

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key with access to Realtime API

### Setup
```bash
# Clone the repository
git clone https://github.com/VictorChenLi/voice-agent-realtime-openai-character.git
cd voice-agent-realtime-openai-character

# Install dependencies
npm install

# Set up environment
cp .env.sample .env
# Add your OPENAI_API_KEY to .env

# Start the development server
npm run dev
```

### Usage
1. Open [http://localhost:3000](http://localhost:3000)
2. Select "**journeyToWest**" from the Scenario dropdown
3. Choose your preferred agent:
   - **sunWukong** - Chat with the Monkey King
   - **baiguJing** - Interact with the White Bone Demon
4. Click "Connect" and start your voice conversation!

## 🎭 Character Interactions

### Talking to 孙悟空
Try these conversation starters:
- "俺老孙在此！你可有什么妖魔鬼怪需要收拾？" (Old Sun is here! Any demons need dealing with?)
- "给我讲讲取经路上的故事吧" (Tell me stories from the journey to the West)
- "你的七十二变是怎样的？" (What are your 72 transformations like?)

### Talking to 白骨精
She might try to deceive you:
- She'll appear as innocent characters to gain your trust
- Be careful - she's plotting to capture Tang Seng!
- Try to see through her disguises with clever questions

## 🛠 Technical Features

- **Advanced Voice Synthesis**: Natural-sounding Chinese speech with character-appropriate tones
- **Real-time Audio**: Low-latency voice conversations using OpenAI's Realtime API
- **Character Consistency**: Each agent maintains authentic personality throughout conversations
- **Voice Style Controls**: Customized pacing, enthusiasm, and formality for each character
- **Multi-agent System**: Seamless switching between different characters in the same session

## 🌟 Additional Scenarios

This project also includes other agent scenarios:
- **Chat Supervisor**: Customer service with intelligent routing
- **Simple Handoff**: Basic agent-to-agent transfers
- **Customer Service Retail**: Advanced customer support demo

## 📁 Project Structure

```
src/app/agentConfigs/
├── journeyToWest.ts      # 🎯 Main Journey to the West characters
├── chatSupervisor/       # Customer service supervisor pattern
├── simpleHandoff.ts      # Basic handoff examples
└── customerServiceRetail/ # Advanced customer service
```

## 🎨 Customization

The Journey to the West characters are highly customizable:

- **Voice Settings**: Modify speech patterns, pacing, and enthusiasm
- **Personality Traits**: Adjust character behavior and responses
- **Language Mixing**: Supports both Chinese and English interactions
- **New Characters**: Easy to add more characters from the novel

## 🤝 Contributing

Feel free to:
- Add more characters from Journey to the West (猪八戒, 沙和尚, 唐僧, etc.)
- Improve voice characteristics and personality traits
- Enhance the conversation scenarios and stories
- Report issues or suggest improvements

## 📜 License

This project is based on OpenAI's realtime-agents demo and maintains the same license structure.

---

**Experience the magic of Journey to the West through cutting-edge AI voice technology!** 🌟

Built with ❤️ using OpenAI Realtime API and the OpenAI Agents SDK.