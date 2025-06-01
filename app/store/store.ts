import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { Item, PricingOption } from './page';

export type SortOption = 'name' | 'price_high' | 'price_low';

interface FilterState {
  searchText: string;
  selectedPricingOptions: PricingOption[];
  sortBy: SortOption;
  priceRange: [number,number];
}

interface StoreState {
  items: Item[];
  filters: FilterState;
}

const initialState: StoreState = {
  items:[],
  filters: {
    searchText: '',
    selectedPricingOptions: [],
    sortBy: 'name',
    priceRange: [0, 999],
  },
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setItems: (state, action:PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    setSearchText:(state, action:PayloadAction<string>) => {
      state.filters.searchText = action.payload;
    },
    setSelectedPricingOptions: (state, action: PayloadAction<PricingOption[]>)=>{
      state.filters.selectedPricingOptions = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSortBy: (state, action: PayloadAction<SortOption>)=> {
      state.filters.sortBy = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number,number]>) => {
      state.filters.priceRange = action.payload;
    },
  },
});

export const { setItems, setSearchText, setSelectedPricingOptions, resetFilters, setSortBy, setPriceRange } = storeSlice.actions;

// Create a function to create the store with initial state
export function makeStore(preloadedState?: Partial<StoreState>) {
  return configureStore({
    reducer: {
      store: storeSlice.reducer,
    },
    preloadedState: preloadedState ? { store: { ...initialState, ...preloadedState } } : undefined,
  });
}

// Create a type for the store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export default storeSlice.reducer;