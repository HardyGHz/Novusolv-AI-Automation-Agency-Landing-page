import { Plus, ArrowUp } from 'lucide-react'

interface PromptBoxProps {
  autoFocus?: boolean
}

export default function PromptBox({ autoFocus = false }: PromptBoxProps) {
  return (
    <form className="w-full max-sm:px-5" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-4 max-w-[766px] w-full mx-auto">
        <div className="flex flex-col gap-2 w-full flex-shrink-0 relative">
          <div className="relative w-full">
            <div className="w-full flex flex-col mx-auto overflow-hidden relative border border-outline-default rounded-3xl shadow-lg bg-surface-default">
              <div className="relative grow h-full max-sm:overflow-auto">
                <textarea
                  name="prompt"
                  rows={4}
                  className="block text-heading relative z-[1] resize-none overflow-auto py-5 pb-0 px-5 w-full max-h-[250px] min-h-[80px] bg-transparent text-[14px] placeholder:text-[14px] focus:outline-none leading-[150%] placeholder:text-heading placeholder:opacity-50"
                  placeholder="Ask me anything..."
                  autoFocus={autoFocus}
                  aria-label="prompt"
                />
              </div>
              <div className="px-5 pb-3 pt-3 flex w-full justify-between relative z-[1]">
                <div className="flex gap-2">
                  <button
                    className="flex items-center justify-center cursor-pointer text-body hover:bg-gray-100 w-[28px] h-[28px] rounded-full transition-colors"
                    type="button"
                    aria-label="Attach file"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    className="flex items-center justify-center bg-surface-button-default text-white hover:bg-surface-button-default-hover disabled:bg-gray-200 disabled:text-gray-400 w-[28px] h-[28px] rounded-full transition-colors disabled:cursor-not-allowed"
                    disabled
                    type="submit"
                    aria-label="Submit prompt"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
