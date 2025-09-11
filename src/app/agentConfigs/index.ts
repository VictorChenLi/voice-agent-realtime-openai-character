import { simpleHandoffScenario } from './simpleHandoff';
import { simpleHandoffScenario2 } from './simpleHandoff2';
import { customerServiceRetailScenario } from './customerServiceRetail';
import { chatSupervisorScenario } from './chatSupervisor';
import { journeyToWestScenario } from './journeyToWest';
import { theLastOfUsScenario } from './theLastOfUs';

import type { RealtimeAgent } from '@openai/agents/realtime';

// Map of scenario key -> array of RealtimeAgent objects
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  simpleHandoff: simpleHandoffScenario,
  simpleHandoff2: simpleHandoffScenario2,
  customerServiceRetail: customerServiceRetailScenario,
  chatSupervisor: chatSupervisorScenario,
  journeyToWest: journeyToWestScenario,
  theLastOfUs: theLastOfUsScenario,
};

export const defaultAgentSetKey = 'chatSupervisor';
