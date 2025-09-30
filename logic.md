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
- **Manual Connection Required**: Users must click "Connect" button to start conversations (auto-connect disabled)

## Manual Connection Pattern

### Implementation
- **Auto-Connect Disabled**: Removed automatic connection when agent is selected
- **User Control**: Users must explicitly click "Connect" button to start conversations
- **Voice/Agent Changes**: When changing voice or agent while connected, user must manually reconnect

### Code Structure
```typescript
// Auto-connect disabled - user must manually click Connect button
// useEffect(() => {
//   if (selectedAgentName && sessionStatus === "DISCONNECTED") {
//     connectToRealtime();
//   }
// }, [selectedAgentName]);

// Voice change handler
const handleVoiceChange = (newVoice: string) => {
  setSelectedVoice(newVoice);
  localStorage.setItem('selectedVoice', newVoice);
  // Disconnect and require manual reconnect to apply new voice
  if (sessionStatus === "CONNECTED") {
    disconnectFromRealtime();
    // User will need to manually reconnect to apply new voice
  }
};
```

### Benefits
- **User Control**: Users decide when to start conversations
- **Better UX**: No unexpected auto-connections
- **Voice Testing**: Users can change voices before connecting
- **Agent Selection**: Users can choose agent before starting

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

## Plot-Driven Conversation Pattern

### Implementation
- **Plot Conditions**: Specific triggers that drive conversations in certain directions
- **Character States**: Current situation and motivations that influence responses
- **Conversation Triggers**: Keywords and topics that activate specific plot elements
- **Story Progression**: Strategies to advance the narrative through dialogue

### Code Structure
```typescript
instructions: `
# 当前剧情状态
- 正在西天取经路上，保护师父唐僧
- 刚经历了几次与妖怪的战斗
- 对取经任务既认真又有些厌倦
- 时刻警惕着可能出现的危险

# 剧情驱动条件
## 主要剧情线
1. **保护师父**: 如果有人询问唐僧或取经，强调保护师父的重要性
2. **降妖除魔**: 遇到妖怪相关话题，表现出战斗的兴奋和正义感
3. **神通展示**: 当被质疑能力时，展示七十二变、筋斗云等神通
4. **过往经历**: 被问及过去时，讲述大闹天宫、被压五行山等经历

## 对话触发条件
- 听到"妖怪"、"危险"、"保护" → 进入战斗模式，强调保护师父
- 听到"神通"、"本领"、"能力" → 展示自己的强大实力
- 听到"过去"、"经历"、"大闹天宫" → 讲述辉煌过往
- 听到"取经"、"西天"、"佛祖" → 表达对任务的复杂感情
- 听到"师父"、"唐僧" → 表现出忠诚和保护的决心

## 剧情推进策略
- 主动提及当前遇到的困难或妖怪
- 询问对方是否见过可疑的人或事
- 分享取经路上的见闻和经历
- 试探对方是否对取经队伍有恶意
`
```

### Benefits
- **Dynamic Conversations**: Characters respond based on plot context
- **Story Progression**: Conversations naturally advance the narrative
- **Character Consistency**: Responses align with current story state
- **Immersive Experience**: Users feel part of an ongoing story
- **Replayability**: Different conversation paths based on triggers

### Example: Journey to the West Characters
- **Sun Wukong**: Protects master, fights demons, shows off powers
- **Baigu Jing**: Seeks to deceive, changes forms, plots against the group
- **Erlang Shen**: Maintains order, watches from afar, ready to intervene

## Character Voice Mapping Pattern

### Implementation
- **Default Character Voices**: Each character has a gender-appropriate default voice
- **User Override**: Users can still manually select any voice via dropdown
- **Smart Detection**: System detects when user has manually selected vs using defaults
- **Consistent Application**: Manual selection applies to all characters in scenario

