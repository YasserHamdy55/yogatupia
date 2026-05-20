import React from "react";

const BrandLogo = ({
  variant = "horizontal",
  className = "",
  showText = true,
  title = "yogaTupia",
}) => {
  const iconSize = variant === "icon" ? 64 : variant === "stacked" ? 110 : 84;
  const textAlign =
    variant === "stacked" ? "items-center text-center" : "items-center";
  const layout = variant === "stacked" ? "flex-col gap-3" : "flex-row gap-3";

  return (
    <div
      className={`inline-flex ${layout} ${textAlign} ${className}`.trim()}
      aria-label={title}
    >
      <img
        src="/brand/yogatupia-heart.png"
        alt=""
        className="shrink-0 object-contain select-none"
        draggable="false"
        style={{ width: iconSize, height: iconSize }}
      />

      {showText && (
        <div className="leading-none">
          <div
            className="font-serif text-2xl md:text-[1.9rem] font-semibold tracking-[0.02em] whitespace-nowrap bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #6E3F73 0%, #9A5C95 55%, #C78A4B 100%)",
            }}
          >
            yogaTupia
          </div>
          <div className="font-serif italic text-[0.78rem] md:text-[0.85rem] tracking-[0.18em] text-[#C78A4B] mt-1">
            Heba Elshamy
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
