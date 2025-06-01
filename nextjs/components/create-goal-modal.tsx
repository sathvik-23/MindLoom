interface CreateGoalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create New Goal</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ×
        </button>
        {/* Form content would go here */}
        <p className="text-gray-400">Goal creation form coming soon...</p>
      </div>
    </div>
  )
}