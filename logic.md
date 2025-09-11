# Voice Agent Webapp Logic Patterns

## Voice Selection Pattern

### Implementation
- **State Management**: Voice selection is managed in App.tsx with localStorage persistence
- **UI Component**: Voice dropdown is added to BottomToolbar.tsx positioned after Audio playback
- **Dynamic Application**: Voice is applied to all agents by modifying the voice property in place
- **Session Reconnection**: When voice changes, the session is disconnected and reconnected to apply the new voice

### Code Structure
```typescript
// State management with localStorage persistence
const [selectedVoice, setSelectedVoice] = useState<string>(
  () => {
    if (typeof window === 'undefined') return 'sage';
    const stored = localStorage.getItem('selectedVoice');
    return stored || 'sage';
  },
);

// Voice change handler
const handleVoiceChange = (newVoice: string) => {
  setSelectedVoice(newVoice);
  localStorage.setItem('selectedVoice', newVoice);
  // Disconnect and reconnect to apply new voice
  if (sessionStatus === "CONNECTED") {
    disconnectFromRealtime();
    // connectToRealtime will be triggered by effect watching selectedAgentName
  }
};

// Apply voice to agents before connection
reorderedAgents.forEach(agent => {
  (agent as any).voice = selectedVoice;
});
```

### Available Voices (OpenAI Realtime API 2024-2025)
- **Female**: alloy, coral, shimmer
- **Male**: ash, ballad, echo, verse
- **Neutral**: sage (default)

### Key Considerations
- Voice changes require session reconnection to take effect (if connected)
- Voice selection is persisted in localStorage for user preference
- All agents in a scenario use the same selected voice
- Voice dropdown is always enabled - can change voices even when disconnected
- Connection timeout prevents getting stuck in "Connecting..." state (30 second timeout)

## Speech Control Pattern

### Implementation
- **Pacing Control**: Detailed instructions for speech rhythm and speed variations
- **Enthusiasm Control**: Guidelines for energy levels and emotional expression
- **Formality Control**: Instructions for tone and politeness levels based on context

### way to control tones
```typescript
instructions: `
# 语音风格控制
## 语速节奏 (Pacing)
- 说话节奏快速而有力，体现角色特点
- 在重要时刻会放慢语速，强调重点
- 兴奋时会加快语速，表达激动情绪

## 热情程度 (Enthusiasm)
- 保持高度热情和兴奋，对冒险充满期待
- 遇到挑战时表现出跃跃欲试的兴奋
- 对正义的坚持充满激情

## 正式程度 (Formality)
- 对不同角色使用不同的正式程度
- 对师父保持尊敬，使用较为正式的敬语
- 对敌人使用挑衅和不屑的语气
`
```

### Benefits
- More realistic and engaging character interactions
- Dynamic speech patterns that adapt to context
- Enhanced role-playing experience
- Better voice agent personality expression

## Adding New Scenarios and Agents

### Step 1: Create Agent Configuration File
Create a new file in `src/app/agentConfigs/` directory (e.g., `myNewScenario.ts`):

```typescript
import { RealtimeAgent } from '@openai/agents/realtime';

// Agent 1
export const firstAgent = new RealtimeAgent({
  name: 'firstAgent',
  voice: 'sage', // Will be overridden by user selection
  instructions: `
# Agent Personality and Instructions
## Identity
Describe who the agent is and their role.

## Task
What the agent is supposed to do.

# Speech Control (Optional)
## 语速节奏 (Pacing)
- Define speech rhythm and speed patterns

## 热情程度 (Enthusiasm)  
- Define energy levels and emotional expression

## 正式程度 (Formality)
- Define tone and politeness levels

## Other Instructions
- Add any specific behaviors, tools, or constraints
`,
  handoffs: [], // Add other agents for handoffs
  tools: [], // Add tools if needed
  handoffDescription: 'Brief description of when to handoff to this agent',
});

// Agent 2 (if multiple agents in scenario)
export const secondAgent = new RealtimeAgent({
  name: 'secondAgent',
  voice: 'sage',
  instructions: `...`,
  handoffs: [],
  tools: [],
  handoffDescription: '...',
});

// Export the scenario array
export const myNewScenario = [firstAgent, secondAgent];
export default myNewScenario;
```

### Step 2: Register Scenario in SDK Map
Add your scenario to the `sdkScenarioMap` in `src/app/App.tsx`:

```typescript
// Import your scenario
import { myNewScenario } from './agentConfigs/myNewScenario';

// Add to the map
const sdkScenarioMap: Record<string, RealtimeAgent[]> = {
  simpleHandoff: simpleHandoffScenario,
  simpleHandoff2: simpleHandoffScenario2,
  journeyToWest: journeyToWestScenario,
  customerServiceRetail: customerServiceRetailScenario,
  chatSupervisor: chatSupervisorScenario,
  myNewScenario: myNewScenario, // Add your scenario here
};
```

