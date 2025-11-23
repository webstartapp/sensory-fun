import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        return (
            <div className={className}>
                <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-200"
                    htmlFor={id}
                >
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        id={id}
                        className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 
              ${error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white'
                            }`}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
