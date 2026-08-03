import { Button } from "./components/ui/button";

const App = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md border border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Welcome
                </h1>

                <p className="text-gray-600 mb-4">
                    Your application is running successfully.
                </p>

                <Button variant="default" className="w-full">
                    Get Started
                </Button>
            </div>
        </div>
    );
};
export default App;