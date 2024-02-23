import React from 'react';
import { Button, ButtonVariant, Card, IconSize } from '@/components/common';
import Link from 'next/link';
import ArrowLeft from '@/assets/icons/chevron-left.svg';
import { MagicCard } from '@/apis/models/card';

const CardDetails = ({ card }: { card: MagicCard }) => {
  return (
    <div className="flex  flex-col pt-4 items-center h-full">
      <div className="w-[800px]">
        <Link href={'/'}>
          <Button
            variant={ButtonVariant.outlined}
            prefixIcon={ArrowLeft}
            prefixIconSize={IconSize.xs}
            className="mb-4"
          >
            Go back
          </Button>
        </Link>
      </div>

      <Card className="w-[800px]">
        <div className="flex gap-4">
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
          <div>
            <h2 className="mb-4">{card.name}</h2>
            <div>
              Description: <b>{card.text}</b>
            </div>
            <div>
              Flavor: <b>{card.flavor}</b>
            </div>
            <div>
              Rarity: <b>{card.rarity}</b>
            </div>
            <div>
              Mana cost: <b>{card.manaCost}</b>
            </div>
            <div>
              Power: <b>{card.power}</b>
            </div>
            <div>
              Type: <b>{card.type}</b>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardDetails;
