import { IdentityHeader } from "@/common/components/IdentityHeader";

interface HomeHeaderProps {
  cardName?: string;
  cardCode?: string;
}

export const HomeHeader = ({ cardName, cardCode }: HomeHeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-6 ">
      <IdentityHeader name={cardName} subtitle={cardCode} showAvatar={true} />  
    </header>
  );
};