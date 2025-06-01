import { SortOption } from "./store";
import InfiniteGrid from "./InfiniteGrid";
import FilterBar from "./FilterBar";
import { Providers } from "./Providers";

export enum PricingOption {
  PAID = 0,
  FREE = 1,
  VIEW_ONLY = 2,
}

export interface Item {
  id: string;
  creator: string;
  title: string;
  pricingOption: PricingOption;
  imagePath: string;
  price: number;
}
async function fetchStoreData() {
  try {
    const response = await fetch("https://closet-recruiting-api.azurewebsites.net/api/data", {
      method: "GET",
      headers: {
        "Content-Type":"application/json"
      },
    });
    const data = await response.json();
    return data;
  } catch(error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default async function StorePage({ searchParams }:
  { searchParams: Promise<{ pricingOptions?: string; priceRange?: string; keyword?: string; sort?: string }> }
) {
  // Initialize state from URL params
  const resolvedParams = await searchParams;
  const initialState: {
    items: Item[];
    searchParams: {
      priceRange: string;
    };
    filters: {
      searchText: string;
      selectedPricingOptions: PricingOption[];
      sortBy: SortOption;
      priceRange: [number, number]
    };
    loading: boolean;
    error: string | null;
  } = {
    items:[],
    searchParams: {
      priceRange: resolvedParams.priceRange || '',
    },
    filters: {
      searchText: resolvedParams.keyword || '',
      selectedPricingOptions: resolvedParams.pricingOptions
        ? resolvedParams.pricingOptions
          .split('+')
          .map(option => parseInt(option))
          .filter(option => Object.values(PricingOption).includes(option))
        : [],
      sortBy: (resolvedParams.sort as SortOption)|| 'name',
      priceRange: resolvedParams.priceRange
        ? [parseInt(resolvedParams.priceRange.split('+') [0]), parseInt(resolvedParams.priceRange.split('+')[1])]
        : [0, 999],
    },
    loading: false,
    error: null,
  };

  // Fetch data
  let items: Item[]=[];
  try {
    items = await fetchStoreData();
  } catch(error) {
    console.error('Error fetching data:', error);
  }

  // Update initial state with fetched items
  initialState.items = items;

  return (
    <Providers initialState={initialState}>
      <div className="'min-h-screen p-8 bg-[#1b1a21]">
        <main className="max-w-[1400px] mx-auto">
          <FilterBar />
          <InfiniteGrid data={items} />
        </main>
      </div>
    </Providers>
  );
}
