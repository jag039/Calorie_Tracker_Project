export class DB {
  db;

  constructor() {
    if (!('indexedDB' in window)) {
      console.error("IndexedDB not supported");
      alert('IndexedDB is not supported on this browser. Please use a newer version.');
      return;
    }
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FoodJournal', 1);

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        if (!this.db.objectStoreNames.contains('foodItems')) {
          const store = this.db.createObjectStore('foodItems', { keyPath: 'id', autoIncrement: true });
          // Create an index on the 'date' field
          store.createIndex('date', 'date');
        }
        if (!this.db.objectStoreNames.contains('userGoals')) {
          this.db.createObjectStore('userGoals', { keyPath: 'id', autoIncrement: true });
        }
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  addFoodItem(date, foodItem) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('foodItems', 'readwrite');
      const store = transaction.objectStore('foodItems');
      const entry = {
        id: Date.now(),
        date,
        ...foodItem
      };
      const request = store.add(entry);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  deleteFoodItem(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('foodItems', 'readwrite');
      const store = transaction.objectStore('foodItems');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  getFoodItemsForDate(date) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction('foodItems', 'readonly');
        const store = transaction.objectStore('foodItems');
        const request = store.getAll(); // Retrieve all items
    
        request.onsuccess = () => {
          const allItems = request.result;
          // console.log(`Retrieved all items: ${JSON.stringify(allItems)}`);
    
          // Filter items by the given date
          const filteredItems = allItems.filter(item => item.date === date);
    
          // console.log(`Filtered items: ${JSON.stringify(filteredItems)}`);
          resolve(filteredItems);
        };
    
        request.onerror = () => {
          console.error("Failed to retrieve items:", request.error);
          reject(request.error);
        };
      });
    }

  addUserGoal(goal) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('userGoals', 'readwrite');
      const store = transaction.objectStore('userGoals');
      const GOAL = {
        id: Date.now(),
        ...goal
      };
      const request = store.add(GOAL);

      request.onsuccess = () => {
          resolve(request.result);
      };

      request.onerror = () => {
          reject(request.error);
      };
    });
  }

  getUserGoals() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('userGoals', 'readonly');
      const store = transaction.objectStore('userGoals');
      const request = store.getAll();

      request.onsuccess = () => {
          resolve(request.result);
      };

      request.onerror = () => {
          reject(request.error);
      };
    });
  }

  editUserGoal(id, updatedGoal) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('userGoals', 'readwrite');
      const store = transaction.objectStore('userGoals');
      const request = store.put({ id, ...updatedGoal });

      request.onsuccess = () => {
          resolve(request.result);
      };

      request.onerror = () => {
          reject(request.error);
      };
    });
  }
}
  