### Step 3: Add to Agent Sets (Optional)
If you want the scenario to appear in the UI dropdown, add it to `src/app/agentConfigs/index.ts`:

```typescript
import { myNewScenario } from './myNewScenario';

export const allAgentSets = {
  // ... existing scenarios
  myNewScenario: myNewScenario,
};

export const defaultAgentSetKey = 'simpleHandoff'; // or your preferred default
```

### Step 4: Test Your Scenario
1. Start the development server
2. Navigate to your scenario via URL: `?agentConfig=myNewScenario`
3. Test voice selection and agent interactions
4. Verify handoffs work correctly between agents

### Step 5: Add Speech Control (Recommended)
Enhance your agents with detailed speech instructions:

```typescript
instructions: `
# Agent Instructions
Your main agent instructions here...

# 语音风格控制
## 语速节奏 (Pacing)
- Define when to speak fast/slow
- Specify rhythm patterns for different situations

## 热情程度 (Enthusiasm)
- Define energy levels for different contexts
- Specify emotional expression guidelines

## 正式程度 (Formality)
- Define formality levels for different relationships
- Specify tone variations based on context
`
```

### Step 6: Add Tools (If Needed)
If your agents need to perform actions, add tools:

```typescript
import { tool } from '@openai/agents/realtime';

// In your agent configuration
tools: [
  tool({
    name: 'myTool',
    description: 'What this tool does',
    parameters: {
      type: 'object',
      properties: {
        param1: {
          type: 'string',
          description: 'Parameter description'
        }
      },
      required: ['param1']
    },
    execute: async (input: any) => {
      // Tool implementation
      return { result: 'success' };
    }
  })
]
```

### Step 7: Add Handoffs (If Needed)
Configure agent handoffs for complex scenarios:

```typescript
// In agent configuration
handoffs: [
  {
    to: 'otherAgentName',
    description: 'When to handoff to this agent',
    condition: 'specific condition or always'
  }
]
```

### Best Practices
- **Naming**: Use descriptive names for agents and scenarios
- **Voice**: Always set voice to 'sage' initially (will be overridden by user selection)
- **Instructions**: Be specific and detailed for better agent behavior
- **Speech Control**: Add pacing, enthusiasm, and formality instructions
- **Testing**: Test all agent interactions and handoffs
- **Documentation**: Update this logic.md file with new patterns

### Common Patterns
- **Customer Service**: Authentication → Main Agent → Specialized Agents
- **Role Playing**: Multiple characters with different personalities
- **Simple Handoff**: Basic agent switching based on user input
- **Complex Workflows**: Multi-step processes with conditional handoffs

### Example: The Last of Us Scenario
A complete example of a role-playing scenario with two main characters:

```typescript
// Ellie - Young survivor (14 years old)
export const ellieAgent = new RealtimeAgent({
  name: 'ellie',
  voice: 'sage',
  instructions: `
# Character Background
- Age: 14 years old, immune to infection
- Sarcastic and witty, uses dark humor
- Fiercely loyal and protective

# Speech Control
## 语速节奏 (Pacing)
- Speaks quickly and energetically like a teenager
- Uses rapid-fire responses when excited
- Quick quips and interruptions

## 热情程度 (Enthusiasm)
- High energy and enthusiasm for new experiences
- Passionate when defending friends
- Animated speech when telling stories

## 正式程度 (Formality)
- Very casual and informal speech
- Uses slang and teenage expressions
- Direct and straightforward
`,
  handoffs: [],
  tools: [],
  handoffDescription: 'Ellie - The young, sarcastic survivor who is immune to the infection',
});

// Joel - Hardened survivor (late 40s)
export const joelAgent = new RealtimeAgent({
  name: 'joel',
  voice: 'sage',
  instructions: `
# Character Background
- Age: Late 40s, lost daughter during outbreak
- Gruff and emotionally guarded
- Protective and paternal

# Speech Control
## 语速节奏 (Pacing)
- Speaks slowly and deliberately
- Measured, controlled speech
- Quick responses when angry

## 热情程度 (Enthusiasm)
- Generally low-key and reserved
- Shows passion when protecting others
- Intense when discussing loss

## 正式程度 (Formality)
- Direct and no-nonsense
- Simple, clear language
- Can be curt when frustrated
`,
  handoffs: [],
  tools: [],
  handoffDescription: 'Joel - The hardened survivor and smuggler who becomes Ellie\'s protector',
});
```

This example demonstrates:
- **Character Development**: Detailed backgrounds and motivations
- **Speech Patterns**: Age-appropriate and personality-driven speech
- **Emotional Depth**: Complex relationships and emotional states
- **Immersive Experience**: Rich, detailed character instructions
