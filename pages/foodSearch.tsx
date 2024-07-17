import { ReactNode, useState } from 'react';

interface FoodItem {
  food_name: string;
  servings: {
    serving: {
      calories?: string;
      protein?: string;
      fat?: string;
      sodium?: string;
      sugar?: string;
    }[];
  };
}

const FoodSearch = () => {
  const [searchExpression, setSearchExpression] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/foodSearch?search_expression=${searchExpression}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setResults(data.foodSearchData.foods_search.results.food);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResults(null);
    }
  };

  return (
    <div>
      <h1>Food Search</h1>
      <input
        type="text"
        value={searchExpression}
        onChange={(e) => setSearchExpression(e.target.value)}
        placeholder="Search for food"
      />
      <button onClick={handleSearch} className="rounded-md transition duration-300 ease-in-out transform bg-blue-300 hover:bg-blue-400 active:bg-blue-600">Search</button>
      {error && <div>Error: {error}</div>}
      {results && (
        <div className='flex flex-col gap-2'>
          {results.map((item: FoodItem) => (
            <div className="flex flex-col rounded-lg bg-blue-100 p-4 transition duration-300 ease-in-out transform hover:bg-blue-400 hover:scale-105">
              <div className=''>{item.food_name}</div>
              <div>
                <p className='flex flex-row gap-2'>
                {item.servings.serving[0].calories && (
                <span>Calories: {item.servings.serving[0].calories}</span>
                )}
                {item.servings.serving[0].protein && (
                  <span>Protein: {item.servings.serving[0].protein}</span>
                )}
                {item.servings.serving[0].fat && (
                  <span>Fat: {item.servings.serving[0].fat}</span>
                )}
                {item.servings.serving[0].sodium && (
                  <span>Sodium: {item.servings.serving[0].sodium}</span>
                )}
                {item.servings.serving[0].sugar && (
                  <span>Sugar: {item.servings.serving[0].sugar}</span>
                )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
