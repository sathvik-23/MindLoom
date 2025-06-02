/**
 * Utility functions for goal management
 */

/**
 * Extract goal information from a user message
 * @param message The user message to analyze
 * @returns Object with goal name, category, and progress if found
 */
export function extractGoalFromMessage(message: string): { 
  isGoalRequest: boolean; 
  name?: string; 
  category?: string;
  progress?: number;
} {
  // Normalize message
  const normalizedMessage = message.toLowerCase();
  
  // Check if this is a goal request
  const goalKeywords = [
    'add goal', 'create goal', 'track goal', 'new goal',
    'set goal', 'add a goal', 'create a goal', 'track a goal'
  ];
  
  const isGoalRequest = goalKeywords.some(keyword => 
    normalizedMessage.includes(keyword)
  );
  
  if (!isGoalRequest) {
    return { isGoalRequest: false };
  }
  
  // Try to extract goal name
  let name: string | undefined;
  
  // Patterns to extract goal name
  const goalNamePatterns = [
    /(?:add|create|track|set|new)(?: a)? goal(?: to| for| of)? (.+?)(?:with|at|\.|$)/i,
    /(?:add|create|track|set|new)(?: a)? goal called (.+?)(?:with|at|\.|$)/i,
    /(?:add|create|track|set|new)(?: a)? goal: (.+?)(?:with|at|\.|$)/i,
    /(?:add|create|track|set|new)(?: a)? (.+?) goal/i,
    /goal(?::|is|for)(?: to)? (.+?)(?:with|at|\.|$)/i
  ];
  
  for (const pattern of goalNamePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      name = match[1].trim();
      break;
    }
  }
  
  // Extract category if available
  let category: string | undefined;
  const categoryMatch = message.match(/(?:in|for|category|type)(?: the)? (?:category|area)(?: of)? (?:"|')?([^"'.,]+)(?:"|')?/i);
  if (categoryMatch && categoryMatch[1]) {
    category = categoryMatch[1].trim();
  }
  
  // Extract progress if available
  let progress: number | undefined;
  const progressMatch = message.match(/(?:at|with|progress|completed)(?: a| an)? (\d+)(?:%| percent)/i);
  if (progressMatch && progressMatch[1]) {
    progress = parseInt(progressMatch[1], 10);
    if (isNaN(progress) || progress < 0) progress = 0;
    if (progress > 100) progress = 100;
  }
  
  return {
    isGoalRequest,
    name,
    category,
    progress
  };
}

interface GoalResponse {
  id: string;
  name: string;
  category: string;
  progress: number;
  created_at: string;
}

/**
 * Add a goal to the database
 * @param goal Goal data to add
 * @returns Promise with response data
 */
export async function addGoal(goal: { 
  name: string; 
  category?: string; 
  progress?: number 
}): Promise<GoalResponse> {
  try {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add goal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
}

/**
 * Fetch all goals from the database
 * @returns Promise with goals array
 */
export async function fetchGoals(): Promise<GoalResponse[]> {
  try {
    const response = await fetch('/api/goals', {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      console.warn(`API responded with status: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}
