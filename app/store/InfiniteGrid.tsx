"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Item, PricingOption } from "./page";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const ITEMS_PER_PAGE = 12;

// Skeleton card component
const SkeletonCard = () => (
  <div className="group flex flex-col rounded-lg overflow-hidden">
    <div className="relative aspect-square overflow-hidden bg-[#2a2930] animate-pulse" />
    <div className="'p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#2a2930] rounded animate-pulse" />
          <div className="h-3 w-24 bg-[#2a2930] rounded animate-pulse" />
        </div>
        <div className="h-5 w-16 bg-[#2a2930] rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export default function InfiniteGrid({ data }: { data: Item[]}) {
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore]= useState(true);
  const [page,setPage] = useState(1);
  const { searchText, selectedPricingOptions, sortBy, priceRange } = useSelector((state: RootState)=> state.store.filters);

  // Filter and sort items based on search text, pricing options, and sort option
  const filteredData = useMemo(()=> {
    let filtered = data.filter(item => {
      const matchesSearch = searchText === '' ||
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchText.toLowerCase());

      const matchesPricing = selectedPricingOptions.length === 0 ||
        selectedPricingOptions.includes(item.pricingOption);

      // Add price range filter when Paid is selected
      const matchesPriceRange = !selectedPricingOptions.includes(PricingOption.PAID) ||
        (item.pricingOption === PricingOption.PAID &&
         item.price >= priceRange[0] &&
         item.price <= priceRange[1]);

      return matchesSearch && matchesPricing && matchesPriceRange;
    });

    // Sort the filtered items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "price_high":
          return b.price -a.price;
        case "price_low":
          return a.price-b.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchText, selectedPricingOptions, sortBy, priceRange]);

  useEffect(() => {
    // Reset pagination when filters or sort change
    setItems(filteredData.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filteredData.length > ITEMS_PER_PAGE);
  }, [filteredData]);

  const fetchMoreData= () => {
    // Simulate API delay
    setTimeout(()=>{
      const nextItems = filteredData.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
      setItems(prevItems =>[...prevItems,...nextItems]);
      setPage(prevPage => prevPage + 1);
      setHasMore(nextItems.length>0);
    }, 500);
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      }
      endMessage={
        <div className="text-center py-8 text-gray-500">
          {items.length === 0 ? 'No items found' : "No more items to load"}
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group flex flex-col rounded-lg overflow-hidden">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={item.imagePath}
                alt={item.title}
                fill
                className="object-cover group-hoveriscale-105"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center text-white">
                <div className="text-sm">
                  <h2 className="font-semibold line-clamp-1">{item.title}</h2>
                  <p>{item.creator}</p>
                </div>
                <div className="font-semibold text-lg">
                  {item.pricingOption === PricingOption.FREE ? 'FREE'
                    : item.pricingOption === PricingOption.VIEW_ONLY ? 'View Only'
                      :`$ ${item.price}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
