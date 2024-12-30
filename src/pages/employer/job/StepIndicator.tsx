import { StepIndicatorProps } from "../../../types/Employer"

export const StepIndicator=({steps,currentStep}:StepIndicatorProps)=>{
  return (
    <div  className="flex items-center">
      {steps.map((step,index)=>(
        <div key={step.number} className='flex items-center'>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep===step.number ? 'bg-indigo-600':currentStep>step.number ?"bg-indigo-900":"bg-gray-800"}`}>
              <span className="text-sm">{`Step ${step.number}/${steps.length}`}</span>

            </div>
            <div className="ml-3">
              <p className={`text-sm ${currentStep===step.number ?'text-white':'text-gray-500'}`}>
                {step.title}
              </p>
            </div>
          </div>
          {index<steps.length-1 && (
            <div className="w-24 h-px bg-gray-800 mx-4"/>
          )}
        </div>
      ))}
    </div>
  )
}
