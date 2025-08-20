import React, { useState } from 'react'
import { format, isAfter, isBefore, addHours } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface EventFormData {
  name: string
  description: string
  location: string
  startDate?: Date
  startTime: string
  endDate?: Date
  endTime: string
}

interface TimeInputProps {
  data: EventFormData
  onUpdate: (updates: Partial<EventFormData>) => void
}

export function TimeInput({ data, onUpdate }: TimeInputProps) {
  const [startCalendarOpen, setStartCalendarOpen] = useState(false)
  const [endCalendarOpen, setEndCalendarOpen] = useState(false)

  // Get current date as default
  const now = new Date()
  const defaultStartDate = data.startDate || now
  const defaultEndDate = data.endDate || addHours(now, 1)

  // Handle start date selection
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdate({ startDate: date })
      setStartCalendarOpen(false)
    }
  }

  // Handle end date selection
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdate({ endDate: date })
      setEndCalendarOpen(false)
    }
  }

  // Handle start time change
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ startTime: e.target.value })
  }

  // Handle end time change
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ endTime: e.target.value })
  }

  // Get formatted date string
  const getFormattedDate = (date: Date | undefined) => {
    if (!date) return 'Select date'
    return format(date, 'PPP')
  }

  // Get default time values
  const getStartTimeValue = () => {
    return data.startTime || format(now, 'HH:mm')
  }

  const getEndTimeValue = () => {
    return data.endTime || format(addHours(now, 1), 'HH:mm')
  }

  // Validation: check if end time is after start time
  const isValidTimeRange = () => {
    const startDate = data.startDate || defaultStartDate
    const endDate = data.endDate || defaultEndDate
    const startTime = data.startTime || format(now, 'HH:mm')
    const endTime = data.endTime || format(addHours(now, 1), 'HH:mm')

    // Create full datetime objects for comparison
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const startDateTime = new Date(startDate)
    startDateTime.setHours(startHour, startMinute, 0, 0)

    const endDateTime = new Date(endDate)
    endDateTime.setHours(endHour, endMinute, 0, 0)

    return isAfter(endDateTime, startDateTime)
  }

  // Get final processed data
  const getProcessedTimeData = () => {
    const startDate = data.startDate || defaultStartDate
    const endDate = data.endDate || defaultEndDate
    const startTime = data.startTime || format(now, 'HH:mm')
    const endTime = data.endTime || format(addHours(now, 1), 'HH:mm')

    return {
      startDate,
      endDate,
      startTime,
      endTime,
    }
  }

  const processedData = getProcessedTimeData()
  const isValid = isValidTimeRange()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Event Time Period</h3>
        <p className="text-sm text-muted-foreground">
          Select the start and end time for your event
        </p>
      </div>

      {/* Start Time Section */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-green-600">Start Time</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !data.startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getFormattedDate(data.startDate || defaultStartDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.startDate || defaultStartDate}
                  onSelect={handleStartDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <div className="relative">
              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-time"
                type="time"
                value={getStartTimeValue()}
                onChange={handleStartTimeChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* End Time Section */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-red-600">End Time</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !data.endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getFormattedDate(data.endDate || defaultEndDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.endDate || defaultEndDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <div className="relative">
              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-time"
                type="time"
                value={getEndTimeValue()}
                onChange={handleEndTimeChange}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {!isValid && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            ⚠️ End time must be after start time
          </p>
        </div>
      )}

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Time Period Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Start:</span>{' '}
            {format(processedData.startDate, 'PPP')} at {processedData.startTime}
          </div>
          <div className="text-sm">
            <span className="font-medium">End:</span>{' '}
            {format(processedData.endDate, 'PPP')} at {processedData.endTime}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {isValid ? (
              <span className="text-green-600">✓ Valid time period</span>
            ) : (
              <span className="text-red-600">✗ Invalid time period</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}