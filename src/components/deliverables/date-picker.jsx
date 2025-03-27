'use client'
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"

export default function DatePicker({ date, setDate, nameRef }) {
  const [inputValue, setInputValue] = useState("")
  const [calendarDate, setCalendarDate] = useState(undefined)
  
  // Parse a date string from yyyy-MM-dd format
  const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null
    
    // Parse from yyyy-MM-dd format
    const parts = dateStr.split('-')
    if (parts.length !== 3) return null
    
    const year = parseInt(parts[0])
    const month = parseInt(parts[1]) - 1 // JS months are 0-indexed
    const day = parseInt(parts[2])
    
    return new Date(year, month, day)
  }
  
  // Format a date object to yyyy-MM-dd string
  const formatDate = (date) => {
    if (!date) return ""
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }
  
  // Update input value when date prop changes
  useEffect(() => {
    if (date) {
      const dateObj = parseDate(date)
      setCalendarDate(dateObj)
      setInputValue(date) // Use the raw string for input
    } else {
      setCalendarDate(undefined)
      setInputValue("")
    }
  }, [date])
  
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    // Date validation - simple check if it's in format yyyy-MM-dd
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (datePattern.test(value)) {
      // Try parsing to make sure it's valid
      const dateObj = parseDate(value)
      if (dateObj && !isNaN(dateObj.getTime())) {
        setCalendarDate(dateObj)
        setDate(value) // Send the string format to parent
      }
    }
  }
  
  const handleCalendarSelect = (selectedDate) => {
    if (selectedDate) {
      // Format the date to yyyy-MM-dd
      const formattedDate = formatDate(selectedDate)
      setInputValue(formattedDate)
      setCalendarDate(selectedDate)
      setDate(formattedDate) // Send the string format to parent
    } else {
      setInputValue("")
      setCalendarDate(undefined)
      setDate("")
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
            selected={calendarDate}
            onSelect={handleCalendarSelect}
            fromYear={1950}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}