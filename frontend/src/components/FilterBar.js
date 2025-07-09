import React from "react";

const BRAND_OPTIONS = [
  { value: "", label: "브랜드 전체" },
  { value: "CHANEL", label: "샤넬" },
  { value: "DIOR", label: "디올" },
  { value: "GUCCI", label: "구찌" },
  { value: "YSL", label: "입생로랑" },
  { value: "HERMES", label: "에르메스" },
];
const VOLUME_OPTIONS = [
  { value: "", label: "용량 전체" },
  { value: "UNDER_30ML", label: "30ml" },
  { value: "UNDER_50ML", label: "50ml" },
  { value: "LARGE", label: "대용량" },
];
const GENDER_OPTIONS = [
  { value: "", label: "성별 전체" },
  { value: "MALE", label: "남성" },
  { value: "FEMALE", label: "여성" },
  { value: "UNISEX", label: "남녀공용" },
];
const PRICE_OPTIONS = [
  { value: "", label: "가격 전체" },
  { value: "100000", label: "10만원 이하" },
  { value: "200000", label: "20만원 이하" },
  { value: "300000", label: "30만원 이하" },
  { value: "500000", label: "50만원 이하" },
];

const FilterBar = ({ brand, volume, gender, price, onChange }) => (
  <div className="d-flex justify-content-center gap-3">
    <select
      className="form-select w-auto"
      value={brand}
      onChange={(e) => onChange({ type: "brand", value: e.target.value })}
    >
      {BRAND_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <select
      className="form-select w-auto"
      value={volume}
      onChange={(e) => onChange({ type: "volume", value: e.target.value })}
    >
      {VOLUME_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <select
      className="form-select w-auto"
      value={gender}
      onChange={(e) => onChange({ type: "gender", value: e.target.value })}
    >
      {GENDER_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <select
      className="form-select w-auto"
      value={price}
      onChange={(e) => onChange({ type: "price", value: e.target.value })}
    >
      {PRICE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default FilterBar;
