import { Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface GoalCardProps {
  goal: {
    id: number
    title: string
    description: string
    category: string
    progress: number
    dueDate: string
  }
}

export function GoalCard({ goal }: GoalCardProps) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <Target className="h-8 w-8 text-indigo-400" />
        <span className="text-sm text-gray-400">{goal.progress}% Complete</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{goal.description}</p>
      <Progress value={goal.progress} className="mb-2" />
      <p className="text-xs text-gray-500">Due: {goal.dueDate}</p>
    </div>
  )
}