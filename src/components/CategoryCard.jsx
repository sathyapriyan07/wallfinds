import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/category/${category.slug}`} className="group block">
      <article className="media-card relative h-52">
        <img
          src={category.cover_image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 w-full p-4">
          <h3 className="text-xl font-semibold">{category.name}</h3>
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
