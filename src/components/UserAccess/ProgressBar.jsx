const ProgressBar = ({ currentStep, totalSteps, role }) => {
  const steps = []

  if (role === "Shipper"){
    steps.push("Basic Information", "Company Details", "Additional Information", "User Permissions")
  }else{
    steps.push("Basic Information", "User Permissions")
  }

  const calculateProgress = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100
  }

  return (
    <div className="w-full">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center relative z-10 ${
                index < currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center ${
                  index + 1 === currentStep
                    ? "bg-blue-600 text-white"
                    : index + 1 < currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-center mt-2">
                <span className="font-medium text-xs sm:text-sm">{step}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${calculateProgress()}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
