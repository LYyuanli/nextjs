"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setSearchText, setSelectedPricingOptions, resetFilters, setSortBy, setPriceRange, SortOption } from "./store";
import { PricingOption } from "./page";
import { useCallback } from "react";
import { Slider } from "@mui/material";

export default function FilterBar() {
  const dispatch = useDispatch();
  const { searchText, selectedPricingOptions, sortBy, priceRange } = useSelector((state: RootState)=> state.store.filters);
  
  const updateURL =useCallback((params: Record<string, string>)=>{
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value])=>{
      if(value){
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, '', url.toString());
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = e.target.value;
    dispatch(setSearchText(newSearchText));
    updateURL({ keyword: newSearchText });
  }

  const handlePricingOptionChange = (option: PricingOption) => {
    const newOptions = selectedPricingOptions.includes(option)
      ? selectedPricingOptions.filter(opt => opt !== option)
      :[...selectedPricingOptions, option];

    dispatch(setSelectedPricingOptions(newOptions));

    // Reset price range when Paid is unchecked
    if(option === PricingOption.PAID && !newOptions.includes(PricingOption.PAID)) {
      dispatch(setPriceRange([0,999]));
      updateURL({ priceRange:''});
    }

    const pricingOptionsParam = newOptions.length > 0
      ? newOptions.join('+')
      : '';
    updateURL({ pricingOptions: pricingOptionsParam });
  };

  const handleReset = () => {
    dispatch(resetFilters());
    updateURL({ keyword: '', pricingOptions: '', sort: '', priceRange: '' });
  }

  const handleSortChange =(e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortValue = e.target.value as SortOption;
    dispatch(setSortBy(newSortValue));
    updateURL({ sort:newSortValue });
  };

  const handlePriceRangeChange = (_event: Event, newValue: number | number[])=> {
    const [min, max] = newValue as number[];
    dispatch(setPriceRange([min,max]));
    updateURL({ priceRange: `${min}+${max}`});
  }

  const isPaidSelected = selectedPricingOptions.includes(PricingOption.PAID);

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Find the Items you're looking for"
          className="w-full px-4 py-2 bg-[#2a2930] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Pricing Options **/}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-white font-medium">Pricing Option</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={selectedPricingOptions.includes(PricingOption.PAID)}
                  onChange={() => handlePricingOptionChange(PricingOption.PAID)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span>Paid</span>
              </label>
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={selectedPricingOptions.includes(PricingOption.FREE)}
                  onChange={()=> handlePricingOptionChange(PricingOption.FREE)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span>Free</span>
              </label>
              <label className="flex items-center space-x-2 text-white">  
                <input
                  type="checkbox"
                  checked={selectedPricingOptions.includes(PricingOption.VIEW_ONLY)}
                  onChange={()=> handlePricingOptionChange(PricingOption.VIEW_ONLY)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span>View Only</span>
              </label>
            </div>
          </div>

          {/* Pricing Slider */}
          {isPaidSelected && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-white text-sm sm:hidden">Price Range</span>
              <div className="flex items-center gap-4">
                <span className="text-white text-sm">${priceRange[0]}</span>
                <Slider
                  min={0}
                  max={999}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  sx={{
                    width:{ xs:'100%', sm:200 },
                    color: '#8B5CF6',
                    '& .MuiSlider-thumb': {
                      backgroundColor: "#fff",
                    },
                    '& .MuiSlider-track': {
                      backgroundcolor: "#8B5CF6"
                    },
                    '& .MuiSlider-rail':{
                      backgroundColor: "#4B5563"
                    },
                  }}
                />
                <span className="text-white text-sm">${priceRange[1]}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-4 py-2 ml-auto text-sm text-white bg-[#2a2930] rounded-lg hover:bg-[#3a3940]
            transition-colors self-start sm:self-auto"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Sorter */}
      <div className="flex items-center space-x-2 justify-end">
        <span className="text-white font-medium">Sort by</span>
        <select
          onChange={handleSortChange}
          value={sortBy}
          className="px-3 bg-transparent text-white border-b-[1px] border-white"
        >
          <option value="name" className="text-black">Item Name</option>
          <option value="price_high" className="text-black">Higher Price</option>
          <option value="price_low" className="text-black">Lower Prices</option>
        </select>
      </div>
    </div>
  );
}
