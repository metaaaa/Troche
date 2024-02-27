import { Candy, CandyProps } from "./Candy";

export type CandyListProps = {
    items?: Array<CandyProps>
};

export const CandyList: React.FC<CandyListProps> = ({ items }) => {
    return (
        <div className='mt-4'>
            {items?.map((item, index) => (
                <Candy id={item.id} path={item.path} onFileSelected={item.onFileSelected} onPlay={item.onPlay} onDelete={item.onDelete} key={item.id} />
            ))}
        </div>
    );
}