### Code Structure
```typescript
// Character-specific default voices in agent definitions
export const sunWukongAgent = new RealtimeAgent({
  name: 'sunWukong',
  voice: 'echo', // Deep, energetic male voice
  // ... other properties
});

export const baiguJingAgent = new RealtimeAgent({
  name: 'baiguJing', 
  voice: 'shimmer', // Seductive, mysterious female voice
  // ... other properties
});

// Voice application logic in App.tsx
reorderedAgents.forEach(agent => {
  const agentName = (agent as any).name;
  let voiceToUse = selectedVoice;
  
  // Use character-specific defaults if user hasn't manually selected
  if (selectedVoice === 'sage') { // Default means no manual selection
    switch (agentName) {
      case 'sunWukong':
        voiceToUse = 'echo'; // Male voice for Monkey King
        break;
      case 'baiguJing':
        voiceToUse = 'shimmer'; // Female voice for White Bone Demon
        break;
      case 'erlangShen':
        voiceToUse = 'ballad'; // Male voice for Celestial War God
        break;
      // ... other characters
    }
  }
  
  (agent as any).voice = voiceToUse;
});
```

### Character Voice Mappings
- **Sun Wukong (Monkey King)**: `echo` - Deep, energetic male voice
- **Baigu Jing (White Bone Demon)**: `shimmer` - Seductive, mysterious female voice  
- **Erlang Shen (Celestial War God)**: `ballad` - Deep, authoritative male voice
- **Zhu Bajie (Pigsy)**: `verse` - Deep, gruff male voice perfect for the gluttonous pig demon
- **Tang Monk (Xuanzang)**: `ash` - Calm, wise male voice perfect for the compassionate monk
- **Sha Wujing (Sandy)**: `ballad` - Deep, steady male voice perfect for the loyal monk
- **Guanyin (Bodhisattva)**: `coral` - Gentle, compassionate female voice perfect for the Bodhisattva
- **Dragon Horse (Bai Long Ma)**: `verse` - Deep, noble male voice perfect for the dragon prince
- **Ellie (The Last of Us)**: `coral` - Young, energetic female voice
- **Joel (The Last of Us)**: `ash` - Gruff, experienced male voice

### Benefits
- **Immersive Experience**: Characters sound appropriate for their gender/role
- **User Control**: Users can still override with any voice they prefer
- **Consistency**: All characters in a scenario use the same voice when manually selected
- **Smart Defaults**: New users get appropriate voices without configuration
- **Flexibility**: Easy to add new character voice mappings

### Voice Selection Behavior
1. **Agent Switching**: Each character automatically uses their assigned voice when switching
2. **Character-Specific**: Sun Wukong always uses 'echo', Baigu Jing always uses 'shimmer', etc.
3. **User Override**: User selects specific voice → all characters use that voice
4. **Reset to Character Defaults**: User selects 'sage' → characters revert to their individual voices
5. **Persistence**: User's manual selection is saved and restored

### Agent Voice Switching Logic
```typescript
// Voice application logic in App.tsx
reorderedAgents.forEach(agent => {
  const agentName = (agent as any).name;
  let voiceToUse;
  
  // If user selected a specific voice (not 'sage'), use that for all agents
  if (selectedVoice !== 'sage') {
    voiceToUse = selectedVoice;
  } else {
    // Use character-specific voices for known characters
    switch (agentName) {
      case 'sunWukong': voiceToUse = 'echo'; break;
      case 'baiguJing': voiceToUse = 'shimmer'; break;
      case 'erlangShen': voiceToUse = 'ballad'; break;
      case 'zhuBajie': voiceToUse = 'verse'; break;
      case 'tangMonk': voiceToUse = 'ash'; break;
      case 'shaWujing': voiceToUse = 'ballad'; break;
      case 'guanyin': voiceToUse = 'coral'; break;
      case 'dragonHorse': voiceToUse = 'verse'; break;
      case 'ellie': voiceToUse = 'coral'; break;
      case 'joel': voiceToUse = 'ash'; break;
      default: voiceToUse = selectedVoice;
    }
  }
  
  (agent as any).voice = voiceToUse;
});
```

### User Experience Flow
1. **Default State**: Voice dropdown shows 'sage' (Character-specific mode)
2. **Agent Switch**: Each agent automatically uses their assigned voice
3. **Manual Override**: User selects any voice → all agents use that voice
4. **Return to Character Mode**: User selects 'sage' → agents revert to individual voices

## Voice UI and Agent Switching Pattern

### Implementation
- **Voice Dropdown Location**: Moved beside agent selector for better UX
- **Dynamic Voice Display**: Dropdown shows character's assigned voice when using defaults
- **Automatic Voice Loading**: Always loads assigned voice when switching agents
- **Fallback for Unknown Agents**: Uses default voice for agents without pre-assigned voices

