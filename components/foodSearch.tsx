import { ReactNode, useState, useEffect } from 'react';
import SimpleModal from './addFoodModal';
import { DB } from '../lib/db';


{/**
  These are my interfaces:
    FoodItem declares what properties a foodItem will have

    FoodSearchProps is an interface that is to be expected my FoodSearch component
      This interface is inputted into FoodSearch wihtin layout.tsx
*/}
interface FoodItem {
  food_id: number;
  food_name: string;
  servings: {
    serving: {
      serving_description: string;
      calories?: string;
      protein?: string;
      fat?: string;
      sodium?: string;
      sugar?: string;
    }[];
  };
}

interface FoodSearchProps {
  chosenDate: string | null;
  setUpdateLog: React.Dispatch<React.SetStateAction<boolean>>;
}

{/**
  This is my FoodSearch Functional Componenet
    This componenet handles fetching results from my api endpoint /api/foodSearch
    using a search expression and displaying the results. 

    This component also allows a user to fetch a FoodItem result and save it to
    their log
 */}
const FoodSearch: React.FC<FoodSearchProps> = ({ chosenDate, setUpdateLog  }) => {
  /**
   * The current search expression entered by the user.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [searchExpression, setSearchExpression] = useState('');
  /**
   * The search results returned from the API.
   * @type {[FoodItem[] | null, React.Dispatch<React.SetStateAction<FoodItem[] | null>>]}
   */
  const [results, setResults] = useState<FoodItem[] | null>(null);
  /**
   * The error message if there is an error during search.
   * @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]}
   */
  const [error, setError] = useState<string | null>(null);
  /**
   * The currently selected food item.
   * @type {[FoodItem | null, React.Dispatch<React.SetStateAction<FoodItem | null>>]}
   */
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  /**
   * Whether the modal is open or closed.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [modalOpen, setModalOpen] = useState(false);
  /**
   * The number of servings for the selected food item.
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [servings, setServings] = useState(1);

  const [calculatedValues, setCalculatedValues] = useState({
    calories: '0.00',
    protein: '0.00',
    fat: '0.00',
    sodium: '0.00',
    sugar: '0.00',
  });

  {/**
   * Handles the search functionality for food items.
   * 
   * This function sends a request to the server to fetch food items based on the current search expression.
   * If the request is successful, it updates the results state with the fetched data.
   * If there is an error during the request, it sets an appropriate error message.
   * 
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the search operation is complete.
   */}
  const handleSearch = async () => {
    try {
      console.log(searchExpression)
      const response = await fetch(`/api/foodSearch?search_expression=${searchExpression}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setResults(data.foodSearchData.foods_search.results.food);
      setError(null);
    } catch (err: any) {
      setError("Type something to search");
      setResults(null);
    }
  };

  /**
   * Handles the click event for a food item
   * 
   * This function sets selectedItem to item and opens up a modal for the item
   * 
   * @function
   * @param {FoodItem} item - the food item that was clicked
   * @returns {void}
   */
  const handleItemClick = (item: FoodItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  /**
   * Increments serving by 0.5 within modal for selected foodItem
   * 
   * @function
   * @returns {void}
   */
  const incrementServings = () => {
    setServings(prev => prev + 0.5);
  };

  /**
   * Decrements serving by 0.5 wihtin modal for selected foodItem
   * 
   * @function
   * @returns {void}
   */
  const decrementServings = () => {
    setServings(prev => Math.max(0.5, prev - 0.5)); // Prevent going below 0.5
  };

  /**
   * This function is run on the nutritional value of selectedItem.
   * It takes the nutritional value such as calories and multiplies it by servings, which
   * is the servings inputted by the user for selectedItem. therefore correctly representing
   * the nutritional information for the selectedItem based on the servings
   * 
   * @function
   * @param {string} value - the nutritional value of selectedItem
   * @returns {void}
   */
  const calculateNutrition = (value: string | undefined) => {
    if (value) {
      return (parseFloat(value) * servings).toFixed(2);
    }
    return '0.00';
  };

  useEffect(() => {
    if (selectedItem) {
      updateCalculatedValues();
    }
  }, [servings, selectedItem]);

  const updateCalculatedValues = () => {
    if (selectedItem) {
      setCalculatedValues({
        calories: calculateNutrition(selectedItem.servings.serving[0].calories),
        protein: calculateNutrition(selectedItem.servings.serving[0].protein),
        fat: calculateNutrition(selectedItem.servings.serving[0].fat),
        sodium: calculateNutrition(selectedItem.servings.serving[0].sodium),
        sugar: calculateNutrition(selectedItem.servings.serving[0].sugar),
      });
    }
  };

  useEffect(() => {
    const db = new DB();
    db.init();
  }, []);

  /**
   * When confirm is clicked on the modal this function runs.
   * This function saves the foodItme into the indexed DB
   * 
   * @function
   * @returns {void}
   */
  const handleConfirm = async () => {
    if (selectedItem && chosenDate) {
      try {
        const db = new DB();
        await db.init();
        await db.addFoodItem(chosenDate, {
          food_id: selectedItem.food_id,
          food_name: selectedItem.food_name,
          servings: servings,
          macros: calculatedValues,
        });
        setModalOpen(false);
        setServings(1)
        setUpdateLog(prev => !prev)
      } catch (error) {
        console.error("Failed to add food item:", error);
      }
    }
  };

  return (
    <div className='flex flex-col max-h-full overflow-hidden'>
      {/**
       * Div includes search bar and search button
       */}
      <div className='flex flex-row gap-1 mb-2'>
        <input
          type="text"
          value={searchExpression}
          onChange={(e) => setSearchExpression(e.target.value)}
          placeholder="Search for food"
          className='grow rounded-lg h-9 px-2'
        />
        <button
          onClick={handleSearch} 
          className="h-9 rounded-md transition duration-300 ease-in-out transform bg-blue-300 hover:bg-blue-400 active:bg-blue-600">
          Search
        </button>        
      </div>

      {/**
       * FatSecret API search Results:
       * This chunk of code actually displays the results fetched from backend
       */}
      {error && <div>Error: {error}</div>}
      {results && (
        <div className='flex flex-col gap-2 overflow-y-auto'>
          {results.map((item: FoodItem, index) => (
            <div 
              key={index} 
              onClick={() => handleItemClick(item)} 
              className="flex flex-col rounded-lg bg-blue-100 p-4 transition duration-300 ease-in-out transform hover:bg-blue-400 hover:scale-95 cursor-pointer"
            >
              <div className='flex flex-row'>
                <div className='font-extrabold grow underline'>{item.food_name}</div>
              </div>
              <div>
                <p className='flex flex-row gap-2'>
                  {item.servings.serving[0].serving_description && (
                    <span className='flex flex-col'><span className='font-bold'>Serving Size: </span><span>{item.servings.serving[0].serving_description}</span></span>
                  )}
                  {item.servings.serving[0].calories && (
                    <span><span className='font-bold'>Calories: </span>{item.servings.serving[0].calories}</span>
                  )}
                  {item.servings.serving[0].protein && (
                    <span><span className='font-bold'>Protein: </span>{item.servings.serving[0].protein}g</span>
                  )}
                  {item.servings.serving[0].fat && (
                    <span><span className='font-bold'>Fat: </span>{item.servings.serving[0].fat}g</span>
                  )}
                  {item.servings.serving[0].sodium && (
                    <span><span className='font-bold'>Sodium: </span>{item.servings.serving[0].sodium}mg</span>
                  )}
                  {item.servings.serving[0].sugar && (
                    <span><span className='font-bold'>Sugar: </span>{item.servings.serving[0].sugar}g</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/**
       * Modal opens when modalOpen is true.
       * this actually happens when a fooditem is clicked, and selectedItem is set to this item
       */}
      <SimpleModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedItem && (
          <div>
            <h3 className='text-lg font-semibold underline'>{selectedItem.food_name}</h3>
            <p>1 serving is {selectedItem.servings.serving[0].serving_description}</p>
            <p>Calories: <span className='font-bold'>{calculateNutrition(selectedItem.servings.serving[0].calories)}</span></p>
            <p>Protein: <span className='font-bold'>{calculateNutrition(selectedItem.servings.serving[0].protein)}</span>g</p>
            <p>Fat: <span className='font-bold'>{calculateNutrition(selectedItem.servings.serving[0].fat)}</span>g</p>
            <p>Sodium: <span className='font-bold'>{calculateNutrition(selectedItem.servings.serving[0].sodium)}</span>mg</p>
            <p>Sugar: <span className='font-bold'>{calculateNutrition(selectedItem.servings.serving[0].sugar)}</span>g</p>
            <div className='flex justify-center'>
              <button onClick={decrementServings} className="bg-red-500 text-white px-2 rounded-full hover:bg-red-600 transition duration-300 ease-in-out transform">-</button>
              <span>{servings.toFixed(2)} serving{servings > 1 ? 's' : ''}</span>
              <button onClick={incrementServings } className="bg-green-500 text-white px-2 rounded-xl hover:bg-green-600 transition duration-300 ease-in-out transform">+</button>
            </div>
            <div className='flex justify-center'>
              <button onClick={handleConfirm} className="m-2 bg-green-500 text-white px-2 rounded-xl hover:bg-green-600 transition duration-300 ease-in-out transform">Confirm</button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
};

export default FoodSearch;
