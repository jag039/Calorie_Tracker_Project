import { useState, useEffect } from 'react';
import { DB } from '../lib/db';

interface LogProps {
  chosenDate: string;
  updateLog: boolean;
  setUpdateLog: React.Dispatch<React.SetStateAction<boolean>>;
}

const Log: React.FC<LogProps> = ({ chosenDate, updateLog, setUpdateLog }) => {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (chosenDate) {
        try {
          const db = new DB();
          await db.init();
          const items = await db.getFoodItemsForDate(chosenDate);
          setFoodItems(items || []);
          setError(null);
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

  const handleDelete = async (id: number) => {
    try {
      const db = new DB();
      await db.init();
      await db.deleteFoodItem(id);
      setUpdateLog(prev => !prev);
    } catch (error) {
      console.error("Failed to delete food item:", error);
    }
  };
  

  return (
    <div className='flex flex-col h-full'>
      <div>
        <h1>Food Log:</h1>
      </div>
      <div className="flex flex-col gap-5 overflow-y-auto flex-grow">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {foodItems.length > 0 ? (
          foodItems.map((item, index) => (
            <div id="foodLogItemContainer" key={index} className="p-2 rounded-lg bg-lime-200">
              <div className='flex flex-row'>
                <div className='grow font-bold underline'>{item.food_name}</div>
                <div id='foodLogItem'><button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 rounded-full hover:bg-red-600 transition duration-300 ease-in-out transform">X</button></div>
              </div>
              <p className='flex flex-col gap-1'>
                <span><span className='font-semibold'>Number of servings: </span>{item.servings}</span>
                <span><span className='font-semibold'>Calories: </span>{item.macros.calories}</span>
                <span><span className='font-semibold'>Fat: </span>{item.macros.fat}g</span>
                <span><span className='font-semibold'>Sodium: </span>{item.macros.sodium}mg</span>
                <span><span className='font-semibold'>Sugar: </span>{item.macros.sugar}g</span>
              </p>
            </div>
          ))
        ) : (
          <div>No food items inputted for today. Go Ahead and begin tracking your meals for the day</div>
        )}
      </div>      
    </div>

  );
};

export default Log;