### Code Structure
```typescript
// Voice dropdown moved to App.tsx beside agent selector
<div className="flex items-center">
  <label className="flex items-center text-base gap-1 mr-2 font-medium">
    Voice
  </label>
  <select
    value={getCurrentVoiceDisplay()}
    onChange={handleVoiceChange}
    className="appearance-none border border-gray-300 rounded-lg text-base px-2 py-1 pr-8 cursor-pointer font-normal focus:outline-none"
  >
    <option value="sage">Character Default</option>
    <option value="alloy">Alloy (Female)</option>
    // ... other voice options
  </select>
</div>

// Dynamic voice display logic
const getCurrentVoiceDisplay = () => {
  if (selectedVoice !== 'sage') {
    return selectedVoice; // User has manually selected a voice
  }
  
  // Show character-specific voice when using defaults
  switch (selectedAgentName) {
    case 'sunWukong': return 'echo';
    case 'baiguJing': return 'shimmer';
    case 'erlangShen': return 'ballad';
    case 'zhuBajie': return 'verse';
    case 'tangMonk': return 'sage';
    case 'ellie': return 'coral';
    case 'joel': return 'ash';
    default: return 'sage'; // Default for unknown agents
  }
};
```

### Voice Application Logic
```typescript
// Always use character-specific voices unless user has manually selected a specific voice
reorderedAgents.forEach(agent => {
  const agentName = (agent as any).name;
  let voiceToUse;
  
  if (selectedVoice !== 'sage') {
    voiceToUse = selectedVoice; // User override
  } else {
    // Always use character-specific voices for known characters
    switch (agentName) {
      case 'sunWukong': voiceToUse = 'echo'; break;
      case 'baiguJing': voiceToUse = 'shimmer'; break;
      case 'erlangShen': voiceToUse = 'ballad'; break;
      case 'zhuBajie': voiceToUse = 'verse'; break;
      case 'tangMonk': voiceToUse = 'ash'; break;
      case 'shaWujing': voiceToUse = 'ballad'; break;
      case 'guanyin': voiceToUse = 'coral'; break;
      case 'dragonHorse': voiceToUse = 'verse'; break;
      case 'ellie': voiceToUse = 'coral'; break;
      case 'joel': voiceToUse = 'ash'; break;
      default: voiceToUse = selectedVoice || 'sage'; // Fallback for unknown agents
    }
  }
  
  (agent as any).voice = voiceToUse;
});
```

### Benefits
- **Better UX**: Voice selector is next to agent selector for logical grouping
- **Visual Feedback**: Dropdown shows which voice the current agent will use
- **Automatic Loading**: No manual configuration needed - voices load automatically
- **Consistent Behavior**: All agents with pre-assigned voices use them by default
- **Fallback Support**: Unknown agents gracefully fall back to default voice
- **User Override**: Users can still manually select any voice for all agents

### UI Layout
- **Agent Selector**: Left side with dropdown
- **Voice Selector**: Right side with dropdown showing current voice
- **Visual Grouping**: Both selectors are in the same row for better UX
- **Responsive Design**: Maintains layout on different screen sizes

## Agent Handoff System

### Overview
Handoffs allow agents to transfer conversation control to other specialized agents based on user intent, conversation context, or specific conditions. This enables complex multi-agent workflows where different agents handle different aspects of a conversation.

### How Handoffs Work

#### 1. **Basic Handoff Setup**
```typescript
// Agent A can hand off to Agent B
export const agentA = new RealtimeAgent({
  name: 'agentA',
  voice: 'sage',
  instructions: 'If user wants X, hand off to agentB',
  handoffs: [agentB], // List of agents this agent can hand off to
  tools: [],
  handoffDescription: 'Agent that handles initial requests',
});

export const agentB = new RealtimeAgent({
  name: 'agentB', 
  voice: 'echo',
  instructions: 'Specialized agent for handling X',
  handoffs: [], // Can hand off to other agents if needed
  tools: [],
  handoffDescription: 'Specialized agent for X',
});
```

#### 2. **Handoff Triggers**
Handoffs are triggered when:
- **Explicit Instructions**: Agent instructions tell it to hand off based on conditions
- **User Intent**: User requests something the current agent can't handle
- **Conversation Flow**: Natural progression requires specialized expertise
- **Tool Results**: Tool execution indicates need for different agent

