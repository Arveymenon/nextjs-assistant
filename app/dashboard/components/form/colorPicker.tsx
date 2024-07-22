"use client"

import { useEffect, useState } from 'react'
import { HslStringColorPicker, HexColorInput } from 'react-colorful'

type ColorPickerProps = {
    id? : string,
    value?: string,
    onChange: (x: string)=> void,
}

const ColorPicker = ({
    id = "",
    value,
    onChange
}: ColorPickerProps) => {
    const [color, setColor] = useState<string>(value || "hsl(0, 0%, 0%)");
    
    useEffect(()=>{if(value) setColor(value) },[value])

    let handleChange = (newColor: string) => {
        setColor(newColor)
        onChange(newColor)
    }

      return (<div id={id}>
        <HslStringColorPicker color={color} onChange={handleChange}/>
    </div>)
}

export default ColorPicker