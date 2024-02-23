import React, { useEffect, useMemo, useState } from 'react';
import { SearchInput } from '@/components/common/SearchInput';
import { useGetCards } from '@/apis/Cards';
import ItemCard from './MagicCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader, LoaderSize } from '@/components/common';

const Home = () => {
  const [search, setSearch] = useState('');

  const {
    data,
    fetchNextPage,
    refetch,
    hasNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
  } = useGetCards(search);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const dataLength = useMemo(() => {
    return (
      data?.pages.reduce((prev, current) => prev + current.data?.length, 0) || 0
    );
  }, [data]);

  const hasNoData =
    data?.pages?.[0]?.data?.length === 0 && !(isLoading || isRefetching);
  return (
    <div
      className="relative h-full bg-surface-overlay overflow-auto"
      id="container"
    >
      <div className="h-header shadow px-4 flex items-center bg-surface-alt justify-end">
        <SearchInput
          className="!w-[300px]"
          placeholder="Search card..."
          value={search}
          handleSearch={(value) => setSearch(value)}
        />
      </div>
      {isLoading ||
        (isRefetching && (
          <div className="w-full flex justify-center mt-4">
            <Loader size={LoaderSize.xxl} />
          </div>
        ))}

      {hasNoData && (
        <div className="w-full flex justify-center mt-4">
          There&apos;s no data please adjust your search.
        </div>
      )}
      {!((isLoading || isRefetching) && !isFetchingNextPage) && (
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={hasNextPage || false}
          loader={
            <div className="w-full flex justify-center">
              <Loader size={LoaderSize.xxl} />
            </div>
          }
          className="pt-4 !overflow-hidden"
          scrollableTarget="container"
        >
          <div className="flex justify-center pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 max-w-[1500px]">
              {data?.pages?.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data?.map((item) => (
                    <ItemCard card={item} key={item.id} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Home;
