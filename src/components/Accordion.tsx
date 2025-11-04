import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface AccordionProps {
  address?: string;
  borderButton?: boolean;
  city?: string;
  location?: string;
  name?: string;
  phone?: string;
  schedule?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  address,
  borderButton = false,
  city,
  location,
  name,
  phone,
  schedule,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
    trackEvent({
      action: 'Click Accordion',
      category: 'Accordion',
      label: name,
    });
  };

  return (
    <div
      className={`border-white py-2 ${borderButton ? 'border-y-1' : 'border-t-1'}`}
    >
      <button
        className="flex justify-between items-center w-full cursor-pointer"
        onClick={handleClick}
      >
        <p className="font-bold text-xl">{name}</p>
        <ChevronDown size={20} />
      </button>

      {isOpen && (
        <div
          className={`${
            isOpen ? 'max-h-96' : 'max-h-0'
          } overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col items-start space-y-2 w-[50%] m-auto">
            {address && <p>{address}</p>}
            {location && <p>{location}</p>}
            {city && <p>{city}</p>}
            {phone && <p>{phone}</p>}
            {schedule && <p>{schedule}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