#### 3. **Handoff Implementation Patterns**

##### **Pattern 1: Simple Conditional Handoff**
```typescript
// Greeter hands off to specialist based on user request
export const greeterAgent = new RealtimeAgent({
  name: 'greeter',
  instructions: `
    Greet the user and ask what they need help with.
    - If they want a haiku, hand off to 'haikuWriter'
    - If they want customer service, hand off to 'customerService'
  `,
  handoffs: [haikuWriterAgent, customerServiceAgent],
});
```

##### **Pattern 2: Multi-Agent Network**
```typescript
// Each agent can hand off to multiple others
(authenticationAgent.handoffs as any).push(returnsAgent, salesAgent, simulatedHumanAgent);
(returnsAgent.handoffs as any).push(authenticationAgent, salesAgent, simulatedHumanAgent);
(salesAgent.handoffs as any).push(authenticationAgent, returnsAgent, simulatedHumanAgent);
```

##### **Pattern 3: Supervisor Pattern**
```typescript
// Junior agent defers to supervisor for complex decisions
export const chatAgent = new RealtimeAgent({
  name: 'chatAgent',
  instructions: `
    You are a junior agent. For complex requests, use getNextResponseFromSupervisor tool.
    Only handle basic greetings and information collection.
  `,
  tools: [getNextResponseFromSupervisor],
});

// Supervisor agent handles complex logic and tool calls
export const supervisorAgent = new RealtimeAgent({
  name: 'supervisorAgent',
  instructions: `Expert supervisor with access to tools and full context`,
  tools: [lookupPolicyDocument, getUserAccountInfo, findNearestStore],
});
```

### Handoff Configuration

#### **Agent Properties**
- **`handoffs`**: Array of agents this agent can transfer control to
- **`handoffDescription`**: Human-readable description of when to use this agent
- **`instructions`**: Contains logic for when to trigger handoffs

#### **Handoff Logic in Instructions**
```typescript
instructions: `
  # Handoff Conditions
  - If user asks about returns → hand off to 'returns' agent
  - If user wants to make a purchase → hand off to 'sales' agent  
  - If user needs technical support → hand off to 'support' agent
  
  # Handoff Process
  1. Acknowledge the user's request
  2. Explain you're transferring them to a specialist
  3. The system will automatically hand off to the appropriate agent
`
```

### Advanced Handoff Patterns

#### **1. Authentication-Based Routing**
```typescript
export const authenticationAgent = new RealtimeAgent({
  name: 'authentication',
  instructions: `
    # Authentication and Routing
    1. Greet the user and collect their information
    2. Authenticate their identity
    3. Based on their request type, hand off to:
       - 'returns' for return requests
       - 'sales' for purchase requests
       - 'support' for technical issues
  `,
  handoffs: [returnsAgent, salesAgent, supportAgent],
});
```

#### **2. Tool-Based Handoffs**
```typescript
export const routingAgent = new RealtimeAgent({
  name: 'routing',
  tools: [classifyUserIntent],
  instructions: `
    Use classifyUserIntent tool to determine user's needs.
    Based on the classification result, hand off to appropriate agent.
  `,
  handoffs: [salesAgent, supportAgent, returnsAgent],
});
```

#### **3. Supervisor Pattern with Tools**
```typescript
// Junior agent uses supervisor tool for complex decisions
export const getNextResponseFromSupervisor = tool({
  name: 'getNextResponseFromSupervisor',
  execute: async (input, details) => {
    // Send conversation context to supervisor
    // Supervisor analyzes and provides response
    // May include tool calls and handoff recommendations
    return { nextResponse: supervisorResponse };
  },
});
```

### Handoff Best Practices

#### **1. Clear Handoff Descriptions**
```typescript
handoffDescription: 'Customer Service Agent specialized in order lookups, policy checks, and return initiations'
```

#### **2. Smooth Transitions**
```typescript
instructions: `
  When handing off:
  1. Acknowledge the user's request
  2. Explain why you're transferring them
  3. Provide context to the receiving agent
  4. Use natural language like "Let me connect you with our returns specialist"
`
```

#### **3. Bidirectional Handoffs**
```typescript
// Agents can hand off to each other
(agentA.handoffs as any).push(agentB);
(agentB.handoffs as any).push(agentA);
```

