import { useState } from 'react';
import FoodSearch from "@/components/foodSearch";
import Info from "@/components/Info";
import Log from "@/components/Log";

export default function Layout() {
  const getCurrentLocalDate = (): string => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChosenDate(event.target.value);
  };

  const [chosenDate, setChosenDate] = useState<string>(getCurrentLocalDate());
  const [updateLog, setUpdateLog] = useState<boolean>(false);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-col lg:flex-row flex-grow max-h-full ">
        <div className="md:h-full min-h-fit p-2 lg:max-w-md ">
          <Info  chosenDate={chosenDate} handleDateChange={handleDateChange} updateLog={updateLog}/>
        </div>
        <div className="flex-grow p-2">
          <Log chosenDate={chosenDate} updateLog={updateLog} setUpdateLog={setUpdateLog}/>
        </div>
        <div className="flex-grow h-full p-2 lg:max-w-xl">
          <FoodSearch chosenDate={chosenDate} setUpdateLog={setUpdateLog}/>
        </div>
      </div>
    </div>
  );
}
