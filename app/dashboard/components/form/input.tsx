import { ChangeEvent, KeyboardEvent, useEffect } from "react"

type InputProps = {
    id? : string,
    value?: string,
    onChange: (x: string)=> void,
}

const Input = ({
    id = "",
    value,
    onChange
}: InputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        onChange(e.target.value)
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <input type="text" id={id} className="mt-1 p-3 block w-full rounded-md border-gray-300 text-lg bg-white text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={value} onChange={handleChange}
            onKeyPress={handleKeyPress}
        />
    )
}

export default Input