#### **4. Context Preservation**
- Handoffs automatically preserve conversation history
- Receiving agent has access to full conversation context
- No manual context passing required

### Handoff Examples

#### **Simple Greeting → Specialist**
```typescript
// User: "Hi, I need help with a return"
// Greeter: "I'll connect you with our returns specialist"
// System: Hands off to returnsAgent
```

#### **Authentication → Service**
```typescript
// User: "I want to return my order"
// Auth: "Let me verify your account first... Now I'll transfer you to returns"
// System: Hands off to returnsAgent
```

#### **Supervisor Pattern**
```typescript
// User: "What's my account balance?"
// Junior: "Let me check that for you"
// Junior: Calls getNextResponseFromSupervisor tool
// Supervisor: Calls getUserAccountInfo tool, provides response
// Junior: Reads supervisor's response to user
```

### Benefits of Handoffs
- **Specialization**: Each agent focuses on their expertise
- **Scalability**: Easy to add new specialized agents
- **User Experience**: Seamless transitions between specialists
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Dynamic routing based on conversation context

## Journey to the West Handoff Implementation

### Use Case 1: Monster Encounter Pattern (Simple Conditional Handoff)

#### **Scenario Flow:**
```
User: "There's a monster ahead!"
Zhu Bajie: "哎呀！有妖怪！猴哥，快来帮忙！" (Oh no! There's a monster! Monkey Brother, come help!)
→ Handoff to Sun Wukong
Sun Wukong: "哈哈！让俺老孙来会会这个妖怪！" (Haha! Let me deal with this monster!)
```

#### **Implementation:**
```typescript
// Zhu Bajie can hand off to Sun Wukong and Erlang Shen
(zhuBajieAgent.handoffs as any).push(sunWukongAgent, erlangShenAgent);

// Handoff triggers in Zhu Bajie's instructions
## 手递交接 (Handoff Logic)
- 遇到妖怪或危险时，立即呼叫孙悟空："猴哥，快来帮忙！"
- 当敌人太强大时，建议请二郎神相助："这妖怪太厉害了，得请二郎神！"
- 发现可疑情况时，让孙悟空用火眼金睛查看："猴哥，用你的火眼金睛看看！"
```

### Use Case 2: Divine Intervention Pattern (Multi-Agent Network)

#### **Scenario Flow:**
```
User: "This monster is too powerful!"
Sun Wukong: "这妖怪确实厉害，看来需要请二郎神相助！" (This monster is indeed powerful, need to ask Erlang Shen for help!)
→ Handoff to Erlang Shen
Erlang Shen: "本神前来助阵！" (This god comes to assist!)
→ After battle, can hand off to any other agent
```

#### **Implementation:**
```typescript
// Multi-agent network - all agents can hand off to each other
(sunWukongAgent.handoffs as any).push(erlangShenAgent, zhuBajieAgent, baiguJingAgent);
(erlangShenAgent.handoffs as any).push(sunWukongAgent, zhuBajieAgent, baiguJingAgent);

// Handoff triggers in Sun Wukong's instructions
## 手递交接 (Handoff Logic)
- 当遇到过于强大的妖怪时，建议请二郎神相助："这妖怪确实厉害，看来需要请二郎神相助！"
- 发现可疑的人或事物时，使用火眼金睛查看："等等，让俺老孙用火眼金睛看看！"
- 当需要天庭帮助时，呼叫二郎神："二郎神，快来助阵！"
```

### Use Case 4: Deception Detection Pattern (Sun Wukong Investigation)

#### **Scenario Flow:**
```
User: "This innocent girl needs help!"
Sun Wukong: "等等，让俺老孙用火眼金睛看看！" (Wait, let me use my golden eyes to see!)
→ Handoff to Sun Wukong for investigation
Sun Wukong: "这是妖怪变的！" (This is a monster in disguise!)
→ Handoff back to original agent or to Erlang Shen
```

#### **Implementation:**
```typescript
// Baigu Jing can hand off to Sun Wukong and Erlang Shen
(baiguJingAgent.handoffs as any).push(sunWukongAgent, erlangShenAgent);

// Handoff triggers in Baigu Jing's instructions
## 手递交接 (Handoff Logic)
- 当被发现是妖怪时，试图逃跑："哎呀！被发现了！"
- 当需要更强大的力量时，呼叫其他妖怪："快来帮忙！"
- 当伪装被识破时，露出真面目："既然被发现了，那就别怪我不客气！"
```

