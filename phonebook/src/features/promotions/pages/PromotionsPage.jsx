import { usePromotionController } from "../controller/usePromotionController";
import { promotionsData } from "../models/promotionModel";
import PromotionCard from "../components/PromotionCard";
import "../css/promotionsPage.css";

const PromotionsPage = () => {
  const { protectedNavigation } = usePromotionController();

  return (
    <main className="promotions-container">
      <div className="promotions-page">
        
        {/* HERO HEADER */}
        <header className="promotions-header">
          <div className="badge">Marketing Suite</div>
          <h1>
            Grow with <span>Promotions</span>
          </h1>
          <p>
            Reach the right customers at the right time with our 
            automated suite of powerful growth tools.
          </p>
        </header>

        {/* GRID */}
        <section className="promotions-grid">
          {promotionsData.map((item) => (
            <PromotionCard
              key={item.id || item.title} // Use ID if available
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onClick={() => protectedNavigation(item.path)}
            />
          ))}
        </section>

      </div>
    </main>
  );
};

export default PromotionsPage;