import React from 'react';
import { MagicCard } from '@/apis/models/card';
import { Card } from '@/components/common';
import Link from 'next/link';

const ItemCard = ({ card }: { card: MagicCard }) => {
  return (
    <Card className="relative h-full bg-surface-overlay max-w-[247px]">
      {card.imageUrl ? (
        <img
          src={card.imageUrl}
          alt=""
          className="max-w-full w-[223px] h-[310px] mb-4 bg-surface-alt"
        />
      ) : (
        <div className="max-w-full w-[223px] h-[310px] mb-4 bg-surface-alt flex items-center justify-center">
          No image
        </div>
      )}
      <Link href={`cards/${card.id}`}>
        <h3 className="mb-2 text-content-primary">{card.name}</h3>
      </Link>
      <p className="w-fit">{card.text}</p>
    </Card>
  );
};

export default ItemCard;
