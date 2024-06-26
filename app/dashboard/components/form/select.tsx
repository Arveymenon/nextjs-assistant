"use client"

import { ChangeEvent, Dispatch } from "react"

export type SelectOption = {
    id?: string
    value: string
}

type SelectProps = {
    options: SelectOption[],
    selected?: string,
    setSelected: (x: string)=> void,
}

const Select = ({
    options,
    setSelected,
    selected
}: SelectProps) => {
    return (
        <select id="client" className="mt-1 p-3 block w-full rounded-md border-gray-300 text-lg bg-white text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selected} onChange={(e)=>setSelected(e.target.value)}>
            {options.map((option, index)=>{
                return <option key={index} value={option.id || option.value}>{option.value}</option>
            })}
        </select>
    )
}

export default Select