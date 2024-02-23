import { useInfiniteQuery, useQuery } from 'react-query';
import baseApi from './Base';
import { MagicCard } from './models/card';
import qs from 'querystring';

const PAGE_SIZE = 20;
const CardsApi = {
  getCards(page: number, search?: string) {
    const params: { page: number; pageSize: number; name?: string } = {
      page,
      pageSize: PAGE_SIZE,
    };
    if (search) {
      params.name = search;
    }
    return baseApi.get(`cards?${qs.stringify(params)}`);
  },
  getCard(id: string) {
    return baseApi.get(`cards/${id}`);
  },
};

export const GET_CARDS_KEY = 'Get/cards';
export function useGetCards(search?: string) {
  return useInfiniteQuery({
    queryKey: [GET_CARDS_KEY],
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const { data, headers } = await CardsApi.getCards(pageParam, search);
      const total = Number(headers['total-count']) || 0;

      const hasNextPage = pageParam * PAGE_SIZE < total;

      return { data: data?.cards as MagicCard[], pageParam, hasNextPage };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) {
        return undefined;
      }
      return lastPage.pageParam + 1;
    },
  });
}

export const GET_CARD_KEY = 'Get/card';
export function useGetCardById(id: string) {
  return useQuery({
    queryKey: [GET_CARDS_KEY],
    queryFn: async () => {
      const { data } = await CardsApi.getCard(id);

      console.log('data', data);
      return data;
    },
  });
}

export default CardsApi;
