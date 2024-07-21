import React, { useEffect, useState } from 'react';
import { DB } from '../lib/db';
import SimpleModal from './addFoodModal';

interface InfoProps {
  updateLog: boolean;
  chosenDate: string;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Info: React.FC<InfoProps> = ({ chosenDate, handleDateChange, updateLog}) => {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calories, setCalories] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [sodium, setSodium] = useState<number>(0);
  const [sugar, setSugar] = useState<number>(0);
  {/** GOALS */}
  const [calorieLimit, setCalorieLimit] = useState<number>(2500);
  const [sodiumLimit, setSodiumLimit] = useState<number>(2300);
  const [fatLimit, setFatLimit] = useState<number>(60);
  const [sugarLimit, setSugarLimit] = useState<number>(36);
  const [proteinGoal, setProteinGoal] = useState<number>(50);
  {/** Temporary state for checking goals */}
  const [calorieCHECK, setCalorieCHECK] = useState<number>(2500);
  const [sodiumCHECK, setSodiumCHECK] = useState<number>(2300);
  const [fatCHECK, setFatCHECK] = useState<number>(60);
  const [sugarCHECK, setSugarCHECK] = useState<number>(36);
  const [proteinCHECK, setProteinCHECK] = useState<number>(50);
  const [goalCheck, setGoalCheck] = useState<boolean>(true);
  {/** GOAL PERCENTAGES */}
  const [calorieP, setCalorieP] = useState<number>(0);
  const [sodiumP, setSodiumP] = useState<number>(0);
  const [fatP, setFatP] = useState<number>(0);
  const [sugarP, setSugarP] = useState<number>(0);
  const [proteinP, setProteinP] = useState<number>(0);  
  {/**------------------------- */}

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (chosenDate) {
        try {
          const db = new DB();
          await db.init();
          const items = await db.getFoodItemsForDate(chosenDate);
          setFoodItems(items || []);
          setError(null);
          
          let totalCalories = 0;
          let totalFat = 0;
          let totalProtein = 0;
          let totalSodium = 0;
          let totalSugar = 0;

          items.forEach((foodItem: { macros: { calories: number; fat: number; protein: number; sodium: number; sugar: number; }; }) => {
            totalCalories += Number(foodItem.macros.calories || 0);
            totalFat += Number(foodItem.macros.fat || 0);
            totalProtein += Number(foodItem.macros.protein || 0);
            totalSodium += Number(foodItem.macros.sodium || 0);
            totalSugar += Number(foodItem.macros.sugar || 0);
          });

          setCalories(parseFloat(totalCalories.toFixed(2)));
          setFat(parseFloat(totalFat.toFixed(2)));
          setProtein(parseFloat(totalProtein.toFixed(2)));
          setSodium(parseFloat(totalSodium.toFixed(2)));
          setSugar(parseFloat(totalSugar.toFixed(2)));

        } catch (err: any) {
          setError("Failed to fetch food items");
          setFoodItems([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFoodItems();
  }, [chosenDate, updateLog]);

  const handleSave = async () => {
    try {
      const db = new DB();
      await db.init();
      const goals = await db.getUserGoals();
      if (goals.length > 0) {
        const goalToUpdate = goals[0];
        await db.editUserGoal(goalToUpdate.id,{
          calorieLimit: calorieCHECK,
          sodiumLimit: sodiumCHECK,
          fatLimit: fatCHECK,
          sugarLimit: sugarCHECK,
          proteinGoal: proteinCHECK          
        })
      } else {
        await db.addUserGoal({
          calorieLimit: calorieCHECK,
          sodiumLimit: sodiumCHECK,
          fatLimit: fatCHECK,
          sugarLimit: sugarCHECK,
          proteinGoal: proteinCHECK
        });        
      }
      setGoalCheck(true)
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save user goals:", error);
    }
  };

  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const db = new DB();
        await db.init();
        const goals = await db.getUserGoals();
        const goal = goals[0]
        if (goal) {
          console.log(goal.calorieLimit)
          setCalorieLimit(goal.calorieLimit || 2500);
          setSodiumLimit(goal.sodiumLimit || 2300);
          setFatLimit(goal.fatLimit || 60);
          setSugarLimit(goal.sugarLimit || 36);
          setProteinGoal(goal.proteinGoal || 50);
          setCalorieCHECK(goal.calorieLimit || 2500);
          setSodiumCHECK(goal.sodiumLimit || 2300);
          setFatCHECK(goal.fatLimit || 60);
          setSugarCHECK(goal.sugarLimit || 36);
          setProteinCHECK(goal.proteinGoal || 50);          
        }
        setGoalCheck(false)
      } catch (error) {
        console.error('Failed to fetch user goals:', error);
      }
    };
    if (goalCheck) {
      fetchUserGoals();
    }
  }, [goalCheck, chosenDate, updateLog]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value));
  };

  useEffect(() => {
    setCalorieP(parseFloat((calories / calorieLimit * 100).toFixed(0)));
    setSodiumP(parseFloat((sodium / sodiumLimit * 100).toFixed(0)));
    setFatP(parseFloat((fat / fatLimit * 100).toFixed(0)));
    setProteinP(parseFloat((protein / proteinGoal * 100).toFixed(0)));
    setSugarP(parseFloat((sugar / sugarLimit * 100).toFixed(0)));
  }, [calories, calorieLimit, sodium, sodiumLimit, fat, fatLimit, protein, proteinGoal, sugar, sugarLimit]);
  



  return (
    <div id='INFO' className="p-4 bg-white rounded-lg shadow-md md:h-full w-full">
      <div className="flex justify-around p-2">
        <input type="date" value={chosenDate} onChange={handleDateChange} className="border-solid border-black border-2 rounded-full p-2 hover:bg-slate-200 transition duration-300 ease-in-out transform hover:cursor-pointer" />
        <button onClick={() => setModalOpen(true)} className="border-solid border-black border-2 rounded-full p-2 hover:bg-slate-200 transition duration-300 ease-in-out transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col mx-2 ">
        <div className='flex flex-col items-center'>
          <p className="text-lg font-semibold text-gray-700">Calorie Limit: {calorieLimit}</p>
          {/** Calorie CIRCLE */}
          <div className="relative md:size-40 size-32">
            <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
              <g className="origin-center -rotate-90 transform">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-blue-600 dark:text-blue-500" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={Math.max(100 - calorieP, 0)}></circle>
              </g>
            </svg>
            <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{calorieP}%</span>
            </div>
          </div>
          {/** --------------- */}
          <p className="text-lg font-semibold text-gray-700">Calories Eaten: {calories}</p>          
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {/** Protein */}
          <div className='inline-block'>
            {/** Calorie CIRCLE */}
            <div className="relative md:size-40 size-32">
              <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
                <g className="origin-center -rotate-90 transform">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-orange-600 dark:text-orange-500" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={Math.max(100 - proteinP, 0)}></circle>
                </g>
              </svg>
              <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{proteinP}%</span>
              </div>
            </div>
            {/** --------------- */}
            <h1 className='text-center'>{protein}g</h1>
            <h1 className='text-center'><span className='font-bold'>Protein Goal: </span>{proteinGoal}g</h1>
          </div>
          {/** Fat */}
          <div className='inline-block'>
            {/** Calorie CIRCLE */}
            <div className="relative md:size-40 size-32">
              <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
                <g className="origin-center -rotate-90 transform">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-red-600 dark:text-red-500" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={Math.max(100 - fatP, 0)}></circle>
                </g>
              </svg>
              <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{fatP}%</span>
              </div>
            </div>
            {/** --------------- */}
            <h1 className='text-center'>{fat}g</h1>
            <h1 className='text-center'><span className='font-bold'>Fat Limit: </span>{fatLimit}g</h1>
          </div>
          {/** SODIUM */}
          <div className='inline-block'>
            {/** Calorie CIRCLE */}
            <div className="relative md:size-40 size-32">
              <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
                <g className="origin-center -rotate-90 transform">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-yellow-600 dark:text-yellow-500" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={Math.max(100 - fatP, 0)}></circle>
                </g>
              </svg>
              <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{sodiumP}%</span>
              </div>
            </div>
            {/** --------------- */}
            <h1 className='text-center'>{sodium}mg</h1>
            <h1 className='text-center'><span className='font-bold'>Sodium Limit: </span>{sodiumLimit}mg</h1>
          </div>
          {/** Sugar */}
          <div className='inline-block'>
            {/** Calorie CIRCLE */}
            <div className="relative md:size-40 size-32">
              <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
                <g className="origin-center -rotate-90 transform">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-purple-600 dark:text-purple-500" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={Math.max(100 - sugarP, 0)}></circle>
                </g>
              </svg>
              <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{sugarP}%</span>
              </div>
            </div>
            {/** --------------- */}
            <h1 className='text-center'>{sugar}g</h1>
            <h1 className='text-center'><span className='font-bold'>Sugar Limit: </span>{sugarLimit}g</h1>
          </div>
        </div>
      </div>

      {/**SETINGS*/}
      <SimpleModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div>
          <h1 className='underline text-lg'>User Settings</h1>
          <div className='flex flex-col gap-2 justify-start'>
            <div className='flex gap-3'>
              <p>Calorie Limit: </p>
              <input className='bg-slate-100 rounded-full px-2' type="number" value={calorieCHECK} onChange={handleInputChange(setCalorieCHECK)}/>
            </div>
            <div className='flex gap-3'>
              <p>Sodium Limit (mg): </p>
              <input className='bg-slate-100 rounded-full px-2' type="number" value={sodiumCHECK} onChange={handleInputChange(setSodiumCHECK)}/>
            </div>
            <div className='flex gap-3'>
              <p>Fat Limit (g): </p>
              <input className='bg-slate-100 rounded-full px-2' type="number" value={fatCHECK} onChange={handleInputChange(setFatCHECK)}/>
            </div>
            <div className='flex gap-3'>
              <p>Sugar Limit (g): </p>
              <input className='bg-slate-100 rounded-full px-2' type="number" value={sugarCHECK} onChange={handleInputChange(setSugarCHECK)}/>
            </div>
            <div className='flex gap-3'>
              <p>Protein goal (g): </p>
              <input className='bg-slate-100 rounded-full px-2' type="number" value={proteinCHECK} onChange={handleInputChange(setProteinCHECK)}/>
            </div>
            <button onClick={() => {handleSave()}} className="m-2 bg-green-500 text-white px-2 rounded-xl hover:bg-green-600 transition duration-300 ease-in-out transform">
              Save
            </button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
};

export default Info;
