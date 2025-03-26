'use client'
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format, parse } from "date-fns"
import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"

export default function DatePicker({ date, setDate, nameRef }) {
  const [inputValue, setInputValue] = useState("")
  
  // Update input value when date prop changes
  useEffect(() => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"))
    }
  }, [date])
  
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    // Try to parse the input as a date
    try {
      const parsedDate = parse(value, "yyyy-MM-dd", new Date())
      if (!isNaN(parsedDate.getTime())) {
        // Convert to ISO string for PostgreSQL timestamptz
        setDate(parsedDate.toISOString())
      }
    } catch (error) {
      // Invalid date format, just update the input
    }
  }
  
  const handleCalendarSelect = (selectedDate) => {
    if (selectedDate) {
      // Set the input field to show the date in user-friendly format
      setInputValue(format(selectedDate, "yyyy-MM-dd"))
      
      // Convert to ISO string for PostgreSQL timestamptz
      setDate(selectedDate.toISOString())
    } else {
      setInputValue("")
      setDate(null)
    }
  }
  
  return (
    <div className="flex gap-2">
      <Input
        name={nameRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="YYYY-MM-DD"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={handleCalendarSelect}
            fromYear={1950}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}