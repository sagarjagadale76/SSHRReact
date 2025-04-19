import * as React from 'react';
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export function Header() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Button variant="default" className="bg-teal-500 hover:bg-teal-600">
        CLEAR FILTER
      </Button>
      
      <div className="flex items-center space-x-4">
        <Select defaultValue="action">
          <SelectTrigger className="w-[180px] bg-teal-500 text-white">
            <SelectValue placeholder="ACTION" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="action">ACTION</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="parcel">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="PARCEL EXPORT" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="parcel">PARCEL EXPORT</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-teal-500 hover:bg-teal-600">
          APPLY FILTER
        </Button>
      </div>
    </div>
  );
}