### Character-Specific Handoff Triggers

#### **Zhu Bajie (Pigsy)**
- **Triggers**: Monsters, danger, food, complaints
- **Handoffs**: Sun Wukong (for fighting), Erlang Shen (for powerful enemies)
- **Phrases**: "猴哥，快来帮忙！" (Monkey Brother, come help!)

#### **Sun Wukong (Monkey King)**
- **Triggers**: Fighting, investigation, powerful enemies, suspicious situations
- **Handoffs**: Erlang Shen (for divine help), Zhu Bajie (for support), Baigu Jing (for investigation)
- **Phrases**: "让俺老孙用火眼金睛看看！" (Let me use my golden eyes to see!)

#### **Erlang Shen (Celestial War God)**
- **Triggers**: Powerful enemies, divine intervention, maintaining order
- **Handoffs**: Sun Wukong (for collaboration), Zhu Bajie (for support), Baigu Jing (for investigation)
- **Phrases**: "本神前来助阵！" (This god comes to assist!)

#### **Baigu Jing (White Bone Demon)**
- **Triggers**: Deception, disguise, being discovered, needing help
- **Handoffs**: Sun Wukong (when discovered), Erlang Shen (when cornered)
- **Phrases**: "哎呀！被发现了！" (Oh no! I've been discovered!)

### Handoff Network Architecture

```
Zhu Bajie ←→ Sun Wukong ←→ Erlang Shen
     ↕              ↕              ↕
   Baigu Jing ←→ Sun Wukong ←→ Erlang Shen
```

### Use Case 5: Master-Disciple Pattern (Tang Monk Leadership)

#### **Scenario Flow:**
```
User: "Master, what should we do about this situation?"
Tang Monk: "让为师来感化这妖怪！" (Let me convert this demon!)
→ Handoff to Tang Monk for guidance
Tang Monk: "悟空，你去降服这妖怪！" (Wukong, go subdue this demon!)
→ Handoff to Sun Wukong for action
```

#### **Implementation:**
```typescript
// Tang Monk can hand off to all disciples and other characters
(tangMonkAgent.handoffs as any).push(sunWukongAgent, zhuBajieAgent, erlangShenAgent, baiguJingAgent);

// Handoff triggers in Tang Monk's instructions
## 手递交接 (Handoff Logic)
- 当遇到妖怪时，让孙悟空保护："悟空，保护为师！"
- 当需要降妖除魔时，交给孙悟空处理："悟空，你去降服这妖怪！"
- 当遇到强大妖怪时，建议请二郎神相助："看来需要请二郎神相助！"
- 当需要感化妖怪时，亲自出马："让为师来感化这妖怪！"
- 当徒弟们争吵时，出面调解："你们都是为师的徒弟，要和睦相处！"
```

### Character-Specific Handoff Triggers (Updated)

#### **Tang Monk (Xuanzang)**
- **Triggers**: Guidance, teaching, conversion, mediation, protection
- **Handoffs**: All disciples (Sun Wukong, Zhu Bajie, Erlang Shen, Baigu Jing)
- **Phrases**: "悟空，保护为师！" (Wukong, protect your master!)

#### **Zhu Bajie (Pigsy)**
- **Triggers**: Monsters, danger, food, complaints, seeking guidance
- **Handoffs**: Sun Wukong (for fighting), Erlang Shen (for powerful enemies), Tang Monk (for guidance)
- **Phrases**: "师父，您来指点迷津！" (Master, please guide us!)

#### **Sun Wukong (Monkey King)**
- **Triggers**: Fighting, investigation, powerful enemies, suspicious situations, seeking approval
- **Handoffs**: Erlang Shen (for divine help), Zhu Bajie (for support), Baigu Jing (for investigation), Tang Monk (for guidance)
- **Phrases**: "师父，您来指点迷津！" (Master, please guide us!)

#### **Erlang Shen (Celestial War God)**
- **Triggers**: Powerful enemies, divine intervention, maintaining order, seeking wisdom
- **Handoffs**: Sun Wukong (for collaboration), Zhu Bajie (for support), Baigu Jing (for investigation), Tang Monk (for wisdom)
- **Phrases**: "本神前来助阵！" (This god comes to assist!)

#### **Baigu Jing (White Bone Demon)**
- **Triggers**: Deception, disguise, being discovered, needing help, seeking conversion
- **Handoffs**: Sun Wukong (when discovered), Erlang Shen (when cornered), Tang Monk (for conversion)
- **Phrases**: "哎呀！被发现了！" (Oh no! I've been discovered!)

#### **Sha Wujing (Sandy)**
- **Triggers**: Mediation, protection, loyalty, support, conflict resolution
- **Handoffs**: All characters (for support and mediation)
- **Phrases**: "大师兄，保护师父！" (Big brother, protect the master!)

#### **Guanyin (Bodhisattva)**
- **Triggers**: Divine intervention, guidance, crisis resolution, teaching
- **Handoffs**: All characters (for divine guidance and intervention)
- **Phrases**: "让贫僧来降服这妖怪！" (Let me subdue this demon!)

#### **Dragon Horse (Bai Long Ma)**
- **Triggers**: Protection, wisdom, loyalty, transportation, crisis support
- **Handoffs**: All characters (for protection and wisdom)
- **Phrases**: "大师兄，保护师父！" (Big brother, protect the master!)

### Updated Handoff Network Architecture

```
        Tang Monk (Master)
            ↕ ↕ ↕ ↕ ↕ ↕ ↕
Zhu Bajie ←→ Sun Wukong ←→ Erlang Shen
     ↕              ↕              ↕
   Baigu Jing ←→ Sun Wukong ←→ Erlang Shen
     ↕              ↕              ↕
   Sha Wujing ←→ Guanyin ←→ Dragon Horse
```

### Benefits of Journey to the West Handoffs
- **Dynamic Storytelling**: Characters naturally hand off based on their roles
- **Authentic Interactions**: Handoffs match the original story's character dynamics
- **Immersive Experience**: Users feel like they're part of the Journey to the West
- **Character Development**: Each character's personality drives handoff decisions
- **Plot Progression**: Handoffs advance the story naturally
- **Master-Disciple Dynamics**: Tang Monk provides guidance and wisdom to all characters
- **Comprehensive Coverage**: All characters can interact with each other through handoffs

## Handoff Voice Change Issue and Solution

### **The Problem**
The OpenAI Realtime API has a limitation: **voice cannot be changed during an active session**. Voice is set when the session is created and remains fixed throughout the session. This means:

- UI shows the correct voice for each character during handoffs
- But the actual audio voice doesn't change during handoffs
- Users hear the same voice regardless of which character is speaking

### **The Solution**
Implemented automatic session reconnection during handoffs to apply the correct voice:

```typescript
onAgentHandoff: (agentName: string) => {
  handoffTriggeredRef.current = true;
  setSelectedAgentName(agentName);
  // Reconnect to apply new voice for the handoff character
  // This is necessary because OpenAI Realtime API doesn't support voice changes mid-session
  if (sessionStatus === "CONNECTED") {
    console.log(`Handoff to ${agentName} - reconnecting to apply new voice`);
    disconnectFromRealtime();
    // The useEffect will trigger reconnection with the new agent and voice
  }
},

// Auto-reconnect after handoff to apply new voice
useEffect(() => {
  if (handoffTriggeredRef.current && selectedAgentName && sessionStatus === "DISCONNECTED") {
    console.log(`Auto-reconnecting after handoff to ${selectedAgentName}`);
    connectToRealtime();
  }
}, [selectedAgentName, sessionStatus]);
```

### **How It Works**
1. **Handoff Occurs**: Character A hands off to Character B
2. **Disconnect**: Session is disconnected to allow voice change
3. **Auto-Reconnect**: Session automatically reconnects with Character B's voice
4. **Voice Applied**: Character B now speaks with their assigned voice
5. **Seamless Experience**: User experiences proper voice changes during handoffs

### **Trade-offs**
- **Pros**: Voice changes work correctly during handoffs
- **Cons**: Brief disconnection/reconnection during handoffs (usually < 1 second)
- **User Experience**: Minimal disruption, voice changes are now audible

### **Technical Details**
- Voice is applied in `connectToRealtime()` function
- Handoff detection uses `handoffTriggeredRef` to distinguish from manual disconnections
- Auto-reconnection only happens after handoffs, not manual agent changes
- Console logging helps debug handoff voice changes
