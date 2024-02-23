import { CardDetails } from '@/components/pages';
import CardsApi from '@/apis/Cards';
import { MagicCard } from '@/apis/models/card';

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  try {
    const { data } = await CardsApi.getCard(id);

    return {
      props: {
        card: data?.card as MagicCard,
        success: true,
      },
    };
  } catch (error) {
    return {
      props: {
        success: false,
      },
    };
  }
}

export default CardDetails;
