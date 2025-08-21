import React from 'react'

export default function Show() {

    const [toggle, setToggle] = React.useState(false)
    const handleToggle = () => {
        setToggle(!toggle)
        console.log("toggle", toggle)
    }
  return (
    <div className='w-full h-full relative'>
        <h1 className="text-2xl text-white font-bold">Merchant Payment Show</h1>
        <p>This is the show page for merchant payments.</p>
        {/* Add more content or components as needed */}
        <p>Here you can display details about a specific merchant payment.</p>
        <p>Consider adding features like viewing transaction history, payment details, etc.</p>
        <p>Make sure to handle any necessary data fetching and state management.</p>
        <p>Use appropriate components to enhance the user experience.</p>
        <p>Ensure the design is consistent with the rest of the dashboard.</p>
        <p>Consider adding links to related pages or actions.</p>
        <p>Test the functionality thoroughly to ensure everything works as expected.</p>

        <button onClick={handleToggle} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Toggle Details
        </button>
        
        {toggle && (
            <div className="absolute top-0 left-0 inset-0 z-50 w-screen h-screen bg-[#212324cc] flex justify-center items-center">
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                    <p>Details about the payment will go here.</p>
                    <button onClick={handleToggle} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}
